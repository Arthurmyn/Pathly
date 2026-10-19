---
version: 1
slug: "src-frontend-components-auth-card-tsx"
primary_target: "src/frontend/components/auth-card.tsx"
related_targets: ["src/frontend/app/(public)/login/page.tsx","src/frontend/app/(public)/register/page.tsx"]
---

# Surface brief: sign up and log in

Scope and mode: Persuade (sign-up) with a returning-user Operate path (log in). One page, two modes, route `/register` and `/login`.
Audience and job: applicant in Kazakhstan who has found Pathly and decides to create an account; returning applicant who wants to continue. Action: create an account or log in (demo sign-in, no server). Proof available: the product's own mechanism (the five-step route), nothing invented. Constraints: Pathly palette and Onest stay; demo data labelled illustrative; text must allow ~30% longer Russian and Kazakh strings.
Unresolved: real password rules and email verification belong to the backend later.

## Direction contract

THESIS: Signing up is the first station of the applicant's own admission route, not a bare form. Refuses the centered card on a soft gradient and the split page with a stock illustration.
OWN-WORLD: Pathly's blue (#4661ff) on warm whites (#f6f6f4, #fcfcfb) and deep navy (#1d2940) in Onest; a route line with station dots and one dashed round stamp; icons drawn as one-stroke SVG (mortarboard, book, calendar, check, seal). Recognizable with the text removed as a vertical transit line with five stations.
STORY: The visitor sees that an account starts a concrete, verifiable path (Profile, Requirements, Gaps, Roadmap, Official website), believes it because each station names what it produces, and creates the account.
FIRST VIEWPORT: 1440x900. Left column about 560px: logo, headline "Start your route to the right programme.", one sentence, email and password fields, a full-width blue pill "Create account", the mode switch link below. Right: a rounded sheet with the vertical route, five stations at 120px steps, station one lit and filled with the form's progress, a dashed rotated "Illustrative demo data" stamp top right.
FORM: Admission route map, position 5 of 7 on the ordered list, seed: 23a6dd3ec47a905a
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
