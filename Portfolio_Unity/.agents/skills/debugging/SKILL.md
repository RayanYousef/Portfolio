---
name: debugging
description: Systematic debugging assistance. Use when users report bugs, errors, unexpected behavior, performance issues, or need help diagnosing problems in their code. Guides through reproduction, diagnosis, root cause analysis, and fix verification.
---

# Debugging Skill

Help users systematically diagnose and fix bugs. Follow the workflow below, adapting depth to the situation -- a simple typo does not need the full pipeline; a Heisenbug does.

---

## 1. Debugging Workflow

Execute these steps in order. Skip steps only when the answer is already obvious.

| Step | Action | Key Questions |
|------|--------|---------------|
| **1. Understand** | Read the error message, stack trace, and user description completely before doing anything. | What is the expected behavior? What actually happens? When did it start? |
| **2. Reproduce** | Create or confirm a minimal, reliable way to trigger the bug. | Can I make it fail on demand? What is the smallest input/config that triggers it? |
| **3. Isolate** | Narrow the scope. Use binary search (bisect code, commits, or inputs) to locate the fault. | Which component owns this failure? Does the bug survive if I remove X? |
| **4. Hypothesize** | Form a specific, falsifiable theory about the root cause. | What single defect would explain ALL observed symptoms? |
| **5. Test** | Design an experiment that can *disprove* the hypothesis. Change ONE thing. | If my theory is right, what should happen when I do X? |
| **6. Fix** | Apply the smallest correct change that addresses the root cause, not just the symptom. | Does this fix the root cause or just mask it? |
| **7. Verify** | Confirm the fix works AND that nothing else broke. | Does the original reproduction case now pass? Do existing tests still pass? |

### When helping a user, always start by asking:
- What is the exact error message or unexpected behavior?
- When did this start happening (what changed)?
- Can you reproduce it reliably?

---

## 2. Methodology Selection Guide

Match the bug type to the best methodology:

| Bug Type | Primary Method | Why |
|----------|---------------|-----|
| **Regression** (it worked before) | `git bisect` -- binary search through commits | O(log N) to find the breaking commit; automatable with `git bisect run <test>` |
| **Logic error** (wrong output) | Scientific method + rubber duck | Walk through the code line-by-line, state your assumptions, check each one |
| **Crash / exception** | Stack trace analysis | Start at the top frame, find YOUR code, follow "Caused by" chains |
| **Performance** | Profiling (CPU/memory) + flame graphs | Measure first, optimize second. Never guess at bottlenecks |
| **Intermittent / flaky** | Record & replay, increase logging, stress test | Capture the exact state when it fails; look for race conditions, resource leaks, or timing dependencies |
| **Production-only** | Structured logging + error tracking (Sentry) | You cannot attach a debugger; rely on telemetry, correlation IDs, and log levels |
| **Data / state corruption** | Data breakpoints + audit trail | Watch the variable/row that goes wrong; trace who mutates it |
| **Network / integration** | Request tracing (DevTools, curl -v, proxy tools) | Inspect the actual bytes on the wire; compare expected vs. actual payloads |
| **Database** | `EXPLAIN ANALYZE` + slow query logs | Check query plans, N+1 patterns, connection pool exhaustion |
| **Build / config** | "Check the plug" -- verify environment | Confirm versions, env vars, paths, permissions before debugging code |

---

## 3. Thinking Patterns

These cognitive rules prevent common debugging traps:

- **Read the error message.** Fully. Before theorizing. Most errors say exactly what is wrong.
- **Avoid confirmation bias.** Design experiments to DISPROVE your theory, not confirm it. If you only look for evidence that supports your hypothesis, you will miss the real cause.
- **Change one thing at a time.** Multiple simultaneous changes make it impossible to know which one mattered.
- **Keep an audit trail.** Record what you tried, what happened, and what you concluded. This prevents repeating failed experiments and helps others help you.
- **Question your assumptions.** "Is the code I'm reading actually the code that's running?" Check saved files, rebuilt artifacts, correct branch, right environment.
- **Get a fresh perspective.** If stuck for more than 15-30 minutes on one theory, step back. Explain the problem from scratch (rubber duck). Consider that your mental model of the system may be wrong.
- **Ask "5 Whys."** When you find the immediate cause, ask why THAT happened. Repeat until you reach a root cause or a process gap. Surface-level fixes lead to recurring bugs.
- **If you didn't fix it, it isn't fixed.** A bug that "went away" after an unrelated change will come back. Understand WHY a fix works.
- **Verify the obvious first.** Is it plugged in? Is the server running? Is the file saved? Is the correct branch checked out? Embarrassingly simple causes are the most common.

