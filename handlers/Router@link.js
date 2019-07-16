import g from './shared/router.js'

export default function router_link_handler(vNode, { to_dom }) {
  /* validate props.*/
  if(process.env.NODE_ENV !== 'production') {
    (async () => {
      try{
        const [prop_types, validate_props] = await Promise.all([
          import('../handlers-props/Router@link.js'),
          import('../validate_props.js')
        ])
        validate_props.default(prop_types.default, vNode)
      } catch(err) {console.log(err)}
    })()
  }
  /*******************************/
  const href = vNode.props.href
  const action_node = to_dom(vNode.children[0])
  if('href' in action_node) {
    action_node.href = href || '/'
  }
  action_node.tabIndex = '0'
  action_node.onclick = (e) => {
    e.preventDefault()
    if(href == g.CURRENT) { return }
    window.history.pushState({}, '', href)
    g.PREVIOUS = g.CURRENT
    g.CURRENT = window.location.pathname
    g.render(g.CURRENT)
    if(g.heads[g.PREVIOUS]) g.heads[g.PREVIOUS].map(_ => g.doc_head.removeChild(_))
    if(g.heads[g.CURRENT]) {
      g.heads[g.CURRENT].map(_ => g.doc_head.appendChild(_))
    }
  }
  return action_node
}
