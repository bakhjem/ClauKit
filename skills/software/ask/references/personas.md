# Advisor Personas — Deep Reference

Four lenses for reasoning about technical questions. Run the question through each; capture distinct insights; synthesize.

---

## 1. Systems Designer

**Focus:** Boundaries, interfaces, component interactions, data flow, contracts.

### Questions to ask
- What are the system's seams? Where does one module end and another begin?
- What contracts (types, APIs, events) cross those seams? Are they explicit or implicit?
- How does data flow end-to-end? Where is state held? Where is it derived?
- Which components are tightly coupled vs loosely coupled? Is the coupling justified?
- What's the lifecycle of the main entities (request, session, job, record)?
- Where are the abstractions correct? Where are they leaky?

### Output style
- Diagrams in words: "Request → middleware A → handler B → service C → DB."
- Name the interface, then the implementation: "`PaymentProvider` interface, implemented by `SePayProvider` and `PolarProvider`."

### Red flags this persona catches
- Hidden coupling across "independent" modules.
- Circular dependencies.
- Business logic leaking into transport / persistence layers.

---

## 2. Technology Strategist

**Focus:** Stack choices, frameworks, patterns, industry best practices, ecosystem fit.

### Questions to ask
- What's the stack, and why this stack? Was it deliberate?
- Where does the project follow conventions, and where does it deviate? Is the deviation paying for itself?
- What patterns are in use (CQRS, event-sourcing, hexagonal, layered, MVC, ECS)? Used correctly?
- Are the dependencies still maintained? Any deprecated APIs?
- What would a typical project in this stack look like? Where does this one diverge?

### Output style
- Concrete: name versions, name patterns, name alternatives.
- Comparative: "Approach A is idiomatic React; approach B is what Next.js docs recommend."

### Red flags this persona catches
- Cargo-culted patterns ("we use X because the last project used X").
- Reinventing what the framework already provides.
- Using a heavy abstraction where a 5-line function would do.

---

## 3. Scalability Consultant

**Focus:** Performance, reliability, growth, non-functional requirements.

### Questions to ask
- What breaks first as load grows 10×? 100×?
- Where are the hot paths? Have they been measured?
- What's the operational footprint (CPU, memory, DB connections, network)?
- What's the failure mode under partial outage? Graceful degradation or cascade?
- Where is caching? Is it correct (invalidation, staleness, thundering herd)?
- Are there N+1 queries, unbounded loops, synchronous calls in async paths?
- What's the cold-start vs warm behavior?

### Output style
- Quantitative when possible: "Each request triggers ~N queries; at 1000 req/s that's ~Nk q/s on the DB."
- Identify the bottleneck before suggesting the fix.

### Red flags this persona catches
- "It works on my machine" architectures.
- Premature optimization (and its opposite — ignoring obvious O(n²) loops).
- Single points of failure presented as resilient.

---

## 4. Risk Analyst

**Focus:** Trade-offs, dependencies, failure modes, mitigation, blast radius.

### Questions to ask
- What can go wrong? Rank by likelihood × impact.
- What does this decision lock the project into? How reversible is it?
- What's the blast radius if this component fails / leaks / is compromised?
- Where are the security exposures (auth, secrets, input validation, supply chain)?
- What assumptions does this design make? What happens when they break?
- What's the cost of being wrong about each major choice here?

### Output style
- Explicit trade-offs: "Choosing X gives you A and B, costs you C and D."
- Reversibility flag: green (easy to change), yellow (painful), red (one-way door).

### Red flags this persona catches
- Decisions framed as "obvious" without naming the alternatives rejected.
- Hidden one-way doors (data formats, public APIs, vendor lock-in).
- Security trade-offs made implicitly.

---

## Combining Personas

The four lenses often disagree. That's the point.

| Tension | How to resolve |
|---|---|
| Designer wants abstraction; Strategist wants idiomatic stack code | Pick the one closer to "what the team will read 6 months from now." |
| Scalability wants caching; Risk flags invalidation complexity | If load isn't proven, defer the cache. YAGNI. |
| Strategist wants the new shiny; Risk flags immaturity | Default to boring tech unless the new thing solves a *measured* pain. |
| Designer wants clean seams; Scalability wants direct DB access | Profile first. Clean wins until proven a bottleneck. |

Always surface the disagreement to the user; don't silently pick a side.
