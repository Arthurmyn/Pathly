# Site structure

Author: Arthur. Status: **proposal**. Derived from scenarios S1-S3 (section 8), requirements FR-01 to FR-12 and the mockups W1-W4 of the proposal.

## 1. Recommendation

One Next.js application (App Router, TypeScript) with three zones separated by route groups:

| Zone | Path prefix | Who | Auth |
|---|---|---|---|
| Public | `/` | Anyone | None |
| Applicant | `/app` | Applicant | JWT, role `applicant` |
| Admin | `/admin` | Administrator | JWT, role `administrator` |

Why this shape:

- **The catalog and requirement pages are public.** The main selling point is that every requirement shows its status, source and verification date. Hiding that behind a login would hide the product's strongest argument, and public pages are indexable and shareable. Personalised results (eligibility, roadmap, advisor) need a profile and therefore a login.
- **The programme page is the centre of the product.** It is one URL with two layers: guests see requirements with status, source and date; logged-in applicants additionally see their own outcome per requirement, the gap list and the "create roadmap" action. This avoids duplicate pages and matches mockup W2.
- **One app, not two.** A separate admin application would double the tooling for a two-person team. The admin zone shares the UI kit (StatusBadge, SourceChip) and the API client; access is enforced twice: Next.js middleware for navigation and the backend for data (FR-01: wrong role gets 403).
- **Rejected:** a login wall for everything (simpler, but weak first impression and no sharing); a single-page dashboard with no per-programme URLs (cannot link a requirement from the advisor or from a roadmap task).

## 2. Sitemap

```
/                              Landing: value proposition, how verification works, CTA
/how-it-works                  Five statuses, source tiers, what Unknown means
/programs                      Catalog with faceted filters (degree level, format, country, university, field, language, verification)
/institutions                  Institutions with country filter and pagination (Bolashak 2024-2026 list plus demo universities)
/institutions/[id]             Institution page: country, website, source, programmes in Pathly
/programs/[slug]               Programme page: requirements, deadlines, sources
                               + personal layer for applicants: eligibility, gaps, roadmap CTA, advisor panel
/universities/[slug]           University page (Should): its programmes and general information
/login   /register
/privacy                       What is stored, deletion, LLM provider data handling

/app                           Dashboard: next actions, shortlist, alerts about Stale/Unknown items
/app/onboarding                AI chat on the left, editable extracted profile on the right (W1, S1)
/app/profile                   Review and edit profile (FR-03)
/app/applications              Shortlist and deadline overview (Should, FR-11)
/app/applications/[id]         One application: eligibility, deadline, "I am enrolled"
/app/roadmap                   Tasks of all applications grouped by programme, plus general tasks (W3, S2)
/app/advisor                   Full-page advisor chat (W4, S3); also available as a side panel on programme pages
/app/settings                  Account, notifications and email reminders (Should), study preferences, export and delete data (NFR-02)

/admin                         Overview: queue sizes, recent changes
/admin/queue                   Tabs: Stale, Missing, Unverified, Conflict (FR-06)
/admin/requirements/[id]       Editor, source snapshot with hash, status history
/admin/programs                Programmes and templates of expected requirement types
/admin/universities
/admin/sources                 Registered Tier 1 pages, last fetch, hash changed or not (FR-07)
/admin/audit-log               All status changes with author and time
/admin/users                   Accounts: name, email, registration date, status (search, pagination)
```

Advisor "request verification" actions create an Unverified/Missing entry that appears in `/admin/queue`, closing the loop between applicant and data curator.

## 3. Navigation

- **Public header:** Programmes, How it works, Log in. Footer: Privacy.
- **Applicant:** left sidebar on desktop and bottom tabs on mobile: Dashboard, Programmes, Applications, Advisor, Profile. Settings in the user menu. The programme page keeps the advisor as a collapsible side panel so questions carry the programme context.
- **Admin:** sidebar with the queue counts as badges; the Conflict queue is first because it blocks matching.

## 4. Key screens and what they must always show

| Screen | Must show | Requirement |
|---|---|---|
| Programme page | Per requirement: type, value, pathway, status badge, source link, verification date | FR-05, NFR-04 |
| Programme page (applicant) | Applicant's value, outcome Met, Not met, Pending or Unknown, and the rule behind it | FR-08, NFR-04 |
| Roadmap | Task, date offset from deadline D, dependency, the gap that caused it | FR-09 |
| Advisor | Citation card with source and date, or a refusal that names the reason (outdated, missing, conflicting, no source) | FR-10, NFR-03 |
| Onboarding | Extracted profile, missing fields highlighted, nothing confirmed until required fields exist | FR-02, FR-03 |
| Admin queue | Record, source snapshot, what changed, actions with audit trail | FR-06, FR-07 |

## 5. Shared UI components

`StatusBadge` (Verified, Unverified, Stale, Missing, Conflict), `OutcomeBadge` (Met, Not met, Pending, Unknown), `SourceChip` (link, tier, date), `ExplanationRow`, `GapList`, `TaskCard`, `CitationCard`, `ProfilePanel`, `QueueTable`.

Rules: Unknown, Stale, Missing and Conflict are never green; colour is never the only signal (icon plus text); dates are absolute, not relative, so a stale date is visible.

## 6. Scenario to route mapping

| Scenario | Route sequence |
|---|---|
| S1 new applicant creates a profile | `/register` -> `/app/onboarding` -> `/app/profile` |
| S2 eligibility and roadmap | `/programs` -> `/programs/[slug]` -> `/app/roadmap` |
| S3 ask the advisor | `/programs/[slug]` (panel) or `/app/advisor` |
| Admin curation | `/admin/queue` -> `/admin/requirements/[id]` |

## 7. Implementation notes

- Public pages: server components with caching; revalidate when a requirement status changes so a Stale record is never served as Verified (NFR-05).
- Chats (onboarding, advisor): client components with streaming responses.
- API client generated from the backend OpenAPI schema (P-24); route guards in `middleware.ts` (P-101).
- Interface language: English first, strings extracted so Russian and Kazakh can be added. This is an open question for the supervisor.
- Out of scope in the structure: mentor and supervisor dashboards, document upload, payments, live classes, community, mobile app. The `/app` and `/admin` zones leave room for a future `/mentor` zone without restructuring.
