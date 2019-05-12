import _head from './head.js'
import parse_query from './parse_query.js'

const get_pathname = () => window.location.pathname

const bind_initial_nav = (render_route, on_route_change) => () => {
  Array.from(document.querySelectorAll('.spa-nav')).map(element => {
    element.onclick = e => {
      e.preventDefault()
      if(get_pathname() === element.getAttribute('href')) {return}
      window.history.pushState({}, '', element.href)
      render_route(get_pathname())
      if(on_route_change) {
        on_route_change(get_pathname())
      }
    }
  })
}



export default function router(_container, config) {
  const {_config, ...routes} = config
  const head = _config.head || {}
  //const plugins = _config.plugins || []
  const on_route_change = _config.on_route_change || undefined
  const initial_head = head['*'] ? head['*'] : undefined

  function handle_props(props, element) {
    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith('on') && key.toLowerCase() === key) {
        element[key] = value
      } else {
        element.setAttribute(key, value)
      }
    })
  }

  function handle_children(children, element) {
    children.forEach(child => {
      if (child === undefined || child === null) {
        return
      } else if (typeof child === 'string' || typeof child === 'number') {
        element.appendChild(document.createTextNode(child))
      } else if (Array.isArray(child)) {
        child.map(({type, props, children}) => {
          element.appendChild(create_dom_nodes({type, props, children}))
        })
      } else {
        element.appendChild(create_dom_nodes({...child}))
      }
    })
  }

  function create_dom_nodes(node) {
    let {type, props, children} = node
    if(type == 'Link') {
      const node = children[0]
      const element = document.createElement(node.type)
      if(node.type == 'a') {element.href = props.as ? props.as : props.href}
      const base = props.href.split('?')[0]
      const query = parse_query(props.href)
      if(query) {
        routes[props.as] = routes[base].bind(null, {query})
        head[props.as] = head[base].bind(null, {query})
      }
      element.onclick = e => {
        e.preventDefault()
        window.history.pushState({query}, '', props.as || props.href)
        render_route(props.as || props.href, {query})
        if(on_route_change) {on_route_change(props.href)}
      }
      handle_props(node.props, element)
      handle_children(node.children, element)
      return element
    } else {
      const element = document.createElement(type)
      handle_props(props, element)
      handle_children(children, element)
      return element
    }
  }

  const maybe_node_arr = (arr) => Array.isArray(arr)
    ? arr.map((vnode => create_dom_nodes(vnode)))
    : create_dom_nodes(arr)

  function render_route(path, ctx={}) {
    const route_component = routes[path] ? routes[path](ctx) : routes['*']()
    const head_component = head[path] ? head[path](ctx): []
    _head.set(maybe_node_arr(head_component))
    _container.innerHTML = ''
    _container.appendChild(create_dom_nodes(route_component))
  }

  if(initial_head) {
    const head_component = typeof  initial_head === 'function' ? initial_head() : undefined
    if(!head_component) { return }
    _head.default(maybe_node_arr(head_component))
  }
  bind_initial_nav(render_route, on_route_change)()
  render_route(get_pathname())
  window.onpopstate = () => {render_route(get_pathname())}
}
