import _global from './internal.global.js'
import match from './internal.match.js'
import { set } from './internal.head.js'

import _404 from './default.404.js'
import to_dom from './to_dom.js'

const finalize = (route, dom) => {
  set(route)
  _global.methods.on_route_mount(window.location.pathname, dom)
  _global.root.innerHTML = ''
  _global.root.appendChild(dom)
}

const gen_tree = (route, matched) => {
  if(_global.routes[route]) {
    return _global.routes[route]()
  } else {
    if(matched) {
      return matched[0](matched[1])
    } else {
      return _404()
    }
  }
}

export default () => {
  const route = window.location.pathname
  const DONT_CACHE = _global.cache.includes(route)
  if(DONT_CACHE) {
    const matched = match(route, _global.routes)
    const route_tree = to_dom(gen_tree(route, matched))
    finalize(route, route_tree)
  } else if(_global.route_cache[route]) {
    finalize(route, _global.route_cache[route])
  } else {
    const matched = match(route, _global.routes)
    const route_tree = to_dom(gen_tree(route, matched))
    _global.route_cache[route] = route_tree
    finalize(route, _global.route_cache[route])
  }
}
