import _global from './global.js'
import create_dom_nodes from './create_dom_nodes.js'
import { regex_match } from './utils.js'

const head = document.head

let prev_head = []

const clear_prev = () => prev_head.map(node => head.removeChild(node))

const render_single = vnode => {
  const node = create_dom_nodes(vnode)
  head.appendChild(node)
  return node
}

const render_arr = nodes => nodes.map(render_single)

const handle_component = (comp, is_to_prev) => comp ? Array.isArray(comp)
  ? is_to_prev ? prev_head = render_arr(comp) : render_arr(comp)
  : is_to_prev ? prev_head = [render_single(comp)] : render_single(comp)
  : undefined

export const mount_first_head = () => handle_component(
  _global.head['*'] && _global.head['*'](),
  false
)

export const set = (route) => {
  clear_prev()
  const matched = regex_match(route, _global.head)
  if(matched) {return handle_component(matched[0](matched[1]), true)}
  if(!_global.head[route]) {return (prev_head = [])}
  handle_component(_global.head[route](), true)
}
