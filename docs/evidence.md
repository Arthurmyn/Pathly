# 2. Evidence of the Relevance

## 2.1. Evidence Log

| ID | Date | Participant or Source | Format | Status | Main Findings | Requirement or Change It Caused |
|---|---|---|---|---|---|---|
| E1 | October 2026 | Supervisor | Written review | Done | The supervisor considered the problem relevant and the unified applicant journey promising. The proposal required a clearer scope, ERD, activity and sequence diagrams, and a stronger evaluation plan. | Reduced the scope to core features, expanded the system diagrams, and added an evaluation plan. |
| E2 | 8 October 2026 | Public admission pages of universities and the Bolashak programme | Observation | Done | Admission information is distributed across university websites and government portals. Requirements vary by programme and admission pathway. | Store programme-specific requirements with official source URLs and verification dates (FR-05). |
| E3 | 12–14 October 2026 | Applicant interested in Bachelor's and Master's programmes | Semi-structured interview | Done | The applicant found it difficult to compare universities, check eligibility, and identify required documents. | Add applicant profiles, programme comparison, and personalised roadmaps. |
| E4 | 12–14 October 2026 | Recent university applicant or graduate | Semi-structured interview | Done | The participant reported difficulties tracking deadlines and remembering document requirements. | Add an application checklist, deadline tracking, and visible source information. Each requirement must include a verification date and a data-status label. |
| E5 | 13–16 October 2026 | University admissions staff member or education consultant | Semi-structured interview | Done | The participant highlighted frequent questions about eligibility, documents, and changing requirements. | Provide programme-specific requirements and clear eligibility explanations. The AI advisor must use verified information and provide source references. |
| E6 | 14–16 October 2026 | Second applicant (Bachelor's or Doctoral/PhD) | Interview | Done | The participant wanted support for different degree levels and clearer explanations of missing requirements. | Support Bachelor's, Master's, and Doctoral/PhD programmes with clear eligibility results and next steps. |
| E7 | 16–23 October 2026 | University admission survey (30 respondents) | Online questionnaire | Done | 43.3% reported difficulty finding accurate and up-to-date admission information, while 40% reported that information was scattered across different websites. | Develop a centralised programme database with admission requirements, official source links, and verification statuses. |
| E8 | 16–23 October 2026 | University admission survey (30 respondents) | Online questionnaire | Done | 60% selected reliable information about programmes and scholarships as the most helpful type of support. | Prioritise reliable, verified programme and scholarship information in the MVP. |
| E9 | 16–23 October 2026 | University admission survey (30 respondents) | Online questionnaire | Done | 50% wanted a personalised admission plan with deadlines, and 43.3% wanted reminders about documents and next steps. | Implement personalised admission roadmaps, deadline tracking, document checklists, and reminders. |
| E10 | 16–23 October 2026 | University admission survey (30 respondents) | Online questionnaire | Done | 36.7% selected eligibility checking as helpful support; 40% reported difficulties related to meeting one or more admission requirements. | Implement eligibility matching that identifies unmet and uncertain requirements and explains the results. |
| E11 | 16–23 October 2026 | University admission survey (30 respondents) | Online questionnaire | Done | 76.7% rated a platform combining admission information, eligibility checking, planning, and reminders as 5/5; the remaining 23.3% rated it 4/5. | Treat the results as preliminary evidence of user interest and evaluate the prototype's usability and usefulness. |

The semi-structured interviews lasted approximately 10–20 minutes. Participants were recorded by role rather than by name. The interviews covered five questions: which sources were used to find requirements; which requirement or deadline was hardest to find; how eligibility was assessed and how confident the participant felt; whether outdated or contradictory information had been encountered; and what would be needed to trust an assistant answering admission questions.

Each finding was recorded alongside the requirement or design change it informed. Survey results were analysed separately from interview findings.

## 2.2. Verified Findings and Assumptions

| ID | Statement | Status | Evidence or Planned Verification |
|---|---|---|---|
| F1 | Admission information is distributed across multiple channels. | Verified within the reviewed sample | Observation E2 |
| F2 | Requirements differ by programme and admission pathway. | Verified within the reviewed sample | Observation E2 |
| F3 | An expert considers the problem relevant and the unified applicant journey promising. | Verified as expert opinion | Supervisor review E1 |
| F4 | Survey respondents report difficulties finding accurate and up-to-date admission information. | Verified within the survey sample | Survey E7; 43.3% reported this difficulty |
| F5 | Survey respondents value reliable information about programmes and scholarships. | Verified within the survey sample | Survey E8; 60% selected this type of support |
| F6 | Survey respondents value personalised planning and deadline reminders. | Verified within the survey sample | Survey E9 |
| F7 | Survey respondents expressed high perceived usefulness for a platform combining the proposed features. | Verified within the survey sample | Survey E11 |
| A1 | Applicants find it difficult to determine their eligibility and identify missing requirements. | Partially supported; further validation needed | Interviews E3–E6 and survey E10 |
| A2 | Applicants encounter outdated or contradictory admission information. | Assumption requiring further verification | Interview records E3–E6; document specific examples if available |
| A3 | Applicants will trust an AI advisor if it provides source links and verification dates. | Assumption requiring further verification | Interview responses; analyse explicit statements about trust |
| A4 | Personalised roadmaps will improve application preparation compared with manual planning. | Assumption requiring evaluation | Compare platform-assisted and manual planning in the evaluation study |

Survey findings describe the 30 respondents and should not be generalised to all applicants. Findings from interviews should be treated as qualitative evidence from the participants interviewed, rather than as estimates of prevalence across the applicant population.

## 2.3. Requirement Change Log

| ID | Evidence | Requirement or Change | Rationale |
|---|---|---|---|
| RC1 | E1 | Narrow the MVP scope and document the architecture and evaluation plan. | The supervisor requested a clearer project scope, diagrams, and measurable evaluation criteria. |
| RC2 | E2 | FR-05: Store programme-specific admission requirements with official source URLs and verification dates. | Requirements vary across programmes and information sources. |
| RC3 | E3 | Support applicant profiles, programme comparison, and personalised roadmaps. | The applicant reported difficulty comparing options and assessing eligibility. |
| RC4 | E4 | Provide application checklists, deadline tracking, source links, and verification dates. | The participant reported difficulty remembering documents and deadlines. |
| RC5 | E5 | Provide clear eligibility explanations and source-grounded AI responses. | Applicants frequently ask about eligibility, documents, and changing requirements. |
| RC6 | E6 | Support Bachelor's, Master's, and Doctoral/PhD programmes and explain missing requirements. | The participant wanted support across degree levels and clearer next steps. |
| RC7 | E7 | Centralise programme information and expose verification status. | Survey respondents reported fragmented and difficult-to-find information. |
| RC8 | E8 | Prioritise reliable programme and scholarship information. | Reliable information was the most frequently selected support option. |
| RC9 | E9 | Include personalised roadmaps, deadline tracking, document checklists, and reminders. | Respondents valued structured planning and reminders. |
| RC10 | E10 | Implement requirement-by-requirement eligibility matching with clear statuses and explanations. | Respondents reported eligibility-related difficulties and selected eligibility checking as useful support. |
| RC11 | E11 | Evaluate usability and perceived usefulness with users. | Respondents rated the proposed combination of features positively, but actual usefulness must be tested with a working prototype. |

## 2.4. Summary

The evidence collected so far indicates that applicants need clearer access to admission information, help comparing programmes, and support organising application requirements and deadlines. The supervisor's feedback also supports narrowing the project scope and establishing a measurable evaluation plan.

These findings inform Pathly's central programme catalogue, source-verification model, eligibility analysis, personalised roadmap, and AI advisor. However, assumptions about trust in AI and the actual improvement produced by personalised roadmaps remain subject to further evaluation.