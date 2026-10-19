from fastapi.testclient import TestClient

from app.db import get_conn
from app.main import app


def test_health_returns_ok_without_a_database():
    client = TestClient(app)  # no lifespan: the pool is not opened, /health must not need it
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_openapi_and_docs_are_served():
    client = TestClient(app)
    schema = client.get("/openapi.json")
    assert schema.status_code == 200
    assert "/health" in schema.json()["paths"]
    assert client.get("/docs").status_code == 200


def test_health_db_runs_a_query(conn):
    app.dependency_overrides[get_conn] = lambda: conn
    try:
        response = TestClient(app).get("/health/db")
    finally:
        app.dependency_overrides.clear()
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "up"}
