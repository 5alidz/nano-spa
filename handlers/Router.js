import { g, init_render_page } from './shared/router_utils.js'

export default function router_handler(vNode, { to_dom }) {
  if(process.env.NODE_ENV !== 'production') {
    (async () => {
      try{
        const [prop_types, validate_props] = await Promise.all([
          import('../handlers.props/Router.js'),
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
    g.heads[g.PREVIOUS].map(el => g.doc_head.removeChild(el))
    if(g.heads[g.CURRENT]) {
      g.heads[g.CURRENT].map(el => g.doc_head.appendChild(el))
    }
  }
  return root
}
