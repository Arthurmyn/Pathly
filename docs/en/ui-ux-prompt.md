# UI/UX generation prompt for Pathly

Author: Arthur. Status: **working tool**, not a requirement. Source of truth for behaviour remains the proposal and [site-structure.md](site-structure.md).

**How to use.** Paste **Part 0** first into the design generator (v0, Figma Make, Claude, Lovable or similar) and keep it in context. Then paste one of **Parts 1-5** at a time, so the tool does not lose detail on long prompts. Finish with **Part 6** for a consistency pass. All content in the prompts is illustrative; the proposal requires that real programme facts are checked against official sources before they are shown as fact.

---

## Part 0. Master prompt (product, principles, design system)

```
You are a senior product designer. Design the UI/UX for "Pathly", a web platform that turns an
applicant's profile and goals into a verified, explainable, actionable admission pathway to
higher-education programmes (Bachelor's, Master's, Doctoral/PhD) in Kazakhstan and abroad.
Deliver high-fidelity, responsive screens (desktop 1440, tablet 834, mobile 390) with light and
dark themes, built as reusable components. Output as React + TypeScript + Tailwind with accessible
primitives (shadcn/ui or Radix style), clickable navigation between screens, and realistic
loading, empty and error states.

## What the product is (and is not)
- It helps an applicant: build a profile through an AI chat, browse programmes, see every admission
  requirement with its source and verification date, get a per-requirement eligibility result with
  an explanation, get an ordered roadmap of next actions, and ask an AI advisor that answers ONLY
  from verified records and refuses otherwise.
- Administrators (data curators) keep requirement data verified and fix stale, missing and
  conflicting records.
- It does NOT submit applications (submission stays on official university/scholarship sites),
  has no payments, live classes, community, mobile app, document upload, or mentor/teacher
  dashboards. Do not design those. Do not show fake testimonials, fake statistics, or real
  university logos.

## The core idea the UI must make obvious: trust through provenance
Every requirement and deadline carries: value, source link, source tier, status, verification date.
Two separate concepts must NEVER be visually confused:

1. DATA STATUS of a record (five states):
   - Verified   : official (Tier 1) source, reviewed by an admin, inside validity window.
   - Unverified : entered but not reviewed, or only Tier 2/3 source.
   - Stale      : validity date passed or source changed.
   - Missing    : expected item, no value stored.
   - Conflict   : two sources disagree.
2. ELIGIBILITY OUTCOME for this applicant (four states): Met, Not met, Pending, Unknown.
   Only a Verified record can produce Met or Not met. Any other status produces Unknown.
   Unknown is a first-class result shown as a gap, never styled as success.

Status = small badge with icon, describes the DATA. Outcome = larger pill, describes the PERSON.
They sit side by side in a requirement row and must be distinguishable at a glance, in colour
blind mode, and in grayscale.

## Design principles
1. Provenance is always visible: status, source, absolute date (e.g. "Verified 12 Sep 2026"),
   never "3 weeks ago".
2. Honest uncertainty: Unknown / Stale / Missing / Conflict are never green and never look like a
   success. Prefer an explicit "We can't tell yet, here is how to find out" over a guess.
3. Explain everything: each result can expand to show rule, applicant value, source, date.
4. Calm, trustworthy, academic-but-friendly. Dense information, generous whitespace, no hype,
   no gamification, no confetti, no decorative AI sparkles.
5. One clear next action per screen (primary button), everything else secondary.
6. Low cognitive load: progressive disclosure, plain language, no jargon like "tier" without a tooltip.
7. Accessible by default: WCAG 2.2 AA, contrast >= 4.5:1 for text and >= 3:1 for UI, visible focus
   rings, keyboard navigation, 44px touch targets on mobile, status never conveyed by colour alone
   (always icon + text), respects prefers-reduced-motion.

## Visual language
- Brand idea: a "path" - a line that connects points. Use it sparingly: logo mark, roadmap
  timeline, onboarding progress. Wordmark "Pathly" in the heading font, simple geometric mark.
- Typography: Inter (UI) with tabular numbers for scores and dates; headings 600 weight.
  Scale: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36. Body 16, dense tables 14. Line height 1.5 body.
- Spacing: 4px base grid (4, 8, 12, 16, 24, 32, 48, 64). Content max width 1200 on public pages,
  app shell fluid with 1120 content column.
- Radius: 8 for controls, 12 for cards, full for pills. Borders 1px, shadows minimal (one soft
  level for popovers and sheets).
- Iconography: a single outline icon set (Lucide), 20px, 1.5 stroke.
- Define everything as design tokens (CSS variables) for light and dark.

### Colour tokens (adjust only to keep contrast; show the full token table in the output)
Brand/primary: indigo 600 (#4F46E5) on light, indigo 400 (#818CF8) on dark. Neutral: slate scale.
Background light #FAFAFB / surface #FFFFFF / border #E4E7EC / text #101828 / muted #475467.
Background dark #0B0F19 / surface #121826 / border #263042 / text #F2F4F7 / muted #98A2B3.

Data status (badge = tinted background + icon + label):
- Verified   : green   - icon shield-check
- Unverified : slate   - icon circle-dashed
- Stale      : amber   - icon clock-alert
- Missing    : gray with dashed outline - icon circle-off
- Conflict   : red-violet (#B42318 / #7A271A family) - icon git-compare / alert-triangle

Eligibility outcome (pill, larger, with icon):
- Met      : green   - check
- Not met  : red     - x
- Pending  : blue    - hourglass (e.g. exam not yet taken, a future step)
- Unknown  : neutral amber-gray with question-mark - NEVER green, NEVER blue

## Shared components to design first (with all variants and states)
StatusBadge, OutcomeBadge, SourceChip (link icon + domain + tier + date, opens source in a new tab),
RequirementRow (collapsed/expanded with ExplanationPanel), ExplanationPanel (rule, your value,
source, date, how to fix), GapList, TaskCard (title, reason, due offset "D-30", dependency,
linked gap, done checkbox), CitationCard (quote, source, date), ProfilePanel (editable fields,
missing fields highlighted), ChatBubble (user / assistant / refusal variant), QueueTable,
FilterBar, EmptyState, ErrorState with retry, Skeletons, Toast, ConfirmDialog, Tooltip,
Tabs, Stepper, DatePill (absolute date + days left).

## Tone and microcopy
Plain, direct, never pushy. Examples:
- Unknown outcome: "We can't confirm this yet. The source was last checked 14 Mar 2026 and has
  expired. Ask us to re-verify."
- Refusal: "I can't answer this from verified sources. I won't guess a deadline. I can request
  verification so an administrator checks the official page."
- Conflict: "Two sources disagree about the minimum IELTS score (6.0 vs 6.5). Until this is
  resolved we treat it as Unknown."
Never use "guaranteed", "you will be accepted", or probability of admission.

## Data realism rules
Use clearly fictional data: "Example University", "Northfield Institute", "Steppe Technical
University". Mark every mock page with a small corner label "Illustrative data". Use plausible
values (GPA 3.4/4.0, IELTS 6.5, deadline 15 Jan 2027). Do not use real university names,
logos, or real fees.

## Language
English UI. Write all strings so they can be externalised for later Russian and Kazakh
translation; leave room for ~30% longer text.

## Deliverables
1) Token table and component sheet. 2) All screens below in light + dark, desktop + mobile.
3) Click-through flows: Scenario S1 (new applicant creates profile), S2 (eligibility + roadmap),
S3 (advisor answer and refusal), A1 (admin resolves a stale record). 4) A short rationale per
screen: which decision it supports and which requirement it satisfies.
```

