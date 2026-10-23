# Diagrams

Editable [Mermaid](https://mermaid.js.org/) sources: `system-context.mmd`, `use-cases.mmd`, `components.mmd`, `erd.mmd`, `activity.mmd` and `sequence.mmd`. They are drafts that match the current project description; review them with the supervisor. Readable SVG and PNG exports are in `docs/img/`.

The entity-relationship diagram shows the planned data model. Only the `universities` table exists in the migrations so far (`src/backend/db/migrations/`).

## Export to SVG or PNG
```
npm install -g @mermaid-js/mermaid-cli
mmdc -i diagrams/components.mmd -o docs/img/components.svg -b white
mmdc -i diagrams/components.mmd -o docs/img/components.png -b white -s 2
```
Alternatively paste the source into https://mermaid.live and export from there.
