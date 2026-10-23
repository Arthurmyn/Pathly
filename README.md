# Pathly: a digital platform to support admission to higher education programmes

Diploma project, Astana IT University (AITU), Software Engineering. Working title of the project: *Development of a Digital Platform to Support Admission to Higher Education Programs*.

Pathly turns an applicant's profile and goals into a verified, explainable and actionable admission pathway. Every requirement and deadline carries its source and an absolute verification date, eligibility is computed by deterministic rules, and the AI advisor (planned) answers only from verified records. Pathly does not submit applications: the applicant submits on the official website of the university or scholarship.

Demo (invented data): <https://stepup.website>

## Problem statement
Applicants to Bachelor's, Master's and Doctoral programmes in Kazakhstan and abroad collect requirements from many sources: university websites, the national testing organisation, scholarship portals such as Bolashak, language test providers and informal channels. Requirements differ by country, university, degree and admission pathway, and they change over time. Applicants cannot easily check whether they meet a requirement, what they are missing, what to do next and by when, and it is often unclear whether a piece of information is still valid or has been verified.

## Target users
- **Applicants** to Bachelor's, Master's and Doctoral/PhD programmes in Kazakhstan and abroad (primary users).
- **Administrators**: the project team, who keep requirement data verified.
- Teachers, mentors and supervisors are a future extension and not part of this project.

## Expected outcomes
- **D1** A functional MVP: applicant profile and AI-assisted onboarding, programme information with verified requirements, eligibility matching and gap analysis, personalised roadmap, source-grounded AI advisor and an administrator workflow for verification.
- **D2** A pilot dataset of 20 verified programmes across the three degree levels, with official sources and verification dates.
- **D3** Technical documentation: requirements, architecture, diagrams and technology selection.
- **D4** An evaluation report on the effectiveness of the platform.

## Team
| Member | Responsibilities |
|---|---|
| Artur Jaxygaliyev | Backend, database, API, main frontend (layout, dashboard, catalogue, eligibility results, roadmap, administrator panel), repository and project management |
| Dinara Medeubek | AI and machine learning (onboarding, extraction, source-grounded answering), data, business analysis, evaluation and documentation |

Supervisor: Altynbek Seitenov. The allocation follows section 10.2 of the proposal. Contributions are traced through commits, pull requests, reviews and YouTrack tasks.

## Scope and current status
**In scope (MVP)**: applicant profiles and AI-assisted onboarding (Must); programme and university information with verified requirements (Must); eligibility matching and gap analysis (Must); personalised roadmaps (Must); source-grounded AI advisor and administrator verification workflow (Must); application checklist, deadline tracking and email reminders (Should).
**Out of scope**: payments, live classes, community features, a mobile app, automatic scraping of university websites, document upload, and mentor, teacher and supervisor dashboards (future extension). The platform does not replace official application systems.

**Status on 23 Oct 2026 (pre-defense preparation):**
- Done: repository structure and workflow (branches, `DIP-<n>` commits, pull requests, templates); backend skeleton (FastAPI, PostgreSQL, SQL migrations, Docker Compose, tests); frontend demo on invented data with the public area, the applicant workspace and the administrator area (see [src/frontend/README.md](src/frontend/README.md)); import of the Bolashak 2024-2026 university list and the 2026 priority specialities; Mermaid diagram sources.
- Open (tracked in YouTrack): the pre-defense documents (evidence log, literature review, comparisons, requirements, architecture description, evaluation plan, risks).
- Not started: connection of the frontend to the backend, authentication, the AI layer (extraction, retrieval, citations, refusal), email reminders, the pilot dataset of 20 verified programmes and the evaluation studies.
- Limits of the demo: data are invented, state lives in the browser, sign-in is simulated and the chats use scripted replies.

## Selected technologies
| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS; unit tests with Vitest |
| Backend | Python, FastAPI, REST/JSON |
| Database | PostgreSQL 16 through psycopg 3 (no ORM), versioned SQL migrations applied by dbmate |
| AI layer (planned) | Retrieval of Verified records by SQL with full-text search, an LLM API behind a provider-neutral interface |
| Tooling | Docker Compose, pytest, ESLint, GitHub, YouTrack, Vercel (demo hosting) |

## Links
- YouTrack: [project DIP](https://udp.youtrack.cloud/dashboard?id=177-0) and [Scrum board](https://udp.youtrack.cloud/agiles/204-5/current)
- Documentation index: [docs/README.md](docs/README.md)
  - Diagrams: [diagrams/](diagrams/) (Mermaid sources)
  - Evaluation protocol: [evaluation/README.md](evaluation/README.md)
  - Working rules: see [Contributing](#contributing) below

## Repository structure
| Path | Content |
|---|---|
| `src/frontend/` | Source code: Next.js application ([README](src/frontend/README.md)) |
| `src/backend/` | Source code: FastAPI application, SQL migrations ([README](src/backend/README.md)) |
| `src/ai/` | Source code: AI layer (not started) |
| `docs/` | Documentation ([index](docs/README.md)); the proposal and the other documents will be added here |
| `diagrams/` | Editable Mermaid sources (readable exports are generated with the command in [diagrams/README.md](diagrams/README.md)) |
| `tests/` | Automated tests: `backend/` (pytest) and `frontend/` (Vitest) ([README](tests/README.md)) |
| `evaluation/` | Evaluation protocol and, later, datasets |
| `config/` | Configuration templates |
| `.env.example` | Configuration example with placeholder values |
| `docker-compose.yml` | Local PostgreSQL, migrations and backend |
| `.github/` | Pull request template and code owners |

Dependency definitions: `src/backend/pyproject.toml` and `src/frontend/package.json` (with `package-lock.json`).

## Setup, run and test

### Requirements
Node.js 20 or newer, Docker Desktop (for the backend and database), Python 3.9 or newer (only to run the backend or its tests outside Docker).

### Frontend (demo)
```
cd src/frontend
npm install
npm run dev            # http://localhost:3000
```
Open `/login` and continue as applicant or administrator (the sign-in is simulated). Production build: `npm run build && npm start`.

### Backend and database
```
cp .env.example .env   # then set a local password in .env
docker compose up --build
```
The API is at <http://localhost:8000/health>, the OpenAPI documentation at <http://localhost:8000/docs>. Stop with `docker compose down`. More options, such as running without Docker: [src/backend/README.md](src/backend/README.md).

### Tests and checks
```
# frontend: unit tests, lint, type check, production build
cd src/frontend
npm test && npm run lint && npm run typecheck && npm run build

# backend: needs PostgreSQL, for example `docker compose up -d db migrate`
pip install -e "src/backend[dev]"
export DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DBNAME
pytest tests/backend
```
Without a database the backend health and migration-file tests still run and the database tests are skipped.

## Contributing
- Branches: `DIP-<n>-short-description`, for example `DIP-12-er-diagram`. Commits: `DIP-<n>: Imperative summary`.
- Every change goes through a pull request that names the YouTrack task; the pull request template lists what to fill in.
- At least one review by the other team member is required before merge. No direct pushes to `main`, no force pushes, no history rewriting.
- Each member commits from their own GitHub account. Tags such as `prob-period-1` are never moved or deleted.
- No secrets, real applicant data or real documents in the repository; use `.env.example` for placeholders.
- Language: English; Russian translations, if any, go under `docs/ru/`.

## License
No licence has been chosen yet. Until one is added, all rights are reserved by the authors.
