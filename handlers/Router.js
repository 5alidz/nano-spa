import default_404 from './shared/default_404.js'

import {
  g,
  clear_root,
  resolve_name,
  init_render_page
} from './shared/router_utils.js'

export default function router_handler(vNode, to_dom) {
  const root = document.createElement('div')
  const { props } = vNode
  const render = init_render_page(props, to_dom, root)

  g.root = root
  g.render = render

  render(window.location.pathname)

  window.onpopstate = () => {
    render(window.location.pathname)
  }
  return root
}
