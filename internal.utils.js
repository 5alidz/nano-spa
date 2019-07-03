export function is_noop(_new, state) {
  const state_keys = Object.keys(_new)
  let [noop, length] = [true, state_keys.length]
  for(let i = 0; i < length; i++) {
    const n = state[state_keys[i]]
    const o = _new[state_keys[i]]
    if(n !== o) {
      noop = false
      break
    }
  }
  return noop
}

export function match(route, routes) {
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
