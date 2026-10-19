# Unified Applicant Platform

Unified Digital Platform for Supporting Applicants to Higher Education Programs in Kazakhstan and Abroad.
Diploma project, Astana IT University (AITU), Software Engineering.

## Problem statement
Applicants to higher education programs in Kazakhstan and abroad must gather requirements, deadlines and document lists from many scattered sources, which are often outdated or inconsistent. This leads to missed deadlines, incomplete applications and poorly informed program choices. The platform brings verified program information, personalised roadmaps, application tracking and human guidance into one place.

## Target users
- **Applicants** to Bachelor, Master and PhD programs in Kazakhstan and abroad
- **Teachers**, **mentors** and **supervisors** who guide and review applicants
- **Administrators** who maintain the verified knowledge base

## Aim
Design and prototype a platform that helps applicants choose programs, understand requirements, plan an application roadmap and track progress, using an AI assistant grounded in a verified knowledge base plus deterministic requirement-matching rules.

## MVP scope
**In scope**
- Role-based authentication (applicant, teacher, mentor, supervisor, administrator)
- Applicant profile and AI-assisted onboarding
- Program catalog with requirements, source URLs and verification dates
- Gap analysis and roadmap generation
- Application/task tracking, checklists and reminders
- Mentor/supervisor review dashboard and admin panel
- Grounded AI assistant that refuses to answer without sources

**Out of scope (MVP)**
- Direct submission of applications to universities
- Payments, visa processing
- Native mobile apps
- Complete coverage of all universities (pilot dataset of about 20 verified programs)

## Proposed tech stack
Next.js (frontend), FastAPI (backend), PostgreSQL + pgvector, REST/JSON, JWT auth, LLM API behind a provider-neutral interface, RAG over a verified knowledge base. Status: proposed, see [ADR-0001](docs/decisions/ADR-0001-tech-stack.md).

## Repository structure
| Path | Content |
|---|---|
| `src/frontend` | Next.js application |
| `src/backend` | FastAPI application |
| `src/ai` | LLM interface, retrieval pipeline |
| `docs` | Documentation, ADRs, diploma pre-defense text |
| `diagrams` | Mermaid sources of architecture diagrams |
| `tests` | Automated tests |
| `evaluation` | Evaluation protocol and datasets |
| `config` | Configuration templates |

## Team
- Arthur [surname TODO]
- Dinara Medeubek
- Supervisor: Altynbek Seitenov

## Status
Pre-defense preparation, 24 Oct 2026.

## Links
- YouTrack: [project DIP](https://udp.youtrack.cloud/dashboard?id=177-0), [Scrum board](https://udp.youtrack.cloud/agiles/204-5/current)
- Documentation: [docs/README.md](docs/README.md)
- Contribution tracing: [docs/CONTRIBUTION_LOG.md](docs/CONTRIBUTION_LOG.md)

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md).

## License
TODO: no license chosen yet. Until one is added, all rights are reserved by the authors.
