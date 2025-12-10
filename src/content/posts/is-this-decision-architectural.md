---
title: "Is this decision architectural?"
pubDate: 2025-12-01
tags: [software architecture, design, Head First, decision making]
---

This is the third post in a series where I share lessons from reading _"Head First Software Architecture"_ by Raju Gandhi, Mark Richards, and Neal Ford. In the [previous post](/posts/four-dimensions-of-architecture), we explored the 4 dimensions of software architecture. Now, let's tackle a practical question every team faces: **How do we know if a decision is architectural?**

## About the book

I picked up _"Head First Software Architecture"_ because it was part of a bundle, and I was eager to learn more about software architecture. What attracted me most was the **Head First approach** to learning - with visuals, engaging style, often exercises, and easy-to-understand examples.

And boy, **this book delivers**.

One thing that usually pushes me away from technical books are language-specific examples. I was often pushed away by fe. Java examples in books about general topics like architecture. If I wanted to read Java code, I would've bought a book about Java, lol.

But this book manages to keep examples accessible and relevant regardless of your tech stack.

## Decisions are in spectrum

Here's a truism: **decisions are not binary**. All depends on context. End of article.

You still here? Ok, so let's expand on that.

They don't neatly fall into "architectural" or "non-architectural" boxes. Instead, they exist on spectrums like from small, tactical choices to big, strategic decisions.

This gray area is where teams often struggle.

**Isn't this architect work to know all of this?** Yes, but not only, because knowing where a decision lands on the spectrum helps you determine:

- When to involve architects vs. when developers can decide independently
- How much discussion and documentation is needed
- What level of review process is appropriate

Teams that understand this make faster decisions while maintaining architectural integrity. Teams that don't either bog down in endless meetings or make costly mistakes that require expensive rework later.

So how do we measure decisions? Let's look at three key spectrums.

## Spectrum 1 - Strategic vs Tactical Decision

Strategic decisions are **long-term choices** that have ripple effects across the system. They often:

- Impact multiple teams or components
- Affect how the system evolves over time
- Set constraints for future decisions
- Are expensive to reverse

**Example:** Choosing microservices architecture vs. monolith. This decision affects team structure, deployment processes, monitoring, debugging, and countless future technical choices. You can't easily "undo" this later.

Tactical decisions are **short-term choices** that solve immediate problems. They typically:

- Affect a single feature or component
- Can be made by individual developers or small teams
- Have localized impact
- Are relatively easy to change later

**Example:** Choosing a specific notification library (like react-toastify vs. sonner) for displaying user alerts. If you don't like it, you can swap it out without restructuring your entire frontend.

## Spectrum 2 - How much work is required?

Some decisions require **significant effort** to implement:

- Touch many parts of the codebase
- Require coordination across multiple teams
- Need extensive testing and migration planning
- Take weeks or months to fully implement

**Example:** Adopting a new database technology (switching from PostgreSQL to MongoDB). This requires rewriting data access layers, migrating data, updating queries, retraining the team, and adjusting monitoring. It's a massive undertaking.

Other decisions are **quick fixes or minor changes**:

- Affect one or few files
- Can be implemented by a single developer
- Take hours or days, not weeks
- Have minimal testing overhead

**Example:** Changing a UI color scheme from blue to green. Update some CSS variables, check a few screens, done. Maybe an hour of work.

### The effort trap

Don't confuse effort with importance. Some low-effort decisions have huge consequences. Some high-effort tasks are just tedious, not architectural.

## Spectrum 3 - Is this decision comes with some important tradeoffs?

This is the **most important spectrum** for identifying architectural decisions.

Architectural decisions often involve **significant tradeoffs** between competing quality attributes:

- Performance vs. Maintainability
- Scalability vs. Simplicity
- Security vs. Usability
- Flexibility vs. Consistency

**Example:** Choosing synchronous vs. asynchronous communication between frontend and backend.

Synchronous (REST API):

- ✅ Simpler to implement and debug
- ✅ Easier to understand for most developers
- ❌ Can't handle real-time updates well
- ❌ More server resources for long-polling

Asynchronous (WebSockets):

- ✅ Real-time updates, better user experience
- ✅ More efficient for streaming data
- ❌ More complex error handling
- ❌ Harder to scale (stateful connections)

This decision has **clear tradeoffs** that affect performance, maintainability, user experience, and infrastructure costs.

Non-architectural decisions have **no significant tradeoffs**:

- One option is clearly better
- The choice doesn't meaningfully affect quality attributes
- It's mostly a matter of preference

**Example:** Should your `List` component and `ListItem` component be separate or combined into one component?

If you separate them:

- Slightly more flexible for custom list items
- Requires passing props between components

If you combine them:

- Slightly simpler to use
- Less flexible for edge cases

**The tradeoffs here are minimal**. Both approaches work fine. Pick one and move on. Don't schedule a meeting about it.

## Is this decision architectural?

Let's analyze a real decision using all three spectrums:

**Decision:** Should we implement optimistic updates in our React application?

### Analyzing the decision:

**Strategic vs Tactical:**

On the surface, this feels tactical - it's a UI enhancement pattern. But it affects how the entire frontend handles data mutations, error recovery, and state synchronization. It sets a pattern that other features will follow.

**Verdict:** Leans toward strategic (60/40).

**How much work:**

Implementing optimistic updates requires:

