# Architecture description

This document describes the layers and components of Pathly, the role of the language model, the six diagrams and how components, requirements, data and tests line up. The stack and the alternatives are in [technology-comparison.md](technology-comparison.md) and [decisions/ADR-0001-tech-stack.md](decisions/ADR-0001-tech-stack.md). Diagram sources are in [../diagrams/](../diagrams/), exports in [img/](img/).

Requirement identifiers follow the code and the proposal: objectives O1-O5 ([proposal.md](proposal.md)), FR-05 (requirements with sources and verification dates), FR-07 (data status), FR-08 (eligibility outcomes), FR-09 (roadmap), NFR-04 (explainability) and NFR-05 (validity of data).

## 1. Layers

| Layer | Technology | Responsibility |
|---|---|---|
| Presentation | Next.js (App Router), React, TypeScript, Tailwind CSS | Public pages, applicant workspace, administrator area. Shows every result with its source and verification date. |
| Application (API) | FastAPI, REST/JSON, JWT with applicant and administrator roles | Authentication and roles, endpoints, orchestration of the services below. |
| Domain logic | Python (backend), TypeScript (demo) | Data status, eligibility matching and gap analysis, roadmap generation. Deterministic. |
| AI | Provider-neutral interface to an external LLM API | Extracting a profile from conversation, explaining, answering from retrieved records. |
| Data | PostgreSQL 16 through psycopg 3, SQL migrations applied by dbmate | Programmes, requirements with source and status, deadlines, profiles, applications, tasks, audit log, conversations, knowledge chunks. |
| External | Email service, official university and scholarship websites | Reminders; the places where applicants submit and where administrators verify data. |

## 2. Components

| Component | Role |
|---|---|
| Auth and roles | Sign-in, JWT, separation of applicant and administrator actions. |
| Requirement matching and gap analysis | Compares the profile with each requirement and returns one outcome per requirement with a rule, both values and the source. |
| Roadmap generator | Turns gaps into dated tasks counted back from the verified deadline, ordered by dependencies. |
| Reminders and notifications | Scheduled jobs that send email before task dates. |
| AI service | Onboarding extraction and the advisor. Contains the retriever, the citation check and the refusal policy. |
| Retriever | Selects Verified records by SQL, with full-text search as fallback. No embeddings. |
| LLM interface | One interface for the external model, so the provider can change. |
| Administrator workflow | Verification queue, status changes, audit log. |

## 3. Role of the language model and deterministic logic
The language model helps with language: it reads the applicant's answers and proposes profile fields, explains results in plain words and answers questions from retrieved records. It does not decide anything that depends on a fact:

- **Eligibility, status and dates are computed by rules.** An outcome is Met, Not met, Pending or Unknown. A requirement whose record is not Verified on the evaluation date can only be Unknown. Only a Tier 1 source (official page or document) can make a record Verified, and a Verified record past its validity date is Stale (FR-07, FR-08, NFR-05).
- **The advisor sees only Verified records.** The retriever filters by status in the SQL query. The answer must cite the records it used; if nothing verified is found, the advisor refuses and points to the official source.
- **The applicant confirms the profile.** Extracted fields are a proposal until confirmed.
- **Roadmap dates are never invented.** If the deadline is not Verified, the first task is to verify it and the other tasks have no date (FR-09).

## 4. Diagrams

| Diagram | Source | Export | What it shows |
|---|---|---|---|
| System context | [system-context.mmd](../diagrams/system-context.mmd) | [svg](img/system-context.svg), [png](img/system-context.png) | Pathly with its users and external systems. |
| Use cases | [use-cases.mmd](../diagrams/use-cases.mmd) | [svg](img/use-cases.svg), [png](img/use-cases.png) | What applicants and administrators can do. |
| Components | [components.mmd](../diagrams/components.mmd) | [svg](img/components.svg), [png](img/components.png) | Components of section 2 and how they call each other. |
| Entity-relationship | [erd.mmd](../diagrams/erd.mmd) | [svg](img/erd.svg), [png](img/erd.png) | Planned data model. Requirements and deadlines carry source, status, verification date and validity date; knowledge chunks are plain text. |
| Activity | [activity.mmd](../diagrams/activity.mmd) | [svg](img/activity.svg), [png](img/activity.png) | From registration to a personalised roadmap, including Unknown outcomes and undated tasks. |
| Sequence | [sequence.mmd](../diagrams/sequence.mmd) | [svg](img/sequence.svg), [png](img/sequence.png) | Onboarding, eligibility analysis, advisor with refusal, administrator verification. |

