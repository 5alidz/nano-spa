import {
  init_root,
  init_head,
  init_render_route,
  init_routes,
} from './router.utils.js'

const bind_initial = (render_route) => {
  document.querySelectorAll('.LINK').forEach(link => {
    link.onclick = function(e) {
      e.preventDefault()
      const href = this.getAttribute('href')
      if(window.location.pathname === href) {return}
      window.history.pushState({}, '', href)
      render_route(href)
    }
  })
}

export default function router(o) {
  const { root, routes, head } = o

  const root_handler = init_root(root)
  const head_handler = init_head(head)
  const route_handler = init_routes(routes, root_handler, head_handler)
  const render_route = init_render_route(root_handler, head_handler, route_handler)

  bind_initial(render_route)

  render_route(window.location.pathname)

  window.onpopstate = () => render_route(window.location.pathname)
}
