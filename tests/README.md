# tests

Automated tests and supporting test materials.

| Path | Content | How to run |
|---|---|---|
| `backend/` | Health endpoints, SQL migrations (apply and roll back), repository tests against a real PostgreSQL | `pytest tests/backend` with `DATABASE_URL` set; see [src/backend/README.md](../src/backend/README.md) |
| `frontend/` | Unit tests of the domain logic: status life cycle, eligibility rules, roadmap generation, intake options, imported Bolashak data, user search | `cd src/frontend && npm test` |

The frontend tests import code from `src/frontend` through the `@/` alias. `frontend/tsconfig.json` lets `npm run typecheck` type-check them too.

AI grounding tests and the evaluation datasets are planned together with the AI layer; see [evaluation/README.md](../evaluation/README.md).
