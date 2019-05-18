import lib from '../src/index.js'

import { Home, HomeHead } from './pages/index.js'
import { About, AboutHead } from './pages/about.js'
import { Contact } from './pages/contact.js'
import { NotFound, defaultHead } from './pages/404.js'
import { Posts } from './pages/posts.js'

const { router, render } = lib

router({
  root: document.getElementById('app'),
  routes: {
    '/': () => render`<${Home} content='Hello World'/>`,
    '/about': () => render`<${About} />`,
    '/contact': () => render`<${Contact} />`,
    '/posts': () => render`<${Posts} />`,
    '*': () => render`<${NotFound} />`,
  },
  head: {
    '/': HomeHead,
    '/about': AboutHead,
    '*': defaultHead
  }
})


