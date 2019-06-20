# nano_spa
A very flexible jsx ([htm](https://github.com/developit/htm)) reusable components + router library that can produce very small builds.

At its core nano_spa is < 4kb but you can incrementally add [`handlers`](#handlers).
- [Get Started](#get-started)
- [Components](#components) `nano_spa/render`
- [Router](#router)   `nano_spa/router`
- [Advanced](#advanced)
  - [to_dom](#to_dom) `nano_spa/to_dom`
  - [Handlers](#handlers) `nano_spa/add_handler`
    - [Promise](#promise) `nano_spa/handlers.promise`
    - [Lazy](#lazy) `nano_spa/handlers.lazy`
    - [Link](#link) `nano_spa/handlers.link`
    - [Box](#link) `nano_spa/handlers.box`
    - [Create Your Own!](#create-your-own)
- [Deploy](#deploy) 🚀

## Getting Started
In your terminal.
`git clone https://github.com/5alidz/create-nano-spa my-app`
or [use as template](https://https://github.com/5alidz/create-nano-spa)
you should see a directory structure like this ->
.
my-app/
|-- src/
|   |-- pages/
|   |-- components/
|   |-- static/
|   | |-- favicon.ico
|   |-- index.html
|   |-- main.js
|-- ...
|-- webpack.config.js
.
- Yes, webpack. `nano_spa` itself is not bundled and require a build tool.

- If you don't know anything about `webpack` don't worry webpack has an amazing community around it so answers to any questions you have already exists.

- Anything related to `nano_spa` and `webpack` will be covered in the [Deploy](#deploy) section.

## Components
#### create your first component
if you're familiar with react components this is the same syntax here with the difference that `nano_spa` uses [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
```js
// inside src/main.js
import render from 'nano_spa/render'

// usage <${myComponent} color='red' />

function myComponent({ color }) {
  const style = `color: ${color};`
  return render`
    <div>
      <h1 style=${style}>Hello, World!<//>
    <//>
  `	
}
```
⚠ always have closing tags.
```js
// <${myComponent} />  	✔ 
// <${myComponent}><//> ✔
// <${myComponent}>     ✖ throws an error

// <meta name='description' content='my awesome site'/> ✔
// <meta name='description' content='my awesome site'>  ✖ throws an error

// <div><//>     ✔
// <div />       ✔
// <div></div>   ✔
// <div>         ✖ throws an error
```
## Router
#### adding a home page
```js
// src/main.js
import render from 'nano_spa/render'
import router from 'nano_spa/router'
import myComponent from './pages/homePage.js'
/*
router accepts and object with following properties.
- routes: { ..., route: () => render`<${routeComponent}/>` }
- head: { ..., route: () => render`headComponent` }
- cache: [... array of string to route, example '/' ] opt out of cache.
- methods: {
	on_route_mount: function(route_string, dom_node_to_route_component) {
			-- maybe route transition?
	},
	on_route_unmount: similar to on_route_mount
}
*/
router({
  routes: { '/': () => render`<${myComponent} color='red' />` },
  head: {'/': () => render`<title>my-app | Home</title>`}
})
```
#### special routes
- routes -> `'/route/(.+)'` regex that will match any routes under `/route`
- routes -> `'*'` will render 404 if route is not found.
#### special head
similar to special routes with the difference `'*'` will render a head at every route.
#### regex example
```js
// ...
// routes will cascade! 
// now it's <BlogPost /> job to handle any nested routes under /blog/...
router({
  routes: {
    '/blog/(.+)': (matches) => render`<${BlogPost} matches=${matches}/>`,
    '*': () => render`<${NotFound} />`
  },
  head: {
    '/blog/(.+)': (matches) => render`<title>Blog | ${matches[0]}</title>`,
    '*': () => render`<meta name='author' content='5alidz' />`
  }
})
```
it's a good idea to start writing your pages under `src/pages/` and reusable components under `src/components`.
## Advanced
### to_dom
`nano_spa` exposes a utility at `'nano_spa/to_dom'` which will take anything and turn it to a DOM node.
```js
import to_dom from 'nano_spa/to_dom'
import render from 'nano_spa/render'

to_dom(render`<div>hello</div>`) // => DOM NODE <div>hello</div>
to_dom(render`some_string`) // => DOM TEXT NODE "some_string"
to_dom(render`${{x: 42}}`)  // => DOM NODE <pre>{ x: 42 }</pre>
to_dom(render`
  <div>hello</div>
  <div>another-div</div>
`) // => array of DOM NODES [div, div]
to_dom(render`${
  function this_is_for_my_blog() {
	  return undefined
  }
`) // => DOM NODE <pre> ... (multi line function)</pre>
```
NOTE: `to_dom` is also used in router under the hood.
### Handlers
handlers is just a hook into the `to_dom` utility, and it is very flexible.
it should be mentioned that flexibility comes with its own cost, it's not a beginner friendly.
##### how handlers works
```js
import add_handler from 'nano_spa/add_handler'
import to_dom from 'nano_spa/to_dom'

function my_handler(vNode) {
  // vNode is just an object with { type: '', props: {}, children: [] }
  // do some transformation on vNode
  // checkout the source code for nano_spa handlers.*.js
  return to_dom(vNode)
}
// every time to_dom sees <MyHandler /> without converting it to <${MyHandler} />
// it will use your function my_handler.
add_handler('MyHandler', my_handler)

function myComponent() {
  return render`
    <MyHandler>
      ...
    <//>
  `
}
// ...
```
`add_handler` can also take an array of handlers.
```js
// promise handler is provided by nano_spa
import promise_handler from 'nano_spa/handlers.Promise'
import link_handler from 'nano_spa/handlers.Link'

import add_handler from 'nano_spa/add_handler'

add_handler([
  ['Promise', promise_handler],
  ['Link', link_handler]
])
// ... 
```
And now you can use  `<Promise />`  and `<Link />` without the need to use `${}` and with much control.

There's a few default handlers that ship with `nano_spa` under `nano_spa/handlers.<handler_name>.js`

#### Link `nano_spa/handlers.Link`
- handles routes.
- expects one child.
##### usage
```js
import link_handler from 'nano_spa/handlers.Link'
import add_handler from 'nano_spa/add_handler'

// it's good practice to use Link instead of Handle_My_Link.
add_handler('Handle_My_Link', link_handler)

function myComponent() {
  return render`
    <div>
      <Handle_My_Link href='/blog'>
	<a>visit blog</a>
      <//>
    </div>
  `
}
```
IMPORTANT: once you add a handler all child components will be able to access it there's no need to keep adding it for each component that uses it.
If you want to use it for all routes just add the handler before calling `router({...config})`
#### Promise
- expects prop `promise` to be a promise.
- `component` component to render when promise resolves.
- `placeholder` spinner or placeholder until `promise` resolves.
##### usage
```js
// given that we added promise handler with string 'Promise'
render`
  <Promise
    component=${(data) => render`<div>${JSON.stringify(data)}</div>`}
    placeholder=${() => render`<${spinner} />`}
    promise=${async () => {
      const p = await fetch('https://jsonplaceholder.typicode.com/todos/1')
      const data = await p.json()
      return data
    }}
  />
`
```
#### Lazy
- expects prop `data` to be an array.
- `template` to use against every element in the array.
- `lazy_load` function that handles the lazy loading.
##### usage ( IntersectionObserver )
```js
render`
  <Lazy
    template=${(data) => render`<img data-src=${data.url} width='100px' height='100px' />`}
    data=${[{url: 'path-to-img'}, {url: 'path-to-img'}]}
    lazy_load=${(target) => {
      const io = new IntersectionObserver((entries, observer) => {
	entries.forEach(entry => {
	  if(entry.isIntersecting) {
	    target.setAttribute('src', target.dataset.src)
	    target.removeAttribute('data-src')
	    observer.disconnect()
	  }
	})
      })
      io.observe(target)
    }}
  />
`
```
#### Box
- transforms all props to style elements.
- if `props.type` then it will use what ever type otherwise it will use `div`
```js
render`
  <Box type='ul' display='grid' background-color='skyblue'>
    <li>item - 1<//>
    <li>item - 2<//>
  <//>
`
```
#### Create Your Own
Not every reusable components needs to be a `handler`  to get started building your own handler on top of nano_spa first see this  [snippet](#handlers).

also checkout `examples` directory in the repo.

##### Road Map
This project exist because i felt like react is too much most of the time and i needed i lighter alternative with incremental style api, i decided to make it open source only for like minded people to contribute and make it better.
- adding more handlers: `state`  handling state and diffs.
- code splitting on route level by default.
- making `webpack` cli wrapper.
- want something else? this is the perfect time to ask for it (in issues) since the project is in early stages.
## Deploy
if you're using `router` then you are using a client side router and thus require to serve `index.html` and all `.js` resources with every route.

to achieve this, many tools like [`now`](https://zeit.co/docs) and [`netlify`](https://netlify.com) offer a way to handle single page application (spa) with the mechanism mentioned above.

for `now` just add the following to `now.json` and add it to the `dist` directory and move `main.js` to `/static/main.js`.
```json
{
  "version": 2,
  "name": "my-test-app",
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": { "cache-control": "s-maxage=31536000,immutable" },
      "dest": "/static/$1"
    },
    {"src": "/main.js", "dest": "/static/main.js"},
    {"src": "/robots.txt", "dest": "/static/robots.txt"},
    {
      "src": "/(.*)",
      "headers": {"cache-control": "s-maxage=0"},
      "dest": "/index.html"
    }
  ]
}
```
Enjoy 🎉