## 5. Alignment of components, requirements, data and tests

| Component | Requirements | Data entities | Scenario or test | Diagrams | State |
|---|---|---|---|---|---|
| Auth and roles | Roles of applicant and administrator | USERS | Sign-in as applicant or administrator in the demo | use-cases, components | Simulated in the demo; not built in the backend |
| Programme and requirement data | O2, FR-05, FR-07, NFR-05 | UNIVERSITIES, PROGRAMMES, REQUIREMENTS, DEADLINES, SOURCES | `tests/frontend/status.test.ts`; `tests/backend/test_universities_repository.py`, `test_migrations.py` | erd, components | `universities` in PostgreSQL; the rest in the demo on invented data |
| Matching and gap analysis | O4, FR-08, NFR-04 | APPLICANT_PROFILES, REQUIREMENTS | `tests/frontend/eligibility.test.ts`; activity and sequence scenarios | activity, sequence, components | Implemented in the demo (TypeScript); not yet in the backend |
| Roadmap generator | O5, FR-09 | APPLICATIONS, ROADMAP_TASKS | `tests/frontend/roadmap.test.ts` | activity, sequence, components | Implemented in the demo |
| Reminders | Application checklist, deadline tracking, email reminders (Should) | REMINDERS | None yet | components, erd | Settings in the demo only |
| AI onboarding | O3 | CONVERSATIONS, MESSAGES, APPLICANT_PROFILES | Onboarding scenario; evaluation in [evaluation.md](evaluation.md) | sequence, components | Scripted replies in the demo; AI layer not started |
| Retriever and advisor | AI advisor grounded in verified sources | KNOWLEDGE_CHUNKS, SOURCES, MESSAGES | Advisor scenario with refusal; evaluation in [evaluation.md](evaluation.md) | sequence, components | Scripted replies in the demo; AI layer not started |
| Administrator workflow | Verification of data | REQUIREMENTS, VERIFICATION_LOG | Verification scenario | sequence, use-cases | Implemented in the demo (queue, audit log) |

## 6. Consistency check: open questions
The consistency pass (DIP-10) found the points below in the proposal text. The proposal belongs to Dinara Medeubek, so the text is not changed here; each point has an owner.

| Point | Finding | Status | Owner |
|---|---|---|---|
| (a) States of eligibility | O4 names three states (Meets, Action Needed, Unknown); FR-08 and section 3.3 name four (Met, Not met, Pending, Unknown). The architecture and the demo use four. | Open: align O4 | Dinara Medeubek |
| (b) Profile fields | FR-02 lists seven fields, O3 lists more (education, citizenship, document readiness). | Open: align the lists | Dinara Medeubek |
| (c) Section 9.4 | Refers to "M4 to M6", which are not defined. | Open: needs the full proposal | Dinara Medeubek |
| (d) Accuracy figure | 41.4% against 41.8% for reference [8]. | Open: check the source | Dinara Medeubek |
| (e) pgvector and embeddings | Sections 3.5, 7.1, 7.5 mention them. The decision is plain PostgreSQL without pgvector. | Decided in ADR-0001; proposal text to update | Dinara Medeubek |
| (f) Numbering and typos | Section 7.1 appears twice; NFR-05 is truncated; "FR-0" in 7.8; "State" instead of "Stale" in Decision 4; "remainders" instead of "reminders" in FR-12. | "Stale" fixed in the technology comparison; the rest open | Dinara Medeubek |
| (g) Prototype link | The link in section 8.2 is empty. The demo is at <https://stepup.website>. | Open: add the link | Artur Jaxygaliyev |
| (h) Milestone date | "Prototype and diagram exports ready" is dated 10-20 Oct in 10.3; the exports and diagrams are in this repository now. | Open: update the date | Dinara Medeubek |

Names, identifiers and scope used here (roles, 20 pilot programmes, the stack) match the README and the other documents in this folder.
