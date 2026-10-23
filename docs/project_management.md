# 10. Project Management and Risks

## 10.1. Repository and YouTrack

**GitHub repository:** https://github.com/Arthurmyn/Pathly

**YouTrack project:** https://udp.youtrack.cloud/dashboard?id=177-0

## 10.2. Allocation of Responsibilities and Individual Contributions

The project is developed by two team members with clearly defined responsibilities. Artur Jaxygaliyev is responsible for backend development, database design, and API integration. Dinara Medeubek is responsible for machine learning, AI functionality, and business analysis. Both members contribute to system design, testing, and project documentation.

| Area | Dinara Medeubek (ML, Business Analysis) | Arthur Jaxygaliyev (Backend, Frontend Development) |
|---|---|---|
| Frontend | Develop the AI onboarding chat and AI advisor interface, including displaying extracted profile data, answers, and source references. | Develop the main layout, applicant dashboard, university and programme catalogue, eligibility results, roadmap, application checklist, and administrator panel. |
| Backend | Define requirements for AI integration, profile extraction, and retrieval. | Implement REST APIs, authentication, database operations, eligibility services, and roadmap generation. |
| ML and AI | Implement AI onboarding, profile extraction, RAG-based answering, source grounding, and AI evaluation. | Integrate backend endpoints with the frontend and support AI-service integration. |
| Business Analysis | Analyse applicant needs and define user scenarios, functional requirements, and evaluation criteria. | Analyse technical feasibility and document backend and interface requirements. |
| Testing and Documentation | Evaluate AI answers, extraction quality, and source reliability; document the AI methodology. | Test frontend, APIs, database operations, and integration; document architecture and implementation. |

## 10.3. Milestones

| Date | Milestone |
|---|---|
| 12–16 October 2026 | Interviews conducted and documented. |
| 18 October 2026 | README, repository structure, YouTrack tasks, and initial merged pull requests established. |
| 10–20 October 2026 | Prototype and diagram exports prepared. |
| Later phases | Core implementation, pilot dataset preparation, evaluation studies, and final report. Dates to be agreed with the supervisor. |

## 10.4. Risks and Dependencies

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Stored requirements are incorrect or outdated. | Medium | High | Use a status model, Tier 1 sources for verified records, and cross-verification. |
| The AI provides a false deadline or admission rule. | Medium | High | Retrieve only from verified records, validate citations, apply a refusal policy, and conduct a 60-question evaluation. |
| Scope is too large for a two-person team. | High | High | Prioritise core scope; implement supporting features only if time allows. |
| LLM cost, service outage, or model changes. | Medium | Medium | Use a provider-neutral interface and pin the model version where possible. |
| Contributions are uneven or difficult to trace. | Medium | High | Use personal accounts, task-linked commits, cross-review, and a contribution log. |

### Dependencies

The project depends on supervisor feedback, access to official university and scholarship information, an API key for the AI service, volunteers to test the platform, and a hosting service for demonstrating the system online.