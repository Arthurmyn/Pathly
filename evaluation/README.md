# Evaluation protocol

## Tests
1. **AI grounding:** 50 questions answerable from the verified knowledge base + 10 unanswerable questions. The assistant must cite sources for the first set and refuse for the second.
2. **Requirement accuracy:** 30 program-requirement samples compared with official sources.
3. **Usability:** SUS questionnaire with at least 8 participants.
4. **Performance:** page load and AI response timing.

## Targets
| ID | Metric | Target |
|---|---|---|
| M1 | Requirement accuracy | >= 95% |
| M2 | Fabricated deadlines | 0 |
| M3 | Grounded answers with correct source (answerable set) | TODO (define threshold) |
| M4 | Correct refusals (unanswerable set) | TODO (define threshold) |
| M5 | SUS score | >= 70 |
| M6 | Page load time | < 2 s |
| M7 | AI response time | < 10 s |

M3 and M4 thresholds are not specified in the brief; confirm with the source document.

## Data rules
Use only public information and synthetic applicant data. No real applicant data or documents in the repository.
