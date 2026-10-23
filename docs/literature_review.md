# 3. Literature Review

## 3.1. Method

The literature review examines educational recommendation systems, university and academic programme selection, admission chatbots, retrieval-augmented generation (RAG), hallucination risks, and evaluation methods. Sources were identified through Google Scholar, DOAJ, MDPI, IEEE Xplore, the ACM Digital Library, and arXiv. The review includes 14 sources: peer-reviewed publications, foundational research, and a preprint. Bibliographic details were checked against publisher or repository records on 10 October 2026.

The review focused on four questions:

1. How do existing systems recommend academic programmes and support educational choices?
2. What difficulties do applicants face when accessing and interpreting admission information?
3. How can conversational AI and RAG support admission guidance while reducing unsupported answers?
4. What limitations remain in eligibility checking, qualification-gap analysis, and personalised admission planning?

## 3.2. Structured Analysis of Publications

| No. | Source | Method and Data | Main Findings | Limitations and Relevance |
|---|---|---|---|---|
| 1 | Urdaneta-Ponte et al. (2021) | Systematic review of educational recommendation systems | Collaborative, content-based, and hybrid approaches are widely used. | Broad educational scope; does not focus specifically on admission eligibility. |
| 2 | Kamal et al. (2024) | Systematic review of academic choice and advising research | Hybrid recommendation approaches are common; many studies rely on offline experiments and case studies. | Limited real-user evaluation across the reviewed studies. |
| 3 | Fedushko et al. (2022) | Recommendation architecture and analysis of Ukrainian admission records | Applicants face information overload and fragmented admission information. | Country-specific context; does not evaluate the complete Pathly workflow. |
| 4 | Elahi et al. (2022) | Offline evaluation and online user study of university recommender algorithms | Different algorithms perform differently in accuracy, novelty, and perceived personalisation. | Recommendation rankings do not establish formal admission eligibility. |
| 5 | Mokarrama et al. (2020) | Content-based university recommendation using six parameters and 947 feedback responses | The proposed method achieved high reported precision, recall, and F1 score, but lower specificity. | Limited criteria and potential false positives; explanations and eligibility checks remain relevant gaps. |
| 6 | Algarni and Sheldon (2023) | Systematic review of course recommendation systems | Large decision spaces and cold-start problems are important challenges. | Focuses on course selection rather than admission eligibility. |
| 7 | Prashant et al. (2025) | Systematic review of administrative chatbots in higher education | Chatbots can reduce workload and speed up responses; privacy and multilingual support remain challenges. | Review of chatbot applications rather than a complete eligibility and planning system. |
| 8 | Chen et al. (2024) | RAG-based admission chatbot tested using data from three universities and feedback from 53 high-school students | Reported average answer accuracy increased from 41.4% to 89.5%, with a peak of 94.7%. | Question answering does not automatically provide eligibility analysis, verification status, or roadmaps. |
| 9 | Lewis et al. (2020) | Introduced retrieval-augmented generation for knowledge-intensive NLP tasks | Retrieval can provide external evidence to support generated answers. | Retrieval alone does not guarantee current, complete, or correct information. |
| 10 | Ji et al. (2023) | Survey of hallucination in natural language generation | Generated text may contain unsupported or factually incorrect information. | Mitigation must be designed and evaluated for the target application. |
| 11 | Gao et al. (2023) | Survey of RAG architectures and evaluation methods | Describes approaches to retrieval, generation, and RAG evaluation. | Preprint; informs system design but is not itself an admission-system evaluation. |
| 12 | Herlocker et al. (2004) | Methodological review of recommender-system evaluation | Evaluation metrics should correspond to the tasks and user goals being assessed. | Foundational work predating modern LLM-based systems. |
| 13 | Larroucau et al. (2025) | Field experiment on personalised information in Chile's centralised admissions system | Personalised information improved assignment and placement outcomes in the studied context. | The centralised system differs from international admissions and does not evaluate requirement-level gap analysis or roadmaps. |
| 14 | Taylor and Bicak (2019) | Analysis of international student information on 43 public university websites in Texas | The study identified readability, translation, and information-completeness problems. | Limited to a specific geographic and institutional context; does not evaluate a unified admission-support platform. |

The table summarises the sources reviewed for this project. Numerical results should be interpreted within the original studies' datasets, methods, and evaluation settings.

## 3.3. Synthesis

### Educational Recommendation Systems

Research on educational recommendation systems demonstrates the use of collaborative, content-based, and hybrid methods to support academic choices [1], [2]. Systems developed for academic-specialty and university selection show how applicant and institution characteristics can be used to rank or recommend options [3], [5]. However, recommending a programme is not equivalent to verifying that an applicant satisfies every formal admission requirement. A recommendation may help narrow choices without confirming minimum GPA, prerequisite courses, language scores, documents, or deadlines.

