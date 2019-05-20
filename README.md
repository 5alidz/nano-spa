# nano_spa

## Why does this exist?

Sometimes i just want to create a quick and small website to test something or explore an idea quickly without downlaoding lots of npm modules.

so i created this, which can only be described as budget `react` :)

and i also wanted to explore the virtual dom idea.

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

notice there's `src` and `static` directories, the `src` directory will be minified and inlined inside `index.html` (this will change),  and the `static` directory will be copied to `dist` as is.

let's imagine you have an image inside `static/my-img.png` and a component inside `src/components/Img.js`.

```javascript
// src/components/Img.js

const Img = () => render`<img src='/static/my-img.png' />`

```

to build your app `npm run build` or `yarn build`

## Features

- Routing.
- Composable components [htm](https://github.com/developit/htm).
- Async components.
- speed. (since it's less than 4kb it loads instantly over slow 3g connection)
- SEO friendly.

## Routing

`nano_spa` provides two basic function as its api `router` and `render`

### router

```javascript
import { router, render } from 'nano_spa'

router({
  routes: {
    '/': () => render`<div>Hello, world!<//>`
  },
  head: {
  '/': () => render`
    <title>Home</title>
    <meta name='description' content='my home page'/>
  `
  },
  methods: {
    on_route_mount: (route, dom_node) => {
      // maybe page transition?
    },
    on_route_unmount: (route, dom_node) => {
      // do work when component get replaced.
    }
  },
  // opt out of caching.
  cache: [/]
})

```

ignoring the details for now, but this is it. the entire api of `nano_spa`

please **NOTE** that `head` doesn't accept a component as value of a route, consider the following.

```javascript

const Home = () => render`
  <div>
    <h1>Hello, world</h1>
  <//>
`

const HomeHead = () => render`
  <title>Home</title>
  <meta name='description' content='my home page'/>
`

router({
  routes: {
    // works perfectly fine.
    '/': () => render`<${Home} />`
  },
  head: {
    // WARNING: this doesn't work.
    '/': () => render`<${HomeHead} />`
  }
})
```
this is because head elements by nature is an array like and this is not valid jsx.
instead just pass it as function. (this might change)

```javascript
// ...
  head: {
    '/': HomeHead
  }
// ...
```
### special routes

There's two kind of special routes:
- `'*'` inside `routes` which will get renderd if no routes are matched, a `404` if you will.
- `'*'` inside `head` will get added to the html head element once and will be present on all routes.
- `'/my-route/(.+)'` a regex that will get matched to a component.

```javascript
//...
  routes: {
    // ...

    '/blog/(\\w+)': (matches) => render`<${BlogPost} matches=${matches}/>`

    // ...
  },
  // this will reflect on head too.
  head: {
    // ...

    'blog/(\\w+)': (matches) => render`<title>${matches[0]}</title>`

    // ...
  }
// ...
```



















