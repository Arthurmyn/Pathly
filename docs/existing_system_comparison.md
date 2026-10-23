# 4. Existing System Comparison

## 4.1. Systems and Criteria

Four existing systems or service categories were compared against eight criteria:

1. Programme search and comparison
2. Per-programme requirements and deadlines
3. Visible verification status and date
4. Personalised eligibility and gap analysis
5. Personalised roadmap
6. AI assistant grounded in sources
7. Application submission or tracking
8. Kazakhstan context

The comparison includes Common App (application submission), Studyportals (programme discovery), the Bolashak process through [gov.kz](https://www.gov.kz/) and [eGov.kz](https://egov.kz/) (official state scholarship and application channels), and general-purpose large language model (LLM) assistants, represented by the ChatGPT 3.5 results discussed in [8].

These systems cover different stages of the higher education application process, so fewer than five directly comparable systems were identified. The proposed platform, Pathly, is included to show how the planned solution addresses the identified gaps.

In the table, "Not found" means that the feature was not identified in the sources reviewed; it does not prove that the feature is absent. Claims should be checked against current official sources before the project defence.

## 4.2. Comparison

| Criterion | Common App | Studyportals | Bolashak | General-purpose LLM assistant | Proposed platform (Pathly) |
|---|---|---|---|---|---|
| Programme search and comparison | Yes | Yes | Not found | No structured programme catalogue | Yes, through a pilot catalogue |
| Per-programme requirements and deadlines | Yes, per college | Yes | Yes, including language requirements | Based on model knowledge unless external sources are used | Yes, with source links and verification dates |
| Visible verification status and date | Not found | Not found | Official sources available; no unified status model identified | No maintained verification status | Yes, with a five-state verification model |
| Personalised eligibility and gap analysis | Not found | Matching emails only, according to reviewed sources | No structured requirement-by-requirement analysis identified | Unreliable without verification; 41.8% accuracy reported in [8] | Yes, for each requirement |
| Personalised roadmap | Deadline checklist | Not found | Not found | Generic text can be generated | Yes, based on eligibility gaps and deadlines |
| AI assistant grounded in sources | Not found | Not found in the reviewed sources | Not found | Can generate answers, but grounding is not guaranteed by default | Yes, using verified sources |
| Application submission or tracking | Yes | No direct application submission identified | Application process available through official channels, including eGov.kz where applicable | No direct submission or tracking | Tracking and planning; submission remains on official channels |
| Kazakhstan context | Not specifically focused on Kazakhstan | International programme discovery, not specifically focused on Kazakhstan | Yes | Depends on the prompt and available information | Yes, with a Kazakhstan-focused pilot |

Note: The table reflects the sources reviewed for this project. "Not found" and other qualified entries should not be interpreted as definitive statements that a system does not offer a feature. The 41.8% accuracy figure should be interpreted according to the exact task, dataset, and evaluation method reported in [8].

## 4.3. Why the Proposed Solution Is Needed

The reviewed systems support different parts of the higher education application journey. Common App focuses on application submission, Studyportals supports programme discovery, Bolashak provides official scholarship information and application procedures, and general-purpose LLM assistants can explain information through natural-language interaction.

However, based on the reviewed sources, applicants may still need to combine information from multiple services to determine whether they satisfy each programme requirement, identify missing or uncertain information, and organise the next steps around verified deadlines. A general-purpose LLM may produce fluent explanations, but fluency alone does not guarantee factual accuracy or that admission information is current.

Pathly aims to connect these activities in one workflow. Its proposed features include a structured programme catalogue, source links and verification dates, requirement-by-requirement eligibility analysis, and a personalised roadmap based on identified gaps and deadlines. The AI advisor will help applicants explore suitable academic directions and understand programme information, while verified data and deterministic rules will govern formal eligibility results.

The reported 41.8% accuracy figure in [8] supports the need to evaluate AI-generated admission answers carefully. It should not be treated as a universal accuracy rate for all LLM assistants or all admission questions. Pathly will therefore need to be evaluated for eligibility accuracy, source reliability, answer grounding, roadmap quality, and usability.

## 4.4. Sources

The comparison is based on the following source groups. Specific claims in the table should be linked to the exact pages or publications used in the final reference list.

- Common App: Official Common App website and application guidance; supplementary sources include the Coursera guide and Crimson Education materials.
- Studyportals: Official Studyportals student-facing pages and company information. Third-party reviews should not be used as the sole evidence for product functionality.
- Bolashak: Official scholarship and study-abroad information published by [gov.kz](https://www.gov.kz/) and [eGov.kz](https://egov.kz/).
- General-purpose LLM assistants: Chen et al. [8], "Facilitating University Admission Using a Chatbot Based on Large Language Models with Retrieval-Augmented Generation", which provides the reported evaluation results discussed in this comparison.

Before submission, replace general source descriptions with complete references and URLs, and verify that each feature claim is supported by the corresponding source. Keep the reference numbering consistent with the thesis bibliography.