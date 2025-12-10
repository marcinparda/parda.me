---
title: "4 Dimensions of Software Architecture"
pubDate: 2025-11-01
tags: [software architecture, design, Head First]
---

This is the second post in a series where I share lessons from reading _"Head First Software Architecture"_ by Raju Gandhi, Mark Richards, and Neal Ford. In the [previous post](/posts/what-is-architecture), we explored what software architecture is. Now, let's dive into the framework that helps us actually design and evaluate architecture: **the 4 dimensions**.

## About the book

I picked up _"Head First Software Architecture"_ because it was part of a bundle, and I was eager to learn more about software architecture. What attracted me most was the **Head First approach** to learning - with visuals, engaging style, often exercises, and easy-to-understand examples.

And boy, **this book delivers**.

One thing that usually pushes me away from technical books are language-specific examples. I was often pushed away by fe. Java examples in books about general topics like architecture. If I wanted to read Java code, I would've bought a book about Java, lol.

But this book manages to keep examples accessible and relevant regardless of your tech stack.

## What are Dimensions of Architecture?

Software architecture isn't just about drawing boxes and arrows. _(Frontend isn't that either!)_ It's a **multi-dimensional problem space**. Sound scary, isn't it? Well in fact it _is_ hard, but if we take it step by step, it becomes manageable. The book introduces **four key dimensions** that architects must consider:

1. **Architectural Characteristics** - The "-ilities" (scalability, maintainability, security, etc.)
2. **Architectural Decisions** - The rules and constraints that guide development
3. **Logical Components** - The building blocks of the system
4. **Architectural Style** - The overall structure and pattern (microservices, layered, etc.)

Think of these as **different lenses** through which you view and shape your system. Missing any dimension means you're making architectural decisions _blindly_.

## Architectural Characteristics

Architectural characteristics are the **quality attributes** of a system - the non-functional requirements that describe _how_ the system should behave rather than _what_ it should do.

### Common characteristics include:

**Performance** - How fast does the system respond?

**Scalability** - Can the system handle growth?

**Security** - Is the system protected against threats?

**Maintainability** - How easy is it to change and extend?

**Reliability** - Does it work consistently?

**Testability** - Can we verify it works correctly?

### The problem with ignoring characteristics

Let's say you're building an e-commerce checkout system. You focus solely on functionality - adding items to cart, processing payments, sending confirmations. The code works perfectly in development.

Then **Black Friday hits**. Your single-server architecture can't handle the load. The payment processing blocks the UI thread. Users abandon carts. **Revenue is lost**.

**What went wrong?** You ignored architectural characteristics like scalability and performance, they are in most of the cases pushed to the side during development, until they _bite you in production_ so when is the right time to think about them? Obvious answer is **from the start**. If they are "more important" things to deliver like features I would suggest when you have first version of MVP ready for deploy and working, do a spike to test how your architecture holds under real world conditions, load tests, security tests etc. **Noones happy with a hanging website on product launch day**. You make good first impressions only once.

### Identifying characteristics for your system

Not all characteristics matter equally for every system. A personal blog doesn't need the same scalability as Netflix. A medical records system prioritizes security and reliability over bleeding-edge performance.

The key is identifying the most critical characteristics for _**your specific system**_ based on business requirements and user needs.

## Architectural Decisions

Architectural decisions are the **rules, guidelines, and constraints** that govern how developers build and modify the system. They're the _"laws"_ of your architecture. These decisions often stem from the desired architectural characteristics.

### Types of architectural decisions:

"We'll implement Back end for Frontend (BFF) pattern" - This is a decision about how frontend and backend communicate.

"We'll use WebSocket for real-time updates" - This is a technology choice driven by performance and users needs.

"We'll enforce automated testing on every new change to main branch" - This is a process decision to ensure reliability.

### Why we need explicit decisions

Without clear architectural decisions, every developer makes their own choices. This leads to inconsistency, technical debt, and systems that are hard to maintain.

For making architectural decisions explicit, consider using decision records (ADR - Architectural Decision Records). They document the context, decision, alternatives considered, and consequences. This creates a shared understanding among the team. I will write more about ADRs in future posts.

## Logical Components

Logical components are the building blocks of your system - the high-level modules that encapsulate specific functionality. They're not necessarily the same as physical deployment units or code modules.

### What are logical components?

Think of logical components as the major "areas of responsibility" in your system:

- **User Management Component** - Authentication, authorization, user profiles
- **Payment Processing Component** - Checkout, transactions, refunds
- **Inventory Component** - Product catalog, stock management
- **Notification Component** - Emails, SMS, push notifications

### Why logical components matter

