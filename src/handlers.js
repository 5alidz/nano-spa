import render from './create_element.js'
import create_dom_nodes from './create_dom_nodes.js'

import { on_unmount, on_mount } from './utils.js'

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
  let prev_head = []
  const clear_prev = () => prev_head.map(node => head.removeChild(node))
  const head = document.head
  const default_head = components['*']
  if(default_head) {
    const rendered = default_head()
    // #1
    if(Array.isArray(rendered)) {
      rendered.map(vnode => head.appendChild(create_dom_nodes(vnode)))
    } else {
      head.appendChild(create_dom_nodes(rendered))
    }
  }
  return {
    set(route) {
      if(!components[route]) {
        clear_prev()
        prev_head = []
        return
      }
      clear_prev()
      const rendered = components[route]()
      // #1
      if(Array.isArray(rendered)) {
        const nodes = prev_head = rendered.map(vnode => create_dom_nodes(vnode))
        nodes.map(dom_node => head.appendChild(dom_node))
      } else {
        const node = prev_head = [create_dom_nodes(rendered)]
        head.appendChild(node[0])
      }
    }
  }
}

export const init_routes = (routes, root_handler, head_handler, methods) => {
  const NOT_FOUND = routes['*']
    ? routes['*']
    : () => render`<h1 style='text-align: center;'>404</h1>`

  const handlers = {
    'PROMISE': (node) => {
      const { props } = node
      const { placeholder, ..._props } = props.promise.props
      const new_node = props.promise.type(_props)
      const _placeholder = placeholder()
      const element = create_dom_nodes(_placeholder)
      new_node.then(_node => {
        element.parentNode.replaceChild(create_dom_nodes(_node), element)
      })
      return element
    },
    'LINK': (node) => {
      const target = node.children[0]
      const element = create_dom_nodes(target)
      const href = node.props.href
      console.log(node)
      const match_href = href.split('/').filter(_ => _)
      // pls regex.
      const source = Object.keys(routes).reduce((acc, curr) => {
        const match_arr = curr.split('*').map(s => s.replace(/\//g, ''))
        if(match_arr.length === match_href.length) {
          acc.src = '/' + match_arr.map(el => !el ? '*' : el).join('/')
          acc.params = match_href.filter(s => match_arr.indexOf(s) === -1)
          return acc
        } else {return acc}
      }, {})
      element.href = href
      element.onclick = e => {
        e.preventDefault()
        on_unmount(methods, root_handler)
        window.history.pushState({}, '', href)
        head_handler.set(href)
        const route_component = routes[href]
          ? routes[href]()
          : routes[source.src]
            ? routes[source.src](source.params)
            : NOT_FOUND()
        const route_dom = create_dom_nodes(route_component)
        on_mount(methods, route_dom)
        root_handler.replace_with(route_dom)
      }
      return element
    }
  }

  return {
    render: () => {
      const route = window.location.pathname
      const route_dom = routes[route]
        ? create_dom_nodes.call(handlers, routes[route]())
        : create_dom_nodes(NOT_FOUND())
      head_handler.set(route)
      on_mount(methods, route_dom)
      root_handler.replace_with(route_dom)
    }
  }
}