Elahi et al. [4] demonstrate the importance of evaluating recommendation systems across multiple dimensions, including accuracy and user-perceived qualities. Algarni and Sheldon [6] identify cold-start problems and large decision spaces in course recommendation. These issues are relevant to applicants who have limited interaction history, although course recommendation differs from admission eligibility assessment.

### Accessibility and Personalised Admission Information

Research on university websites identifies difficulties in the accessibility and completeness of information provided to international applicants. Taylor and Bicak [14] analysed information from public four-year universities in Texas and reported readability and translation limitations. These findings indicate that applicants may struggle to interpret admission information, but the results should not be generalised directly to all countries or degree levels.

Larroucau et al. [13] examined personalised information in Chile's centralised higher-education admissions system and reported improvements in assignment and placement outcomes. This supports the potential value of tailored guidance. However, international admissions often involve separate requirements, deadlines, and application procedures for each institution, so the findings do not directly establish the effectiveness of a personalised roadmap for international applicants.

### Admission Chatbots and Retrieval-Augmented Generation

Chatbots can help applicants obtain information through natural-language interaction. Prashant et al. [7] identify potential benefits such as faster responses and reduced administrative workload, alongside privacy and multilingual-support challenges.

Chen et al. [8] evaluated an admission chatbot using retrieval-augmented generation. Their reported average answer accuracy increased from 41.4% to 89.5%, with a peak of 94.7%. This suggests that retrieving relevant admission information can improve question answering in the studied setting. However, accurate answers to individual questions do not necessarily establish whether a particular applicant satisfies every programme requirement or whether a sequence of application tasks is complete.

Foundational RAG research explains how retrieved documents can ground generated responses in external knowledge [9], [11]. Nevertheless, retrieval does not guarantee that sources are current, complete, or relevant. Research on hallucination highlights the risk of fluent but unsupported output [10]. Therefore, Pathly should validate sources and use deterministic rules for formal eligibility decisions rather than relying solely on generated text.

### Evaluation Implications

Herlocker et al. [12] emphasise that recommender-system evaluation should reflect the task being performed. For Pathly, chatbot answer accuracy alone is insufficient. Evaluation should also examine requirement-checking accuracy, source validity, deadline correctness, roadmap completeness, task completion time, recommendation relevance, and user understanding.

## 3.4. Difference from Existing Platforms

Existing platforms support different stages of the higher-education application journey. Common App focuses on application submission, Studyportals supports programme discovery, and official Bolashak channels provide scholarship information and application procedures. General-purpose LLM assistants can explain information through natural-language interaction, but their answers are not necessarily grounded in current, verified admission records.

Based on the reviewed sources, these capabilities are not demonstrated together as one evaluated workflow for Pathly's target context. Pathly is designed to connect programme discovery with source-linked admission requirements, requirement-by-requirement eligibility analysis, qualification-gap identification, and a personalised roadmap based on gaps and deadlines.

The proposed AI advisor will help applicants explore academic directions and understand programme information. Verified programme records and deterministic rules will govern formal eligibility results, while the language model will support conversation and explanations.

## 3.5. Research Gap and Contribution

The reviewed literature establishes several relevant capabilities separately: educational recommenders rank or personalise options [1]–[6]; studies of university websites identify accessibility and information-completeness problems [14]; personalised information can improve decisions in a specific admissions context [13]; and RAG can improve admission question answering [8].

Within the reviewed sources, we did not identify an evaluated system that combines verified, source-linked admission requirements, transparent requirement-level eligibility decisions, qualification-gap analysis, deadline-aware roadmap generation, and a source-grounded conversational advisor for international applicants in the Kazakhstan context.

This is a bounded research gap in the literature reviewed for this project, not a claim that no comparable platform exists anywhere. A broader claim would require a documented search of additional academic publications, commercial services, and institutional systems.

Pathly's applied contribution is to design and evaluate this integrated workflow. The language model will support conversational profile elicitation and natural-language explanations. Programme recommendations will be connected to available programme data, while admission eligibility will be assessed using verified records and deterministic rules.

The proposed evaluation will examine:

- Relevance and clarity of academic-direction and programme recommendations;
- Accuracy of requirement-level eligibility decisions;
- Validity and freshness of admission sources;
- Completeness and correctness of personalised roadmaps;
- Grounding of AI-generated answers in verified records;
- Usability and task completion time.

The project does not claim to introduce a new language model or recommendation algorithm. Its contribution is the integration and evaluation of these capabilities in the target admission context.

