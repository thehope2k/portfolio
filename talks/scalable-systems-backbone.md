# Scalable Software Systems — Story Backbone

> **Core storytelling philosophy:**
> Every technology introduced through *reasoning*, not prescription.
> The arc is always: **observe the problem → think like an engineer → arrive at the solution naturally**.
> The slide/UI doesn't narrate this — it gives the speaker *clues* (a word, a diagram, a visual hint) to anchor the
> story.

---

## Storytelling Principles

### Reasoning-first, not solution-first

Bad: "Feed is slow → use Redis"
Good: "Queries are expensive, but the data doesn't change that fast. What if we just... remember the answer? Local
memory works — oh wait, we have 10 servers now. It needs to be shared. That's distributed cache. That's Redis."

### CAP theorem & Eventual Consistency — reasoning tools, not solutions

These aren't slides about a technology. They're *the reasoning framework* that explains why we make tradeoffs.

- CAP = "You can't have everything. When the network breaks, what do you sacrifice — availability or correctness?"
- Eventual Consistency = "We chose availability. The data will be right... eventually. Is that okay for your use case?"

They surface *inside* the stories where tradeoffs happen (e.g., Read Replica, Saga pattern), not as standalone concepts.

### The UI's job

Show *just enough* to guide the speaker — a key word, a short label on a diagram node, an arrow showing a flow. The
audience should see the architecture evolve. The speaker fills in the "why".

---

## Acts

---

### Act 1 — "We built it in a weekend"

**Theme:** Foundation
**Story beat:** Hope and two friends build Gossip.com. Fast. No planning, just ship.

**Reasoning chain (spoken, not on slide):**

- We need a server → VPS (cheapest thing)
- We need structure → MVC, one repo, one DB on the same machine
- We need an API → REST, CRUD, done

**Slide clue:** Architecture diagram — one box. Server + App + DB, all together.

**Technologies introduced:** Monolith, MVC, REST API, Single DB, VPS

---

### Act 2 — "It died at 2am"

**Theme:** Scaling Basics
**Story beat:** A celebrity scandal post goes viral overnight. Server at 100% CPU. Down.

**Reasoning chain (spoken, not on slide):**

- First instinct: bigger server (vertical scaling) — works, until it doesn't. There's a ceiling.
- Why not more servers? → Sessions are stored in memory on one machine. User hits server 2, they're logged out.
  → Sessions need to live outside the app. Stateless design.
- More servers need traffic split → Load Balancer
- DB is now the bottleneck, not the app → Can we have multiple DBs?
  → Writes still need one source of truth. Reads can be duplicated → Read Replica
  → *But replicas lag slightly* → This is where we first touch **eventual consistency** as a reasoning tool: "Is it okay
  if someone sees a post 200ms late? Yes. We trade perfect consistency for availability."

**Slide clue:** Diagram evolves — LB in front, 3 app boxes, primary DB + replica. Label: "replica lag ~ms"

**Technologies introduced:** Horizontal scaling, Load Balancer, Stateless, Read Replica
**Reasoning frameworks surfaced:** Eventual consistency (briefly, as tradeoff framing)

---

### Act 3 — "The same query, 40 times a second"

**Theme:** Performance
**Story beat:** Feed page is slow. DB metrics show the same 5 queries hitting over and over.

**Reasoning chain (spoken, not on slide):**

- The data doesn't change every millisecond. Why are we asking the DB every time?
- What if we just remember the answer? → Local in-memory cache
- Problem: 10 servers, 10 caches, all different versions of the truth → need a shared cache
- → Redis. One cache, all servers read from it.
- Cache invalidation: now we have a new problem — when does the cached data go stale?
  → TTL, explicit invalidation on write. This is hard. There's a famous quote about this.
- Static assets (images, JS, CSS) also slow → CDN, cached at the edge, geographically close to users
- The DB queries that *can't* be cached — are they using indexes? → Explain indexing as a lookup table vs full scan

**Slide clue:** Diagram — Redis layer between app and DB. CDN at edge. DB with "index" label on hot tables.

**Technologies introduced:** Caching, Redis, Cache invalidation, CDN, Indexing

---

### Act 4 — "User waited 9 seconds to post"

**Theme:** Async & Messaging
**Story beat:** Posting something triggers notifications, emails, feed updates, analytics — all in one request.

**Reasoning chain (spoken, not on slide):**

- Why is posting slow? The request doesn't finish until *everything* finishes.
- Does the user need to wait for the notification to send? No. They just need the post saved.
- What if we split: "do the important thing now, do the rest later"? → Async
- "Later" means something has to pick it up → Message Queue (Kafka / RabbitMQ)
- Analogy: a ticket at a restaurant. You order (produce), kitchen handles it (consume), you don't stand at the pass.
- Multiple things care about "post created" (notifications, email, feed, analytics) → Pub/Sub, each consumer subscribes
  independently
