import _global from './internal.global.js'
import mount_component from './mount_component.js'
import to_dom from './to_dom.js'

import { set } from './internal.head.js'
import {match} from './internal.utils.js'

import _404 from './default.404.js'

const finalize = (route, dom) => {
  set(route)
  mount_component(_global.root, dom)
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
