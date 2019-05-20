# nano_spa

## Why does this exist?

Sometimes i just want to create a quick and small website to test something or explore an idea quickly without downlaoding lots of npm modules.

so i created this, which can only be described as budget `react` :)

and also wanted to explore the virtual dom idea.

**NOTE**: there's alot of great projects that make use of jsx and they're production ready and stable, you should use those in your production apps; this is just an exploration.

## Usage

```
git clone https://github.com/5alidz/create-nano-spa.git ./my-app && cd my-app
```
## What is create-nano-spa?

it's a quick way to start a project with everything setup for you.

keep in mind that all client-side routers rely on serving `index.html` when hitting any route, and `create-nano-spa` is setup exactly to behave like that.

please check [Deployment](#deployment)

after cloning `create-nano-spa` run `npm install` or `yarn`

notice there's `src` and `static` directories, the `src` directory will be minified and inlined inside (this will change) `index.html`,  and the `static` directory will be copied to dist as is.

let's imagine you have an image inside `static/my-img.png` and a component inside `src/components/Img.js`.

```javascript
// src/components/Img.js

const Img = () => render`<img src='/static/my-img.png' />`

```

## Features

- Routing.
- Composable components [htm](https://github.com/developit/htm).
- Async components.


