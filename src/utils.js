import _global from './global.js'

const UNMOUNT = 'on_route_unmount'
const MOUNT = 'on_route_mount'

export const get_current = () => window.location.pathname

export const __PUSH_STATE__ = route => window.history.pushState({}, '', route)

export const on_unmount = (route) => _global.methods[UNMOUNT]
  && _global.methods[UNMOUNT](
    route || get_current(),
    _global.root.children[0]
  )

export const on_mount = (route_dom) => _global.methods[MOUNT]
  && _global.methods[MOUNT](get_current(), route_dom)

export const regex_match = (route, routes) => {
  let matched = undefined
  if(routes[route]) {
    return matched
  } else {
    Object
      .keys(routes)
      .filter(key => key !== '*' || routes.hasOwnProperty(route))
      .map(key => {
        const regex = new RegExp(key)
        if(!regex.test(route)) { return }
        const regex_vals = regex.exec(route)
        if(regex.test(route) && regex_vals.length >= 2) {
          const [, ...matches] = regex_vals
          matched = routes[key] ? [routes[key], matches] : undefined
        }
      })
    return matched
  }
}
