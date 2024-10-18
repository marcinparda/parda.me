---
title: How to Make Working with Complex Union Types Easier Using Discriminated Unions?
pubDate: 2024-10-18
tags: [typescript, discriminated-unions]
---

## Problem

Imagine we have a `Vehicle` type in our app that we can represent like this:

```ts
type Vehicle = Car | Motorcycle | Bike;
type Car = {
  brand: string;
  model: string;
  engine: string;
  nrOfDoors: number;
  hasClimateControl: boolean;
};
type Motorcycle = {
  brand: string;
  model: string;
  engine: string;
};
type Bike = {
  brand: string;
  model: string;
  type: string;
  nrOfWheels: number;
};
```

Now we want to create a vehicle and log `nrOfDoors` if it is a car. How would we do that?

```ts
const vehicle = createRandomVehicle();
// ❌ This won't work
console.log(vehicle.nrOfDoors);
if ("brand" in vehicle) {
  // ❌ This won't work
  console.log(vehicle.nrOfDoors);
}
```

## What is a Discriminated Union?

```ts
// This will work
if ("nrOfDoors" in vehicle) {
  console.log(vehicle.nrOfDoors);
}
// This will work too
if ("hasClimateControl" in vehicle) {
  console.log(vehicle.nrOfDoors);
}
```

First, we need to check if the vehicle has a `nrOfDoors` or `hasClimateControl` property. Then TypeScript will know that the vehicle is a `Car`, and we can access the `nrOfDoors` property.

The process when TypeScript "gets to know" that the vehicle is a `Car` is called a discriminated union. It is a pattern that allows TypeScript to narrow down the type of an object based on a specific property.

In simple terms, no other type has the `nrOfDoors` property, so if we check for it, TypeScript will know that the object is a `Car`.

## Solution

But we won't always know which property to check. In that case, we can use a common property that all types have. In this case, we will use the `type` property.

```ts
type Vehicle = Car | Motorcycle | Bike;
type Car = {
  type: "car";
  brand: string;
  model: string;
  engine: string;
  nrOfDoors: number;
  hasClimateControl: boolean;
};
type Motorcycle = {
  type: "motorcycle";
  brand: string;
  model: string;
  engine: string;
};
type Bike = {
  type: "bike";
  brand: string;
  model: string;
  type: string;
  nrOfWheels: number;
};
```

We need to make sure that the `type` property is unique for each type so TypeScript can distinguish between them.

Now we can check for the `type` property to know which type the vehicle is.

```ts
if (vehicle.type === "car") {
  console.log(vehicle.nrOfDoors);
}
```

Also, it helps in various other cases like creating a new `Vehicle` object manually.

```ts
const newVehicle: Vehicle = {
  type: "car",
  // From this point TypeScript knows that the object is a Car and will suggest only Car properties
};
```

## Summary

That’s it. I hope you enjoyed this article.

**Here’s an add-on for you:** A brief summary of the article. You can use it to create flashcards (e.g., in Anki).

## What is a Discriminated Union in TypeScript?

It is a pattern that allows TypeScript to narrow down the type of an object based on a specific property.

Example usage:

```ts
type Vehicle = Car | Motorcycle | Bike;
type Car = {
  type: "car";
  brand: string;
  model: string;
  engine: string;
  nrOfDoors: number;
  hasClimateControl: boolean;
};
type Motorcycle = {
  type: "motorcycle";
  brand: string;
  model: string;
  engine: string;
};
type Bike = {
  type: "bike";
  brand: string;
  model: string;
  type: string;
  nrOfWheels: number;
};
```

```ts
if (vehicle.type === "car") {
  console.log(vehicle.nrOfDoors);
}
```