### Summary of Findings

| Finding | Evidence | Implication for Pathly |
|---|---|---|
| Recommendation does not guarantee eligibility | Educational recommenders focus on ranking or personalising choices [1]–[6]. | Use explicit requirement-level rules and explain each status. |
| Admission information can be difficult to access and interpret | Website analysis identified readability, translation, and information-completeness issues in the studied context [14]. | Consolidate source-linked information and display verification dates. |
| Personalised information can improve outcomes in a specific context | A field experiment in Chile reported improved assignment and placement outcomes [13]. | Provide tailored guidance and evaluate it in Pathly's target context. |
| RAG can improve admission question answering | One admission chatbot study reported improved answer accuracy with RAG [8]. | Use RAG for grounded explanations, not as the sole eligibility decision-maker. |
| Generated answers and sources require validation | RAG and hallucination research identifies factuality, freshness, and traceability risks [9]–[11]. | Validate citations, track source freshness, and handle insufficient evidence explicitly. |
| Evaluation must reflect the user task | Recommender evaluation literature emphasises task-appropriate metrics [12]. | Measure eligibility accuracy, roadmap quality, and user outcomes, not only answer accuracy. |

## 3.6. References

[1] M. C. Urdaneta-Ponte, A. Méndez-Zorrilla, and I. Oleagordia-Ruiz, "Recommendation systems for education: Systematic review," Electronics, vol. 10, no. 14, Art. 1611, 2021, doi: 10.3390/electronics10141611.

[2] N. Kamal, F. Sarker, A. Rahman, S. Hossain, and K. A. Al Mamun, "Recommender system in academic choices of higher education: A systematic review," IEEE Access, vol. 12, pp. 35475–35501, 2024, doi: 10.1109/ACCESS.2024.3368058.

[3] S. Fedushko, T. Ustyianovych, and Y. Syerov, "Intelligent academic specialties selection in higher education for Ukrainian entrants: A recommendation system," Journal of Intelligence, vol. 10, no. 2, Art. 32, 2022, doi: 10.3390/jintelligence10020032.

[4] M. Elahi, A. Starke, N. El Ioini, A. A. Lambrix, and C. Trattner, "Developing and evaluating a university recommender system," Frontiers in Artificial Intelligence, vol. 4, Art. 796268, 2022, doi: 10.3389/frai.2021.796268.

[5] M. J. Mokarrama, S. Khatun, and M. S. Arefin, "A content-based recommender system for choosing universities," Turkish Journal of Electrical Engineering and Computer Sciences, vol. 28, no. 4, pp. 2128–2142, 2020, doi: 10.3906/elk-1911-37.

[6] S. Algarni and F. Sheldon, "Systematic review of recommendation systems for course selection," Machine Learning and Knowledge Extraction, vol. 5, no. 2, pp. 560–596, 2023, doi: 10.3390/make5020033.

[7] Prashant, M. Poriye, P. Mittal, and N. Sharma, "Automating university administration: A systematic review of chatbot applications in higher education," AIJR Proceedings, vol. 7, no. 6, pp. 314–323, 2025, doi: 10.21467/proceedings.7.6.36.

[8] Z. Chen, D. Zou, H. Xie, and H. Lou, "Facilitating university admission using a chatbot based on large language models with retrieval-augmented generation," Educational Technology & Society, vol. 27, no. 4, pp. 454–470, 2024.

[9] P. Lewis et al., "Retrieval-augmented generation for knowledge-intensive NLP tasks," in Advances in Neural Information Processing Systems, vol. 33, 2020, arXiv:2005.11401.

[10] Z. Ji et al., "Survey of hallucination in natural language generation," ACM Computing Surveys, vol. 55, no. 12, Art. 248, 2023, arXiv:2202.03629.

[11] Y. Gao et al., "Retrieval-augmented generation for large language models: A survey," arXiv:2312.10997, 2023 (preprint).

[12] J. L. Herlocker, J. A. Konstan, L. G. Terveen, and J. T. Riedl, "Evaluating collaborative filtering recommender systems," ACM Transactions on Information Systems, vol. 22, no. 1, pp. 5–53, 2004.

[13] T. Larroucau, I. A. Rios, A. Fabre, and C. Neilson, "College Application Mistakes and the Design of Information Policies at Scale," NBER Working Paper No. 34164, Aug. 2025, doi: 10.3386/w34164.

[14] Z. W. Taylor and I. Bicak, "International, inaccessible, and incomplete: A Texas case study of international student websites," Journal of International Students, vol. 9, no. 4, pp. 1009–1014, 2019, doi: 10.32674/jis.v0i0.756.