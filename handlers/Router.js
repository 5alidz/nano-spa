import g from './shared/router.js'
import default_404 from './shared/default_404.js'

const clear_root = (r, c) => {
  r.innerHTML = ''
  r.appendChild(c)
}

const resolve_name = name => {
  if(name == '/') {
    return 'index'
  } else {
    return name.replace(/\//g, '@').substr(1, name.length)
  }
}

const init_render_page = (props, to_dom, root) => {
  return (route) => {
    if(g.routes[route]) {
      return clear_root(root, g.routes[route])
    } else {
      props.dir(resolve_name(route))
        .then(_module => {
          const c = to_dom(_module.default())
          g.routes[route] = c
          clear_root(root, c)
          requestIdleCallback(() => g.routes[route] = g.root.children[0])
        })
        .catch(_ => {
          props.dir('404')
            .then(_m => {
              const c = to_dom(_m.default())
              g.routes[route] = c
              clear_root(root, c)
            })
            .catch(_ => {
              clear_root(root, default_404())
            })
        })
    }
  }
}
export default function router_handler(vNode, { to_dom }) {
  if(process.env.NODE_ENV !== 'production') {
    (async () => {
      try{
        const [prop_types, validate_props] = await Promise.all([
          import('../handlers-props/Router.js'),
          import('../validate_props.js')
        ])
        validate_props.default(prop_types.default, vNode)
      } catch(err) {console.log(err)}
    })()
  }

  const root = document.createElement('div')
  const { props } = vNode
  const render = init_render_page(props, to_dom, root)

  g.root = root
  g.render = render

  g.CURRENT = window.location.pathname
  g.render(g.CURRENT)

  window.onpopstate = () => {
    g.PREVIOUS = g.CURRENT
    g.CURRENT = window.location.pathname
    g.render(g.CURRENT)
    if(g.heads[g.PREVIOUS]) g.heads[g.PREVIOUS].map(el => g.doc_head.removeChild(el))
    if(g.heads[g.CURRENT]) g.heads[g.CURRENT].map(el => g.doc_head.appendChild(el))
  }
  return root
}
