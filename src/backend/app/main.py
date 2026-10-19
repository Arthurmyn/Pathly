from contextlib import asynccontextmanager

import psycopg
from fastapi import Depends, FastAPI, HTTPException

from app.config import get_settings
from app.db import close_pool, get_conn, open_pool


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    open_pool(settings.database_url, settings.db_pool_min_size, settings.db_pool_max_size)
    try:
        yield
    finally:
        close_pool()


app = FastAPI(
    title="Pathly API",
    version="0.1.0",
    description="Verified admission requirements, eligibility analysis and roadmaps.",
    lifespan=lifespan,
)


@app.get("/health", tags=["health"])
def health() -> dict:
    """Liveness: the application is running. Does not touch the database."""
    return {"status": "ok"}


@app.get("/health/db", tags=["health"])
def health_db(conn: psycopg.Connection = Depends(get_conn)) -> dict:
    """Readiness: the application can run a query on the database."""
    try:
        conn.execute("SELECT 1")
    except psycopg.Error as exc:
        raise HTTPException(status_code=503, detail="Database is not reachable") from exc
    return {"status": "ok", "database": "up"}
