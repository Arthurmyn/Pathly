import os
import uuid

import psycopg
import pytest
from psycopg import sql
from psycopg.rows import dict_row

from helpers import migrate_up


@pytest.fixture(scope="session")
def database_url() -> str:
    url = os.environ.get("TEST_DATABASE_URL") or os.environ.get("DATABASE_URL")
    if not url:
        pytest.skip("Set TEST_DATABASE_URL or DATABASE_URL to run the database tests")
    return url


def _connect(url: str, schema: str, **kwargs) -> psycopg.Connection:
    return psycopg.connect(url, options="-c search_path=%s" % schema, **kwargs)


@pytest.fixture
def make_schema(database_url):
    """Create throw-away schemas inside the database and drop them afterwards."""
    created = []

    def _make() -> str:
        name = "test_" + uuid.uuid4().hex[:10]
        with psycopg.connect(database_url, autocommit=True) as admin:
            admin.execute(sql.SQL("CREATE SCHEMA {}").format(sql.Identifier(name)))
        created.append(name)
        return name

    yield _make

    with psycopg.connect(database_url, autocommit=True) as admin:
        for name in created:
            admin.execute(sql.SQL("DROP SCHEMA IF EXISTS {} CASCADE").format(sql.Identifier(name)))


@pytest.fixture(scope="session")
def migrated_schema(database_url):
    """One schema with all migrations applied, shared by the tests that only read and write rows."""
    name = "test_" + uuid.uuid4().hex[:10]
    with psycopg.connect(database_url, autocommit=True) as admin:
        admin.execute(sql.SQL("CREATE SCHEMA {}").format(sql.Identifier(name)))
    with _connect(database_url, name) as conn:
        migrate_up(conn)
    yield name
    with psycopg.connect(database_url, autocommit=True) as admin:
        admin.execute(sql.SQL("DROP SCHEMA IF EXISTS {} CASCADE").format(sql.Identifier(name)))


@pytest.fixture
def conn(database_url, migrated_schema):
    """A connection inside the migrated schema. Everything the test writes is rolled back."""
    with _connect(database_url, migrated_schema, row_factory=dict_row) as connection:
        yield connection
        connection.rollback()
