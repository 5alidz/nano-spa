import render from './create_element.js'
import create_dom_nodes from './create_dom_nodes.js'

import {
  on_unmount,
  on_mount,
  __PUSH_STATE__,
  get_current,
  traverse
} from './utils.js'

const regex_match = (route, routes) => {
  let matched = undefined
  Object.keys(routes).filter(key => key !== '*').map(key => {
    if(routes[route]) {return}
    const regex = new RegExp(key)
    const regex_vals = regex.exec(route)
    if(regex.test(route) && regex_vals.length >= 2) {
      const [, ...matches] = regex_vals
      matched = routes[key] ? [routes[key], matches] : undefined
    }
  })
  return matched
}

export const init_root = (root) => {
  return {
    replace_with(dom_node) {
      root.innerHTML = ''
      root.appendChild(dom_node)
    },
    root
  }
}

export const init_head = (components={}) => {
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
  handle_component(components['*'] && components['*'](), false)
  return {
    set(route) {
      clear_prev()
      const matched = regex_match(route, components)
      if(matched) {return handle_component(matched[0](matched[1]), true)}
      if(!components[route]) {return (prev_head = [])}
      handle_component(components[route](), true)
    }
  }
}

export const init_routes = (
  routes,
  root_handler,
  head_handler,
  methods,
  cache
) => {
  const caches = {}

  const NOT_FOUND = routes['*']
    ? routes['*']
    : () => render`<h1 style='text-align: center;'>404</h1>`

  const gen_tree = (route, matched) => routes[route]
    ? routes[route]()
    : matched ? matched[0](matched[1]) : NOT_FOUND()

  const __FINAL__ = (route, tree, with_handlers) => {
    const dom = with_handlers(tree)
    on_mount(methods, dom)
    head_handler.set(route)
    root_handler.replace_with(dom)
  }

  const handlers = {
    PROMISE: (node) => {
      const with_handlers = create_dom_nodes.bind(handlers)
      const { props } = node
      const { placeholder, ..._props } = props.promise.props
      const new_node = props.promise.type(_props)
      const _placeholder = placeholder()
      const element = with_handlers(_placeholder)
      new_node.then(_node => {
        element.parentNode.replaceChild(with_handlers(_node), element)
        caches[get_current()] = traverse(caches[get_current()], (root) => {
          if(root.type == '__PROMISE__' && root.props.id === node.props.id) {
            return _node
          }
          return root
        })
      })
      return element
    },
    LINK: (node) => {
      const with_handlers = create_dom_nodes.bind(handlers)
      const target = node.children[0]
      const element = with_handlers(target)
      const href = node.props.href
      element.href = href
      const matched = regex_match(href, routes)
      element.onclick = e => {
        e.preventDefault()
        on_unmount(methods, root_handler)
        __PUSH_STATE__(href)
        const route_tree = gen_tree(href, matched)
        __FINAL__(href, route_tree, with_handlers)
      }
      return element
    }
  }

  return {
    render: () => {
      const with_handlers = create_dom_nodes.bind(handlers)
      const route = get_current()
      const DONT_CACHE = cache.includes(route)
      const matched = regex_match(route, routes)
      const route_tree = gen_tree(route, matched)
      if(!caches[route]) { caches[route] = route_tree }
      __FINAL__(route, DONT_CACHE ? route_tree : caches[route], with_handlers)
    }
  }
}
