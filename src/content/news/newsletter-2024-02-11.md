---
title: "Articles I read on my way to work - #4"
pubDate: 2024-02-11
tags: ["Newsletter"]
---

## CSS

- [What is box-sizing: border-box in CSS?](https://www.freecodecamp.org/news/what-is-box-sizing-border-box-css/) - Basics, but worth refreshing.
- [How to Override width and height HTML attributes with CSS](https://davidwalsh.name/css-override-width-height)

## JavaScript

- [jQuery 4.0.0 Beta](https://blog.jquery.com/2024/02/06/jquery-4-0-0-beta/) - First major release since 2016 of library that is used on more than three-quarters of all websites.
- [What is Strict Mode in JavaScript?](https://www.freecodecamp.org/news/how-to-use-strict-mode-in-javascript/) - Check if you have it enabled in your projects!
- [Immutable JavaScript](https://www.freecodecamp.org/news/immutable-javascript-improve-application-performance/) - I guarantee you - write frontend in JS with functional programming in mind and you will get rid of 90% of your problems. (I do not accept returns)

## TypeScript

- [How To Use forwardRef With Generic Components](https://www.totaltypescript.com/forwardref-with-generic-components) - I have never fallen to this case, but if someone did it must have been frustrating.
- [TypeScript 5.4 Beta](https://devblogs.microsoft.com/typescript/announcing-typescript-5-4-beta/#the-noinfer-utility-type) - NoInfer is worth checking, may help in some niche cases.
- [8 TypeScript Tips To Expand Your Mind (and improve your code)](https://www.youtube.com/watch?v=QSIXYMIJkQg)
- [Wrangling Tuple Types](https://kyleshevlin.com/wrangling-tuple-types/?utm_source=newsletter.reactdigest.net&utm_medium=referral&utm_campaign=reconciliation-renderers-fiber-virtual-tree) - About using `as const` to create correct types for tuple-like array

## Node.js

- [Amazon released LLRT, a JavaScript Runtime](https://github.com/awslabs/llrt) - Experimental JS runtime that aims to lower time of startup. Made for serverless apps.

## React

- [I just merged my 8th PR to React!](https://www.youtube.com/watch?v=onT3QjB58gs) - To response to recent PR spam problem - this is nice and helpful way to start contributing to open source.
- [State Management in React – When and Where to use State](https://www.freecodecamp.org/news/react-state-management/) - Nice graph at the end of article sums it all. I wish this article could be expanded with useContext.
- [React Intersection Observer - A Practical Guide](https://www.builder.io/blog/react-intersection-observer) - Create animated secondary navigation using Intersection Observer API.
- [New client-side hooks coming to React 19](https://marmelab.com/blog/2024/01/23/react-19-new-hooks.html) - I have a mixed feelings about changes to `use` hook. In one hand `use(Promise)` looks super useful, but I think `use(Context)` in if statement is odd and close to antipattern (breaking SRP, component is harder to test/mock).

## Angular

- [[PL] - Odkryj Prostotę Signal Store, Część 1](https://www.angular.love/2024/02/09/przelom-w-zarzadzaniu-stanem-odkryj-prostote-signal-store-czesc-1/?utm_source=rss&utm_medium=rss&utm_campaign=przelom-w-zarzadzaniu-stanem-odkryj-prostote-signal-store-czesc-1) - @ngrx/signals and its role in modern Angular
- [Analog](https://analogjs.org/) - Angular fullstack meta-framework. Analog take a path of other meta-frameworks and is quite similar to them.

## Next.js

- [How we Increased Search Traffic by 20x in 4 Months with the Next.js App Router](https://hardcover.app/blog/next-js-app-router-seo)
- [FIX NEXT.JS ROUTING TO HAVE FULL TYPE-SAFETY](https://www.flightcontrol.dev/blog/fix-nextjs-routing-to-have-full-type-safety) - How to write typesafe routing in Next.js - no dependencies no problem. You only have to maintain that code later. For ready (and more feature rich) solution look for tanstack router.
- [NEXT.JS APP ROUTER MIGRATION: THE GOOD, BAD, AND UGLY](https://www.flightcontrol.dev/blog/nextjs-app-router-migration-the-good-bad-and-ugly) - I had similar opinion on Next 13, but with Next 14 DX is much better (for me at least). I hope that article could highlight their problems when migrating from 13 to 14.

## Other

- [Getting into web components - an intro](https://utilitybend.com/blog/getting-into-web-components-an-intro/)
- [Gemini Ultra released](https://blog.google/technology/ai/google-gemini-update-sundar-pichai-2024/) - New AI model enhancement release from Google that replaced Bard. Result of this model are quite impresive actually.
- [Free AI Assistants course](https://www.epicweb.dev/tutorials/ai-assistants/real-world-examples/introduction-to-developing-with-ai-assistants) - How to use copilot and other AI Tools for writing test cases, debugging code and more. Course made by Kent C. Dodds.
- [How to Make Your Web Sites Accessible](https://www.freecodecamp.org/news/how-to-make-your-web-sites-accessible/) - Basics of Accessiblity
- [Documentation Libraries to Help You Write Good Docs](https://www.freecodecamp.org/news/documentation-libraries-to-help-you-write-good-docs/) - If you need some, here they are. I personally recommend Docusaurus.
- [Jak wdrożyć mikrofrontendy w banku? Rozmowa z Jakubem Pawlakiem](https://www.youtube.com/watch?v=WbEkeZZUrLg) - [PL] Another great talk from Frontend Architecture channel this time about microfrontends.
- [How to Set Up Authentication in Your Apps with Supabase Auth](https://www.freecodecamp.org/news/set-up-authentication-in-apps-with-supabase/) - I don’t like put tutorials here, but this has section about the authentication theory with nice graphs.
- [OpenAI - New embedding models and API updates](https://openai.com/blog/new-embedding-models-and-api-updates) - I didn’t believe that OpenAI will actually lower their prices for ChatGPT 3.5 model by 50% for input and 25% for output tokens. Also, there are\*\* \*\*new embedding models with lower pricing and some improvments to GPT-4 Turbo model.
