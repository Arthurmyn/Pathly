# 9. Verification and Evaluation Plan

## 9.1. Baseline Solutions

| Component | Baseline for Comparison |
|---|---|
| Recommendations and eligibility | B1: Keyword filter by degree, country, and field (typical search portal); B2: Manual determination by participants using official websites |
| Planning | B3: Traditional manual process using official websites without the platform |
| AI advisor | B4: The same LLM without retrieval; B5: Retrieval without status filtering and citation validation |

## 9.2. Evaluation Questions, Metrics, and Success Criteria

| ID | Questions and Metrics | Metrics | Baseline | Success Criterion |
|---|---|---|---|---|
| EQ1 | Are programme recommendations relevant? Evaluate recommendations using labelled applicant profiles. | Precision@5, Recall@5, nDCG@5 | B1, random order | Precision@5 >= 80% |
| EQ2 | Is eligibility matching correct? Test against manually verified admission requirements and edge cases. | Accuracy, macro-F1, false Met rate | Rule-based baseline | Accuracy >= 95%; false Met rate <= 2%; unverified data marked Unknown |
| EQ3 | Are roadmaps useful? Ask experts and applicants to evaluate task order and usefulness. | Expert rating, user agreement, next-action correctness | Manual roadmap | Mean expert rating >= 4/5; next-action correctness >= 80% |
| EQ4 | Does the platform improve the admission-planning process? Compare platform-assisted and manual planning. | Completion time, checklist completeness, error count | Manual planning | Reduced completion time and improved completeness |
| EQ5 | Are AI answers reliable and supported by sources? Test answerable, unanswerable, outdated, and conflicting-data questions. | Answer correctness, citation precision, refusal accuracy | LLM without verified retrieval | Correctness >= 90%; refusal accuracy >= 90%; no unsupported deadlines presented as facts |

## 9.3. Testing Plan

| Level | What Is Tested | Tool |
|---|---|---|
| Unit | Matching rules, status transitions, roadmap ordering | pytest |
| API and integration | Endpoints, role permissions, database constraints | pytest with a test database |
| End-to-end | Scenarios S1 to S3 | Playwright |
| AI evaluation | Agreed AI evaluation set, citation validation, refusal behaviour | Scripted run, results logged |
| Security and usability | Access by the wrong role, secrets scan, five core tasks, and SUS questionnaire | Checklist; observation |

## 9.4. Measurement Conditions

Evaluation will use a pilot dataset of verified programmes (target: 20 programmes across Bachelor's, Master's, and PhD levels), synthetic applicant profiles for automated tests, and at least eight volunteer participants for M4 to M6 who are not members of the project team.

Participants and results will be recorded without storing personal data. Both team members will run the same protocol, and results will be stored in the repository's evaluation folder.

The evaluation will compare Pathly against the defined baselines using the metrics and success criteria specified above.