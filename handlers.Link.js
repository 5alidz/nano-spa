import match from './src/internal/match.js'
import _global from './src/internal/global.js'
import { set } from './src/internal/head.js'

import to_dom from './to_dom.js'
import _404 from './src/default.404.js'

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

const finalize = (route, dom) => {
  set(route)
  _global.methods.on_route_mount(window.location.pathname, dom)
  _global.root.innerHTML = ''
  _global.root.appendChild(dom)
}

export default function LINK(vNode) {
  const target = vNode.children[0]
  const element = to_dom(target)
  const href = vNode.props.href
  if('href' in element) {
    element.href = href
  } else {
    element.tabIndex = '0'
  }
  const matched = match(href, _global.routes)
  element.onclick = e => {
    e.preventDefault()
    if(window.location.pathname == href) { return }
    _global.methods.on_route_unmount(window.location.pathname, _global.root.children[0])
    window.history.pushState({}, '', href)
    let route_tree
    if(_global.route_cache[href]) {
      route_tree = _global.route_cache[href]
    } else {
      _global.route_cache[href] = to_dom(gen_tree(href, matched))
      route_tree = _global.route_cache[href]
    }
    finalize(href, route_tree)
  }
  return element
}
