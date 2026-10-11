# ADR-0001: Technology stack

Status: **Proposed, to confirm with supervisor**

## Context
The platform needs role-based access, a relational data model (programs, requirements with sources and verification dates, deadlines, applications), and an AI assistant grounded in a verified knowledge base. The team is two students with a short timeline.

## Options
**Backend framework:** FastAPI / Node.js (Express/Nest) / Django
- FastAPI: async, automatic OpenAPI docs, strong fit with Python AI tooling.
- Node.js: single language with the frontend, but weaker AI ecosystem.
- Django: batteries included (admin, ORM), heavier for an API-first design.

**Database:** PostgreSQL / MongoDB / MySQL
- PostgreSQL: relational integrity, JSON support, pgvector extension.
- MongoDB: flexible schema, but the domain is strongly relational.
- MySQL: viable, no mature vector extension.

**Vector search:** pgvector / Qdrant
- pgvector: one datastore, simpler operations, sufficient for a small knowledge base.
- Qdrant: dedicated and scalable, but an extra service to run.

## Decision (proposed)
FastAPI + PostgreSQL with pgvector, Next.js frontend, REST/JSON, JWT auth, provider-neutral LLM interface.

## Consequences
Python for backend and AI layer; one database to operate. Revisit pgvector vs Qdrant if the knowledge base outgrows it.

To be confirmed with the supervisor (Altynbek Seitenov).
