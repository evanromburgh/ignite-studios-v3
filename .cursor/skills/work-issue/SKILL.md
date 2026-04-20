---
name: work-issue
description: Pick up and implement a specific GitHub issue in evanromburgh/ignite, following the one-issue-per-chat workflow, context hygiene, and handoff protocol in AGENTS.md. Use when user says "work on issue N", "resume issue N", or similar.
---

# Work Issue

Implement a single GitHub issue in `evanromburgh/ignite` end-to-end, staying inside the context-hygiene rules in `AGENTS.md`.

## Process

### 1. Orient — before writing any code

1. Read `AGENTS.md` to refresh the workflow, conventions, and handoff protocol.
2. Run `gh issue view <N> --repo evanromburgh/ignite` to read the full issue body and acceptance criteria. If the user said "resume issue N", also read the most recent handoff comment on that issue.
3. Confirm the issue's `Blocked by` list is satisfied — every referenced issue must be closed. If not, stop and tell the user which dependency is still open.
4. Skim `PRD.md` for any decisions relevant to this slice (architecture, naming, state machines, security posture).
5. Skim the repo to understand the current state of the code around what you'll be changing.

### 2. Confirm the plan

Before making non-trivial changes, reply to the user with:

- The acceptance criteria quoted verbatim (as a checklist)
- A short implementation plan organised as small, commit-sized steps
- Any open questions, ambiguities, or things that will need user credentials/clicks (e.g. Vercel, Supabase dashboard work)
- A clear statement of anything you notice that is out of scope — do NOT silently expand scope

Then proceed. Simple, unambiguous issues don't need explicit user sign-off; non-trivial ones do.

### 3. Implement with context hygiene

- Commit and push after every meaningful step. Commit messages reference the issue: `feat: #N short description`.
- Post a progress comment on the issue at natural milestones (schema done, API done, UI done, tests passing).
- After each commit that satisfies an acceptance-criteria item, tick that box in the issue body. Write the updated body to a file using your file-write tool (UTF-8, no BOM — don't use PowerShell `>` redirection, which produces UTF-16 on Windows), then push it with `gh issue edit <N> --repo evanromburgh/ignite --body-file <path>`. Never batch-tick at close time.
- Run `pnpm lint`, `pnpm typecheck`, and `pnpm build` before each push. CI expects them green.
- If you estimate context is past ~40% and material work remains, STOP and write a handoff comment per `AGENTS.md` §"Context hygiene & handoff protocol", then end your turn.

### 4. Close out

Only when every acceptance-criteria box can be ticked:

1. Push the final commit.
2. Post a final progress comment listing each AC box with its commit SHA.
3. Run `gh issue close <N> --repo evanromburgh/ignite --reason completed`.
4. Tell the user it's done and suggest starting a fresh chat for the next issue.

Never close an issue with open ACs. If an AC needs user-side work (Vercel, Supabase, credentials), leave the issue open, hand off, and tell the user the specific steps.

## Invocation shapes to recognise

- `Work on issue #N` — fresh chat, orient from scratch.
- `Resume issue #N from handoff comment <link>` — fresh chat, continuing prior work. Read the linked handoff comment first.
- `Pick up the next ready issue` — list open issues, find one with a satisfied `Blocked by`, propose it to the user before starting.