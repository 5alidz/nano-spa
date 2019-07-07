import default_404 from './shared/default_404.js'

const g = {}
const map = {'/': 'index', '*': '404'}
const route_g = route => route.substr(1, route.length)
const clear_root = (r, c) => {r.innerHTML = '';r.appendChild(c)}

export default function router_handler(vNode, to_dom) {
  const root = document.createElement('div')
  const { props } = vNode
  let first_route = window.location.pathname

  if(first_route[0] == '/' && first_route.length > 1) {
    first_route = first_route.substr(1, first_route.length)
  }

  props.dir(map[first_route] || first_route)
    .then(_module => {
      const component = to_dom(_module.default())
      g[window.location.pathname] = component
      clear_root(root, component)
    })
    .catch(err => {
      props.dir('404')
        .then(_m => {
          const component = to_dom(_m.default())
          g[window.location.pathname] = component
          clear_root(root, component)
        })
        .catch(_err => {
          clear_root(root, default_404())
        })
    })
  return root
}
