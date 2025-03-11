---
title: User permissions management with React
pubDate: 2025-03-11
tags: [React, BFF, Permisions]
---

It's essential to understand that effective permission management in React applications requires moving away from direct role checks at the component level. Let's see why is that and how to implement a better approach using React's Context API.

## Problem

Let's see simple and common implementation of user permissions:

```tsx
type UserRole = "admin" | "editor" | "viewer" | "manager";

interface User {
  id: string;
  name: string;
  role: UserRole;
}

const ProjectDashboard = ({ user }: { user: User }) => {
  // Multiple permission checks scattered throughout component
  const isUserCanEditProject = user.role === "admin" || user.role === "editor";
  const isUserCanDeleteProject = user.role === "admin";
  const isUserCanInviteMembers =
    user.role === "admin" || user.role === "manager";
  const isUserCanViewAnalytics =
    user.role === "admin" || user.role === "manager" || user.role === "editor";

  return (
    <div className="project-dashboard">
      <h1>Project Dashboard</h1>

      {/* Actions conditionally rendered based on permissions */}
      <div className="actions">
        {isUserCanEditProject && <button>Edit Project</button>}
        {isUserCanDeleteProject && <button>Delete Project</button>}
        {isUserCanInviteMembers && <button>Invite Members</button>}
      </div>

      {/* Content conditionally rendered based on permissions */}
      <div className="content">
        <ProjectDetails />
        {isUserCanViewAnalytics && <ProjectAnalytics />}
      </div>
    </div>
  );
};

// Similar logic repeated in other components
const UserProfile = ({ user }: { user: User }) => {
  const isUserCanEditPersonalData =
    user.role === "admin" || user.id === "current-user-id";
  const isUserCanChangeRoles = user.role === "admin";

  return (
    <div className="user-profile">
      {/* More permission-based rendering */}
      {isUserCanEditPersonalData && <button>Edit Profile</button>}
      {isUserCanChangeRoles && <RoleSelector />}
    </div>
  );
};
```

The approach shown above demonstrates several common issues in permission management. The code explicitly checks user roles at the component level to determine what features should be accessible. This creates multiple problems as an application grows.

1. It leads to significant code duplication as the same permission checks need to be implemented across different components.
2. It tightly couples component rendering logic with authorization rules, making the code harder to maintain and test.
3. Any changes to permission logic require updating multiple components, increasing the risk of inconsistencies and errors.

Another problematic aspect is the direct reliance on roles rather than specific permissions. This creates an inflexible system where changing what a particular role can do requires finding and updating all role-checking code throughout the application. Additionally, this approach makes it difficult to implement more complex permission scenarios that don't fit neatly into the existing role structure.

## Solution

### Permissions

A better approach is to implement a dedicated permissions system using for example React's Context API. This centralizes permission logic and provides a consistent way to check permissions throughout your application:

```tsx
// types.ts
export type Permission =
  | "edit:project"
  | "delete:project"
  | "invite:members"
  | "view:analytics"
  | "edit:profile"
  | "manage:roles";

export interface User {
  id: string;
  name: string;
  role: string;
  permissions: Permission[];
}
```

```tsx
// PermissionsContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { Permission, User } from "./types";

interface PermissionsContextType {
  hasPermission: (permission: Permission) => boolean;
  user: User | null;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined,
);

export const PermissionsProvider: React.FC<{
  children: ReactNode;
  user: User | null;
}> = ({ children, user }) => {
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  return (
    <PermissionsContext.Provider value={{ hasPermission, user }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};
```

With the context set up, we can now wrap our application with the `PermissionsProvider` and fetch user data including permissions from an API:

```tsx
// App.tsx
import { PermissionsProvider } from "./PermissionsContext";
import { User } from "./types";
import { useState, useEffect } from "react";

const App = () => {
  const { data: user, isLoading } = useFetchUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PermissionsProvider user={user}>
      <ProjectDashboard />
      <UserProfile />
    </PermissionsProvider>
  );
};
```

Now our components can use the `usePermissions` hook to check for specific permissions:

