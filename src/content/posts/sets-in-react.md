---
title: Do I need a Set here? Using Sets in React
pubDate: 2025-05-01
tags: [react, JS Sets, useState]
---

If you've ever implemented a feature adding some elements to array of unique elements, for example adding tags to your post/blog/video, you've likely encountered the problem of preventing duplicate elements/tags. If you used for this arrays with utility function for checking if tag is already in tags array then you should know that this approach is not optimal and time efficient. In this article, we'll explore how to use JavaScript Sets to efficiently manage unique tags in a React application.

If you're already familiar with Sets in JS and want to jump straight to the tag feature implementation, you can skip to the section [Using Set for manipulating tags](#using-set-for-manipulating-tags).

## Sets in JS

### What are Sets in JS?

JS Sets are built-in objects that store collections of unique values. Unlike arrays, Sets automatically ensure that all values are unique.

### Why to use Sets in JS?

1.  Automatic uniqueness: Sets automatically prevent duplicate values

2.  Optimized lookups: Checking if a value exists in a Set is more efficient than in an array, and better performance for uniqueness checks than filtering arrays.

3.  Clean API: Sets provide standarized intuitive methods like `add()`, `delete()`, and `has()`

Performance of using an array versus a Set for uniqueness checks:

```tsx
// Using an array
function isUniqueWithArray(tag: string, tags: string[]): boolean {
  return !tags.includes(tag); // O(n) time complexity
}

// Using a Set
function isUniqueWithSet(tag: string, tags: Set<string>): boolean {
  return !tags.has(tag); // O(1) time complexity
}
```

For large collections, the difference in performance becomes significant.

### How to use Sets in JS?

Here are some basic operations you can perform with Sets:

```tsx
// Creating a Set
const tags = new Set<string>();

// Adding values
tags.add("react");
tags.add("javascript");
tags.add("typescript");
tags.add("react"); // Duplicate, won't be added

// tags now contains: ["react", "javascript", "typescript"]

// Checking if a value exists
const hasReact = tags.has("react"); // true
const hasAngular = tags.has("angular"); // false

// Removing values
tags.delete("typescript"); // Removes "typescript"

// Getting the size
const tagCount = tags.size; // 2

// Clearing all values
tags.clear();
console.log(tags.size); // 0
```

Iterating through a Set:

```tsx
const tags = new Set<string>(["react", "javascript", "typescript"]);

// Using forEach
tags.forEach((tag) => {
  console.log(tag);
});

// Using for...of
for (const tag of tags) {
  console.log(tag);
}

// Converting to an array to use array methods
const tagsArray = [...tags];
const upperCaseTags = tagsArray.map((tag) => tag.toUpperCase());
```

Sets are not directly indexable like arrays, so if you need to access specific elements by index, you'll need to convert the Set to an array first:

```tsx
const tags = new Set<string>(["react", "javascript", "typescript"]);
const tagsArray = [...tags];
const secondTag = tagsArray[1]; // "javascript"
```

One very useful feature of Sets is when you already have an array of values and you want to get only unique values from it. You can easily convert an array to a Set and back to an array:

```tsx
const tagsArray = ["react", "javascript", "typescript", "react", "javascript"];
const tagsSet = new Set(tagsArray); // Set(3) {"react", "javascript", "typescript"}
// Convert back to an array if needed
const uniqueTags = [...tagsSet]; // ["react", "javascript", "typescript"]
```

## Using Set for manipulating tags

Now let's implement a practical tag input feature in React using Sets to prevent duplicate tags. We are aiming to create a simple tag input component that allows users to add and remove tags. Each tag should be unique, and the component should handle user input efficiently.

### Problem with manipulating tags

When implementing a tag input feature, there are several challenges to address:

1.  Preventing duplicates: Users shouldn't be able to add the same tag twice

2.  State management: Efficiently managing the collection of tags as React state

3.  Performance: Ensuring good performance when adding, removing, and checking for tag existence

Let's look at a naive implementation using an array to store tags:

```tsx
import React, { useState } from "react";

function TagInput(): JSX.Element {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const addTag = () => {
    // Check for duplicates - inefficient for large arrays
    if (!tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      setInputValue("");
    } else {
      alert("This tag already exists!");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="tag-input-container">
      <div className="tags">
        {tags.map((tag) => (
          <div key={tag} className="tag">
            {tag}
            <button onClick={() => removeTag(tag)}>×</button>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a tag"
        />
        <button onClick={addTag}>Add</button>
      </div>
    </div>
  );
}

export default TagInput;
```

This implementation works, but it has some limitations:

1.  The `includes()` check becomes slower as the number of tags grows
2.  Need to implement a utility function to check for duplicates, which can be error-prone and is less efficient.
3.  Need to implement a remove functionality with `filter()` which creates a new array every time a tag is removed, and is additional logic to maintain.

## Solution with Sets

Now, let's refactor this implementation to use a Set instead of an array:

```tsx
import React, { useState } from "react";

function TagInput(): JSX.Element {
  const [tags, setTags] = useState<Set<string>>(new Set<string>());
  const [inputValue, setInputValue] = useState<string>("");

  const addTag = () => {
    if (!tags.has(inputValue)) {
      // Create a new Set with the existing values plus the new tag
      setTags(new Set([...tags, inputValue]));
      setInputValue("");
    } else {
      alert("This tag already exists!");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prevTags) => {
      // Create a new Set from the previous one (for immutability)
      const newTags = new Set(prevTags);
      // Remove the tag
      newTags.delete(tagToRemove);
      return newTags;
    });
  };

  return (
    <div className="tag-input-container">
      <div className="tags">
        {[...tags].map((tag) => (
          <div key={tag} className="tag">
            {tag}
            <button onClick={() => removeTag(tag)}>×</button>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a tag"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
        />
        <button onClick={addTag}>Add</button>
      </div>
    </div>
  );
}

export default TagInput;
```

This implementation leverages the built-in uniqueness of Sets to prevent duplicate tags. Note how we create a new Set when updating state, following React's immutability principles.

## Why not Maps?

You might wonder why we're using Sets instead of Maps for this tag feature. Both are efficient data structures, but Maps are designed for key-value pairs, while Sets are designed for unique values. Maps could be more appropriate with features like cart items, where you need to associate a quantity with each item name/id.

## Summary

JavaScript Sets provide helpful API for managing collections of unique values, making them ideal for features like described in this article.
Maybe you already heard about Sets, but didn't know when to use them and forget that they exist. That was my case many times, so I decided to use it every time I create an array. In most of the cases they don't suit my needs, but this way I created a habit of asking myself a question: "Do I need a Set here?".

## Flashcard

**Front:**\
When to use JS Sets?

**Back:**

Sets are useful when you need to manage collections of unique values, such as adding unique tags to post/blog/video.