---

## Part 1. Public zone

```
Design the PUBLIC pages. No login needed.

1) Landing "/"
- Header: logo, Programmes, How it works, Log in (secondary), Get started (primary).
- Hero: headline "Know where you stand and what to do next." Sub: "Verified admission
  requirements, an honest eligibility check, and a step-by-step plan - for Kazakhstan and abroad."
  Primary CTA "Build my profile", secondary "Browse programmes".
- Right side of the hero: a realistic product preview of a requirement table with all five data
  statuses visible (this IS the pitch).
- "How it works" in 4 steps: Tell us about you (AI chat) -> See every requirement with its source
  -> Get your gaps explained -> Follow your roadmap.
- Trust section: explain Verified / Unverified / Stale / Missing / Conflict with one sentence
  each, and the line "We only call something Verified if it comes from an official source and
  an administrator has checked it."
- "What Pathly does not do" box: does not submit applications, does not predict acceptance.
- Footer: Privacy, How it works, contact placeholder. No fake logos, no fake numbers.

2) How it works "/how-it-works"
- Long-form explainer with the five statuses and three source tiers (official / official
  secondary / third party), a worked example of one requirement turning Verified -> Stale after
  its validity date, and why Unknown is not a failure. A simple diagram of the lifecycle.

3) Catalog "/programs"
- Left filter column (sheet on mobile): degree level (Bachelor's, Master's, Doctoral/PhD),
  country, field. Search box.
- Results as cards: programme name, university, country flag + name, degree badge, next verified
  deadline (absolute date) or "No verified deadline", and a data-health meter such as
  "7 of 8 requirements verified" with the count of Stale/Missing items.
- Sorting: Name, Deadline, Most verified.
- Empty, loading and error states. Pagination or infinite scroll with a visible count.

4) Programme page "/programs/[slug]" - GUEST view
- Header: programme, university, degree, country, official programme link, "Last fully checked".
- Tabs: Requirements, Deadlines, About.
- Requirements as RequirementRow list grouped by admission pathway (e.g. "Standard entry",
  "Scholarship pathway"), each row: requirement name, required value, StatusBadge, SourceChip.
  Expanding a row shows source quote, tier, verification date, validity date, history.
- Persistent callout for guests: "Check your own eligibility - build a profile in 3 minutes."
- Keep the requirement order logical (do not re-sort by status), but make Stale, Missing and
  Conflict rows noticeable with the badge and a one-line note.
- Mobile: sticky bottom bar with the primary CTA.

5) Auth "/login" and "/register" - minimal, centred card, email + password, clear error
messages, password rules, link to Privacy. No social login.

6) Privacy "/privacy" - plain-language page: what is stored (only profile fields needed for
matching), what is sent to the AI provider, how to delete the account and all data.
```

