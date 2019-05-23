import lib from '../src/index.js'

import { Home, HomeHead } from './pages/index.js'
import { About, AboutHead } from './pages/about.js'
import { Contact } from './pages/contact.js'
import { NotFound, defaultHead } from './pages/404.js'
import { Posts } from './pages/posts.js'
import { Post, PostHead } from './pages/post.js'

const { router, render } = lib

router({
  root: document.getElementById('app'),
  routes: {
    '/':           () => render`<${Home} content='Hello World'/>`,
    '/about':      () => render`<${About} />`,
    '/contact':    () => render`<${Contact} />`,
    '/posts':      () => render`<${Posts} />`,
    '/blogs/(\\w+)': (matches) =>
      render`<div>just mess up${JSON.stringify(matches)}</div>`,
    '/posts/(.+)': (matches) => render`<${Post} matches=${matches}/>`,
    '*':           () => render`<${NotFound} />`,
  },
  head: {
    '/': HomeHead,
    '/about': AboutHead,
    '/posts/(.+)': PostHead,
    '*': defaultHead
  },
  methods: {
    on_route_mount: console.log,
    on_route_unmount: console.log
  }
})
