# Technology comparison

Proposed MVP stack: Next.js with React and TypeScript for the web interface; Python with FastAPI for the REST backend; PostgreSQL for structured data; and an LLM API with retrieval over curated, verified records for the AI advisor.

## Decision 1: backend platform
Criteria: AI retrieval integration, role-based API, development speed.

| Alternative | Strengths | Weakness for this project |
|---|---|---|
| FastAPI (Python) | Same language as AI and retrieval libraries; typed API; automatic documentation | Fewer ready-made admin tools than Django |
| Node.js (NestJS or Express) | One language with the frontend; large ecosystem | AI and retrieval tooling is stronger in Python |
| Django | Built-in administration and authentication | Heavier; asynchronous AI calls need more setup |

## Decision 2: data storage
Criteria: relational requirements with source and status.

| Alternative | Strengths | Weakness for this project |
|---|---|---|
| PostgreSQL | Strong relations; transactions; facts and status in one database, so retrieval can filter by status | Less tuned than dedicated engines at very large scale; schema migrations |
| MongoDB | Flexible documents | Weaker joins; harder to keep status consistent |
| MySQL | Widely known, simple hosting | Fewer built-in search and vector features |

## Decision 3: component interaction (frontend to backend)

| Alternative | Strengths | Weakness for this project |
|---|---|---|
| REST (JSON over HTTPS) | Simple, testable, matches FastAPI documentation | Several calls for composite views |
| GraphQL | One request for composite views | More tooling and a harder test setup |
| WebSockets | Live updates | Unneeded complexity; reminders can be scheduled jobs |

## Decision 4: eligibility matching approach

| Alternative | Strengths | Weakness for this project |
|---|---|---|
| Deterministic rule engine over structured requirements | Explainable; unit-testable; Unknown and Stale are explicit outcomes | Requirements must be structured by hand |
| ML classifier on historical outcomes | Can capture soft factors | No open outcome data for Kazakhstan; opaque |
| LLM judges eligibility from retrieved text | Handles free text | Risk of hallucinated eligibility [10]; hard to test |

The frontend is Next.js, authentication uses JWT.
