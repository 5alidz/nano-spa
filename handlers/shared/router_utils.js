export const g = {
  routes: {},
  render: () => {},
  root: undefined
}
export const clear_root = (r, c) => {r.innerHTML = '';r.appendChild(c)}

export const resolve_name = name => {
  if(name == '/') {
    return 'index'
  } else {
    return name.replace(/\//g, '@').substr(1, name.length)
  }
}

export const init_render_page = (props, to_dom, root) => {
  return (route) => {
    if(g.routes[route]) {
      return clear_root(root, g.routes[route])
    } else {
      props.dir(resolve_name(route))
        .then(_module => {
          const c = to_dom(_module.default())
          g.routes[route] = c
          clear_root(root, c)
        })
        .catch(err => {
          props.dir('404')
            .then(_m => {
              const c = to_dom(_m.default())
              g.routes[route] = c
              clear_root(root, c)
            })
            .catch(_err => {
              clear_root(root, default_404())
            })
        })
    }
  }
}
