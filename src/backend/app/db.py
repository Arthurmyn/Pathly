from typing import Iterator, Optional

import psycopg
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

_pool: Optional[ConnectionPool] = None


def open_pool(url: str, min_size: int = 1, max_size: int = 5) -> ConnectionPool:
    """Create the shared connection pool. Does not block if the database is not reachable yet."""
    global _pool
    _pool = ConnectionPool(
        url,
        min_size=min_size,
        max_size=max_size,
        kwargs={"row_factory": dict_row},
        open=False,
    )
    _pool.open(wait=False)
    return _pool


def close_pool() -> None:
    global _pool
    if _pool is not None:
        _pool.close()
        _pool = None


def get_conn() -> Iterator[psycopg.Connection]:
    """FastAPI dependency: one pooled connection per request, committed on success."""
    if _pool is None:
        raise RuntimeError("The database pool is not open")
    with _pool.connection() as conn:
        yield conn
