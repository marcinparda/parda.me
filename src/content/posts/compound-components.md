---
title: "Implementing Compound Components Using React Context"
pubDate: 2023-03-26
tags:
  [
    compund-components,
    react,
    design-patterns,
    react-context,
    component-composition,
  ]
---

# Problem

In the [previous article](/blog/component-composition), I showed you how to avoid passing dozens of props to components using the **Compound Components** pattern. However, we encountered a few issues:

> - We added a new layer of abstraction that needs to be remembered and known to exist. It would be helpful to document it as well.
> - We don't know exactly which components to use in the `Panel` if we want the whole component to look consistent and function correctly. Some syntax hints would be useful to tell us what we should use in the `Panel`, don't you think? :)
> - If we want the components to communicate with each other, e.g., hide the entire `Panel` by clicking a button in the `PanelHeader`, we would have to pass additional props to the components (`handleClick`, `isPanelVisible`).

# Solution

## Compound Components Using React Context

A compound component is a pattern for creating reusable components that consist of multiple smaller components.

In a compound component, the main parent component provides a set of child components that work together to implement the overall functionality of the parent component.

In the previous article, we created a `Panel` component that looked like this:

```tsx
<Panel title="Panel">
  <PanelHeader>
    <h3>Header</h3>
  </PanelHeader>
  <PanelBody>
    <p>Body</p>
  </PanelBody>
</Panel>
```

First of all, let's fix this problem:

> - We don't know exactly which components to use in the `Panel` if we want the whole component to look consistent and function correctly. Some syntax hints would be useful to tell us what we should use in the `Panel`, don't you think? :)

To do this, we just need to apply this syntax in our `Panel` component:

```tsx
Panel.Header = function PanelHeader({ children }: ParentProps) {
  return <header>{children}</header>;
};
```

By doing this, in our editor, when we type `Panel.` and press `CTRL + Space`, we should get a list of all the components that we can use in the `Panel`.
This allows us to use it like this:

```tsx
<Panel title="Panel">
  <Panel.Header>
    <h3>Header</h3>
  </Panel.Header>
  <Panel.Body>
    <p>Body</p>
  </Panel.Body>
</Panel>
```

This solves our first problem. Additionally, this code is better documented. In one file, we have a list of child components that we should use within the `<Panel>` tags. Let's move on to the **second problem**:

> - If we want the components to communicate with each other, e.g., hide the entire `Panel` by clicking a button in the `PanelHeader`, we would have to pass additional props to the components (`handleClick`, `isPanelVisible`).

How can we achieve this without adding too many props? Here comes React Context to the rescue. If you're not familiar with React Context, I recommend reading [this article](https://react.dev/learn/passing-data-deeply-with-context) from the official React documentation.

First, let's define the `PanelContext` for our panel:

```tsx
interface PanelContextValue {
  isVisible: boolean;
  showPanel: () => void;
  hidePanel: () => void;
}

const PanelContext = React.createContext({} as PanelContextValue);
```

In this context, we will store data about whether the `Panel` is visible and two functions that will change the visibility of the panel.

The next thing to do is to add state and a `Provider` to the parent `Panel` component.

```tsx
export const Panel = ({ title, children }: PanelProps & ParentProps) => {
  const [isVisible, toggleVisibility] = React.useState(false);
  const showPanel = () => toggleVisibility(true);
  const hidePanel = () => toggleVisibility(false);

  if (!isVisible) return <button onClick={showPanel}>Show Panel</button>;

  return (
    <PanelContext.Provider value={{ isVisible, showPanel, hidePanel }}>
      <div>
        <h1>{title}</h1>
        {children}
      </div>
    </PanelContext.Provider>
  );
};
```

If the panel is not visible, we will display a button that will show the panel when clicked. The last step is to use the values from the Provider in the child components.

Let's now refactor `Panel.Header` so that it can hide the entire panel without passing props to this component:

```tsx
Panel.Header = function Header({ children }: ParentProps) {
  const { hidePanel } = useContext(PanelContext);
  return (
    <header>
      {children}
      <button onClick={hidePanel}>Hide Panel</button>
    </header>
  );
};
```

This way, we pass the ability to change the state of the `Panel` to the header, leaving only the children as props. We can pass the appropriate functionality to other sub-components in a similar way.

The final `Panel.tsx` file now looks like this:

```tsx
import React from "react";

interface PanelProps {
  title: string;
}

interface ParentProps {
  children: React.ReactNode;
}

interface PanelContextValue {
  isVisible: boolean;
  showPanel: () => void;
  hidePanel: () => void;
}

const PanelContext = React.createContext({} as PanelContextValue);

export const Panel = ({ title, children }: PanelProps & ParentProps) => {
  const [isVisible, toggleVisibility] = React.useState(false);
  const showPanel = () => toggleVisibility(true);
  const hidePanel = () => toggleVisibility(false);

  if (!isVisible) return <button onClick={showPanel}>Show Panel</button>;

  return (
    <PanelContext.Provider value={{ isVisible, showPanel, hidePanel }}>
      <div>
        <h1>{title}</h1>
        {children}
      </div>
    </PanelContext.Provider>
  );
};

Panel.Header = function Header({ children }: ParentProps) {
  const { hidePanel } = React.useContext(PanelContext);
  return (
    <header>
      {children}
      <button onClick={hidePanel}>Hide Panel</button>
    </header>
  );
};

Panel.Body = function Body({ children }: ParentProps) {
  return <main>{children}</main>;
};
```

And its usage has not changed since the last code snippet, even though we added new functionality:

```tsx
<Panel title="Panel">
  <Panel.Header>
    <h3>Header</h3>
  </Panel.Header>
  <Panel.Body>
    <p>Body</p>
  </Panel.Body>
</Panel>
```

# Summary

That's it. I hope you enjoyed this article. If you have any questions, feel free to ask them in the comments.

**Here's an addendum for you.** A brief summary of the article. You can use it to create flashcards (e.g. in Anki).

## What is a compound component?

A **compound component** is a component that consists of multiple subcomponents. The subcomponents are usually combined together to create a more complex component that performs a more complex function.

Example:

```tsx
<Panel title="Panel">
  <Panel.Header>
    <h3>Header</h3>
  </Panel.Header>
  <Panel.Body>
    <p>Body</p>
  </Panel.Body>
</Panel>
```
