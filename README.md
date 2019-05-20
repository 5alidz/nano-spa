# nano_spa

## Why does this exist?

Sometime i just wanted to create a quick and small website that is very simple and cheap but also have the composablity of components and with routes in mind, so basically a budget `react` :)

**NOTE**: this is a work in progress.

## Features
- Routing.
- Composable components [htm](https://github.com/developit/htm).
- Async components.
## Usage
```
git clone https://github.com/5alidz/create-nano-spa.git ./my-app && cd my-app
```
your code goes into the `src` folder and any static resources goes into the `static` folder.
## The Router

nano_spa provides a simple api of two functions `router` and `render`

`render` expects an `obj`

Valid `obj` keys:
- `root` the root html element that gets rendered to
- `routes` expects an object containing all possible routes including regex as a key and component to render.
- `head` similar to routes.
- `methods` expects object with provided methods `on_route_mount` and `on_route_unmount`
- `cache` expects an array of routes `[strings]` to opt out of caching.

### routes

Each route should be a function that return a component similar to react.

the one requirment for a valid component is that it returns one single element for example the following is not a valid component.

```javascript

// this is an INVALID as a route component.
function myComponent() {
  return render`
    <h1>lorem ipsum</h1>
    <p>lorem ipsum</p>
    <img src="/static/my-image" />
  `
}

// the correct way.
function myComponent() {
  return render`
    <div>
      <h1>lorem ipsum</h1>
      <p>lorem ipsum</p>
      <img src="/static/my-image" />
    </div>
  `
}

```

More examples of valid routes.

```javascript
import { router, render  } from 'nano_spa'

// using `msg` as prop.
const home = ({ msg }) => render`<div>${msg}</div>`

const about = () => render`<div>About</div>`

const notFound = () => render`<div>404</div>`

router({
  root: document.getElementById('app'),
  routes: {
    '/':          () => render`<${home} msg='hello world' />`,
    '/about':     () => render`<${about} />`,
    '/blog/(.+)': (matches) => render`<div>${JSON.stringify(matches)}</div>`,
    '*':          () => render`<${notFound} />`
  }
})
```

The `'*'` route here means if no routes are matched it will be renderd.

### head

`head` is similar to routes with on difference that it should return either one or an array of head elements

continuing our example.

```javascript
import { router, render  } from 'nano_spa'

const home = ({ msg }) => render`<div>${msg}</div>`
const about = () => render`<div>About</div>`
const notFound = () => render`<div>404</div>`

router({
  root: document.getElementById('app'),
  routes: {
    '/':          () => render`<${home} msg='hello world' />`,
    '/about':     () => render`<${about} />`,
    '/blog/(.+)': (matches) => render`<div>${JSON.stringify(matches)}</div>`,
    '*':          () => render`<${notFound} />`
  },
  // adding head elements to routes.
  head: {
    '/': () => render`<title>my-app | Home</title>`,
    '/about': () => render`
      <title>my-app | About</title>
      <meta name='keywords' content='about,my-app' />
    `,
    // note the usage of `matches here`
    '/blog/(.+)': (matches) => render`<title>${matches[0]}</title>`
    '*': () => render`<meta name='author' content='5alidz'/>`
  }
})

```

The `'*'` head element here will get added to the `<head></head>` dom element and will be present on all routes.

### methods

nano_spa `methods` is a way to do some work when a route is mounted or unmounted

let's continue the same example here.

```javascript
import { router, render  } from 'nano_spa'

const home = ({ msg }) => render`<div>${msg}</div>`
const about = () => render`<div>About</div>`
const notFound = () => render`<div>404</div>`

router({
  root: document.getElementById('app'),
  routes: {
    '/':          () => render`<${home} msg='hello world' />`,
    '/about':     () => render`<${about} />`,
    '/blog/(.+)': (matches) => render`<div>${JSON.stringify(matches)}</div>`,
    '*':          () => render`<${notFound} />`
  },
  head: {
    '/': () => render`<title>my-app | Home</title>`,
    '/about': () => render`
      <title>my-app | About</title>
      <meta name='keywords' content='about,my-app' />
    `,
    '/blog/(.+)': (matches) => render`<title>${matches[0]}</title>`
    '*': () => render`<meta name='author' content='5alidz'/>`
  },
  // available methods.
  methods: {
    on_route_mount: (route, dom_element) => {
      // do some work here
      // maybe update the navbar or implement page transition
    },
    on_route_unmount: (route, dom_element) => {
      // do some work after the route has been replaced.
    }
  },
  // this is how to rerender '/' each time you hit the home page.
  cache: ['/']
})

```
