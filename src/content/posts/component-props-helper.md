---
title: Why You Shouldn't Forget About the ComponentProps<T> Type Helper
pubDate: 2024-07-01
tags: [react, props, typescript, 3rd-party-library]
---

Well… because I did. And I lost some valuable time because of it.

## Problem

Some time ago, I was using a 3rd party React library in my job project and I got quite upset. I had a number of components imported from this package, but most of them had no Props interface exported. And some of the components didn't have a Props interface at all. Something like this:

```tsx
const Button = ({isFocused, classNames}: any) => { ... }
```

or

```tsx
const StatusLED = ({isOn, color}: {isOn: boolean; color: string}) => { ... }
```

was a common practice. Part of my job was to take these 3rd party components and create new components based on them. Something like:

```tsx
interface MyIconButtonProps {
  isFocused: boolean;
  classNames: string;
  icon: string;
}
const MyIconButton = ({ isFocused, classNames, icon }: MyIconButtonProps) => {
  return (
    <div>
      <MyIcon icon={icon} />
      <Button isFocused={isFocused} classNames={classNames} />
    </div>
  );
};
```

You may already spot the problem. I had to create the `MyIconButtonProps` interface based on the props that the `Button` component takes. And I had to check what props `Button` takes by looking at the component implementation or documentation. That raised yet another problem - the `MyIconButtonProps` interface could quickly become outdated. If the `Button` component's props were to change, I would have to remember to update the `MyIconButtonProf` interface. And if I were to forget about it, the code would compile but the `Button` component would not work as expected.

## Solution

Then I remembered that something like `ComponentProps<T>` exists. What does it do? `ComponentProps<T>` is a helper type that extracts the props type from a component. It is defined as:

```tsx
type ComponentProps<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
> = T extends JSXElementConstructor<infer P>
  ? P
  : T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : {};
```

So I can use it like this:

```tsx
import { ComponentProps } from "react";
type MyIconButtonProps = ComponentProps<typeof Button> & { icon: string };
const MyIconButton = ({ icon, ...buttonProps }: MyIconButtonProps) => {
  return (
    <div>
      <MyIcon icon={icon} />
      <Button {...buttonProps} />
    </div>
  );
};
```

And that’s it. Now I don’t have to worry about the `MyIconButtonProps` interface becoming outdated. And I don't need to read implementation or documentation (which can be outdated too) anymore. Win-win.

## Other Problems

Of course, there are other use cases for the `ComponentProps<T>` helper. I will name a few common ones.

### Higher Order Components

If you are using higher order components, you may want to extract props from them. For example:

```tsx
const withLoading = <P extends object>(Component: React.ComponentType<P>) => {
  return ({
    isLoading,
    ...props
  }: { isLoading: boolean } & ComponentProps<typeof Component>) => {
    return isLoading ? <Loading /> : <Component {...(props as P)} />;
  };
};
```

### DOM Elements

You may want to extract props from DOM elements. For example:

```tsx
const MyInput = (props: ComponentProps<"input">) => {
  return <input {...props} className="my-input" />;
};
```

This way, `MyInput` will take all the props that the `input` element can take.

### Gathering Type of One Specific Prop

```tsx
type ButtonOnClick = ComponentProps<
  typeof ThirdLibraryComponent
>["onButtonClick"];
```

# Summary

And finally, a request for library owners: Please export your component props interfaces. Not for me or any of the people who know the `ComponentProps<T>` helper, but for people who haven’t heard or just forgot about it. You may say that I am a hypocrite because I didn't export my `MyIconButtonProps` interface. Well, that's because I don't want to expose implementation details outside of my component if it is not necessary. But in the case of 3rd party libraries, it is very helpful for the users.

That’s all. I hope you enjoyed this article. Thanks for spending your time here. Here’s an addon for you. A brief summary of the article. You can use it to create fiches cards (e.g., in Anki).

## What is ComponentProps<T> helper?

**ComponentProps<T>** is a helper type that extracts the props type from a component. It is defined as:

```tsx
type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;
```

Example usage:

```tsx
type MyIconButtonProps = ComponentProps<typeof Button> & { icon: string };
```
