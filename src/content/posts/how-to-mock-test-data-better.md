---
title: How to Mock Test Data Better?
pubDate: 2026-08-30
tags: [testing, TypeScript, mocking, design-patterns]
---

## Problem

If you've ever written a test that needs a fake user, article, or cart, you've probably reached for the easiest option: hardcode an object literal wherever you need it.

```typescript
// Example of non-centralized mock data
interface Article {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

const articleBaseMock: Article = {
  id: "1",
  title: "First Article",
  content: "Content of the first article",
  tags: ["react"],
};
```

Looks harmless enough. So we reach for it in a test:

```typescript
// Example usage in tests
test('renders article', () => {
  render(<ArticlePage article={articleBaseMock} />);
  expect(screen.getByText('First Article')).toBeInTheDocument();
});

test('renders second article', () => {
  const secondArticle: Article = { ...articleBaseMock, id: '2', title: 'Second Article' };
  render(<ArticlePage article={secondArticle} />);
  expect(screen.getByText('Second Article')).toBeInTheDocument();
});
```

Then someone builds a new page and reuses the same base mock. Why write a new one, right?

```typescript
// Example usage in a new page
const articles: Article[] = [
  articleBaseMock,
  { ...articleBaseMock, id: '2', title: 'Second Article' },
];

function ArticlesListPage() {
  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
```

Now `articleBaseMock` lives in some shared file, imported from three different places, spread and tweaked by hand every time someone needs slightly different data. So, what's the actual problem here?

## Shared mutable state

`articleBaseMock` is one object, and there's only one of it. Import it in two tests inside the same test file and both tests point at the very same object in memory, not a copy. Jest and Vitest only reset the module registry per test _file_ by default, so this sharing happens across tests within one file, not across separate files.

That's usually fine when you're just reading fields. It gets dangerous with nested or array fields, though, because spreading an object only copies the top level:

```typescript
test('adds a tag to article', () => {
  const withNewTag = { ...articleBaseMock, tags: [...articleBaseMock.tags, 'typescript'] };
  // easy to forget the inner spread and just do:
  const withNewTagBuggy = { ...articleBaseMock };
  withNewTagBuggy.tags.push('typescript'); // mutates articleBaseMock.tags too!

  render(<ArticlePage article={withNewTagBuggy} />);
});

test('renders article tags', () => {
  render(<ArticlePage article={articleBaseMock} />);
  expect(screen.queryByText('typescript')).not.toBeInTheDocument();
  // fails if run after test above - tags array still has 'typescript'
});
```

Even the variable name saw it coming: `withNewTagBuggy`. `{ ...articleBaseMock }` looks safe, reads like "a copy." It isn't, not for `tags`. The array field is still the same reference, so pushing to it in one test quietly leaks into every other test that imports the same mock. The failure depends on run order too, so it passes locally, fails in CI, and only fails when that one other test happens to run first. The problem isn't in the code under test at all. It's in the test data's lifecycle, and it's easy to miss in review, because the offending line looks like a perfectly normal spread.

## Hard variancing

Real components need variants too: an empty article, one with a dozen tags, one with a title long enough to wrap onto three lines. Every time, someone writes `{ ...articleBaseMock, content: '' }` inline, right in whichever test needs it.

The problem shows up the moment you need that same variant, or something close to it, in more than one place. Each test builds its own version of "article with no content" from scratch, and there's no shared place that says this is what that variant actually looks like. Write it slightly differently in two files (`content: ''` in one, `content: ' '` in another, or someone spreads from an entirely different base object) and now you've got two tests claiming to check the same case while actually checking two different shapes. Nobody notices until one of them fails, and whoever's debugging has to first figure out that the two "empty content" mocks were never the same object to begin with. The search space for the bug is every call site instead of one function.

Nested fields make this worse, just in a different way. Compare:

```typescript
const withExtraTag: Article = {
  ...articleBaseMock,
  tags: [...articleBaseMock.tags, "typescript"],
};
```

against a factory call like `createArticleMock({ tags: [...articleBaseMock.tags, 'typescript'] })`. Same override, but reading the spread version means untangling "what `articleBaseMock` already had" from "what this line is actually changing." The outer spread and the inner spread sit right next to each other and look almost identical, while the factory call only ever shows you the override argument, so what changed for this variant is the only thing left on the line.

## Solution

The fix: a factory function. Instead of exporting a fixed object, export a function that builds one for you, with sensible defaults and room to override anything you need.

```typescript
// mocks/article.ts
export function createArticleMock(overrides: Partial<Article> = {}): Article {
  return {
    id: crypto.randomUUID(),
    title: "Article title",
    content: "Article content",
    tags: ["react"],
    ...overrides,
  };
}
```

`id` is random by default, but it's still overridable like anything else (`createArticleMock({ id: 'fixed-id-for-this-test' })`) for the rare case where a test needs to assert on a specific id.

Every call builds all fields fresh, `tags` included, so there's no leftover reference to any previous call's array. Spreading the return value is safe by default now, and variants read as data instead of a copy-paste rule you have to remember:

```typescript
test('renders article', () => {
  const article = createArticleMock({ title: 'First Article' });
  render(<ArticlePage article={article} />);
  expect(screen.getByText('First Article')).toBeInTheDocument();
});

test('renders empty content state', () => {
  const article = createArticleMock({ content: '' });
  render(<ArticlePage article={article} />);
});

test('renders article with extra tags', () => {
  const article = createArticleMock({ tags: ['react', 'typescript'] });
  render(<ArticlePage article={article} />);
});
```

One thing the factory alone doesn't fix, though: nothing stops a test from mutating the object it just got handed back.

