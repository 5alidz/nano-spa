import {
  init_root,
  init_head,
  init_render_route,
  init_routes,
} from './router.utils.js'

const current_path = () => window.location.pathname

const bind_initial = (render_route, root_handler, methods) => {
  document.querySelectorAll('.LINK').forEach(link => {
    link.onclick = function(e) {
      e.preventDefault()
      const href = this.getAttribute('href')
      if(current_path() === href) {return}
      methods['on_route_unmount']&&methods['on_route_unmount'](
        current_path(),
        root_handler.root.children[0]
      )
      window.history.pushState({}, '', href)
      render_route(href)
    }
  })
}

export default function router(o) {
  const { root, routes, head, methods } = o

  const root_handler = init_root(root)
  const head_handler = init_head(head)
  const route_handler = init_routes(routes, root_handler, head_handler, methods)
  const render_route = init_render_route(
    root_handler,
    head_handler,
    route_handler,
    methods
  )

  bind_initial(render_route, root_handler, methods)

  render_route(current_path())

  window.onpopstate = () => {
    methods['on_route_unmount']&&methods['on_route_unmount'](
      window.location.pathname,
      root_handler.root.children[0]
    )
    render_route(current_path())
  }
}
