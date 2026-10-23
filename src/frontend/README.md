# src/frontend

Next.js (App Router, TypeScript, Tailwind CSS) frontend of Pathly.

**Current state: a working demo on invented data.** Programmes, requirements and sources are fictional (`.example` domains) and live in `lib/mock-data.ts`; the app keeps its state in the browser (`localStorage`) and does not call the backend yet. The eligibility rules, the status life cycle and the roadmap generation are real, tested code in `lib/`, so the demo behaves like the final product will. The onboarding and advisor chats use scripted replies (`lib/mock-chat.ts`), not a language model. The list of foreign universities and the priority specialities come from the official Bolashak PDFs through the import scripts below.

## Run
Requires Node.js 20 or newer.
```
cd src/frontend
npm install
npm run dev          # http://localhost:3000
```
Production build: `npm run build && npm start`. Checks: `npm test` (unit tests), `npm run lint`, `npm run typecheck`. The unit tests are in [`tests/frontend/`](../../tests/frontend/).

Deployment: Vercel with the root directory set to `src/frontend` (framework preset Next.js).

## Try the demo
1. Open `/login` and choose **Continue as applicant**. On the dashboard use **Use a sample profile**, or fill in **Profile**.
2. Open a programme: every requirement shows its status, source and absolute verification date, and your result (Met, Not met, Pending, Unknown) with the rule behind it. A requirement that is not Verified is always Unknown.
3. **Create my roadmap** and open **Roadmap**: tasks are grouped by programme, ordered by dependencies and dated back from the verified deadline.
4. In **Settings**, under Developer tools, move **Today in the demo** to a later date and watch Verified records become Stale.
5. Sign in as administrator: open the verification queue, fix a record, try to verify a Tier 3 source (blocked), save a Tier 1 source and verify it; see the audit log.

## Structure
| Path | Content |
|---|---|
| `app/(public)/` | Home, how it works, programmes and specialities, institutions, privacy |
| `app/(auth)/` | Sign-up and log-in |
| `app/app/` | Applicant workspace: dashboard, roadmap, applications, profile, onboarding, advisor, settings |
| `app/admin/` | Administrator area: overview, verification queue, requirement editor, audit log, users |
| `components/` | UI kit and screens |
| `lib/` | Domain logic: `status.ts`, `eligibility.ts`, `roadmap.ts`, `profile-fields.ts`, `notifications.ts`, `settings.ts`; `mock-data.ts`; `data/` (imported Bolashak lists) |
| `scripts/` | `import_bolashak.py` (universities) and `import_bolashak_specialities.py` (priority specialities): read the PDFs and write JSON into `lib/data/`; need `pip install pymupdf` |

## Design rules
The palette (blue accent over warm grays) and the Onest typeface are fixed by the team; colours are tokens in `app/globals.css` and the interface is light only. A status describes the data and an outcome describes the applicant; both are a dot and a label, and the dots differ by shape, so meaning never rests on colour alone. Unknown, Stale, Missing and Conflict are never styled as success. Dates are absolute. See [docs/en/site-structure.md](../../docs/en/site-structure.md) and [docs/PRODUCT.md](../../docs/PRODUCT.md).
