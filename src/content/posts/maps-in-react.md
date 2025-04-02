---
title: Should you use JS Maps in React?
pubDate: 2025-04-01 
tags: [react, JS Maps]
---

If you are familliar with Maps in JS and want to learn how to use them in React, you can skip to the section [Maps in React](#maps-in-react).

## Maps in JS

### What are Maps in JS?

JS Maps are built-in objects that store collections of key-value pairs.
A Map is created using the Map constructor and manipulated through its built-in methods:

```typescript
// Creating an empty Map
const permissionMap = new Map<string, string | string[]>();

// Creating a Map with initial values
type Permission = "create" | "read" | "update" | "delete";
type Role = "admin" | "editor" | "viewer";

const rolePermissionMap = new Map<Role, Permission[]>([
  ["admin", ["create", "read", "update", "delete"]],
  ["editor", ["read", "update"]],
  ["viewer", ["read"]],
]);

console.log(rolePermissionMap.get("editor")); // ['read', 'update']
console.log(rolePermissionMap.size); // 3
```

Maps establish a clear relationship between keys and values, making them perfect for things like modeling permission systems where we need to associate features with allowed user roles.

### Why to use maps in JS?

Maps offer several distinct advantages compared to JS objects:

- Maps are optimized for frequent additions and lookups
- Maps are iterable, making them easy to loop over
- Maps provide specialized methods for working with collections
- Maps are more performant than objects for large collections
- Maps track their size with the built-in size property
- Maps preserve insertion order of elements

So the main advantages are:

- **Performance**: Maps are optimized for frequent additions and lookups, with near constant-time complexity for most operations.
- **Clarity**: Maps provide intuitive methods like has(), get(), and set() that make permission checking code more readable and intentional.

So they are super helpful especially when we need to get a value by a key, or check if a key exists in a collection very often.

For permission management specifically, Maps provide a cleaner syntax for checking if a permission exists:

```typescript
// Using an object
interface PermissionsObj {
  [role: string]: string[];
}

const permissionsObj: PermissionsObj = {
  admin: ["create", "read", "update", "delete"],
  editor: ["read", "update"],
};
// Check if a role exists (less intuitive)
const hasRole: boolean = "editor" in permissionsObj;

// Using a Map
type Role = "admin" | "editor" | "viewer";
type Permission = "create" | "read" | "update" | "delete";

const permissionsMap = new Map<Role, Permission[]>([
  ["admin", ["create", "read", "update", "delete"]],
  ["editor", ["read", "update"]],
]);
// Check if a role exists (more intuitive)
const hasRole: boolean = permissionsMap.has("editor");
```

This clarity becomes increasingly valuable as permission logic grows more complex.

### How to use maps in JS?

Basic Map Operations:

```typescript
type Feature = "deleteUsers" | "editContent";
type Role = "admin" | "editor" | "viewer";

const permissionMap = new Map<Feature, Role | Role[]>();

// Adding entries
permissionMap.set("deleteUsers", "admin");
permissionMap.set("editContent", ["admin", "editor"]);

// Checking for permissions
permissionMap.has("deleteUsers"); // true
permissionMap.get("editContent"); // ['admin', 'editor']

// Removing entries
permissionMap.delete("deleteUsers");

// Getting the size
console.log(permissionMap.size);
```

Iterating through Maps:

```typescript
const permissionMap = new Map<Feature, Role | Role[]>();

// Using forEach
permissionMap.forEach((permissions: Role | Role[], feature: Feature) => {
  console.log(`Feature: ${feature}, Allowed roles: ${permissions}`);
});

// Using for...of with entries()
for (const [feature, permissions] of permissionMap.entries()) {
  console.log(`Feature: ${feature}, Allowed roles: ${permissions}`);
}

// Getting all keys (features)
const features: Feature[] = [...permissionMap.keys()];

// Getting all values (permissions)
const allPermissions: (Role | Role[])[] = [...permissionMap.values()];
```

Creating a Permission Checker:

```typescript
type Feature = "dashboard" | "userManagement" | "contentEditor" | "reports";
type Role = "admin" | "editor" | "viewer";

function createPermissionChecker(
  userRole: Role,
  permissionMap: Map<Feature, Role | Role[]>,
): (feature: Feature) => boolean {
  return function canAccess(feature: Feature): boolean {
    if (!permissionMap.has(feature)) {
      return false;
    }

    const allowedRoles = permissionMap.get(feature);
    return Array.isArray(allowedRoles)
      ? allowedRoles.includes(userRole)
      : allowedRoles === userRole;
  };
}

// Usage
const featurePermissionMap = new Map<Feature, Role | Role[]>([
  ["dashboard", ["admin", "editor", "viewer"]],
  ["userManagement", "admin"],
  ["contentEditor", ["admin", "editor"]],
  ["reports", ["admin", "viewer"]],
]);

const userRole: Role = "editor";
const canUserAccess = createPermissionChecker(userRole, featurePermissionMap);

console.log(canUserAccess("dashboard")); // true
console.log(canUserAccess("userManagement")); // false
console.log(canUserAccess("contentEditor")); // true
```

This approach creates a clean, reusable permission system that can be easily adapted for different parts of your application.

## Maps in React

### How to use maps in React?

While Maps themselves aren't React-specific, they complement React's state management and declarative rendering approach.

Maps can be stored and utilized in React in several ways:

- As `component state` via the `useState` hook
- Within `context providers` for application-wide data sharing
- As a piece of data that values are often checked against in `conditional rendering`

Here's a basic example of incorporating Maps into a React component:

```tsx
import React, { useState, useEffect } from "react";

type PermissionKey =
  | "dashboard"
  | "userManagement"
  | "contentEditor"
  | "reports";
type UserRole = "admin" | "editor" | "viewer";

function PermissionAwareApp(): JSX.Element {
  const [permissionMap, setPermissionMap] = useState<
    Map<PermissionKey, UserRole[]>
  >(new Map());
  const [userRole, setUserRole] = useState<UserRole>("viewer");

  useEffect(() => {
    const permissions = getPermissions();
    setPermissionMap(permissions);
  }, []);

  // Check if user can access a feature
  const canAccess = (feature: PermissionKey): boolean => {
    if (!permissionMap.has(feature)) {
      return false;
    }
    const allowedRoles = permissionMap.get(feature);
    return allowedRoles ? allowedRoles.includes(userRole) : false;
  };

  return (
    <div>
      <h1>My Application</h1>

      {canAccess("dashboard") && <div>Dashboard Content</div>}
      {canAccess("userManagement") && <div>User Management</div>}
    </div>
  );
}
```

This pattern allows for clean, permission-based conditional rendering throughout the application.

### Maps, Immutability, and React's Change Detection

When using Maps as React state, it's crucial to understand how React detects changes to determine when to re-render components.

#### How React Detects State Changes

React uses a shallow comparison (`Object.is` or `===`) to detect if state has changed between renders. For objects and collections like Maps, this means React only compares references, not the content inside.

```tsx
// This comparison is what React essentially does between renders
prevState === newState; // If false -> re-render, if true -> skip render
```

This has major implications when working with Maps in React:

```tsx
function BadMapUpdates() {
  const [permissionMap, setPermissionMap] = useState<Map<string, string[]>>(
    new Map([["admin", ["create", "delete"]]]),
  );

  // ❌ WRONG: This mutation won't trigger a re-render!
  const addPermissionIncorrectly = () => {
    permissionMap.set("admin", [...permissionMap.get("admin")!, "update"]);
    // React won't detect this change because the Map reference is the same
  };

  // ✅ CORRECT: Create a new Map instance
  const addPermissionCorrectly = () => {
    setPermissionMap((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set("admin", [...(prevMap.get("admin") || []), "update"]);
      return newMap;
    });
  };

  return (
    <div>
      <button onClick={addPermissionCorrectly}>Add Permission</button>
      <pre>{JSON.stringify([...permissionMap], null, 2)}</pre>
    </div>
  );
}
```

#### Common Patterns for Immutable Map Updates

Here are some tested patterns for working with Maps immutably in React:

1. **Adding or updating entries:**

```tsx
setPermissionMap((prevMap) => {
  const newMap = new Map(prevMap);
  newMap.set(key, value);
  return newMap;
});
```

2. **Removing entries:**

```tsx
setPermissionMap((prevMap) => {
  const newMap = new Map(prevMap);
  newMap.delete(key);
  return newMap;
});
```

3. **Modifying values within nested arrays in Maps:**

```tsx
setPermissionMap((prevMap) => {
  const newMap = new Map(prevMap);
  const existingValue = prevMap.get(key) || [];
  newMap.set(key, [...existingValue, newItem]);
  return newMap;
});
```

#### Performance Considerations

Because creating new Map copies can be expensive for large collections, consider these optimization strategies:

1. **Memoization** - Use React's `useMemo` to avoid unnecessary Map recreation
2. **Batch updates** - Perform multiple Map changes at once rather than in separate state updates
3. **Structuring data** - For complex permissions, consider a nested structure of multiple smaller Maps instead of one large one

```tsx
// Using useMemo to optimize Map creation
const permissionMap = useMemo(() => {
  const map = new Map<Feature, Role[]>();
  // Populate map based on data
  return map;
}, [data]); // Only recreate when data changes
```

While Maps provide near constant-time lookups due to their highly optimized implementation, the actual performance gains depend on the context and the size of the data being handled. In some cases, especially with small datasets or infrequent operations, the benefits may be marginal. Real-world improvements should be measured on a case-by-case basis.

Remember: the key benefit of Maps (O(1) lookup time) remains intact despite creating new instances, which is why they're still preferable to objects for frequent lookups even with the immutability requirement.

### How to use maps in React on permission-based feature toggling example

Now we will dive into implementing a permission-based features toggle system in React using Maps. So we will check if a user has permission to access a specific feature and render the UI accordingly.

1. Creating a Permission Context:

```tsx
// PermissionContext.ts
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type PermissionKey =
  | "dashboard"
  | "userManagement"
  | "contentEditor"
  | "reports"
  | "editUsers"
  | "deleteUsers"
  | "viewContent"
  | "editContent"
  | "deleteContent"
  | "createContent";
type UserRole = "admin" | "editor" | "viewer";

interface PermissionContextType {
  permissionMap: Map<PermissionKey, UserRole[]>;
  canAccess: (feature: PermissionKey) => boolean;
  userRole: UserRole;
}

interface PermissionProviderProps {
  children: ReactNode;
  userRole: UserRole;
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined,
);

export function PermissionProvider({
  children,
  userRole,
}: PermissionProviderProps): JSX.Element {
  const [permissionMap, setPermissionMap] = useState<
    Map<PermissionKey, UserRole[]>
  >(new Map());

  useEffect(() => {
    const permissions = getPermissions();
    setPermissionMap(permissions);
  }, []);

  const canAccess = (feature: PermissionKey): boolean => {
    if (!permissionMap.has(feature)) return false;
    const allowedRoles = permissionMap.get(feature);
    return allowedRoles ? allowedRoles.includes(userRole) : false;
  };

  return (
    <PermissionContext.Provider value={{ permissionMap, canAccess, userRole }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermission(): PermissionContextType {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error("usePermission must be used within a PermissionProvider");
  }
  return context;
}
```

2. Using the Permission Context in the App:

```tsx
// App.tsx
import React from "react";
import { PermissionProvider } from "./PermissionContext";
import Dashboard from "./Dashboard";
import UserManagement from "./UserManagement";
import ContentEditor from "./ContentEditor";
import { UserRole } from "./types";

function App(): JSX.Element {
  // This could come from authentication service
  const userRole: UserRole = "editor";

  return (
    <PermissionProvider userRole={userRole}>
      <div className="app">
        <header>
          <h1>Feature-Toggled Application</h1>
          <p>Logged in as: {userRole}</p>
        </header>
        <main>
          <Dashboard />
          <UserManagement />
          <ContentEditor />
        </main>
      </div>
    </PermissionProvider>
  );
}

export default App;
```

3. Creating Permission-Aware Components:

```tsx
// UserManagement.tsx
import React from "react";
import { usePermission } from "./PermissionContext";

function UserManagement(): JSX.Element | null {
  const { canAccess } = usePermission();

  // Only render the component if user can view it
  if (!canAccess("userManagement")) {
    return null;
  }

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Example row */}
          <tr>
            <td>john_doe</td>
            <td>john@example.com</td>
            <td>Editor</td>
            <td>
              {canAccess("editUsers") && (
                <button className="edit-btn">Edit</button>
              )}
              {canAccess("deleteUsers") && (
                <button className="delete-btn">Delete</button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
```

4. We can also create a reusable permission gate component:

```tsx
// PermissionGate.tsx
import React, { ReactNode } from "react";
import { usePermission } from "./PermissionContext";
import { PermissionKey } from "./types";

interface PermissionGateProps {
  feature: PermissionKey;
  fallback?: ReactNode;
  children: ReactNode;
}

function PermissionGate({
  feature,
  fallback = null,
  children,
}: PermissionGateProps): ReactNode {
  const { canAccess } = usePermission();

  if (!canAccess(feature)) {
    return fallback;
  }

  return children;
}

export default PermissionGate;
```

5. Using the Permission Gate Component:

```tsx
// ContentEditor.tsx
import React from "react";
import PermissionGate from "./PermissionGate";

function ContentEditor(): JSX.Element {
  return (
    <div className="content-editor">
      <h2>Content Management</h2>

      <PermissionGate feature="viewContent">
        <div className="content-list">
          {/* Content items */}
          <div className="content-item">
            <h3>Article Title</h3>
            <p>Published: Jan 15, 2023</p>

            <PermissionGate feature="editContent">
              <button>Edit</button>
            </PermissionGate>

            <PermissionGate feature="deleteContent">
              <button>Delete</button>
            </PermissionGate>
          </div>
        </div>
      </PermissionGate>

      <PermissionGate
        feature="createContent"
        fallback={<p>You don't have permission to create content.</p>}
      >
        <button className="new-content-btn">Create New Content</button>
      </PermissionGate>
    </div>
  );
}

export default ContentEditor;
```

This implementation pattern creates a clean way to handle permission-based rendering throughout your React application. The `PermissionGate` component keeps the underlying permission logic consistent and centralized.

But of course there are many ways to implement permission-based feature toggling in React, and that one was just to show Maps in action.

## Summary

JavaScript Maps provide a powerful and flexible alternative to objects for various use cases in React applications. They offer superior performance for values lookups, support for complex key types, and intuitive methods that make permission code more readable. When you will next time face a decision to use new object please keep in mind that Maps are also a thing and might be a better choice.

## Flashcards

**Front:**
What are the advantages of using Maps in JavaScript?

**Back:**
Maps excel at this task due to their O(1) lookup performance, flexibility with key types, and built-in methods that make code more readable and maintainable.

**Front:**
How to use Map as a React state?

**Back:**

```tsx
type PermissionKey = "dashboard" | "userManagement";
type UserRole = "admin" | "editor" | "viewer";

const [permissionMap, setPermissionMap] = useState<
  Map<PermissionKey, UserRole[]>
>(new Map());

// To update a Map immutably:
const updatePermission = (key: PermissionKey, roles: UserRole[]): void => {
  setPermissionMap((prevMap) => {
    const newMap = new Map(prevMap);
    newMap.set(key, roles);
    return newMap;
  });
};
```
