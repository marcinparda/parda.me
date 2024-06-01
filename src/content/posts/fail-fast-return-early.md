---
title: Fail fast, return early
pubDate: 2024-06-01
tags: [react, design-patterns]
---

## Problem

Let's consider a React component that fetches data from an API and renders it conditionally:

```tsx
import React, { useState, useEffect } from 'react';
import { useFetchUser } from './api';

interface User {
  name: string;
  age: number;
}

interface Props {
  userId: string;
}

const UserProfile: React.FC<Props> = ({userId}) => {
  const { data: user, isLoading, isError } = useFetchUser(userId);

  return (
    {isLoading && <div>Loading...</div>}
    {isError && <div>There was a problem with fetching data.</div>}
    {!isLoading && !isError && user && (
      <div>
        <h1>User Profile</h1>
        <p>Name: {user.name}</p>
        <p>Age: {user.age}</p>
      </div>
    )}
  );
};
```

This doesn't look that bad, isn't it? For now no, but let's consider a more complex component with multiple props and state properties that could be undefined:

```tsx
import React, { useState, useEffect } from 'react';
import { useFetchUser, useFetchSettings } from './api';

interface User {
  name: string;
  age: number;
  role?: string;
  address?: {
    street: string;
    city: string;
    country: string;
  };
}

interface Settings {
  displayDetailsSettings?: {
    showAddress: boolean;
    showContacts: boolean;
  };
}

interface Props {
  userId: string;
}

const UserDetails: React.FC<Props> = ({ userId }) => {
  const { user, isLoading, isError } = useFetchUser(userId);
  const { 
    settings, 
    isLoading: isLoadingCurrentUser, 
    isError: isErrorCurrentUser 
  } = useFetchSettings();
  
  return (
    <>
    {(isLoading || isLoadingCurrentUser) && (<div>Loading...</div>)}
    {(isError || isErrorCurrentUser) && <div>There was a problem with fetching data.</div>}
    {
      !isLoading && 
      !isLoadingCurrentUser && 
      !isErrorCurrentUser && 
      !isError && 
      user && (
        <div>
          <h1>User Details</h1>
          <p>Name: {user.name}</p>
          <p>Age: {user.age}</p>
          {user.role ? <p>Role: {user.role}</p> : <p>No role</p>}
          {user.address ? (
            setting && 
            settings.displayDetailsSettings && 
            settings.displayDetailsSettings.showAddress
          ) ? (
            <p>
              Address: {user.address.street}, {user.address.city}, 
              {user.address.country}</p>
          ) : <p>User's address is hidden</p>
      ) : <p>No address</p>
    }
      </div>
    )}
    </>
  );
};
```

In this example, we have multiple checks for `undefined` values in the render method, making the code harder to read and maintain. Like, imagine the intern is about to make small changes to this code. She/he could be easly confused and break some of this checks. 

And I even put in this example complicated logic yet, just simple checks. Let's assume that now to addition we show only address only if current user is Admin AND has required permissions to read users address AND user didn't disable option to share his address with admins.

So what we can use to refactor this code?

## Fail fast, return early
The "fail fast, return early" pattern is a programming principle that suggests checking for invalid or error conditions as early as possible in a function or method, and returning immediately if those conditions are met. Here's an example of a simple TypeScript function that demonstrates the "fail fast, return early" pattern:

```ts
function conditionalAdding(a: number | undefined, b: number | undefined): number {
  if (a === undefined && b === undefined) {
    throw new Error('Invalid input: a or b must be defined');
  }
  if (a === undefined) {
    return b;
  }
  if (b === undefined) {
    return a;
  }
  return a + b;
}
```

This approach ensures that the function fails fast and doesn't continue with invalid input. On top of that return statement doesn't look like this `return a ? b ? a + b : a : b;` :D

## Solution
To apply the "fail fast, return early" pattern in our React component, we can move the checks for undefined values to the top of the component function and return early if any of the conditions are met:

```tsx
import React from 'react';
import { useFetchUser, useFetchSettings } from './api';

interface User {
  name: string;
  age: number;
  role?: string;
  address?: {
    street: string;
    city: string;
    country: string;
  };
}

interface Settings {
  displayDetailsSettings?: {
    showAddress: boolean;
    showContacts: boolean;
  };
}

interface Props {
  userId: string;
}

const UserRole: React.FC<{ 
  role: User['role'] | undefined 
}> = ({ role }) => (
  if (!role) {
    return <p>No role</p>;
  }
  
  return <p>Role: {role}</p>;
);

const UserAddress: React.FC<{ 
  address: User['address'] | undefined, 
  settings: Settings | undefined 
}> = ({ address, settings }) => (
  if (!address) {
    return <p>No address</p>;
  }

  if (
    !settings || 
    !settings.displayDetailsSettings || 
    !settings.displayDetailsSettings.showAddress
  ) {
    return <p>User's address is hidden</p>;
  }
  
  return <p>Address: {address.street}, {address.city}, {address.country}</p>;
);

const UserDetails: React.FC<Props> = ({ userId }) => {
  const { user, isLoading, isError } = useFetchUser(userId);
  const { 
    settings,
    isLoading: isLoadingCurrentUser,
    isError: isErrorCurrentUser
  } = useFetchSettings();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>There was a problem with fetching data.</div>;
  }

  if (!user) {
    return <div>There is user with provided id.</div>;
  }

  return (
    <div>
      <h1>User Details</h1>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <UserRole role={user.role} />
      <UserAddress address={user.address} settings={settings} />
    </div>
  );
};
```

Uff... Better, right? While refactoring this code, I already noticed that we have problem when checking `showAddress` in `UserAddress` component. The problem is when we don't have settings or `displayDetailsSettings` maybe we should different error message than `User's address is hidden`, because we don't know if is hidden, we only know that it's just not available.

So if I wouldn't recommend usage of ternary operator in `return` statements at all? I wouldn't go that far, but if we have two nested checks or complicated checks, it's better to use `if` statement for better readability and maintainability.

## Summary

That's all. I hope you enjoyed this article. Thanks for reading!

**Here's an addon for you.** Brief summary of an article. You can use it to create fiches cards (e.g. in Anki).

### What is return early pattern?

The *return early* pattern is a programming principle that suggests checking for invalid or error conditions as early as possible in a function or method, and returning immediately if those conditions are met.

Example:

```ts
function conditionalAdding(a: number | undefined, b: number | undefined): number {
  if (a === undefined && b === undefined) {
    throw new Error('Invalid input: a or b must be defined');
  }
  if (a === undefined) {
    return b;
  }
  if (b === undefined) {
    return a;
  }
  return a + b;
}
```
