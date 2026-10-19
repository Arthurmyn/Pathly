# tests
Automated tests (unit tests for gap-analysis rules, API tests, AI grounding tests).

| Path | Content | How to run |
|---|---|---|
| `backend/` | Health endpoints, SQL migrations (apply and roll back), repository tests against a real PostgreSQL | `pytest tests/backend` with `DATABASE_URL` set; see [src/backend/README.md](../src/backend/README.md) |
