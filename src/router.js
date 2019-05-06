import _head from './head.js'
import parse_query from './parse_query.js'
// TODO Link and Head.
const get_pathname = () => window.location.pathname

export default function router(_container, config) {
  const {_config, ...routes} = config
  const { plugins, head } = _config
  // how to create dom nodes TODO refactor
  function create_dom_nodes(node) {
    let {type, props, children} = node
    if(type === 'Link') {
      const node = children[0]
      const element = document.createElement(node.type)
      // handle edge cases > not anchor.
      element.href = props.as ? props.as : props.href
      element.appendChild(document.createTextNode(node.children[0]))
      const base = props.href.split('?')[0]
      const query = parse_query(props.href)
      element.onclick = e => {
        e.preventDefault()
        window.history.pushState({query}, '', props.as || props.href)
        routes[props.as] = routes[base].bind(null, {query})
        render_route(_container, head, routes, base, {query})
      }
      return element
    }
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
  // how to render a route
  function render_route(container, head, routes, path, ctx={}) {
    const route_component = routes[path] ? routes[path](ctx) : routes['*']()
    const head_component = typeof head[path] === 'function'
      ? head[path](ctx)
      : []
    _head.set(Array.isArray(head_component)
      ? head_component.map(vnode => create_dom_nodes(vnode))
      : create_dom_nodes(head_component)
    )
    container.innerHTML = ''
    container.appendChild(create_dom_nodes(route_component))
  }
  // handle initial nav elements
  Array.from(document.querySelectorAll('.spa-nav')).map(element => {
    element.onclick = e => {
      e.preventDefault()
      window.history.pushState({}, '', element.href)
      render_route(_container, head, routes, get_pathname())
    }
  })
  // renders initial route.
  render_route(_container, head, routes, get_pathname())
  // this only handles back and forward history.
  window.onpopstate = (e) => {
    render_route(
      _container,
      head,
      routes,
      get_pathname(),
      e.state
    )
  }
}
