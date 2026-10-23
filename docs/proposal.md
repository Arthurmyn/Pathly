# 1. Project Proposal

## 1.1. Problem Statement

Applying to higher education programmes in Kazakhstan and abroad requires applicants to collect, interpret, and compare information from multiple sources. Depending on the institution, degree level, and programme, applicants may need to meet different academic, language, financial, documentation, and deadline requirements. Scholarship programmes may also impose separate eligibility conditions. For example, the Bolashak scholarship has specific eligibility and documentation requirements, while colleges using the Common App may have different deadlines and application policies.

Beyond finding admission information, applicants must identify programmes that match their academic background, skills, interests, and future goals. However, choosing an appropriate academic direction can be challenging. A student with strong mathematical skills might consider finance, statistics, or data science, while someone with programming experience might explore computer science or software engineering. Such choices require more than matching one skill to a programme; applicants need to understand their options and the requirements associated with each path.

Existing university websites and digital platforms support programme discovery and application submission, but applicants may still need to connect information from different sources, assess their eligibility, identify missing requirements, and organise their next steps independently. They may also lack personalised guidance that connects their strengths and interests with suitable academic programmes.

The problem addressed by Pathly is therefore the lack of a unified, transparent, and personalised workflow that connects academic-direction exploration with programme selection and admission preparation. Pathly aims to address this gap through an AI advisor that explores applicants' skills, interests, educational backgrounds, and goals, suggests relevant academic directions with explanations, and helps them compare programmes. These recommendations will be connected to verified admission requirements, rule-based eligibility analysis, and a personalised roadmap of tasks and deadlines. The language model will support conversation and explanations, while verified data and deterministic rules will govern formal eligibility decisions.

## 1.2. Target Users

| User Group | Role in the MVP |
|---|---|
| Applicants to Master's programmes in Kazakhstan and abroad | Included: primary users; profiles, AI-assisted onboarding, gap analysis, and personalised roadmaps |
| Applicants to Bachelor's programmes | Included: primary users; profiles, AI-assisted onboarding, gap analysis, and personalised roadmaps |
| Applicants to Doctoral / PhD programmes | Included: primary users; profiles, AI-assisted onboarding, gap analysis, and personalised roadmaps |
| Teachers, mentors, and supervisors | Excluded from the MVP; possible future extension |
| Administrators | Included: the project team manages and verifies programme data |

## 1.3. Aim

The aim of this project is to design, implement, and evaluate Pathly, a digital platform that supports applicants throughout the higher education decision-making and admission process in Kazakhstan and abroad.

Pathly will help applicants explore suitable academic fields and programmes based on their educational background, strengths, skills, interests, preferences, and study goals. Its AI advisor will conduct a conversational assessment, ask follow-up questions when necessary, explain potential study directions, and help applicants compare relevant options. The recommendations will serve as decision support rather than definitive career or academic decisions.

The platform will integrate personalised programme discovery, source-verified admission requirements, rule-based eligibility and qualification-gap analysis, deadline-aware roadmap generation, and an AI advisor grounded in curated programme information. The system will distinguish verified facts from missing, outdated, conflicting, or unverified information and will not present uncertain eligibility decisions as confirmed.

The project will evaluate the functional correctness, recommendation relevance, data reliability, AI answer grounding, usability, and practical usefulness of the MVP. The evaluation will examine whether Pathly helps applicants understand their options, the reasons behind recommendations, and the next steps required to prepare for admission.

## 1.4. Objectives

| ID | Objectives |
|---|---|
| O1 | Analyse the needs and admission workflows of applicants to Bachelor's, Master's, and Doctoral/PhD programmes in Kazakhstan and the United States, using interviews and official sources. |
| O2 | Design and populate a database of at least 20 programmes in Kazakhstan and the United States, including degree levels, requirements, deadlines, documents, official URLs, verification dates, and statuses. |
| O3 | Implement an AI-assisted onboarding process that collects applicants' education, strengths, skills, interests, and goals to support personalised academic and programme recommendations. |
| O4 | Implement rule-based eligibility matching and gap analysis for GPA, degree background, language scores, examinations, deadlines, documents, budget, citizenship, and work experience. Each requirement shall be classified as Meets, Action Needed, or Unknown, with an explanation. |
| O5 | Create a personalised admission and preparation plan based on gaps, verified deadlines, and task dependencies. Applicants can mark tasks as completed, while administrators manage programme deadlines. |
| O6 | Develop an AI advisor that recommends suitable academic directions and programmes, answers admission questions using verified sources, and explains its suggestions. |
| O7 | Implement an administration interface for managing users, universities, programmes, requirements, deadlines, sources, and verification statuses, including alerts for missing, outdated, or conflicting records. |
| O8 | Evaluate the MVP's recommendation relevance, eligibility accuracy, source reliability, roadmap quality, AI answer grounding, usability, and response time. |

