import {
  init_root,
  init_head,
  init_routes,
} from './handlers.js'

import { get_current, on_unmount, __PUSH_STATE__ } from  './utils.js'

const bind_initial = (render_route, root_handler, methods) => {
  document.querySelectorAll('.LINK').forEach(link => {
    link.onclick = function(e) {
      e.preventDefault()
      const href = this.getAttribute('href')
      if(get_current() === href) {return}
      on_unmount(methods, root_handler)
      __PUSH_STATE__(href)
      render_route(href)
    }
  })
}

export default function router(o) {
  const { root, routes={}, head={}, methods={}, cache=[] } = o
  const root_handler = init_root(root)
  const head_handler = init_head(head)
  const route_handler = init_routes(routes, root_handler, head_handler, methods, cache)
  bind_initial(route_handler.render, root_handler, methods)
  route_handler.render()

  let prev = get_current()
  window.onpopstate = () => {
    on_unmount(methods, root_handler, prev)
    prev = get_current()
    route_handler.render()
  }
}
