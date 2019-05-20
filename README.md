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
`router(obj)`
Valid `obj` keys:
- `root` the root html element that gets rendered to
- `routes` expects an object containing all possible routes including regex as a key and component to render.
- `head` similar to routes.
- `methods` expects object with provided methods `on_route_mount` and `on_route_unmount`

```javascript
import { router, render  } from 'nano_spa'
// using ```msg` as prop.
const home = ({ msg  }) => render`<div>${msg}</div>`
const about = () => render`<div>About</div>`
const notFound = () => render`<div>404</div>`

router({
  root: document.getElementById('app'),
  routes: {
      '/': () => render`<${home} msg='hello world' />`,
      '/about': () => render`<${about} />`,
      '/blog/(.+)': (matches) => render`<div>${JSON.stringify(matches)}</div>`,
      '*': () => render`<${notFound} />
  }
})
```

The `'*'` route here means if no routes are matched it will be renderd.
