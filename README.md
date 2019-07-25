# nano_spa
nano_spa is a way to write single page applications with lazy loading "features" aka "handlers" by default and auto generates docs for you.

NOTE: although most of the api is stable (render, to_dom), `nano_spa` is still very experimental and changes might happend to the default `handlers` `Box, State, etc...`.

- [Get Started](#get-started)
- [CLI Usage](#cli-usage)
- [render](#render)
- [to_dom](#to_dom)
- [handlers](#handlers)
	- [Box](#box)
	- [State](#state)
	- [Reducer](#reducer)
	- [Router](#router)
	- [Router::link](#routerlink)
	- [Router::head](#routerhead)
- [Create Your Own Handlers](#create-your-own-handlers)
- [Generate Docs](#generate-docs)
- [Deploy](#deploy)
## Get started
- Create your apps directory (you can have many apps under one directory sharing the same features).
$ `mkdir my-app && cd my-app`
- initialize project
$ `npm init -y && npm i nano_spa`
- add start script in `package.json`
```json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "nano_spa start",
    "build": "nano_spa build",
    "docs": "nano_spa docs"
  }
}
```
## CLI usage
#### start
Starts the development server.
##### Arguments
- `-s` source folder to start the development server from, defaults to `app`.
- `-p` port to serve, defaults to `3000`.

Example:
the following starts the development server on `another-app` directory on port 5000.
```json
"scripts": {
  "start:another-app": "nano_spa start -s another-app -p 5000"
}
```
$ `npm run start:another-app`
##### Requirements
inside the root of your "source" directory it must contains.
- `index.html`
- `main.js`
- `static`

NOTE: if the above does not exist nano_spa will create a simple hello world starter for you.

#### build
Builds your project in `dist-app`
##### Arguments
- `-s` source folder to build, defaults to `app`.

Example:
the following builds `another-app` to `dist-another-app`
```json
{
  "scripts": {
    "build:another-app": "nano_spa build -s another-app"
  }
}
```
$ `npm build:another-app`
##### Requirements
given the previous example you must have a `another-app` directory.
#### docs
Generates documentation for the whole project, specifically from `handlers-props`.
check handlers-props for more info.

## render
render under the hood uses [htm](https://github.com/developit/htm), this means that render just renders a string to jsx object.
#### simple usage
```js
import render from 'nano_spa/render'

function app() {
  return render`<div>Hello, world!</div>`
}
```
#### with components
```js
import render from 'nano_spa/render'

// simple component.
function myComponent({msg}) {
  return render`<div>${msg}</div>`
}

// also supports fragments.
function myFragment() {
  return render`
    <>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </>
  `
}

function app() {
  return render`
    <div>
      <${myComponent} msg='hello, world!' />
      <${myFragment} />
    </div>
  `
}
```

## to_dom
converts jsx made from `render` to DOM nodes

#### usage
```js
import render from 'nano_spa/render'
import to_dom from 'nano_spa/to_dom'

function app() {
  return render`<div>Hello, world!</div>`
}

document.getElementById('root').appendChild(to_dom(render`<${app} />`))
```

in the case of `app` returning a fragment, to_dom will return an array of DOM nodes.

```js
function app() {
  return render`
    <>
      <li>1</li>
      <li>2</li>
    </>
  `
}

const appRoot = document.getElementById('root')

to_dom(render`<${app} />`).forEach(domNode => appRoot.appendChild(domNode))
```

## handlers
Now that you are familiar with the core concepts of `nano_spa` it is time to get familiar with handlers.

when using `render`, the moment `render` encounters an element that starts with an uppercase element E.g. `<Div />` it will look for `./handlers/Div.js` and it will lazley load that module, without importing the module!

`nano_spa` ships with default handlers:
- Box
- State
- Reducer
- Router
- Router::link
- Router::head

### Box
Box is a very simple handler that transforms props to style elements.

|prop|type|required|default|description|
|--|--|--|--|--|
|type|string|false|div|sets the DOM node type|
|grid|boolean|false|none|sets the display to grid|
|flex|boolean|false|none|sets the display to flex|
|*|string|false|none|appends to the style attribute|
#### usage
```js
import render from 'nano_spa/render'

function app() {
  return render`
    <Box
      type='main'
      padding='1rem'
      background-color='blue'
      display='grid'
    >
      Hello, world
    </Box>
  `
}

  /*
  *** note that we didn't import Box from 'somewhere' ***
  this is the same as:
  <main style='padding: 1rem; background-color: blue; display: grid;'>
    Hello, world
  </main>
  */

```
### State
|prop|type|required|default|description|
|--|--|--|--|--|
|state|object|true|none|none|
|render|function|true|none|a function that takes state and setState as arguments and returns a component|

#### usage
```js
import render from 'nano_spa/render'

// simple counter example.
const counter = (state, setState) => {
  /*
    setState only accepts function as argument and expected to
    return an object.
  */
  const increment = () => setState(oldState => ({
    count: oldState.count + 1
  }))
  return render`
    <div>
      <button onclick=${increment}>
        increment
      </button>
      ${state.count}
    </div>
  `
}
function myComponent() {
  const state = { count: 0 }
  return render`<State state=${state} render=${counter} />`
}
```

### Reducer
|prop|type|required|default|description|
|--|--|--|--|--|
|initial|object|true|none|initial state|
|reducer|function|true|none|a function that takes state, action as arguments and returns new state|
|render|function|true|none|a function that takes state and dispatch as arguments and returns a component|

#### usage
```js
import render from 'nano_spa/render'

const reducer = (state, action) => {
  if(action.type == 'INCREMENT') {
    return {...state, count: state.count + 1}
  } else if(action.type == 'DECREMENT') {
    return {...state, count: state.count - 1}
  } else {
    return state
  }
}
const counter = (state, dispatch) => {
  const increment = () => dispatch({type: 'INCREMENT'})
  const decrement = () => dispatch({type: 'DECREMENT'})
  return render`
    <div>
      <button onclick=${increment}>increment</button>
      <button onclick=${decrement}>increment</button>
      ${state.count}
    </div>
  `
}
function myComponent() {
  return render`
    <Reducer
      initial=${{ count: 0}}
      reducer=${reducer}
      render=${counter}
    />
  `
}
```

### Router
|prop|type|required|default|description|
|--|--|--|--|--|
|dir|function|true|none|a function that returns a dynamic import statement|
|on_mount|function|true|none|a function that takes DOM node of current page, and current route|
|on_unmount|function|true|none|a function that takes DOM node of previous page, and previous route|

#### usage
```js
// in main.js
import render from 'nano_spa/render'

function app() {
  return render`
    <div>
      <h1>I will exist on every route!</h1>
      <Router
        dir=${page => import(`./pages/${page}.js`)}
        on_mount=${console.log}
        on_unmount=${console.log}
      />
    </div>
  `
}
/*
 * now you have to create a directory `pages`
 * inside `pages`:
 * '/' maps to index.js
 * 'a not found route' maps to 404.js
 * or the default 404 page that comes with Router
*/
```

```js
// in ./pages/index.js
import render from 'nano_spa/render'

export default () => render`<div>hello, world</div>`
```

### Router@link
|prop|type|required|default|description|
|--|--|--|--|--|
|href|string|true|none|none|

#### usage
```js
/*
 * Router::link supports any element that accepts an `onclick` method.
 * a, button, img, ...etc. and will set `tabIndex` to 0. for a11y
 * it's very important that you don not set href on the anchor tag here.
*/
// ...
  `<Router::link href='/'>
    <a>Home</a>
  <//>`
// ...
```

### Router@head
does not take any props just one or more children, and works on route level.

#### usage
```js
// ...
  `<Router::head>
    <title>my-app | Home</title>
    <meta name='description' content='this is our home page.'/>
  <//>`
// ...
```

## Create Your Own Handlers

handlers let you use your favorite data structures and the full capability of the web platform.
this means the possiblities are endless, you could make a `react` handler if you want.

handlers accepts virtual `node` (jsx object), `utils`, and if it returns a DOM node then it will be appended to the rest of the jsx tree it does not return anything, then it will just execute whatever is inside of your handler, treating it as a side effect if you will.

`utils` contains {to_dom, on}
in the root of your project create `Hello.js` inside `./handlers`

```js
// inside ./handlers/Hello.js
export default helloHandler(vNode) {
  const Hello = document.createElement('div')
  Hello.innerText = 'hello, ' + vNode.props.name || ''
  return Hello
}
```

#### usage

```js
// inside ./app/main.js
import render from 'nano_spa/render'
import to_dom from 'nano_spa/to_dom'

function app() {
  return render`
    <Hello name='world'/>
  `
}

document.getElementById('root').appendChild(to_dom(render`<${app} />`))
```

## Generate Docs

To generate docs for your project `nano_spa` looks for `./handlers-props/MyHandler.js`
this will allow for development warnings + auto generated docs.

given the previous example `Hello.js` to include it and the docs and have development environment warnings and errors you must create `./handlers-props/Hello.js` and populate it as follows.

```js
// inside ./handlers-props/Hello.js
module.exports = {
  name: {
    type: ['string'],
    required: false
  }
}
```

NOTE: when you use the command `nano_spa docs` inside `scripts` in your `package.json`
`nano_spa` will look at your handlers directory and generate empty prop-types for the handlers it found.

## Deploy

the only thing to keep in mind when deploying is you serve `index.html` at every route.
great deployment services like `zeit/now` or `netlify` provide a very easy way to do this.

that's it. examples coming soon!

