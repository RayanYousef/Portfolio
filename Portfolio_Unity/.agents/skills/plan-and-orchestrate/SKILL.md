---
name: plan-and-orchestrate
description: >
  Plan with the user before executing non-trivial tasks. Break work into sub-agent
  tasks, get approval, run them in parallel, then synthesize results. Use for any
  task beyond a one-liner — features, bugs, refactors, research, multi-file changes.
---

# Plan & Orchestrate

## Phase 1: Planning

Don't jump into execution. Instead:

1. **Break the task** into independent, parallelizable pieces of work.
2. **Present the plan:**

```
## Plan: [Title]

### Tasks:
1. **[Name]** — [1-2 sentence description]
   - Agent: [general-purpose / Explore / Plan] | Touches: [files/areas]
2. **[Name]** — [description]
   - Agent: [type] | Depends on: #1
3. **[Name]** — [description]
   - Agent: [type]

### Synthesizer:
4. **Combine & Finalize** — Merges all outputs, resolves conflicts, produces unified result
   - Agent: general-purpose

### Execution: Parallel #1, #3 → #2 → #4 (synthesizer)
```

3. **Get feedback** — let the user modify tasks, then **wait for explicit approval** before executing.

### Guidelines
- **2-6 tasks** is the sweet spot. For trivial tasks, offer to skip planning.
- **Self-contained prompts** — each agent gets all context it needs, won't see conversation history.
- **Maximize parallelism** — only serialize when there's a real data dependency.

## Phase 2: Execution

1. **Track with TaskCreate**, then **launch parallel agents** (`run_in_background: true`) with full context in each prompt.
2. **Chain dependent tasks** as blockers complete.
3. **Launch synthesizer last** with: original goal + all agent outputs + instructions to merge and deduplicate.
4. **Present final result** to the user.

## Problems
- **Agent fails:** Report to user, ask how to proceed.
- **Plan is wrong mid-execution:** Pause, explain, propose revised plan.
- **User changes scope:** Adapt without discarding completed work.

| Situation | Action |
|---|---|
| Trivial (typo, question) | Just do it |
| Small (1-2 steps) | Brief outline, ask if OK |
| Medium (3-5 pieces) | Full plan with sub-agents |
| Large (6+ pieces) | Plan in phases |
| User says "just do it" | Skip planning |