- Updating state management patterns
- Adding rollback logic for failed mutations
- Handling edge cases (conflicts, network errors)
- Updating existing mutations across multiple features
- Writing new tests for optimistic scenarios

This isn't a weekend project. It touches many parts of the codebase.

**Verdict:** Medium to high effort.

**Important tradeoffs:**

Optimistic updates:

- ✅ **Much better perceived performance** - users see instant feedback
- ✅ **Improved user experience** - app feels snappy and responsive
- ❌ **More complex error handling** - what happens when the server rejects the change?
- ❌ **Potential for user confusion** - "I saw it saved, but now it's gone?"
- ❌ **State synchronization challenges** - keeping optimistic state in sync with server state

This involves **significant tradeoffs** between user experience and code complexity.

**Verdict:** High tradeoff impact.

### So, is it architectural?

By analyzing the three spectrums, we land **somewhere between architectural and non-architectural**. It has characteristics of both:

- Strategic implications for the codebase
- Significant implementation effort
- Major tradeoffs between competing quality attributes

But it's not a pure architectural decision like "choose microservices vs monolith."

**And that's perfectly fine!** Most decisions live in this gray area. The value isn't in definitively labeling it "architectural" or not. The value is in **recognizing it deserves discussion with architect**.

### What to do with in-between decisions?

For decisions like this:

1. **Discuss with architects** - They don't need to make the decision, but they should be aware of it
2. **Document the tradeoffs** - Write an ADR (Architectural Decision Record) explaining the choice
3. **Get team alignment** - Ensure everyone understands why you're making this choice
4. **Review later** - Check if the tradeoffs played out as expected

**Pro tip:** Architects love being involved in discussions about tradeoffs. It's literally their job. Unless they're overworked and drowning in meetings, they'll appreciate being consulted on decisions like this, even if it's just a quick Slack message or 15-minute discussion.

## Summary (Flashcard)

Decisions exist on a spectrum from tactical to architectural. Evaluate them using three dimensions:

1. **Strategic vs Tactical** - Long-term impact vs. short-term fix
2. **Required Effort** - How much work to implement
3. **Tradeoff Significance** - Does it involve important quality attribute tradeoffs?

Most decisions fall somewhere in between. That's normal. Use the spectrums to determine when to involve architects and what level of discussion is needed.

---

That's all. I hope you enjoyed this article. Thanks for reading!

**Here's an addon for you.** Brief summary of an article in form of question & answer. You can use it to create fiches cards (e.g. in Anki).

### Flashcards

**#1**

**Front:** Are architectural decisions binary (either architectural or not)?

**Back:** No. Decisions exist on a spectrum from tactical to strategic, with most landing somewhere in between.

---

**#2**

**Front:** Why does it matter if a decision is architectural?

**Back:** It determines when to involve architects, how much discussion is needed, and what review process is appropriate.

---

**#3**

**Front:** What are the 3 spectrums for evaluating decisions?

**Back:** 1) Strategic vs Tactical, 2) Required effort/work, 3) Significance of tradeoffs.

---

**#4**

**Front:** What characterizes a strategic decision?

**Back:** Long-term impact, affects multiple teams/components, sets constraints for future decisions, expensive to reverse.

---

**#5**

**Front:** Give an example of a strategic decision.

**Back:** Choosing microservices vs. monolith architecture.

---

**#6**

**Front:** What characterizes a tactical decision?

**Back:** Short-term, affects single feature/component, localized impact, relatively easy to change later.

---

**#7**

**Front:** Give an example of a tactical decision.

**Back:** Choosing a specific notification library like react-toastify vs. sonner.

---

**#8**

**Front:** What defines a high-effort decision?

**Back:** Touches many parts of codebase, requires team coordination, needs extensive testing/migration, takes weeks or months.

---

**#9**

**Front:** Give an example of a high-effort decision.

**Back:** Adopting a new database technology (switching from PostgreSQL to MongoDB).

---

**#10**

**Front:** Give an example of a low-effort decision.

**Back:** Changing a UI color scheme from blue to green.

---

**#11**

**Front:** What is the most important spectrum for identifying architectural decisions?

**Back:** Whether the decision involves significant tradeoffs between competing quality attributes.

---

**#12**

**Front:** What tradeoffs exist between synchronous and asynchronous communication?

**Back:** Sync is simpler but can't handle real-time well. Async enables real-time but is more complex to implement and scale.

---

**#13**

**Front:** Give an example of a decision WITHOUT significant tradeoffs.

**Back:** Whether to separate List and ListItem components or combine them - both approaches work fine with minimal differences.

---

**#14**

**Front:** What tradeoffs come with implementing optimistic updates?

**Back:** Better UX and perceived performance vs. more complex error handling and state synchronization challenges.

---

**#15**

**Front:** What should you do with "in-between" decisions?

**Back:** Discuss with architects, document tradeoffs (ADR), get team alignment, review later.

---

**#16**

**Front:** Should architects be involved in all decisions?

**Back:** No, but they should be consulted on decisions with significant tradeoffs or strategic implications, even if just briefly.

---

**#17**

**Front:** Can tactical decisions become strategic?

**Back:** Yes, when they accumulate. For example, using 15 different notification libraries creates a strategic mess from tactical decisions.

---

**#18**

**Front:** Is high effort the same as architectural importance?

**Back:** No. Some low-effort decisions have huge consequences. Some high-effort tasks are tedious but not architectural.
