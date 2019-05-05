import create_dom_nodes from './dom.js'

export default function router(_container, routes = {}) {
  const {_config, ...actual_routes} = routes
  Object.keys(actual_routes).map(id => {console.log(id)})
  Array.from(document.querySelectorAll('.spa-nav'))
    .map(el => {
      el.onclick = e => {
        e.preventDefault()
        // push history state and replace container.
      }
    })
  // read first window.location.href and render the route.
  window.onpopstate = () => ({}) // handle back and forward history.
}
