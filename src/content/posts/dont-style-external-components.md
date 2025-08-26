---
title: DO NOT style external library components to adjust layout
pubDate: 2025-09-01
tags: [react, UI libraries, styling, maintainability]
---

We've all been there - you're integrating a UI library like Material-UI or Ant Design with your custom styling solution like Tailwind CSS, and the components don't quite match your design. The quickest fix seems to be slapping some margin classes directly onto the library component. But this approach creates technical debt that will bite you later.

## Problem

Let's say you're working with Material-UI and Tailwind CSS. You need to add some spacing to a MUI Button to match your design:

```tsx
import { Button } from "@mui/material";

const UserInfoForm = () => {
  return (
    <form>
      <input type="email" placeholder="Email" />
      <input type="text" placeholder="Username" />
      {/* Quick fix: add margin-top directly to MUI Button */}
      <Button className="mt-4" variant="contained" type="submit">
        Save
      </Button>
    </form>
  );
};
```

This works fine initially. But now imagine you want to reuse this form in different layouts with different spacing requirements. The `UserInfoForm` will be heavily reused across your app:

```tsx
const UserProfile = () => {
  return (
    <div className="profile-container">
      {/* UserInfoForm with its baked-in mt-4 margin */}
      <UserInfoForm />
      {/* CarInfoForm needs has default spacing and spacing is inconsistent */}
      <CarInfoForm />
    </div>
  );
};
```

What can you do? Add a prop to conditionally remove the class? Its better to write maintainable code instead. Let's start with understanding why this approach is wrong.

## Styling external components is in general wrong

Library owners design their components to be as reusable as possible across different projects and use cases. When you inject custom classes or styles directly into library components, you're working against their intended design philosophy.

The better solution is wrapping the component in a container element:

```tsx
import { Button } from "@mui/material";

const UserInfoForm = () => {
  return (
    <form>
      <input type="email" placeholder="Email" />
      <input type="text" placeholder="Username" />
      {/* Wrap in div to control layout */}
      <div className="mt-4">
        <Button variant="contained" type="submit">
          Save
        </Button>
      </div>
    </form>
  );
};
```

This approach offers several key advantages:

1. **Separation of concerns**: Layout logic stays separate from the component's internal styling.

2. **Component boundaries**: The button maintains its original design while the wrapper controls layout. If you replace the MUI Button with a different library's button, it will display in the exact same position.

3. **Easy portability**: You can copy this button to other components without worrying about removing layout-specific classes.

## What to do if you need to style external components?

Before modifying external components directly, check if the library provides theming capabilities. Most mature UI libraries offer theme providers for global customization:

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Remove uppercase
          borderRadius: "8px", // Custom border radius
        },
      },
    },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <YourApp />
  </ThemeProvider>
);
```

You can have multiple ThemeProviders if needed, with child providers extending parent themes.

But what if theming doesn't solve your problem? For instance, you have a dropdown where the select options need bigger padding than the theme provides. In this case, create a custom wrapper component:

```tsx
import { Select, MenuItem } from "@mui/material";

const SelectBigPadding = ({ children, ...props }) => {
  return (
    <Select {...props} className="[&_.MuiMenuItem-root]:p-4">
      {children}
    </Select>
  );
};

// Use it exactly like the original MUI Select
const UserSettingsForm = () => {
  return (
    <SelectBigPadding value={selectedOption} onChange={handleChange}>
      <MenuItem value="option1">Option 1</MenuItem>
      <MenuItem value="option2">Option 2</MenuItem>
    </SelectBigPadding>
  );
};
```

This way you get the benefit of customization while keeping the original component's API intact.

## Padding over margins

BTW. When adjusting spacing, I prefer and recommend using padding instead of margins. Padding keeps the component's layout intact and avoids collapsing margin issues. Sometimes you have two elements with padding/margins next to each other. If both have margins, they collapse into one margin. For me it is more predictable to use paddings which always add up.

## Solution

Here's how our user info form looks with proper layout separation:

**Before:**

```tsx
const UserInfoForm = () => {
  return (
    <form>
      <input type="email" placeholder="Email" />
      <input type="text" placeholder="Username" />
      <Button className="mt-4" variant="contained" type="submit">
        Save
      </Button>
    </form>
  );
};
```

**After:**

```tsx
const UserInfoForm = () => {
  return (
    <form>
      <input type="email" placeholder="Email" />
      <input type="text" placeholder="Username" />
      <div className="mt-4">
        <Button variant="contained" type="submit">
          Save
        </Button>
      </div>
    </form>
  );
};
```

This approach prepares better layout boundaries for external elements. The button remains pure and reusable, while layout concerns are handled by the wrapper.

## Summary

Avoid adding layout styles directly to external library components. Use wrapper elements to control spacing and positioning instead. This maintains component boundaries, improves reusability, and prevents tight coupling between layout and component logic.

That's all. I hope you enjoyed this article. Thanks for reading!

**Here's an addon for you.** Brief summary of an article. You can use it to create fiches cards (e.g. in Anki).

**Front:** How should you handle layout styling for external library components?

**Back:** Never add layout styles (margins, positioning) directly to library components. Instead, wrap them in container elements (div, section) that handle layout concerns. This preserves component boundaries, improves reusability, and prevents coupling between layout and component logic.
