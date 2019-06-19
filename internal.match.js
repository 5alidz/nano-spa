export default (route, routes) => {
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
