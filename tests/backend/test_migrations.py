import psycopg
import pytest

from helpers import load_migrations, migrate_down, migrate_up


def _tables(conn, schema):
    rows = conn.execute(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = %s", (schema,)
    ).fetchall()
    return {row[0] for row in rows}


def test_every_migration_has_up_and_down():
    migrations = load_migrations()
    assert migrations, "no migration files found"
    for name, up, down in migrations:
        assert up.strip(), "%s has an empty up part" % name
        assert down.strip(), "%s has an empty down part" % name


def test_migrations_apply_to_an_empty_database_and_roll_back(database_url, make_schema):
    schema = make_schema()
    with psycopg.connect(database_url, options="-c search_path=%s" % schema) as conn:
        assert _tables(conn, schema) == set()

        migrate_up(conn)
        assert "universities" in _tables(conn, schema)

        migrate_down(conn)
        assert _tables(conn, schema) == set()

        migrate_up(conn)  # can be applied again after a rollback
        assert "universities" in _tables(conn, schema)


def test_database_rejects_an_empty_university_name(conn):
    with pytest.raises(psycopg.errors.CheckViolation):
        conn.execute("INSERT INTO universities (name, country) VALUES ('  ', 'Kazakhstan')")