---

## Part 2. Applicant zone: onboarding, profile, programme page (logged in)

```
Design the APPLICANT app shell and core flow. App shell: left sidebar on desktop (Dashboard,
Programmes, Applications, Advisor, Profile), bottom tab bar on mobile, user menu with Settings
and Log out, a compact "data freshness" alert area for items that went Stale.

1) Onboarding "/app/onboarding" (Scenario S1)
- Two-pane layout. LEFT: conversation with the AI. RIGHT: the extracted profile as an editable
  form that fills live as the user talks: target degree, field, target country, current
  education + GPA (with scale), language test + score, intake (season/year), budget.
- Missing required fields are highlighted in the profile panel; the assistant asks about them
  one at a time. Show a "typing" state and a quick-reply chip row for common answers.
- Each extracted field shows a small "from your message" hint and an edit pencil. Nothing is
  saved as final until the user presses "Confirm profile" (disabled until required fields exist,
  with a tooltip listing what is missing).
- Mobile: tabs "Chat" and "Profile" with a badge showing the missing count.
- States: first message empty state with 3 example prompts, extraction uncertainty ("Did you mean
  GPA 3.4 out of 4.0?"), error with retry, user corrects a field.
- Privacy line under the input: "We only keep fields needed to match requirements."

2) Profile "/app/profile" (FR-03)
- Sectioned form, every field editable, inline validation, unit/scale selectors.
- After saving, show a non-blocking toast "Eligibility and roadmap updated" and a link to what
  changed.

3) Programme page, APPLICANT view "/programs/[slug]" (Scenario S2)
- Same page as the guest view plus a personal layer:
  - Top summary card: "Your eligibility for this programme": counts of Met / Not met / Pending /
    Unknown as a segmented bar with numbers (not a percentage score, no "match %").
    One sentence summary that is honest about Unknown ("2 requirements can't be confirmed
    because their sources are outdated").
  - RequirementRow now shows: requirement, required value, YOUR value, OutcomeBadge, StatusBadge,
    SourceChip. Expand = ExplanationPanel: rule, your value, source quote, verification date,
    "How to close this gap".
  - Right column on desktop: "Gaps" list (GapList) ordered by deadline impact and a primary button
    "Create my roadmap". An "Ask the advisor about this programme" button opens a side panel.
  - A requirement with a Stale source shows outcome Unknown with the amber note
    "Source expired on 14 Mar 2026" and a secondary button "Request re-verification".
- Never show a single "you are eligible" verdict if any record is not Verified.
```

