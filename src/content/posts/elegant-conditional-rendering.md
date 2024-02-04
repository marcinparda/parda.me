---
title: "How to make conditional rendering without a lot of if statements?"
pubDate: 2024-02-04
tags: [react]
---

# Problem

```tsx
type UserType =
  | "editor"
  | "admin"
  | "manager"
  | "contributor"
  | "viewer"
  | "superuser"
  | "analyst";

const Dashboard = ({ userType }: { userType: UserType }) => {
  if (userType === "editor") {
    return <EditorDashboard />;
  } else if (userType === "admin") {
    return <AdminDashboard />;
  } else if (userType === "manager") {
    return <ManagerDashboard />;
  } else if (userType === "contributor") {
    return <ContributorDashboard />;
  } else if (userType === "viewer") {
    return <ViewerDashboard />;
  } else if (userType === "superuser") {
    return <SuperuserDashboard />;
  } else if (userType === "analyst") {
    return <AnalystDashboard />;
  } else {
    // Handle unknown user types
    return null;
  }
};
```

The given code for rendering user dashboards is written in an "ugly" way, using multiple if-else statements to check the user's permission and render the appropriate dashboard. This approach can lead to repetitive code and reduced maintainability.

# Solution

To refactor the code, we can use a more elegant approach by utilizing the dashboards variable, which stores the mapping of user types to their respective dashboard components. By doing so, we can avoid the need for multiple if-else statements and improve the maintainability of the code.

```tsx
type UserType =
  | "editor"
  | "admin"
  | "manager"
  | "contributor"
  | "viewer"
  | "superuser"
  | "analyst";

const dashboards: Record<UserType, JSX.Element> = {
  editor: <EditorDashboard />,
  admin: <AdminDashboard />,
  manager: <ManagerDashboard />,
  contributor: <ContributorDashboard />,
  viewer: <ViewerDashboard />,
  superuser: <SuperuserDashboard />,
  analyst: <AnalystDashboard />,
};

const Dashboard = ({ userType }: { userType: UserType }) => {
  return dashboards[userType];
};
```

In this refactored code, we have centralized the dashboard components for each user type within the dashboards variable. The `Dashboard` component now simply returns the corresponding dashboard component based on the user's type, avoiding the need for multiple conditional statements.

We must be careful with new approach because if the user type is not found in the dashboards object, it will return `undefined`. This can be handled by adding a proper check for the user type or by providing a default dashboard component.

# Summary

By refactoring the code to use the dashboards variable approach, we have improved the maintainability and readability of the code. This approach follows best practices and provides a more elegant solution for rendering user dashboards based on their permissions.

# Flashcard

## What is a nice way to avoid if statements when rendering component?

A nice way to avoid if statements when rendering components is to use a data-driven approach, such as maintaining a mapping of user types to their respective components in a variable or object. By doing so, you can eliminate the need for multiple conditional statements and achieve a more maintainable and efficient codebase.
Example:

```tsx
type UserType = "editor" | "admin" | "manager";

const dashboards: Record<UserType, JSX.Element> = {
  editor: <EditorDashboard />,
  admin: <AdminDashboard />,
  manager: <ManagerDashboard />,
};

const Dashboard = ({ userType }: { userType: UserType }) => {
  return dashboards[userType];
};
```
