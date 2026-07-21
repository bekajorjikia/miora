# Tasks

Written specs for work that's big enough to be worth writing down. One task =
one Markdown file, based on `TEMPLATE.md`.

## When to write a task file (and when not to)

**Just prompt Cursor/Codex directly** for small work — a style fix, a rename, a
copy tweak. If you can hold the whole change in your head, don't write a file.

**Write a task file when:**
- "Done" isn't obvious and needs defining up front, or
- the work touches architecture or the data model and you'll want the reasoning
  later, or
- you'd end up explaining it more than once.

Rule of thumb: if you'd have to explain it twice, write it down once.

## Why the file exists

The load-bearing part is `## Acceptance` — a definition of done as **runnable
checks**. That's what makes review objective ("did these four commands pass?")
instead of a judgement call, and what survives after the chat window is gone.

## Naming

`TASK-<NNN>-short-slug.md`, e.g. `TASK-004-menu-item-card.md`. Numbers are
sequential and never reused.

## Status

There isn't a status field — **git is the status.** A task is done when its
acceptance boxes are ticked and the work is committed. No folders to move things
between, no metadata to keep in sync.

## Rules of the road

- **Self-contained:** a task must be doable from the file alone, with no memory of
  the conversation that produced it.
- **Scope is frozen.** Found a second problem while working? Note it in
  `## Worker notes` so it can be filed separately — don't absorb it into this task.
- **Blocked? Say so.** Write the specifics into `## Blockers` and stop. Don't guess
  past ambiguity.
- **Tick the boxes.** Acceptance checks get ticked only after they actually pass.