Without clear component boundaries, you end up with a "big ball of mud" - code that's all tangled together. Changing one thing breaks something else. Testing requires loading the entire application. New features take forever to implement. Same goes with changing something.

### Identifying logical components

Good logical components:

1. **Have a single, clear purpose** (high cohesion)
2. **Depend minimally on other components** (loose coupling)
3. **Hide implementation details** (encapsulation)
4. **Are independently testable**

## Architectural Style

Architectural style is the overall structure and organization pattern for your system. It's the big-picture view of how components are arranged and how they communicate.

### Common architectural styles:

**Layered Architecture** - Organized in horizontal layers (presentation, business, data)

**Microservices/Microfrontends** - Independent, deployable services

**Event-Driven** - Components communicate via events

**Modular Monolith** - Monolithic app with well-defined modules

### Choosing the right style

The architectural style you choose depends on your characteristics and decisions:

- Need independent scaling? → Microservices
- Small team, simple app? → Monolithic
- Real-time updates? → Event-Driven
- Clear separation of concerns? → Layered

**There's no "best" style - only the right style for your specific context.**

## How the 4 Dimensions Work Together

These dimensions don't exist in isolation - they influence and constrain each other:

**Characteristics** drive **Decisions**:

- Need high security? → Decision: All data must be encrypted at rest
- Need scalability? → Decision: Stateless services only

**Decisions** influence **Components**:

- Decision: Single responsibility principle → Components: Break monolith into modules
- Decision: No shared state → Components: Each component manages its own data

**Components** shape **Style**:

- Many independent components → Style: Microservices
- Tightly coupled components → Style: Monolithic

**Style** enables **Characteristics**:

- Microservices → Better scalability
- Layered architecture → Better maintainability

## Summary (Flashcard)

The 4 dimensions of software architecture provide a complete framework for designing systems:

1. **Architectural Characteristics** - The quality attributes (performance, security, scalability)
2. **Architectural Decisions** - The rules and constraints that guide development
3. **Logical Components** - The building blocks that encapsulate functionality
4. **Architectural Style** - The overall structure and communication patterns

**Remember:** Good architecture considers all four dimensions together. Ignoring any dimension leads to incomplete, fragile systems that fail under real-world pressures.

---

That's all. I hope you enjoyed this article. Thanks for reading!

**Here's an addon for you.** Brief summary of an article in form of question & answer. You can use it to create fiches cards (e.g. in Anki).

### Flashcards

**#1**

**Front:** What are the 4 dimensions of software architecture?

**Back:** Architectural Characteristics, Architectural Decisions, Logical Components, Architectural Style.

---

**#2**

**Front:** What are architectural characteristics?

**Back:** Quality attributes describing how a system should behave (performance, scalability, security, maintainability).

---

**#3**

**Front:** Why do architectural characteristics matter?

**Back:** Ignoring them causes systems to fail in production under real-world conditions despite working in development.

---

**#4**

**Front:** What are architectural decisions?

**Back:** Rules, guidelines, and constraints that govern how developers build and modify the system.

---

**#5**

**Front:** Give an example of an architectural decision.

**Back:** "All data must be encrypted at rest" or "Use WebSocket for real-time updates."

---

**#6**

**Front:** What are logical components?

**Back:** High-level building blocks that encapsulate specific functionality (e.g., User Management, Payment Processing).

---

**#7**

**Front:** What makes a good logical component?

**Back:** Single clear purpose, minimal dependencies, hidden implementation details, independently testable.

---

**#8**

**Front:** What is architectural style?

**Back:** The overall structure and organization pattern of a system (e.g., microservices, layered, event-driven).

---

**#9**

**Front:** Name 4 common architectural styles.

**Back:** Layered, Microservices, Event-Driven, Modular Monolith.

---

**#10**

**Front:** How do characteristics influence decisions?

**Back:** Desired characteristics drive decisions (e.g., need security → decision to encrypt all data).

---

**#11**

**Front:** How do decisions influence components?

**Back:** Decisions shape component structure (e.g., single responsibility principle → break monolith into modules).

---

**#12**

**Front:** How do components shape style?

**Back:** Component organization determines architectural style (e.g., independent components → microservices).

---

**#13**

**Front:** How does style enable characteristics?

**Back:** Architectural style supports specific characteristics (e.g., microservices → better scalability).

---

**#14**

**Front:** What happens without clear component boundaries?

**Back:** You get a "big ball of mud" - tangled code where changes break things and testing is difficult.

---

**#15**

**Front:** What happens without explicit architectural decisions?

**Back:** Inconsistency, technical debt, and systems that are hard to maintain.

---

**#16**

**Front:** Do all characteristics matter equally for every system?

**Back:** No. Identify the most critical characteristics based on your specific business requirements and user needs.
