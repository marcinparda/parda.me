---
title: Understanding NPM and Enhancing Security in Node.js
pubDate: 2024-11-01
tags: [npm, security, javascript, nodejs]
---

## Problem
Despite its pivotal role in the JavaScript ecosystem, there remains a significant knowledge gap regarding npm among many developers. This lack of understanding can lead to improper dependency management, such as using outdated packages or neglecting security audits. 

Vulnerabilities in widely-used packages can propagate through dependency chains, as seen in incidents like the **event-stream incident** in 2018 or the **ua-parser-js hijacking** in 2021.

## Solution

This article :D and everyone that is spreading the word about npm security.

### First, what is `npm`?
**Node Package Manager** (**npm**) serves as the backbone for managing packages within the Node.js ecosystem. It facilitates the installation, management, and sharing of code packages, making it an essential tool for developers. 
At the heart of every npm project lies the package.json file, which acts as a manifest containing vital metadata about the project. This file is crucial for managing dependencies, scripts, and configurations. To create a basic package.json file, one can simply run:
```bash
npm init -y
```
This command generates a package.json file with set of default metadata project values. We will focus on the dependencies section of the package.json file, which lists all the project dependencies.

### What `npm install` does?
The `npm install` command is used to install dependencies listed in the package.json file. It reads the dependencies section and installs the specified packages in the `node_modules` directory.
Besides installing the dependencies, `npm` also generates a `package-lock.json` file. This file contains a detailed dependency tree, ensuring that the same versions of packages are installed across different environments. It is worth to highlight that installed packages by us also have their own dependencies and they are installed in our the `node_modules` directory as well.

### Should I commit the `package-lock.json` and `node_modules` directory?
The `node_modules` directory contains all the installed packages, which can be regenerated using the `package-lock.json` file. It is recommended to **not** commit the `node_modules` directory to the version control system. Instead, only the `package-lock.json` file should be committed. This practice ensures that the project remains lightweight and portable.

### Is not commiting `package-lock.json` a good idea?
While it is generally recommended to commit the `package-lock.json` file, there are scenarios where it might not be necessary. For instance, if the project is a library or a package intended for distribution, committing the `package-lock.json` file might not be necessary. However, for applications or projects with multiple contributors, committing the `package-lock.json` file is crucial to maintain consistency across different environments. 

I would recommend to always commit the `package-lock.json` though.

### `npm i` vs `npm ci`
So now, if I want to have the same versions of packages installed across different environments, I should just clone the repository and run `npm i`, right? 

Not quite. 

The `npm i` command installs the dependencies listed in the `package.json` file, but it does not guarantee that the same versions of packages will be installed across different environments. This is where the `npm ci` command comes into play. 
`ci` stands for **clean install**, and it is used to install the exact versions of packages specified in the `package-lock.json` file. This ensures that the same versions of packages are installed across different environments, making it ideal for continuous integration and deployment pipelines. So if you have commited `package-lock.json` file, you should use `npm ci` instead of `npm i`.

So when should you use `npm i`? When you want to install the latest versions of packages or update the dependencies in the `package.json` file.

And if we are talking about security latest versions of packages...

### Versioning strategies

When managing dependencies, understanding versioning strategies is critical:

- Wildcard (*): Matches any version of a package but can lead to instability.
- Caret (^): Allows updates to the most recent minor version without changing the leftmost non-zero digit.
- Tilde (~): Permits updates only to the most recent patch version.
- Exact Version (e.g., 1.0.0): Specifies a fixed version of a package.

For client production projects maintained by frontend developers, using exact versions is recommended for critical dependencies to ensure stability. However, if some flexibility is acceptable, caret versions can be used for well-maintained libraries. Wildcards should generally be avoided due to their potential for introducing unexpected behavior.

But now we have another issue. What if the package maintainer publishes a new version? How we can know that we are not like 10 minor or 1 major version behind?

### Dependency bots

Dependency bots are automated tools that monitor repositories for outdated dependencies. They analyze the package.json file and compare the versions of installed packages with the latest available versions. If a newer version is available, the bot generates a pull request with the updated version. This process helps ensure that projects remain up-to-date with the latest package versions, reducing the risk of vulnerabilities.

Example of dependency bot is [Github Dependabot](https://github.com/dependabot).

### NPM Security audits

Now that we have more knowledge about `npm` and dependency management, let's talk about how to keep our projects secure. 

One of the most effective ways to enhance security is by leveraging npm's built-in security features. The `npm audit` command scans the project's dependencies for known vulnerabilities and provides a detailed report. It categorizes vulnerabilities based on severity levels and offers recommendations for remediation.

When you run `npm install` you can often see output like this:
```bash
14 vulnerabilities found
Severity: 1 low | 7 moderate | 5 high | 1 critical

run `npm audit fix` to fix them, or `npm audit` for details
```

By running `npm audit` you can see the detailed report of the vulnerabilities in your dependencies and what versions of the packages resolve them. Also there is often a link for more information about the vulnerability.

By running `npm audit fix` you can fix them by updating the packages to the versions that don't have the vulnerabilities.

`npm audit fix` is run along with `npm install` so maybe you don't even need to do that in your project as npm will do it for you.

Sometimes after `npm audit fix` you can see that some of the vulnerabilities are still there. This can happen because the newer version of the package has a breaking change. In that case you can use `npm audit fix --force` to force the update, but first make sure that you checked the changelog of the package and that the breaking change won't break your project.

### Problem with versions with vulnerabilities

The last edge case that I want to mention in this article is when you have a dependency that has a vulnerability and the maintainer of the package doesn't want/can't fix it. Or maybe it is very old version of the package but you can't update it because of breaking changes. So there is variuos ways to handle this situation:

- You can create a pull request to the package repository and fix the vulnerability yourself.
- If above is not possible due to no response from the maintainer or other reasons, you can fork the package and fix the vulnerability yourself or find someone who already did that and use their fork. (Be careful with this one, as you can't be sure that the fork is safe).
- You can use `package.json` overrides.

### `package.json` overrides

`package.json` overrides allow you to specify a different version of a package than the one specified in the dependencies section. This feature is useful when you need to use a specific version of a package to address a vulnerability or compatibility issue. 

So let's assume that you have a package `legit-package` that is using in its dependencies `vulnerable-package@1.0.0` and you can't update `legit-package` because of breaking changes. You can add `overrides` section to your `package.json` like this:
```json
{
  "overrides": {
    "legit-package": {
      "vulnerable-package": "1.0.1"
    }
  }
}
```

and then run `npm install` and the `vulnerable-package` will be updated to `1.0.1`.

Please be aware that this is a workaround and you should always try to fix the vulnerability in the package itself. 

Overrides can lead to unexpected behaviors, conflicts between package versions (yes you can have two different versions of the same package in your project) and can make your project harder to maintain.

So I would use the overrides only if you are going to fix the vulnerabilities in your project in near future.

## Summary

That's all. I hope you enjoyed this article. Thanks for reading!

**There is not an addon for you in this article.** :(
I tried to structurize the article in a way that you can use any part of it as an your new flashcard. And do remember - share your knowledge about npm security with others. It's important for the whole community! 
