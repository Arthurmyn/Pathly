# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

School leavers and graduates (Bachelor's, Master's and Doctoral/PhD applicants) in Kazakhstan who apply to programmes in Kazakhstan and abroad. Their job: find out whether they are eligible for a programme, what they are still missing, and what to do next and by when. A second user group is administrators (the project team during the diploma) who keep requirement data verified. Mentors, teachers and supervisors are a future extension, not part of the MVP.

## Product Purpose

Pathly turns an applicant's profile and goals into a verified, explainable and actionable admission pathway. Admission information is scattered across university sites, testing agencies and scholarship portals, changes over time and is rarely marked as verified or outdated. Success: an applicant can see for every requirement its source, status and verification date, gets an honest per-requirement result, and follows an ordered roadmap of tasks. Pathly does not submit applications; submission stays on official channels.

## Positioning

Every requirement and deadline carries its source, source tier, status (Verified, Unverified, Stale, Missing, Conflict) and an absolute verification date. Eligibility is computed by deterministic rules; unverified, stale, missing or conflicting data always yields Unknown and is never treated as satisfied. The AI advisor answers only from Verified records, cites them and refuses otherwise. Common App, Studyportals and general LLM assistants do not show verification status or compute a personal gap analysis.

## Operating Context

Diploma project, Astana IT University (Software Engineering), two students, supervisor Altynbek Seitenov. A pilot dataset of illustrative programmes in Kazakhstan and the United States. The current frontend is a working demo on invented data (universities, programmes and sources are fictional, `.example` domains). Onboarding is planned Russian-first with Kazakh and English later.

## Capabilities and Constraints

- Roles: applicant and administrator. Sign-in with roles; the demo sign-in is simulated.
- Outcomes per requirement: Met, Not met, Pending, Unknown, always with an explanation (rule, applicant value, source, verification date). Never a "chance of admission" percentage.
- Roadmap tasks are dated back from a Verified deadline; when the deadline is not Verified no date is invented.
- No document upload, payments, live classes, community, mobile app or scraping in the MVP.
- Stack: Next.js (App Router, TypeScript, Tailwind) frontend, FastAPI and plain PostgreSQL backend.

## Brand Commitments

The name is Pathly. The palette (blue accent over warm grays) and the Onest typeface are fixed by the team for now and must stay. All text stays honest: no invented claims, statistics, testimonials, customers or university logos.

## Evidence on Hand

No real testimonials, user numbers, partner universities or press. Interview records exist only as summaries in the proposal. The demo data is synthetic and must be labelled illustrative where a visitor could mistake it for real.

## Product Principles

1. Provenance is always visible: source, tier and an absolute date next to every fact.
2. Honest uncertainty beats a confident guess: unknown is a result, not a failure.
3. Explain every result: the rule, the applicant's value, the source.
4. Deterministic logic decides eligibility; the language model only phrases and extracts.
5. Pathly guides; the official website submits.

## Accessibility & Inclusion

Meaning is never carried by colour alone (badges also differ by icon, border and text). Interface text must support Russian and Kazakh later, so layouts allow roughly 30% longer strings. Motion respects the reduced-motion setting.
