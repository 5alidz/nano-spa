import create_dom_nodes from './dom.js'

function render_route(container, routes, path) {
  const route_component = routes[path] ? routes[path]() : routes['*']()
  container.innerHTML = ''
  container.appendChild(create_dom_nodes(route_component))
}
export default function router(_container, config) {
  const {_config, ...routes} = config
  const { plugins, head } = _config
  const initial_nav_elements = Array.from(document.querySelectorAll('.spa-nav'))
  const nav_onclick = dom_element => dom_element.onclick = e => {
    e.preventDefault()
    window.history.pushState({}, '', dom_element.href)
    render_route(_container, routes, window.location.pathname)
  }
  initial_nav_elements.map(nav_onclick)
  render_route(_container, routes, window.location.pathname)
  window.onpopstate = () =>
    // handle back and forward history.
    render_route(_container, routes, window.location.pathname)
}
