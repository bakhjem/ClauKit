# Anti-Patterns — What Not to Do

Common failure modes when answering technical questions. Each comes with the failure pattern, the cause, and the correction.

---

## 1. Answering Without Reading

**Pattern:** Confident project-specific claims with no file references.

> "Your auth middleware probably validates the JWT against the session table and falls back to the API key header…"

**Cause:** Pattern-matching from training data instead of from this codebase.

**Correction:** Before any project-specific claim, grep for the relevant code and Read it. If you couldn't find it in 2–3 searches, say "I haven't been able to locate X — can you point me at the file?" rather than guessing.

---

## 2. Fabricated APIs / Files / Functions

**Pattern:** Naming a function, file, or method that doesn't exist.

> "You should use `validateSessionWithRefresh()` from `lib/auth/session.ts`…"

**Cause:** Plausible-sounding but invented identifiers.

**Correction:** Every identifier in the answer must either (a) be quoted from the code you just read, or (b) be clearly marked as a *suggested name* for code that doesn't exist yet. Never blur the two.

---

## 3. Over-Architecting the Question

**Pattern:** User asks "how do I read a file in this project?" — answer covers event sourcing, hexagonal architecture, and a 5-phase migration plan.

**Cause:** Treating every question as strategic.

**Correction:** Match depth to question. A lookup gets a lookup answer. Save the four-persona consultation for actually strategic questions.

---

## 4. Both-Sidesing Without Picking

**Pattern:** "You could use approach A or approach B, both have merit, it depends…"

**Cause:** Avoiding judgment to seem balanced.

**Correction:** Pick a default given the current constraints. Then name the condition that would flip the choice. "Use A. Switch to B if load grows past N." Trade-offs aren't an excuse to refuse to recommend.

---

## 5. Persona-Headed Section Dumps

**Pattern:** Four headed sections (Designer, Strategist, Scalability, Risk) with disconnected bullet lists.

**Cause:** Confusing the *reasoning process* with the *output format*.

**Correction:** Run the four personas internally. Output *one* synthesized recommendation that surfaces the tensions between lenses inline. The reader wants an answer, not a tour of your thinking.

---

## 6. Hedge-Stacking

**Pattern:** "Generally, in most cases, depending on context, it's often the case that you might possibly want to consider…"

**Cause:** Lack of conviction; trying to be unfalsifiable.

**Correction:** Make a falsifiable claim. "Use approach A because B." If you're not sure, say "I'm not sure — here's what I'd check to find out."

---

## 7. Narrating Internal Deliberation

**Pattern:** "Let me think about this from a Systems Designer perspective… now switching to Scalability Consultant…"

**Cause:** Confusing process with deliverable.

**Correction:** Reason silently. Output decisions. The user doesn't want commentary on your reasoning; they want the result.

---

## 8. Implementation Drift

**Pattern:** User asks "how is X done?", answer ends with `Edit` / `Write` tool calls "fixing" something.

**Cause:** Conflating consultation with implementation. The `/ask` skill is read-only.

**Correction:** Stop at the recommendation. If implementation is needed, say "Want me to implement this? That'd be `/code` or `/plan` first." Then wait for user to confirm.

---

## 9. Stale Memory / Stale Context

**Pattern:** Citing a file path or function name that was renamed / removed three commits ago.

**Cause:** Trusting prior context (memory, earlier in the conversation, training data) over current state.

**Correction:** For project-specific claims, prefer fresh reads over recollection. If a memory says "X exists at Y," verify before recommending action based on it.

---

## 10. Ignoring Constraints the User Stated

**Pattern:** User says "we can't introduce new dependencies right now" — answer recommends adding 3 npm packages.

**Cause:** Pattern-matched answer overrode stated constraint.

**Correction:** Re-read the user's framing before finalizing. If your best answer violates a stated constraint, surface that explicitly: "The cleanest answer is X but that needs dep Y, which you said is off-limits — so within your constraint, the answer is Z (which is worse along dimension W)."

---

## Quick Self-Check Before Sending

- [ ] Did I read at least one relevant file in this codebase?
- [ ] Every project-specific claim has a file ref or is flagged as general principle?
- [ ] No invented identifiers?
- [ ] Length matches question complexity?
- [ ] I picked a recommendation (not just listed options)?
- [ ] Constraints stated by the user are respected (or violation is surfaced)?
- [ ] No implementation tool calls?
- [ ] Unresolved questions listed at the end, if any?
