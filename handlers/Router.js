import { g, init_render_page } from './shared/router_utils.js'

export default function router_handler(vNode, to_dom) {
  const root = document.createElement('div')
  const { props } = vNode
  const render = init_render_page(props, to_dom, root)

  g.root = root
  g.render = render

  g.CURRENT = window.location.pathname
  g.render(g.CURRENT)

  window.onpopstate = () => {
    g.PREVIOUS = g.CURRENT
    g.CURRENT = window.location.pathname
    g.render(g.CURRENT)
  }
  return root
}