```typescript
test('tags stay isolated per call', () => {
  const article = createArticleMock({ tags: ['react'] });

  article.tags.push('typescript'); // mutates the array this article owns
  render(<ArticlePage article={article} />);
  expect(screen.getByText('typescript')).toBeInTheDocument();

  expect(article.tags).toEqual(['react']);
  // fails - article.tags is still ['react', 'typescript'], same array reference as above
});
```

A different call to `createArticleMock` would've been unaffected, and that part the factory does fix. But this one object, once handed back, is just a plain mutable array sitting on a plain mutable object, same as any other. The factory removes the _shared_ part of the problem, since each call owns its own object now, but it doesn't remove mutation as a possibility on that object. More on that below.

A couple of things worth knowing before reaching for this pattern:

- `crypto.randomUUID()` is available globally in Node 19+ (and 18.14+) and in evergreen browsers, so most setups get this for free. On an older runtime, import `randomUUID` from `node:crypto`, or drop in any short random-string helper. The factory doesn't care how `id` gets generated, only that it's fresh on every call.
- A random `id` by default trades determinism for convenience, which is a bit ironic given that this whole post is about order-dependent, flaky failures. It's fine as long as nothing asserts on the actual value. The moment a test snapshots output containing that id, or compares it against something fixed, pass an explicit `id` override instead, the same as you would for any other field: `createArticleMock({ id: 'article-1' })`.
- It is more typing than a spread for simple, one-off variants. For a handful of tests touching a single field, `{ ...articleBaseMock, content: '' }` is still less code, and that's a fine trade to make.
- And if you need factories with sequences, traits, and associations across many entities, libraries like [fishery](https://github.com/thoughtbot/fishery) or [@jackfranklin/test-data-bot](https://github.com/jackfranklin/test-data-bot) already implement this same idea with a lot more machinery. Worth a look before you hand-roll a factory per entity in a larger codebase.

## Alternative approaches (structuredClone and Object.freeze)

You might be wondering whether you need a whole factory function just to fix shared mutable state. Fair question, because that problem alone has a much smaller fix available: call `structuredClone(articleBaseMock)` at the top of any test that needs to mutate, or reach for `Object.freeze` (deep, on `tags` too) on `articleBaseMock` itself, so a stray `.push` throws right where it happens instead of quietly leaking into the next test. Either is a one-liner, no new file, no factory.

Both are worth using. Freezing your base mocks is close to free, and it turns this whole class of problem into a loud failure instead of a silent one. But notice what neither of them touches: the hard variancing problem from earlier. Cloning or freezing `articleBaseMock` still leaves you spreading `{ ...structuredClone(articleBaseMock), content: '' }` by hand in every test that needs that variant, the same scattered, no-shared-place problem as before, just with a clone call bolted onto the front. Freeze is even less forgiving: it won't let you change a field at all without spreading around it first.

The factory fixes both problems at once, and not because "a fresh object" is some special power only a factory has, cloning gets you that too. It's because the factory is the one mechanism in this article that also gives each variant a name and a single place to live. That's the real reason to reach for it over the one-liner: not mutation safety alone, since that part is replaceable, but mutation safety _and_ readable variance, from the same function.

And this closes the gap flagged earlier too: wrap the factory's return value in `Object.freeze()`, and mutating a factory-made object throws instead of silently succeeding. The factory and the freeze aren't competing fixes. They cover different things, so combine them.

## Beyond mocks

Nothing about `createArticleMock` is actually specific to testing. The same shape, a function with defaults and overrides, shows up anywhere you need a plausible object without wiring up the real thing behind it.

- Storybook stories are an easy next stop. Instead of a `const sampleArticle = {...}` sitting at the top of every `.stories.tsx` file, import the same factory your tests already use, and override just the prop each story cares about.
- Mock Service Worker handlers want the same thing. A handler that returns `createArticleMock({ tags: ['react', 'testing'] })` as its response body reads exactly like the test that renders that article, because it's building the same shape the same way.
- Seed scripts and e2e fixtures benefit too, especially once you need dozens of rows that just look realistic. Wrap the factory in a loop, override `id` and `title` per iteration, and you get a list of distinct articles without hand-writing a single one.

Anywhere you'd otherwise reach for a hardcoded object and quietly hope nobody ever needs a second one, reach for a factory instead.

## Summary

Centralize your mock data behind factory functions instead of exporting fixed objects. Each call gets its own object, nested fields included, so tests stop depending on run order, and variants become a data override instead of a copy-paste rule you have to remember.

That's all. I hope you enjoyed this article. Thanks for reading!

Here's an addon for you. Brief summary of an article. You can use it to create fiches cards (e.g. in Anki).

## Flashcards

**Front:**
Why use factory functions instead of static objects for mock test data?

**Back:**
Static objects are shared references, so a mutation in one test can leak into another. Factories build a fresh object on every call.

**Front:**
Why doesn't spreading an object (`{ ...obj }`) protect its nested arrays or objects from mutation?

**Back:**
Spread only copies the top level. Nested fields keep the same reference, so mutating them still mutates the original object.

**Front:**
Why is it a problem when every test builds its own slightly different variant of test data inline?

**Back:**
Each variant has no shared source of truth, so the same case can end up written differently in different places and silently drift apart.

**Front:**
Does a factory function alone prevent mutation bugs?

**Back:**
No. It only controls what happens when the object is built. Wrap its return value in `Object.freeze()` to stop mutation after the fact.

**Front:**
Besides test mocks, where else is the factory-function pattern useful?

**Back:**
Anywhere you need a plausible object without the real thing behind it, for example Storybook stories, API mocks, or database seed scripts.