---

## Part 3. Roadmap, advisor, dashboard, applications, settings

```
1) Roadmap "/app/applications/[id]/roadmap" (Scenario S2)
- Header: programme name, deadline D (absolute date + days left), progress "4 of 11 tasks".
- Main view: a vertical timeline (the brand "path" line) of TaskCards ordered by date offset from
  deadline D (D-90, D-60, D-30, D-7) and by dependencies. Also offer a compact list view and
  a calendar-month view toggle.
- TaskCard: title (e.g. "Take IELTS Academic"), due date, reason ("Required: min. 6.5, your score
  is not recorded"), linked gap chip, dependency indicator ("After: Register for IELTS"), source
  chip, done checkbox, "Why this task?" expander.
- Special task type "Verify this requirement": shown when the underlying data is Unknown; has a
  distinct icon and explains that the plan may change once verified.
- Tasks blocked by an unmet dependency are visibly locked with a tooltip. If a task would fall
  after its deadline, show a conflict warning instead of silently scheduling it.
- Recompute banner when profile or data changed: "Your roadmap was updated because the IELTS
  requirement changed. See what changed." with a diff view.
- States: no gaps ("Nothing to do right now - but check these 2 items we couldn't verify"),
  deadline unknown, loading, error.

2) Advisor "/app/advisor" and side panel (Scenario S3)
- Chat with a programme context chip ("Context: Example MSc, Steppe Technical University") that
  can be changed or removed.
- Assistant answer variants:
  a) Grounded answer: short text + one or more CitationCards (quote, source domain, tier badge,
     verification date, "Open source").
  b) Status-aware answer: answer + amber note when the cited record is near expiry.
  c) Refusal: distinct visual treatment (neutral container, shield icon), states the reason
     (no verified source / outdated / missing / conflicting), and offers two actions:
     "Request verification" and "Open official source".
  d) Conflict answer: shows both sources side by side.
- No streaming of unverified claims: if the answer fails citation checking, show "Checking
  sources..." then the refusal, never a flash of unsupported text.
- Input hints, character counter, message history with date separators, "Clear chat" with
  confirmation. Error and offline states. Under the input: "Answers use verified records only."
- Do not add "AI sparkle" icons; use a neutral assistant avatar.

3) Dashboard "/app"
- "Your next 3 actions" (from roadmaps), shortlist cards with eligibility segmented bar and
  next deadline, a "Needs attention" panel for programmes whose data went Stale since the last
  visit, and a profile completeness card. Empty state for new users leading to onboarding.

4) Applications "/app/applications" and "/app/applications/[id]" (Should priority)
- Shortlist table: programme, status (Considering / Preparing / Applied elsewhere / Dropped),
  next deadline, eligibility bar. Detail page: tabs Eligibility, Roadmap, Checklist, Deadlines.
- Checklist reflects the programme's required items; completing items persists. Add a clear
  notice: "Pathly tracks your progress. Submit your application on the official website."
- Reminder settings: choose how many days before a deadline to get an email.

5) Settings "/app/settings"
- Account, email reminders (days before deadline), "Delete my account and data" in a danger zone
  with a confirmation dialog that lists exactly what is removed (profile, chat history).
```

---

## Part 4. Administrator zone

