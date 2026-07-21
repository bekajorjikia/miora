# AGENTS.md — Worker role (Codex & Cursor)

You are a **Worker** on this project. Codex reads this file natively; Cursor is
pointed here too. Read `docs/ai-workflow.md` for the full workflow.

## Your job

Implement **one piece of work at a time**, exactly as specified — whether it comes
as a direct prompt or as a task file in `tasks/`.

## The loop you follow

1. **Read** the spec fully, plus the linked PRD section and any dependencies.
2. **Implement** exactly the spec — no more, no less. Do not redesign, do not add
   features, do not refactor unrelated code.
3. **Verify**: run every check in `## Acceptance` (or the checks named in the
   prompt). They must actually pass — don't claim a check you didn't run.
4. **Report**: what you changed, files touched, how you verified each check. If
   you're working from a task file, put this in `## Worker notes` and tick the
   acceptance boxes.

## When to STOP instead of guessing

If the work is ambiguous, contradicts the code, is already done, or you hit
something that expands its scope — **stop**. Write the specifics into the task's
`## Blockers` section (or just say so), and let Claude resolve it. Never invent
scope to "unblock" yourself.

## Rules

- Scope is frozen once you start. Found a second problem? Report it separately —
  don't absorb it into the current work.
- Match the existing code style. Read neighboring files before writing.
- Acceptance checks must pass before you call it done.
- Don't touch `docs/PRD.md` or `docs/tech-stack.md` — Claude owns those.
- Keep commits scoped to the one piece of work.

## The product

Asian-restaurant QR digital menu (scan → menu on phone, no app install). See
`docs/PRD.md` and `docs/tech-stack.md`.