---

## 4. Tool Selection Guide

| Situation | Reach For | Notes |
|-----------|-----------|-------|
| "I have a stack trace" | Stack trace analysis | Find your code frame, read the error type and message, check "Caused by" |
| "It's slow" | CPU profiler (Py-Spy, async-profiler, pprof) | Generate a flame graph; look for wide bars (time) or tall stacks (deep calls) |
| "Memory keeps growing" | Memory profiler / heap snapshots | Compare snapshots over time; look for objects that only grow |
| "It worked yesterday" | `git bisect` | Automate with a test script: `git bisect run pytest test_foo.py` |
| "Only fails in prod" | Structured logging, error tracking (Sentry), distributed tracing | Add correlation IDs to follow requests across services |
| "Fails sometimes" | Stress testing, record-and-replay (rr), thread sanitizer | Reproduce under load; capture non-deterministic state |
| "Wrong data from API" | Network proxy (mitmproxy, Fiddler), curl -v, browser DevTools | Inspect request/response payloads, headers, status codes |
| "Query is slow" | `EXPLAIN ANALYZE`, slow query log, ORM logging | Check for full table scans, missing indexes, N+1 queries |
| "Complex state bug" | Debugger with conditional breakpoints + watch expressions | Set breakpoints that fire only when the bad condition occurs |
| "Need to understand unfamiliar code" | Static analysis, code search, read tests first | Tests document intended behavior; static analysis finds code smells |
| "Want to prevent this class of bug" | Linter rules, static analysis (CodeQL, Semgrep, SonarQube) | Shift left: catch it at write time, not debug time. 6x cheaper |

---

## 5. Common Anti-patterns

Avoid these -- they waste time and introduce new bugs:

| Anti-pattern | Why It Fails | Do This Instead |
|-------------|-------------|-----------------|
| **Random changes ("shotgun debugging")** | Multiple changes obscure cause and effect; may introduce new bugs | Change one thing, observe, revert if it did not help |
| **Skipping reproduction** | You cannot verify a fix for a bug you cannot trigger | Invest time in a minimal reproduction case FIRST |
| **Not reading the error message** | The answer is often right there in the output | Read the FULL error, including "Caused by" chains |
| **Debugging the wrong code** | Stale builds, wrong branch, cached artifacts | Verify: clean build, correct branch, saved files |
| **Assuming instead of measuring** | "It's probably the database" -- but is it? | Profile and measure before optimizing |
| **Fixing symptoms, not causes** | Adding a null check hides WHY the value is null | Trace back to the root cause with "5 Whys" |
| **Not verifying the fix** | "It compiles, ship it" | Run the reproduction case, run the test suite |
| **Debugging alone too long** | Tunnel vision sets in after ~30 min | Explain the problem to someone (or a rubber duck), take a break, get a fresh view |
| **Ignoring version/environment differences** | "Works on my machine" | Compare versions, env vars, OS, configs between environments |
| **No audit trail** | Repeating failed experiments; losing progress | Keep a running log of hypotheses, experiments, and results |

---

## Applying This Skill

When a user asks for debugging help:

1. **Assess severity and type.** Read their description and classify the bug (regression, logic, performance, etc.).
2. **Pick the right methodology** from the selection guide above.
3. **Walk through the workflow** step by step, explaining your reasoning.
4. **Use tools** -- actually run code, read files, check logs. Do not guess when you can look.
5. **Communicate clearly.** State your hypothesis, what experiment you will run, and what result you expect. If the experiment disproves your hypothesis, say so and pivot.
6. **After fixing**, verify the fix AND explain the root cause so the user learns.
