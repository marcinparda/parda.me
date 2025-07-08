---
title: TypeScript Enums: Yay or Nay?
pubDate: 2025-08-01 
tags: [TypeScript, Enums]
---

Typescript introduces `Enums` as a solution to group a related set of identifiers together in a meaningful way. Yet, this language feature come under a storm of criticism, with many arguing against using for various reasons. This article will shed some light on their symbolic nature, when to use them, and when to consider alternatives. 

## Symbolic Nature of TypeScript Enums

Enums in TypeScript, as mentioned above, are a means of grouping related identifiers for better readability and avoid cluttering. Essentially, an Enum in TypeScript allows us to define a set of named constants - a collection of related values that can be numeric or string values.

The core characteristic of TypeScript Enums is their symbolic nature, meaning the decisions about Enum's values are taken during runtime rather than compile-time. This means you can refer to Enum members in ways like static properties in classes or such.

Here's a basic example:
```typescript
enum RoleEnum {
  Administrator = 'ADMIN',
  Editor = 'EDITOR',
  Viewer = 'VIEWER'
}

```

These enumeration members are assigned string values, making them symbolic names for the corresponding values. More likely than not, you've used symbols like these when handling roles in an application with a permissions system.

## When TypeScript Enums are Yay

Leverage the symbolic nature of TypeScript Enums when dealing with constant sets, especially when these sets symbolize distinctive cases in an application. Think of roles, distinctive statuses. These are textually descriptive, intuitive, and they scream semantics. And, to demonstrate a great use-case let's have a look at a concrete example in a React application.

```typescript
// Constants
enum ThemeEnum {
  Light = 'light',
  Dark = 'dark'
}

// Context
const ThemeContext = createContext<ThemeEnum>(ThemeEnum.Light);

export const ThemeProvider: React.FC = ({ children }) => {
 
   const [theme, setTheme] = useState<ThemeEnum>(ThemeEnum.Light);

   const switchTheme = useCallback(() => {
      setTheme(prevTheme => prevTheme === ThemeEnum.Light ? ThemeEnum.Dark : ThemeEnum.Light);
   }, []);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

// Then in some component
const YourComponent: React.FC = () => {
    const theme = useContext(ThemeContext);
    
    return <div className={theme}>Your content here...</div>
```

Here Enums shine! Clear and intuitive usage. We avoid magic strings everywhere.

## When TypeScript Enums are Nay

On the flip side, Enums could really hurt when misused. Some developers argue TypeScript union types hence replacing enums with union types. However, in the process, some data is lost and makes it harder to debug and maintain and generally recommending against this move.

We cannot stress enough that it is crucial to avoid using TypeScript Enums for dynamic values. Let me illustrate through the below example why it might not be recommended.

```typescript
// Constants
enum StatusEnum {
  Success = 'Sucessful',
  Failure = 'Failed',
}

// Component 
const MyComponent: React.FC = () => {
  const [status, setStatus] = useState<string>("");

  // Assume the fetchStatus comes from an API
  const fetchStatus = async () => {
    const response = await fetch('yourAPI/endpoint');
    const data = await response.json();
    setStatus(data.status);
  };

  return (
    <div>
      {status === StatusEnum.Success
         ? 'Operation successfully completed!'
         : 'Operation failed! Please try again.'}
    </div>
 );
};

```

Here is the wrong usage indeed. The reason Enums (or at least most Enum usage!) are not suitable for such a design is due to their static nature while we are dealing with might-be dynamic values coming from that API endpoint.

## How to get yay scenarios every time

My advice is to use Enums when you have a fixed set of values that are not going to change at runtime. If you need to handle dynamic values, consider using union types or other alternatives like constants or objects. To make Enums more robust and less error-prone, you can use `JS Symbol` to create unique identifiers, which can help avoid potential conflicts with string values. For example:

```typescript
const TaskStatus = {
  Pending: Symbol('Pending'),
  InProgress: Symbol('InProgress'),
  Completed: Symbol('Completed')
};
```

I advice to write an custom eslint rule to enforce the usage of Enums with Symbols only. But be careful and think how you will work with enums from the API.

## Summary

TypeScript Enums provide a convenient way to group related constants - especially handy, given their human-readable nature. While their usage can be a matter of heated debate, what counts is whether their use benefits a particular use-case. Enums can print their value in case of API failure or sift them away at runtime- favoring clarity during debugging.

## Flashcards

**Front:** What is symbolic nature of TypeScript Enums? 

**Back:** Enums in TypeScript allow us to define a set of named constants - a collection of related values that can be numeric or string values. These Enums are static named constants that provide symbolic names for such set of values.