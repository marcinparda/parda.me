---
title: DO NOT style external library components to adjust layout
pubDate: 2025-09-01
tags: [react, UI libraries, styling, maintainability]
---

We've all been there - you're integrating a UI library like Material-UI or Ant Design with your custom styling solution like Tailwind CSS, and the components don't quite match your design. The quickest fix seems to be slapping some margin classes directly onto the library component.
While this often works in the short term, it introduces hidden complexity that can negatively affect maintainability and flexibility later.

## Problem

Suppose you want to slightly adjust the spacing of a Material-UI Button when styled with Tailwind CSS:

```tsx
import { Button } from "@mui/material";

const UserInfoForm = () => {
  return (
    <form>
      <input type="email" placeholder="Email" />
      <input type="text" placeholder="Username" />
      {/* Quick fix: margin-top applied directly */}
      <Button className="mt-4" variant="contained" type="submit">
        Save
      </Button>
    </form>
  );
};
```

This looks fine initially. However, problems arise when the component is reused in different contexts:

```tsx
const UserProfile = () => {
  return (
    <div className="profile-container">
      {/* UserInfoForm enforces its own margin */}
      <UserInfoForm />
      {/* CarInfoForm has different spacing logic */}
      <CarInfoForm />
    </div>
  );
};
```

The margin is now “baked in,” making it difficult to adapt the component across varied layouts without adding extra conditional props, which clutters the component API.

This tight coupling of external components and layout introduces **maintenance overhead**: replacing MUI with another library, applying different design systems, or creating reusable form patterns becomes unnecessarily complex.

### Why direct styling of library components causes problems

External UI libraries are designed with clear boundaries:

- **Internal styling (appearance):** colors, typography, borders, hover or focus states - these belong to the component implementation and can often be customized with themes or style overrides.
- **Layout (positioning in its parent container):** margins, alignment, and spacing rules - not intrinsic to the component, but determined by the context in which it is used.

When we blur these boundaries by applying layout styles directly to library components, two issues arise:

1. **Reduced reusability and flexibility** – The component cannot adapt easily across different containers or layout systems.
2. **Increased maintenance overhead** – Future changes (switching libraries, refactoring layout systems, redesigns) require untangling layout rules embedded deep in component instances.

Put differently, it’s not just “technical debt that will bite you later” - it increases complexity every time you need to use the component in a new context.

## Solution

Instead of styling the library button directly, wrap it in a container responsible for spacing:

```tsx
import { Button } from "@mui/material";

const UserInfoForm = () => {
  return (
    <form>
      <input type="email" placeholder="Email" />
      <input type="text" placeholder="Username" />
      {/* Properly isolating layout */}
      <div className="mt-4">
        <Button variant="contained" type="submit">
          Save
        </Button>
      </div>
    </form>
  );
};
```

### Advantages:

1. **Separation of concerns** – Layout and appearance are clearly decoupled.
2. **Predictable replacement** – If you switch from MUI Button to another one, the surrounding layout wrapper still ensures consistent spacing.
3. **Scalability** – Buttons can be reused in multiple forms or sections without carrying layout assumptions.

### When to use theming or `styleOverrides`

For appearance-level customization (e.g., border radius, text casing, colors), prefer the library’s **theming system**:

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
        },
      },
    },
  },
});
```

This allows you to control visual identity globally without leaking layout rules into the component.

For specific use cases (e.g., a custom `Select` with larger padding), consider **wrapper components** that extend the base API while encapsulating additional styles.

```tsx
import { Select, MenuItem } from "@mui/material";

const SelectBigPadding = ({ children, ...props }) => {
  return (
    <Select {...props} className="[&_.MuiMenuItem-root]:p-4">
      {children}
    </Select>
  );
};

// Usage:
const UserSettingsForm = () => {
  return (
    <SelectBigPadding value={selectedOption} onChange={handleChange}>
      <MenuItem value="option1">Option 1</MenuItem>
      <MenuItem value="option2">Option 2</MenuItem>
    </SelectBigPadding>
  );
};
```

### The nuance: padding vs margins

In the spacing debate, padding tends to be more predictable because it avoids **margin collapse**. In CSS, if two adjacent elements both have vertical margins, the browser doesn’t add them together - instead, the larger of the two margins is applied. This often produces surprises when stacking components.

Padding, on the other hand, is included inside the component’s box, so two padded elements always stack consistently.

However, there is an important distinction:

- **Padding** is internal spacing - it pushes content inward inside a component’s boundary.
- **Margin** is external spacing - it defines how the component relates to neighboring elements.

Best practice:

- Use **padding** for internal consistency and predictable stacking.
- Use **margins sparingly** when you truly need spacing external to the component (for example, vertical rhythm in a container).

### Before vs After

**Before (with margin in the component):**

```tsx
<Button className="mt-4" variant="contained" type="submit">
  Save
</Button>
```

**After (with wrapper handling layout):**

```tsx
<div className="mt-4">
  <Button variant="contained" type="submit">
    Save
  </Button>
</div>
```

This small change significantly improves flexibility and maintainability.

## Summary

- Avoid adding **layout styles (e.g., margins, positioning)** directly to external library components.
- Keep **layout external** (with wrappers, containers), and **appearance internal** (via theming, overrides).
- Padding is often safer than margins thanks to margin collapse rules, but both have their place: use padding for inner spacing, margin when external spacing is unavoidable.

That's all. I hope you enjoyed this article. Thanks for reading!

**Here's an addon for you.** Brief summary of an article. You can use it to create fiches cards (e.g. in Anki).

**Flashcard 1**  
**Front:** How should you handle layout styling for external library components?  
**Back:** Never add layout styles (margins, positioning) directly to library components. Keep layout external (via wrappers/containers) while using theming or overrides for internal styling.

**Flashcard 2**  
**Front:** What’s the difference between layout and appearance in UI components?  
**Back:** Layout determines how a component is positioned in its container (margins, alignment), while appearance controls the component’s visual details (colors, borders, typography).

**Flashcard 3**
**Front:** Why is styling external components directly with margins problematic?  
**Back:** It couples layout with the component, reducing reusability, making redesigns harder, and increasing maintenance overhead.

**Flashcard 4**  
**Front:** What is CSS margin collapse?  
**Back:** When two vertical margins meet, they don’t add together; instead, the larger one is applied. This can cause unpredictable spacing issues.

**Flashcard 5**
**Front:** Why is padding often safer than margin for consistent spacing?  
**Back:** Padding is internal, so values always add up predictably and don’t collapse like margins.

**Flashcard 6**  
**Front:** How can you extend external library components with additional styles safely?  
**Back:** Wrap them in custom wrapper components that preserve the original API but apply customized appearance rules (e.g., `SelectBigPadding`).