```tsx
// ProjectDashboard.tsx
import { usePermissions } from "./PermissionsContext";

const ProjectDashboard = () => {
  const { hasPermission } = usePermissions();

  return (
    <div className="project-dashboard">
      <h1>Project Dashboard</h1>

      <div className="actions">
        {hasPermission("edit:project") && <button>Edit Project</button>}
        {hasPermission("delete:project") && <button>Delete Project</button>}
        {hasPermission("invite:members") && <button>Invite Members</button>}
      </div>

      <div className="content">
        <ProjectDetails />
        {hasPermission("view:analytics") && <ProjectAnalytics />}
      </div>
    </div>
  );
};
```

This approach provides a cleaner, more maintainable way to handle permissions in React applications. Components no longer need to understand role hierarchies or complex permission rules; they simply check for the specific permissions they need.

### Backend for frontend (BFF)

In cases where your backend doesn't provide a dedicated permissions endpoint, you can implement a `Backend for Frontend` (`BFF`) pattern or create a role-to-permission mapping on the frontend. Both approaches allow you to maintain the benefits of permission-based checking while working with role-based backend systems.

```tsx
// permissionsMap.ts
import { Permission } from "./types";

type UserRole = "admin" | "editor" | "viewer" | "manager";

export const roleToPermissionsMap: Record<UserRole, Permission[]> = {
  admin: [
    "edit:project",
    "delete:project",
    "invite:members",
    "view:analytics",
    "edit:profile",
    "manage:roles",
  ],
  editor: ["edit:project", "view:analytics", "edit:profile"],
  manager: ["invite:members", "view:analytics", "edit:profile"],
  viewer: ["edit:profile"],
};
```

```tsx
// Enhanced PermissionsProvider with role mapping
import { roleToPermissionsMap } from "./permissionsMap";

interface UserWithoutPermissions {
  id: string;
  name: string;
  role: UserRole;
}

export const PermissionsProvider: React.FC<{
  children: ReactNode;
  user: UserWithoutPermissions | null;
}> = ({ children, user }) => {
  // Derive permissions from user role using our mapping
  const permissions = user ? roleToPermissionsMap[user.role] : [];

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return permissions.includes(permission);
  };

  return (
    <PermissionsContext.Provider value={{ hasPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
};
```

Alternatively, you can create a dedicated BFF service that transforms the user data before it reaches your React application. I encountered this approach with metaframeworks like `Next.js`, where you can create a server-side API route to fetch user data and enhance it with permissions:

```tsx
// bffService.ts
import { User, Permission } from "./types";
import { roleToPermissionsMap } from "./permissionsMap";

export const fetchUserWithPermissions = async (): Promise<User | null> => {
  try {
    // Fetch basic user data
    const userResponse = await fetch("/api/user");
    const userData = await userResponse.json();

    // Enhance with permissions based on role
    const permissions = roleToPermissionsMap[userData.role];

    // Return enhanced user object
    return {
      ...userData,
      permissions,
    };
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
};
```

```tsx
// Using the BFF service in your application
const App = () => {
  const { data: user } = await useUserWithPermissions();

  return (
    <PermissionsProvider user={user}>
      <ProjectDashboard />
      <UserProfile />
    </PermissionsProvider>
  );
};
```

This approach maintains the advantages of permission-based checking while working with backends that only provide role information. The transformation layer, whether implemented as a frontend mapping or a BFF service, allows you to decouple your frontend permission logic from backend role structures.

## Summary

Implementing user permissions in React applications should move away from scattered role checks throughout components to a centralized permission system using Context API. This approach provides a clean hasPermission interface that decouples authorization logic from rendering components. When a dedicated permissions endpoint isn't available, developers can use either role-to-permission mappings on the frontend or implement a Backend for Frontend pattern to transform role-based data into permission-based data. The permission-based approach significantly improves maintainability, makes testing easier, and allows for more granular access control that adapts more readily to changing requirements.

## Flashcard

**What are the best practices for implementing user permissions in React applications?**

The best practices for implementing user permissions in React are:

- Centralize permission logic using React's Context API or state management libraries like Redux.
- Use a permission-based approach rather than role-based checks to decouple authorization logic from component rendering.
- Implement a dedicated permissions system with a hasPermission interface that components can use to check for specific permissions.
- When working with role-based backends, create a role-to-permission mapping on the frontend or implement a Backend for Frontend pattern to transform role-based data into permission-based data.

Example:

```tsx
// Instead of this:
{
  user.role === "admin" && <AdminButton />;
}

// Do this:
{
  hasPermission("manage:users") && <AdminButton />;
}
```
