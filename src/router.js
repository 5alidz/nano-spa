import _head from './head.js'

// TODO Link and Head.

function create_dom_nodes(node) {
  let {type, props, children} = node
  const element = document.createElement(type)
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('on') && key.toLowerCase() === key) {
      element[key] = value
    } else {
      element.setAttribute(key, value)
    }
  })
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
  return element
}

function render_route(container, head, routes, path) {
  const route_component = routes[path] ? routes[path]() : routes['*']()
  const head_component = typeof head[path] === 'function'
    ? head[path]()
    : []
  _head.set(Array.isArray(head_component)
    ? head_component.map(vnode => create_dom_nodes(vnode))
    : create_dom_nodes(head_component)
  )
  container.innerHTML = ''
  container.appendChild(create_dom_nodes(route_component))
}

export default function router(_container, config) {
  const {_config, ...routes} = config
  const { plugins, head } = _config
  // handle initial nav elements
  Array.from(document.querySelectorAll('.spa-nav')).map(element => {
    element.onclick = e => {
      e.preventDefault()
      window.history.pushState({}, '', element.href)
      render_route(_container, head, routes, window.location.pathname)
    }
  })
  // renders initial route.
  render_route(_container, head, routes, window.location.pathname)
  // this only handles back and forward history.
  window.onpopstate = () => {
    render_route(_container, head, routes, window.location.pathname)
  }
}
