---
title: Organizing Data Fetching with a Data Access Layer
pubDate: 2025-01-15
tags: [react, API, data fetching, Data Access Layer]
---

In this post we offer a pattern that helps you manage how you fetch and manipulate data returned by an API, providing a powerful way to better organize and de-clutter your React components.

## Component displaying data from API

We have commonly seen situations like this - you need to fetch some data from an API and render it in your component. You fetch the data, update some state, and then use that state in your rendering logic.

Lets imagine this situation where we have a `CarInfoCard` component that fetches and displays essential information about a car like make, model and year:

```tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface CarInfoResponse {
  vehicle: {
    details: {
      specifications: {
        make: string;
        model: string;
        year: number;
        extras?: string;
      };
    };
    unrelatedInfo: {
      origin: string;
      previousOwners: number;
      price: number;
    };
  };
}

export const CarInfoCard = () => {
  const [data, setData] = useState<CarInfoResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<CarInfoResponse>(
        "http://api.somedomain.com/carinfo/123"
      );
      setData(response.data);
    };

    fetchData();
  }, []);

  return (
    <Card>
      {data && (
        <>
          <h2>
            {`${data.vehicle.details.specifications.make} ${data.vehicle.details.specifications.model}`}
          </h2>
          <p>{`Year: ${data.vehicle.details.specifications.year}`}</p>
        </>
      )}
    </Card>
  );
};
```

While this may work, it introduces several problems both in terms of performance and maintainability. Firstly, we are fetching and setting state in the component, which can be cumbersome and convolute the rendering logic. Secondly, our API response (`CarInfoResponse`) contains a lot more information than our component really needs.

## Separate API call from component

To start our refactoring, let's move the data fetching logic into a custom hook. This will keep our component clean and focused on rendering UI only which adheres to the Single Responsibility Principle, one of the SOLID principles for crafting maintainable and well-crafted code.

```ts
// api/carinfo/types.ts
interface CarInfoResponse {
  vehicle: {
    details: {
      specifications: {
        make: string;
        model: string;
        year: number;
        extras?: string;
      };
    };
    unrelatedInfo: {
      origin: string;
      previousOwners: number;
      price: number;
    };
  };
}
```

```ts
// api/carinfo/useCarInfo.ts
export const useCarInfo = (id: string) => {
  const [carInfo, setCarInfo] = useState<CarInfoResponse | null>(null);

  useEffect(() => {
    const fetchingData = async () => {
      const response = await axios.get<CarInfoResponse>(
        `http://api.somedomain.com/carinfo/${id}`
      );
      setCarInfo(response.data);
    };

    fetchingData();
  }, []);

  return carInfo;
};
```

```tsx
// CarInfoCard.tsx
export const CarInfoCard = ({ id }: { id: string }) => {
  const carInfo = useCarInfo(id);

  if (!carInfo) {
    return <Card>Loading car info...</Card>;
  }

  const currentYear = new Date().getFullYear();
  const age = currentYear - carInfo.vehicle.details.specifications.year;

  return (
    <Card>
      <h2>{`${carInfo.vehicle.details.specifications.make} ${carInfo.vehicle.details.specifications.model}`}</h2>
      <p>{`Year: ${carInfo.vehicle.details.specifications.year}, Age: ${age}`}</p>
    </Card>
  );
};
```

## We are done! Right?

So, our CarInfoCard component seems pretty neat and clean. Have we made our code maintainable? Not yet, it's only a little less worse. But why?

At this point, we've already started introducing a Data Access Layer (DAL) by separating the concerns of fetching data and displaying it. By moving the data fetching logic into a custom hook (`useCarInfo`), we've created a clear boundary between how data is retrieved and how it is presented in the UI. This is the first step towards a proper DAL, as it allows our components to focus solely on rendering, while the data retrieval and transformation logic lives elsewhere.

Well, separating API call from the component certainly brought us half way there but it's still not the optimal solution. That's because of the following reasons:

1. If the structure of our API response changes, we need to update our component, or hooks, or both. This means that our component is tightly _coupled_ with the API response structure.
2. If we want to create a new component that needs car age, we would have to repeat our logic for calculating age of the car, potentially breaking the DRY (Don't Repeat Yourself) principle.

As such, wouldn't it be great if we have a function (or 'layer') that will separate the API response from the data our component really requires? The data should be returned in such format that our components can conveniently use.

## Adapter pattern comes to rescue!

This is where having a Data Access Layer (DAL) comes in handy. Now we can easily create a function that transforms the API response into a more usable format for our components. This is called Adapter pattern, which allows us to adapt the data from one format to another.

Let's create an Adapter in our DAL example for `CarInfoCard`:

```ts
// api/carinfo/types.ts
export interface CarInfo {
  make: string;
  model: string;
  year: number;
  age: number;
}

interface CarInfoResponse {
  vehicle: {
    details: {
      specifications: {
        make: string;
        model: string;
        year: number;
        extras?: string;
      };
    };
    unrelatedInfo: {
      origin: string;
      previousOwners: number;
      price: number;
    };
  };
}
```

```ts
// api/carinfo/adapters.ts
const carInfoAdapter = (response: CarInfoResponse): CarInfo => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - response.vehicle.details.specifications.year;
  return {
    make: response.vehicle.details.specifications.make,
    model: response.vehicle.details.specifications.model,
    year: response.vehicle.details.specifications.year,
    age,
  };
};
```

```ts
// api/carinfo/useCarInfo.ts
export const useCarInfo = (id: string) => {
  const [carInfo, setCarInfo] = useState<CarInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<CarInfoResponse>(
        `http://api.somedomain.com/carinfo/${id}`
      );
      setCarInfo(carInfoAdapter(response.data));
    };

    fetchData();
  }, []);

  return carInfo;
};
```

```tsx
// CarInfoCard.tsx
export const CarInfoCard = ({ id }: { id: string }) => {
  const carInfo = useCarInfo(id);

  if (!carInfo) {
    return <Card>Loading car info...</Card>;
  }

  return (
    <Card>
      <h2>{`${carInfo.make} ${carInfo.model}`}</h2>
      <p>{`Year: ${carInfo.year}, Age: ${carInfo.age}`}</p>
    </Card>
  );
};
```

By introducing a Adapter pattern, we solved the anxieties we laid out previously. Our `useCarInfo` hook is just fetching data and returning parsed values. If data structure changes on the back-end, we only need to update `carInfoAdapter` to handle these changes. If we need more data in our component, we can easily extend the `CarInfo` interface and the `carInfoAdapter` function.

Furthermore, this Adapter logic can be reused in any other components that need the same data more easily and our components just consume data they need without concerning themselves with its origins.

## Summary

JavaScript's Data Access Layer is an amazing tool that elegantly separates the specifics of data fetching and data processing from the specifics of the use of the data. Not only it makes your components much easier to read and maintain, but by providing a centralized place to handle changes from your data sources, it also makes your applications much more adaptable.

## Flashcard

**Front:**
What is a Data Access Layer, and why would we use it in React applications?

**Back:**
A Data Access Layer is a utility for accessing specific data from your data sources and preparing it for use in your applications by providing nice API for your components/functions. It is useful to make your applications adaptable and maintain better separation of concerns.
