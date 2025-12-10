---
title: "What is Software Architecture?"
pubDate: 2025-10-01
tags: [software architecture, design, Head First]
---

This is the first post in a series where I share lessons from reading "Head First Software Architecture" by Raju Gandhi, Mark Richards, and Neal Ford. Each post will explore a specific concept from the book and how it applies to real-world development, especially in frontend and TypeScript contexts.

## About the book

I picked up "Head First Software Architecture" because it was part of a bundle, and I was eager to learn more about software architecture. What attracted me most was the Head First approach to learning - with visuals, engaging style, often exercises, and easy-to-understand examples.

And boy, this book delivers.

One thing that usually pushes me away from technical books are language-specific examples. I was often pushed away by fe. Java examples in books about general topics like architecture. If I wanted to read Java code, I would've bought a book about Java, lol.

But this book manages to keep examples accessible and relevant regardless of your tech stack.

## First, what is architecture definition?

There are a lot of definitions of software architecture floating around. The book mentions one from Martin Fowler:

> "The important stuff. The stuff that matters. The stuff that's hard to change."

I heard simillar definition over a year ago from Tomasz Ducin and it resonates with me.

You can find this quote on [Martin Fowler's architecture page](https://martinfowler.com/architecture).

This definition is simple and gets to the heart of what architecture really is. I would add only that these decisions are often technical, but not always - they're always business-related though. (Unfortunately, we developers are not the most important part of our application :(). That's how I understand it. So for me it is:

> "The important technical stuff. The stuff that matters for business and users. The stuff that's hard to change."

### Another architecture "building a house" analogy

Think about home architecture:

**The important stuff (hard to change):**

- Foundation
- Walls
- Roof
- Style of the house (industrial, renaissance, etc.)

These keep you safe, warm, and dry. If you want to move or rebuild the foundation or style later, it will be extremely costly and time-consuming.

**The less important stuff (easy to change):**

- Color of the walls
- Furniture
- Decorations

These things can be changed easily later without breaking the bank or tearing down walls.

### Architecture in frontend development

There is common misconception (remember that this is my opinion, and I will fight for this one!) that **architecture is picking major libraries and frameworks - React vs. Vue, Redux vs. MobX or folder structure. I disagree.** And I have a good reason for it. All of these choices are implementation details. Final users doesn't care if you used React or Vue, they care if the app works well, is fast, secure and easy to use (different users worries about different things of caurse). And if you can achive this by using React or Vue, because they are both great for creating SPA application, and SPA is what you need, then for me picking SPA is the architectural decision much more, than picking React or Vue.

But here is the thing - when we can tell what is the architectural decision, and what is the implementation detail? We will answer this question in next posts, but for short - none of them are really set in stone, some of the decisions are just more "architectural" and some are more "implementation". It's job of team and architect where to draw the line, because every project and requirements are different.

I will add one more example from frontend software architecture:

The important stuff is for example the choice of _what kind_ of state management approach we use: **centralized** (like Redux), **decentralized** (component state), or **hybrid**. This decision affects how your entire application handles data flow, debugging, and team collaboration.

What's less important? The specific library you choose (Redux, MobX, Zustand, Jotai). With good code abstractions and proper architectural boundaries, you can swap out the implementation library later with reasonable effort. Replacing whole state from centralized to decentralized - you'll be better starting this project from scratch.

## Summary

Software architecture is about identifying and designing **"the important technical stuff"** - the decisions that matter for business and that are expensive to change later.

Like a house's foundation, architectural decisions form the base upon which everything else is built.

**Remember:**

- 🏗️ Architecture = The hard-to-change decisions (state management approach, data flow patterns, SPA vs. SSR)
- 🔧 Tools = The easy-to-change implementations (Redux vs. Zustand, React vs. Vue)

---

That's all. I hope you enjoyed this article. Thanks for reading!

**Here's an addon for you.** Brief summary of an article in form of question & answer. You can use it to create fiches cards (e.g. in Anki).

### Flashcards

**#1**

**Front:** What is software architecture according to Martin Fowler?

**Back:** "The important stuff. The stuff that matters. The stuff that's hard to change." Architecture represents the foundational decisions that are costly to modify later, like choosing centralized vs. decentralized state management (hard to change) rather than specific library choices like Redux vs. Zustand (easier to change).

---

**#2**

**Front:** What's the difference between architectural decisions and implementation details in frontend development?

**Back:** Architectural decisions are hard-to-change choices that affect the entire system (e.g., SPA vs. SSR, centralized vs. decentralized state management, data flow patterns). Implementation details are easier-to-change choices (e.g., React vs. Vue, Redux vs. Zustand). With good abstractions, you can swap implementation details without redesigning the architecture.

---

**#3**

**Front:** Give an example of architectural decision using house building analogy.

**Back:** In house architecture, the foundation, walls, and roof are architectural decisions - hard and expensive to change. The color of walls, furniture, and decorations are implementation details - easy to change later. Similarly in software, choosing a state management approach is architectural, while choosing a specific library is an implementation detail.
