# src/backend

FastAPI backend on plain PostgreSQL (psycopg 3, versioned SQL migrations, no ORM, no pgvector).

Current state (task DIP-22): the smallest runnable skeleton: health endpoints, a connection pool, one migration (`universities`) with a repository, and tests. It is not the MVP.

## Layout
| Path | Content |
|---|---|
| `app/main.py` | FastAPI app, `GET /health` (liveness) and `GET /health/db` (readiness) |
| `app/config.py` | Settings from environment variables |
| `app/db.py` | Connection pool and the `get_conn` request dependency |
| `app/repositories/` | Plain SQL access that returns typed Pydantic models |
| `db/migrations/` | Versioned `.sql` migrations with `-- migrate:up` and `-- migrate:down` parts |
| `../../tests/backend/` | Automated tests |

## Run with Docker (recommended)
Requires Docker Desktop.
```
cp .env.example .env        # run from the repository root; set a local password in .env
docker compose up --build
```
This starts PostgreSQL, applies the migrations with [dbmate](https://github.com/amacneil/dbmate), then starts the backend.
- API: http://localhost:8000/health and http://localhost:8000/health/db
- OpenAPI documentation: http://localhost:8000/docs

Stop with `docker compose down` (add `-v` to delete the database volume).

## Run on your machine
```
cd src/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
export DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DBNAME   # a running PostgreSQL
uvicorn app.main:app --reload
```
To create the tables, apply the migrations (`docker compose up migrate` after starting the `db` service, or run `dbmate up` yourself).

## Test
From the repository root, with PostgreSQL running (for example `docker compose up -d db migrate`):
```
pip install -e "src/backend[dev]"
export DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DBNAME   # or TEST_DATABASE_URL
pytest tests/backend
```
Without a database the health and migration-file tests still run and the database tests are skipped.

The tests create their own temporary schema inside the database, apply every migration to it, roll back everything each test writes, and drop the schema at the end, so they leave no data behind and do not touch your real tables.

## Adding a migration
Create `db/migrations/<timestamp>_<name>.sql` with both parts:
```
-- migrate:up
CREATE TABLE ...;

-- migrate:down
DROP TABLE ...;
```
`test_migrations.py` checks that every file has both parts and that all migrations apply and roll back on an empty database.
