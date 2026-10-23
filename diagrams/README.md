# Diagrams

Editable [Mermaid](https://mermaid.js.org/) sources: `system-context.mmd`, `use-cases.mmd` and `components.mmd`. They are drafts that match the current project description; review them with the supervisor. The entity-relationship, activity and sequence diagrams are planned (tracked in YouTrack).

## Export to SVG or PNG
```
npm install -g @mermaid-js/mermaid-cli
mmdc -i diagrams/components.mmd -o docs/img/components.svg -b white
mmdc -i diagrams/components.mmd -o docs/img/components.png -b white -s 2
```
Alternatively paste the source into https://mermaid.live and export from there.
