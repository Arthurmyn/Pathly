# ADR-0001: Technology stack

Status: **Accepted by the team on 18 Oct 2026 and implemented in the skeleton. To confirm with the supervisor (Altynbek Seitenov).**

## Context
The platform needs role-based access, a relational data model (programmes, requirements with source, status and validity dates, deadlines, applications), deterministic eligibility rules and an AI advisor that answers only from verified records. The team is two students with a short timeline.

## Options
**Backend framework:** FastAPI / Node.js (Express, NestJS) / Django
- FastAPI: typed API, automatic OpenAPI documentation, the same language as the AI and retrieval libraries.
- Node.js: one language with the frontend, but a weaker AI ecosystem.
- Django: administration and authentication built in, heavier for an API-first design.

**Database:** PostgreSQL / MongoDB / MySQL
- PostgreSQL: relational integrity, transactions, JSON support, full-text search.
- MongoDB: flexible documents, but the domain is strongly relational.
- MySQL: viable, fewer built-in search features.

**Data access:** plain SQL with psycopg 3 / an ORM (SQLAlchemy with Alembic)
- Plain SQL: every query is visible and testable, the status filter lives in the query, no extra layer to learn.
- ORM: less boilerplate, but one more abstraction and a second migration tool.

**Retrieval for the advisor:** SQL lookup of Verified records with PostgreSQL full-text search as a fallback / a vector index (pgvector, Qdrant)
- The knowledge base is small and structured, so no embeddings are needed; the non-Verified filter is part of the SQL query.

## Decision
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS.
- **Backend:** FastAPI (Python), REST/JSON.
- **Database:** plain PostgreSQL 16, psycopg 3 with a thin repository layer, versioned `.sql` migrations applied by dbmate. No ORM, no pgvector.
- **AI layer (planned):** retrieval of Verified records by SQL with full-text search as fallback; an LLM API behind a provider-neutral interface; citation checks and a refusal policy.
- **Authentication (planned):** JWT with applicant and administrator roles.
- **Local environment and deployment:** Docker Compose for the backend and database; the frontend demo is deployed on Vercel.

## Consequences
Python for the backend and the AI layer, TypeScript for the web interface, one database to operate. Relations and row mapping are written by hand. Revisit the vector index if the knowledge base outgrows full-text search.
