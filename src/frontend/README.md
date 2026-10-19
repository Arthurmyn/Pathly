# src/frontend

Next.js (App Router, TypeScript, Tailwind CSS) frontend of Pathly.

**Current state (task DIP-23): a working demo with mock data.** All data is invented and lives in `lib/mock-data.ts`; there is no backend call yet. The eligibility rules, status life cycle and roadmap generation are real, tested code (`lib/`), so the demo behaves like the final product will. The AI onboarding and advisor screens are static previews (mockups W1 and W4) until the AI layer is connected.

## Run
Requires Node.js 20 or newer.
```
cd src/frontend
npm install
npm run dev          # http://localhost:3000
```
Production build: `npm run build && npm start`. Checks: `npm test` (unit tests), `npm run lint`, `npm run typecheck`.

## Try the demo
1. Open `/login` and choose **Continue as applicant**. Use **Use a sample profile** on the dashboard.
2. Open a programme (for example *MS Computer Science, Northfield Institute*): every requirement shows its status, source and absolute verification date, and your result Met / Not met / Pending / Unknown with the rule behind it. A requirement that is not Verified is always Unknown.
3. **Create my roadmap**: tasks are ordered by dependencies and dated back from the verified deadline. Complete a task to unlock the next one.
4. In **Settings** (Demo controls) move **Today in the demo** to a later date (for example 20 Dec 2026) and watch Verified records become Stale.
5. `/login` then **Continue as administrator**: open the verification queue, fix a record, try to verify a Tier 3 source (blocked), save a Tier 1 source and verify it; see the audit log.

## Structure
| Path | Content |
|---|---|
| `app/(public)/` | Landing, how it works, catalogue, programme page, sign in, privacy |
| `app/app/` | Applicant workspace: dashboard, profile, applications and roadmap, onboarding and advisor previews, settings |
| `app/admin/` | Administrator area: overview, verification queue, requirement editor, audit log |
| `components/` | UI kit (`StatusBadge`, `OutcomeBadge`, `SourceChip`, `RequirementRow`, `TaskCard`, …) and screens |
| `lib/` | Types, mock data, `status.ts`, `eligibility.ts`, `roadmap.ts` and their tests |

## Design rules
Colours come from the brand palette in `app/globals.css`: warm white page, soft gray sidebar, white cards, deep navy text, coral accent (CTA, active menu, progress). Status colours: green success, blue in progress, amber attention, red error or missing, gray neutral. Decorative teal, sky, sand and navy colours are used only for programme tiles. Status describes the data (small badge) and outcome describes the applicant (larger pill); meaning is never carried by colour alone, because badges also differ by icon, border style and text. Unknown, Stale, Missing and Conflict are never styled as success. Dates are absolute.

Layout: a gray window with a sidebar of grouped navigation, a rounded main sheet with breadcrumbs and search, pill tabs with counts and a right rail (progress ring, steps, sources, related programmes) on programme and application pages. The layout pattern follows a reference design; no assets or branding of the reference are used. See [docs/en/site-structure.md](../../docs/en/site-structure.md).

The app follows the Next.js version bundled in `node_modules/next/dist/docs` (see `AGENTS.md`).
