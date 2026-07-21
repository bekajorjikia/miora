# Miora QR — Asian Restaurant Digital Menu

A QR-code digital menu for Asian restaurants: a diner scans a table QR code and
sees the menu on their phone — no app install.

## AI workflow (start here)

This project is built by three AI tools with separated jobs:

- **Claude = Thinker** — plans, writes task specs, reviews. Brief: [`CLAUDE.md`](CLAUDE.md)
- **Codex & Cursor = Workers** — implement task files. Brief: [`AGENTS.md`](AGENTS.md)

Read the full workflow in [`docs/ai-workflow.md`](docs/ai-workflow.md).

## Map

| Path                    | What |
|-------------------------|------|
| `docs/ai-workflow.md`   | How the three tools collaborate (the loop, handoff rules). |
| `docs/PRD.md`           | Product spec — what we're building. |
| `docs/tech-stack.md`    | Proposed stack (confirm before building). |
| `CLAUDE.md`             | Thinker role brief. |
| `AGENTS.md`             | Worker role brief (Codex + Cursor). |
| `.cursor/rules/`        | Cursor's rules. |
| `tasks/`                | Written specs, for work worth writing down. |

## First steps

1. Review `docs/PRD.md` and `docs/tech-stack.md`; settle the open questions.
2. Point Codex / Cursor at `AGENTS.md` for the standing rules.
3. Hand off work — a direct prompt for small things, a task file for the rest.

## Running it

```
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
npm test
```