```
Design the ADMIN panel for data curators. Denser than the applicant app, table-first, keyboard
friendly. Sidebar: Overview, Queue (with counts), Programmes, Universities, Sources, Audit log.

1) Overview "/admin"
- Four count tiles: Conflict, Stale, Missing, Unverified (Conflict first, it blocks matching).
  A "Data health" summary across the pilot dataset (counts only, no vanity charts), and a recent
  changes feed. Alert strip for sources whose content hash changed since last check.

2) Queue "/admin/queue" (FR-06)
- Tabs by queue with counts. QueueTable columns: programme, requirement, current value, status,
  source domain + tier, last verified, validity date, reason it is in the queue. Filters,
  bulk select, sort, keyboard navigation (j/k, Enter to open).
- Row actions: Open, Mark verified, Mark stale, Resolve conflict. Dangerous actions require a
  note.

3) Requirement editor "/admin/requirements/[id]"
- Split view. LEFT: form (type, operator, value, unit, pathway, source URL, source tier,
  validity date). RIGHT: archived source snapshot with the matching text highlighted, content
  hash, and a diff against the previous snapshot when the source changed.
- Status control that only offers valid transitions; selecting Verified is disabled unless the
  source tier is Tier 1, with an explanatory tooltip.
- Below: status history (who, when, from -> to, reason) from the audit trail.
- Conflict mode: two sources side by side with a "choose value" action and a required note.

4) Programmes / Universities - CRUD tables with a form drawer. Programme template editor listing
the requirement types the programme is expected to have, so absent values show as Missing.

5) Sources "/admin/sources" - registered Tier 1 pages, last fetch, hash changed yes/no, next
scheduled check, "Check now".

6) Audit log "/admin/audit-log" - filterable table of all status changes.
```

---

## Part 5. States, responsiveness, accessibility, motion

```
For EVERY screen above provide: loading (skeleton), empty, error with retry, partial data, and
long-content states (long programme names, 40-character emails, 12 requirements in one group,
a requirement with 3 conflicting sources, zero deadlines).

Responsive rules: tables become stacked cards below 640px, filter column becomes a bottom sheet,
the programme page keeps the primary action in a sticky bottom bar, the two-pane onboarding
becomes tabs.

Accessibility: every badge and pill has icon + text, focus order matches reading order, chat is an
aria-live region with polite announcements, tables have proper headers, dialogs trap focus,
contrast checked in both themes, target size >= 44px on touch.

Motion: 150-200ms ease-out for state changes, expanding a requirement row animates height, the
roadmap path draws in once, no looping animations; reduce all motion when
prefers-reduced-motion is set.

Performance cues: skeletons match final layout to avoid layout shift; the advisor shows
"Checking sources..." instead of a spinner-only wait (target answer within 10 seconds).
```

---

## Part 6. Consistency review prompt

```
Review all screens you generated against these checks and fix every violation:
1. Is any Unknown / Stale / Missing / Conflict item coloured or worded like a success?
2. Does every requirement and deadline show status, source and an absolute verification date?
3. Are data status badges and eligibility outcome pills visually distinct and legible in
   grayscale?
4. Is there any feature that is out of scope (payments, document upload, mentor dashboard,
   application submission, probability of admission, fake statistics, real university names)?
5. Does the advisor ever show an uncited factual claim? Does every refusal state its reason and
   offer an action?
6. Does each screen have one clear primary action?
7. Do all text and UI colours pass WCAG 2.2 AA in light and dark?
8. Are the same component names, spacing, and copy tone used everywhere?
Return a list of changes made and any remaining open questions.
```

---

## Notes for the team

- The data in the prompts is intentionally fictional. When real pilot programmes are verified, replace sample content only in demos that clearly say they use real, dated sources.
- Colour hex values are starting points; contrast must be verified in the generated output.
- Tailwind and shadcn/ui are suggested for the generator output only; the frontend stack in the proposal is Next.js, React and TypeScript, and the UI library is not yet decided.
- Screens map to tasks P-100 to P-112 and prototype tasks P-04 and P-05 in [development-plan.md](development-plan.md).
