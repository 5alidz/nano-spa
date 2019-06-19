import _global from './internal.global.js'
import match from './internal.match.js'

import to_dom from './to_dom.js'

let prev_head = []
const head = document.head
const clear_prev = () => prev_head.map(node => head.removeChild(node))

export const mount_first_head = () => {
  const default_head = _global.head['*']
  if(typeof default_head == 'function') {
    const comp = default_head()
    const comp_arr = Array.isArray(comp) ? comp : [comp]
    const comp_dom = to_dom(comp_arr)
    comp_dom.forEach(node => head.appendChild(node))
  }
}

export const set = (route) => {
  clear_prev()
  if(_global.head_cache[route]) {
    prev_head = _global.head_cache[route]
    _global.head_cache[route].map(node => head.appendChild(node))
  } else {
    const matched = match(route, _global.head)
    if(matched) {
      const comp = matched[0](matched[1])
      const comp_dom = to_dom(comp)
      _global.head_cache[route] = Array.isArray(comp_dom) ? comp_dom : [comp_dom]
      prev_head = _global.head_cache[route]
      _global.head_cache[route].map(node => head.appendChild(node))
    } else if(!_global.head[route]) {
      prev_head = []
    } else if(typeof _global.head[route] == 'function') {
      const dom_node = to_dom(_global.head[route]())
      _global.head_cache[route] = Array.isArray(dom_node) ? dom_node : [dom_node]
      prev_head = _global.head_cache[route]
      _global.head_cache[route].map(node => head.appendChild(node))
    }
  }
}
