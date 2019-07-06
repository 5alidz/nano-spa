import _global from './global.js'
import mount_component from './mount_component.js'
import to_dom from '../to_dom.js'

import {match} from './utils.js'

let prev_head = []
const head = document.head
const mount_to_head = (c) => mount_component(head, c, true)

const clear_prev = () => Array.isArray(prev_head)
  ? prev_head.map(node => head.removeChild(node))
  : head.removeChild(prev_head)

export const mount_first_head = () => {
  const default_head = _global.head['*']
  if(typeof default_head == 'function') {
    const comp = default_head()
    const comp_dom = to_dom(comp)
    mount_component(head, comp_dom, true)
    comp_dom.forEach(node => head.appendChild(node))
  }
}

export const set = (route) => {
  clear_prev()
  if(_global.head_cache[route]) {
    // from cache
    prev_head = _global.head_cache[route]
    // mounting
    mount_to_head(_global.head_cache[route])
  } else {
    const matched = match(route, _global.head)
    if(matched) {
      const comp = matched[0](matched[1])
      const comp_dom = to_dom(comp)
      // caching
      _global.head_cache[route] = comp_dom
      prev_head = _global.head_cache[route]
      // mounting
      mount_to_head(_global.head_cache[route])
    } else if(!_global.head[route]) {
      prev_head = []
    } else if(typeof _global.head[route] == 'function') {
      const dom_node = to_dom(_global.head[route]())
      // caching
      _global.head_cache[route] = dom_node
      prev_head = _global.head_cache[route]
      // mounting
      mount_to_head(_global.head_cache[route])
    }
  }
}