- What if a consumer crashes mid-processing? → At-least-once delivery, idempotency matters
- What if it keeps failing? → Dead Letter Queue — a holding pen for broken messages

**Slide clue:** Diagram — post service → Kafka topic → fan-out to notification, email, feed, analytics consumers. DLQ
shown as a side path.

**Technologies introduced:** Sync vs Async, Message Queue, Kafka, Pub/Sub, Event-driven, DLQ, At-least-once

---

### Act 5 — "20 engineers, one repo, Friday deploy"

**Theme:** Microservices
**Story beat:** Team scaled. Every deploy is a war. One bug in notifications brings down payments.

**Reasoning chain (spoken, not on slide):**

- The monolith means: one broken thing = everything broken
- Different teams want to deploy independently, on their own schedule
- Natural split: services owned by teams → Service decomposition (not magic, just boundaries)
- Now clients need to talk to 10 services — they can't know all the addresses → API Gateway as the single front door
- Every service now needs to know: who is this user? → JWT/OAuth2 — token carries identity, stateless auth
- You can't run 10 services on a laptop without containerization → Docker — "it works on my machine" → now it works
  everywhere
- Optional mention: service discovery (how services find each other), but don't go deep

**Slide clue:** Diagram — monolith explodes into service boxes (auth, post, notification, payment, feed). API Gateway in
front. Each box has a Docker icon.

**Technologies introduced:** Service decomposition, API Gateway, JWT/OAuth2, Docker
**Reasoning frameworks surfaced:** Why microservices (team autonomy, fault isolation) — and the cost (distributed
complexity)

---

### Act 6 — "Payment charged. Post never created. 847 tickets."

**Theme:** Distributed Patterns
**Story beat:** User pays for a promoted post. Payment service succeeds. Post service crashes after. Money gone, post
missing.

**Reasoning chain (spoken, not on slide):**

- In a monolith with one DB: wrap it in a transaction, done.
- In microservices: there is no shared transaction across service boundaries.
- We need a way to coordinate multiple steps that can each fail → Saga pattern
  → Choreography: each service reacts to events (payment success → create post → if fail → trigger refund)
  → It's eventual. It might not be instant. **CAP theorem surfaces here**: we chose availability (services can operate
  independently), we gave up strict consistency. Eventual consistency is the *contract* we accepted.
- But how does the payment service guarantee it fired the event, even if it crashed right after writing to DB? → Outbox
  pattern: write to a local table in the same DB transaction, a separate process reliably publishes it.
- Retrying the same payment twice? → Idempotency key — same request, same result, no double charge.
- Downstream service is slow/flaky → Circuit Breaker — fail fast, don't cascade
- Automated abuse / spam → Rate Limiting at the API Gateway layer

**Slide clue:** Saga flow diagram showing payment → post → on failure → compensating transaction. Outbox table shown.
Circuit breaker states (closed/open/half-open).

**Technologies introduced:** Saga, Outbox, Idempotency, Circuit Breaker, Rate Limiting
**Reasoning frameworks surfaced:** CAP theorem (as the "why" behind saga's tradeoffs), Eventual Consistency (as the
contract)

---

### Finale — "This is what it looks like now"

**Theme:** Infrastructure + Full Picture
**Story beat:** Same weekend project. Now: 10M posts/day, global users, 30-person eng team.

**Slide clue:** Full architecture diagram — all pieces visible. Brief mention:

- Docker everywhere → Kubernetes for orchestration and auto-scaling
- CI/CD — deploy without fear
- S3/Object storage for media

**Speaker note:** The technology didn't come first. The problems came first. Every box in this diagram is the answer to
a specific pain.

---

## Topics Cut (and why)

| Topic                | Reason                                                       |
|----------------------|--------------------------------------------------------------|
| DDD                  | Too abstract — useful concept but not a visual story beat    |
| Service discovery    | Internal plumbing — one sentence if asked                    |
| Consumer group       | Too deep into Kafka internals                                |
| Backpressure         | Implementation detail, not a story moment                    |
| DB Sharding          | Complex tradeoffs, no clean narrative resolution in this arc |
| Session management   | Folded into stateless discussion in Act 2                    |
| Logging / Monitoring | Explicitly excluded — important but not this talk            |

---

## UI Design Philosophy (for when we build it)

- **Speaker-driven**: UI is a visual anchor, not a teleprompter
- **Diagrams evolve** across acts — show the same system getting more complex
- **Short text only for summaries**: bullet tradeoffs (e.g., "✓ independent deploys / ✗ distributed complexity")
- **Reasoning frameworks** (CAP, eventual consistency) appear as labels/callouts *on diagrams*, not as standalone text
  slides
- Slide transition should feel like zooming into a growing system, not flipping pages
