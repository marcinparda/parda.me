---
title: How to write UI tests to be more resilient to changes
pubDate: 2024-02-18
tags: [testing, unit-testing]
---

## Problem

Have you ever written similar assertions?

```tsx
const { getByRole } = render(<Input />);
expect(getByRole("button")).toBeInTheDocument();
```

```tsx
const { getByText } = render(<Button />);
expect(getByText("Send this message")).toBeInTheDocument();
```

```tsx
const { getByLabelText } = render(<Label />);
expect(getByLabelText("Name")).toBeInTheDocument();
```

```tsx
const { container } = render(<Sidebar />);
expect(
  container.getElementsByClassName("wrapper-secondary"),
).toBeInTheDocument();
```

If you have, you might have noticed that these tests are sensitive to change.

- If you change role of the button from `button` to `submit`, the test will fail.
- If you change the text of the button from `Send this message` to `Send`, the test will fail.
- If you change the label of the input from `Name` to `Full name`, the test will fail.
- If you change or remove the class name of the wrapper from `wrapper-secondary`, the test will also fail.

## Solution

### What is `data-testid` and how to use it?

`data-testid` is an attribute that is used to select elements in the DOM. It is not a standard HTML attribute, but it is widely used in the testing community.

Here is an example of how you can use `data-testid` in jsx components:

```tsx
<Button data-testid="button" />
<Input data-testid="input" />
<Label data-testid="label" />
<Sidebar data-testid="sidebar" />
```

and in the tests you can use it like this to select elements:

```tsx
const { getByTestId } = render(<Button />);
expect(getByTestId("button")).toBeInTheDocument();
```

```tsx
const { getByTestId } = render(<Input />);
expect(getByTestId("input")).toBeInTheDocument();
```

```tsx
const { getByTestId } = render(<Label />);
expect(getByTestId("label")).toBeInTheDocument();
```

```tsx
const { getByTestId } = render(<Sidebar />);
expect(getByTestId("sidebar")).toBeInTheDocument();
```

### Why you should use `data-testid` for grabbing elements in the tests?

1. **It makes your tests more resilient to changes.** If you change the text of the button from `Send this message` to `Send`, you don't have to change the test.
2. **It makes your tests more readable.** You can easily understand what the test is about by looking at the `data-testid` attribute.

### Why you should not use `data-testid` for grabbing elements in the tests?

There is an argument that:

> Using data-testid attributes do not resemble how your software is used and should be avoided if possible.

[Source of this argument](https://testing-library.com/docs/queries/bytestid/)

But I don't really buy this argument. I think that the benefits of using `data-testid` outweigh this minor drawback.

### What if I want to test accessibility or semantic tags?

You can use `data-testid` in combination with other selectors. For example:

```tsx
<Button data-testid="button" aria-label="Send this message" />
```

```tsx
const { getByTestId, getByLabelText } = render(<Button />);
const button = getByTestId("button");
expect(button).toBeInTheDocument();
expect(button).toHaveAttribute("aria-label", "Send this message");
```

## Summary

That's all. I hope you enjoyed this article. If you have any questions, feel free to ask them in the comments.

**Here's an addon for you.** Brief summary of an article. You can use it to create fiches cards (e.g. in Anki).

### What is `data-testid` and how to use it?

`data-testid` is an attribute that is used to select elements in the DOM. It is not a standard HTML attribute, but it is widely used in the testing community.

Example of how you can use `data-testid` in jsx components:

```tsx
<Button data-testid="button" />
```

```tsx
const { getByTestId } = render(<Button />);
expect(getByTestId("button")).toBeInTheDocument();
```
