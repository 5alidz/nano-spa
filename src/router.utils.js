import render from './create_element.js'
import create_dom_nodes from './create_dom_nodes.js'

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
  const head = document.head
  const default_head = components['*']
  if(default_head) {
    const rendered = default_head()
    if(Array.isArray(rendered)) {
      rendered.map(vnode => head.appendChild(create_dom_nodes(vnode)))
    } else {
      head.appendChild(create_dom_nodes(rendered))
    }
  }
  return {
    set(route) {
      if(!components[route]) {
        prev_head.map(node => head.removeChild(node))
        prev_head = []
        return
      }
      prev_head.map(dom_node => head.removeChild(dom_node))
      const rendered = components[route] ? components[route]() : undefined
      if(!rendered) {return}
      if(Array.isArray(rendered)) {
        const nodes = rendered.map(vnode => create_dom_nodes(vnode))
        prev_head = nodes
        nodes.map(dom_node => head.appendChild(dom_node))
      } else {
        const node = create_dom_nodes(rendered)
        prev_head = [node]
        head.appendChild(node)
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
      const match_href = href.split('/').filter(_ => _)
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
        methods['on_route_unmount']&&methods['on_route_unmount'](
          window.location.pathname,
          root_handler.root.children[0]
        )
        window.history.pushState({}, '', href)
        head_handler.set(href)
        const route_component = routes[href]
          ? routes[href]()
          : routes[source.src]
            ? routes[source.src](source.params)
            : NOT_FOUND()
        const route_dom = create_dom_nodes(route_component)
        methods['on_route_mount']&&methods['on_route_mount'](href, route_dom)
        root_handler.replace_with(route_dom)
      }
      return element
    }
  }

  return {
    get: (route) => {
      if(routes[route]) {
        return create_dom_nodes.call(handlers, routes[route]())
      } else {
        return create_dom_nodes(NOT_FOUND())
      }
    }
  }
}

export const init_render_route = (
  root_handler,
  head_handler,
  route_handler,
  methods
) => {
  return (route) => {
    const route_dom = route_handler.get(route)
    head_handler.set(route)
    root_handler.replace_with(route_dom)
    methods['on_route_mount']&&methods['on_route_mount'](route, route_dom)
  }
}