## 1.5. Expected Outcomes

| ID | Outcome |
|---|---|
| D1 | A functional MVP that integrates all the main features described in Section 1.6. |
| D2 | A pilot dataset containing 20 verified programmes across Bachelor's, Master's, and Doctoral/PhD levels, supported by official sources and verification dates. |
| D3 | Technical documentation covering system requirements, architecture, diagrams, and technology selection. |
| D4 | A report evaluating the effectiveness of the platform according to the criteria defined in Section 9. |

## 1.6. Project Scope

In addition to admission guidance, Pathly will provide AI-assisted academic-direction discovery. During onboarding or a separate conversation, applicants may describe their strongest subjects, technical and transferable skills, interests, preferred activities, previous education, and future goals. The AI advisor will use this information to suggest potentially relevant academic fields and explain how the applicant's profile relates to each option.

For example, an applicant who reports strong mathematical skills and an interest in financial analysis may be encouraged to explore finance, economics, statistics, or data science. An applicant with programming experience and an interest in working with data may be shown options such as computer science, software engineering, or data science. The advisor should explain the differences between these fields, identify relevant prerequisites, and ask clarifying questions rather than assuming that one skill determines the best choice.

Where supported by the pilot dataset, the advisor will connect suggested fields to relevant university programmes, compare their verified admission requirements, identify gaps in the applicant's profile, and generate a personalised preparation roadmap. The language model will help interpret applicant responses, explore options, and explain recommendations; structured programme records and deterministic rules will remain responsible for verified admission facts and eligibility results.

The MVP will provide exploratory academic guidance, not psychometric testing, guaranteed career predictions, or definitive professional counselling. Recommendations will be presented as options for applicants to consider, and applicants will remain responsible for their final decisions.

### Feature Priorities

| Category | Features | Priority |
|---|---|---|
| Core | Applicant profiles and AI-assisted onboarding; university and programme information with verified admission requirements; eligibility matching and gap analysis; personalised application roadmaps; an AI advisor using verified sources; administrator workflow for verifying information | Must |
| Supporting Features | Application checklist, deadline tracking, and email reminders | Should |
| Future Extension | Teacher scheduling, preparation courses, mentor and supervisor dashboards, document uploads, and document feedback | Won't in this diploma project |
| Out of Scope | Payment processing, live classes, community features, a mobile application, and automatic scraping of university websites | Won't |

The platform does not replace official application systems. Applicants must submit their applications through the official websites of universities or scholarship programmes.

### Example of the User Journey

An applicant creates a profile and enters their academic background and study goals through AI-assisted onboarding. They select a programme and review its admission requirements, including official source links and verification dates. The platform then checks their eligibility, identifies missing requirements, and generates an ordered list of next steps. The AI advisor provides explanations based only on verified information. If information is missing, outdated, or conflicting, the system explains the limitation and directs the applicant to verify it. Any programme-specific information must be checked against official sources before it is presented as a fact.

## 1.7. Engineering Complexity

The project involves several technical challenges, including designing a relational database that stores admission requirements, their sources, and verification statuses. It also requires a rule-based engine that checks eligibility, identifies missing requirements, and explains its results using three possible states.

The platform must generate personalised roadmaps by organising tasks according to deadlines and dependencies. In addition, the AI advisor will use retrieval-augmented generation (RAG) to provide answers supported by verified sources, with citations and a refusal mechanism when reliable information is unavailable.

The onboarding process must also extract applicant information from conversations and convert it into a structured profile. Finally, the project requires an evaluation framework with manually verified reference data, baseline comparisons, and user testing to assess the platform's accuracy and usability.