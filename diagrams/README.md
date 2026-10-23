# Diagrams

Editable [Mermaid](https://mermaid.js.org/) sources live here; readable exports (SVG and PNG) live in [`docs/img/`](../docs/img/).

| Diagram | Source | Exports |
|---|---|---|
| System context | `system-context.mmd` | `docs/img/system-context.svg`, `.png` |
| Use cases | `use-cases.mmd` | `docs/img/use-cases.svg`, `.png` |
| Components (draft) | `components.mmd` | `docs/img/components.svg`, `.png` |

The diagrams are drafts that match the current project description; review them with the supervisor. The entity-relationship, activity and sequence diagrams are planned (see `docs/planning/youtrack-tasks.csv`).

## Re-export after editing a source
```
npm install -g @mermaid-js/mermaid-cli
mmdc -i diagrams/components.mmd -o docs/img/components.svg -b white
mmdc -i diagrams/components.mmd -o docs/img/components.png -b white -s 2
```
Alternatively paste the source into https://mermaid.live and export from there.
