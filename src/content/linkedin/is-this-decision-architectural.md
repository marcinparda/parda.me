**"Should we schedule a meeting about this?"** - A question worth ask before going to implementation of a feature.

But how to determine if a decision is **architectural** or just a **tactical implementation detail**?

How to avoid losing time in endless meetings about trivial choices, or make costly mistakes that require expensive rework.

The problem? **Decisions aren't binary.** They exist on a spectrum from project-related to architectural-related.

Here's how to evaluate any decision using **3 key dimensions**:

**1 Strategic vs Tactical** 🎯
→ Does it affect multiple teams or just one component?
→ Can you easily reverse it later?
→ Example: Microservices vs monolith (strategic) vs. how structure of mockups should look like before we get an actual API for this specific endpoint (tactical)

**2 Required Effort** ⚙️
→ Does it touch many parts of the codebase?
→ Will it take weeks or just hours?
→ Warning: Don't confuse effort with importance - some low-effort decisions have huge consequences.

**3 Tradeoff Significance** ⚖️
→ This is the **most important** dimension.
→ Does it involve real tradeoffs between quality attributes?
→ Example: Optimistic updates = better UX vs. complex error handling

Still not sure where your decision lands? Then it's time to call an architect! They thrive in this gray area, helping teams navigate complex tradeoffs. These kind of conversations are exactly their job, love and superpower. And will know for future reviews if this type of decision should involve them or not.

I explored this topic in depth in the article, drawing from "Head First Software Architecture" and analyzing real decisions like implementing optimistic updates in React apps.

**Learn more:** https://www.parda.me/blog/is-this-decision-architectural/

#softwarearchitecture #softwaredevelopment #systemdesign #engineering #decisionmaking
