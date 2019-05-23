import create_dom_nodes from './create_dom_nodes.js'
import render from './create_element.js'
import _global from './global.js'
import { set } from './head.js'
import { replace_with } from './root.js'

import {
  regex_match,
  on_mount,
  on_unmount,
  get_current,
  __PUSH_STATE__
} from './utils.js'

const NOT_FOUND = () => _global.routes['*']
  ? _global.routes['*']
  : () => render`<h1 style='text-align: center;'>404</h1>`

const gen_tree = (route, matched) => _global.routes[route]
  ? _global.routes[route]()
  : matched ? matched[0](matched[1]) : NOT_FOUND()()

const __FINAL__ = (route, dom) => {
  on_mount(dom)
  set(route)
  replace_with(dom)
}

const caches = {}

export const handlers = {
  PROMISE(node) {
    const with_handlers = create_dom_nodes.bind(this)
    const { props } = node
    const { placeholder, ..._props } = props.promise.props
    const new_node = props.promise.type(_props)
    const _placeholder = placeholder()
    const element = with_handlers(_placeholder)
    new_node.then(_node => {
      element.replaceWith(with_handlers(_node))
    })
    return element
  },
  LINK(node) {
    const with_handlers = create_dom_nodes.bind(this)
    const target = node.children[0]
    const element = with_handlers(target)
    const href = node.props.href
    'href' in element && (element.href = href)
    const matched = regex_match(href, _global.routes)
    element.onclick = e => {
      e.preventDefault()
      if(get_current() == href) { return }
      on_unmount()
      __PUSH_STATE__(href)
      const route_tree = with_handlers(gen_tree(href, matched))
      __FINAL__(href, route_tree)
    }
    return element
  }
}

export const render_route = () => {
  const with_handlers = create_dom_nodes.bind(handlers)
  const route = get_current()
  const DONT_CACHE = _global.cache.includes(route)
  const matched = regex_match(route, _global.routes)
  const route_tree = with_handlers(gen_tree(route, matched))
  if(!caches[route]) { caches[route] = route_tree }
  __FINAL__(route, DONT_CACHE ? route_tree : caches[route])
}
