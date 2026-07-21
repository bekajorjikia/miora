# AI Workflow — Thinker & Workers

This project is built by three AI tools with clearly separated jobs. The goal is
that **one brain plans and reviews**, and **hands (workers) implement**. This keeps
the architecture coherent while parallelizing the actual coding.

## The roles

| Tool   | Role    | Does                                                                 | Does NOT |
|--------|---------|---------------------------------------------------------------------|----------|
| Claude | Thinker | Owns architecture & product intent. Breaks work into task files. Reviews worker output. Resolves ambiguity. | Write large amounts of feature code. |
| Codex  | Worker  | Implements one task file at a time. Runs tests. Reports back.        | Redesign architecture or invent scope. |
| Cursor | Worker  | Implements one task file at a time, IDE-driven. Runs tests. Reports. | Redesign architecture or invent scope. |

**One rule above all:** workers implement what the task file says. If a task is
ambiguous, wrong, or blocked, the worker stops and writes the question into the
task file's `## Blockers` section instead of guessing. Claude resolves it.

## The loop

```
        ┌──────────────────────────────────────────────┐
        │ 1. THINK (Claude)                            │
        │   Read PRD + current state.                  │
        │   Define what "done" means.                  │
        └───────────────────┬──────────────────────────┘
                            │
        ┌───────────────────▼──────────────────────────┐
        │ 2. BUILD (Codex or Cursor)                   │
        │   Implement exactly the spec.                │
        │   Run the acceptance checks until they pass. │
        │   Report what changed and how it was checked.│
        └───────────────────┬──────────────────────────┘
                            │
        ┌───────────────────▼──────────────────────────┐
        │ 3. REVIEW (Claude)                           │
        │   Read the diff, re-run the checks.          │
        │   Approve, or send back a fix.               │
        └───────────────────┬──────────────────────────┘
                            │
                     (repeat from 1)
```

## Two ways to hand off work

**Direct prompt** — for small, self-evident work. Just tell Cursor or Codex what
to do. No file, no ceremony.

**Task file** — for work where "done" needs defining up front, or that touches
architecture and you'll want the reasoning later. See `tasks/README.md` for the
line between the two, and `tasks/TEMPLATE.md` for the shape.

Either way, step 3 still happens: someone reads the diff before it's trusted.

## Handoff rules

1. **Define "done" before starting** — as runnable checks (commands, tests)
   wherever possible, not adjectives. This is the whole game; it's what makes
   review objective instead of a matter of taste.
2. **A task is self-contained.** A worker should never need the conversation that
   produced it — everything needed is in the prompt/file or linked from it.
3. **Scope is frozen once started.** If a worker discovers the scope is wrong, it
   stops and raises it rather than expanding the task.
4. **Git is the status.** No status fields, no folders to move things between.
   Work is done when its checks pass and it's committed.

## Who edits what

- Claude edits: `docs/`, task files in `tasks/`, `CLAUDE.md`, and reviews
  everything.
- Workers edit: source code, tests, and the `## Worker notes` / `## Blockers`
  sections of a task file they're working from.
- Nobody edits `docs/PRD.md` or `docs/tech-stack.md` without Claude's sign-off —
  those are the source of truth.

## Getting started

1. Read `docs/PRD.md` (what we're building) and `docs/tech-stack.md` (how).
2. Point Codex/Cursor at `AGENTS.md` so they pick up the standing rules.
3. Hand them work — a direct prompt for small things, a task file for the rest.
