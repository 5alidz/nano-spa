import g from './shared/router.js'

export default (vNode, { to_dom }) => {
  if(process.env.NODE_ENV !== 'production') {
    (async () => {
      try{
        const [prop_types, validate_props] = await Promise.all([
          import('../handlers-props/Router@head.js'),
          import('../validate_props.js')
        ])
        validate_props.default(prop_types.default, vNode)
      } catch(err) {console.log(err)}
    })()
  }
  const current_route = window.location.pathname
  const head_array = vNode.children.map(child => to_dom(child))
  g.heads[current_route] = head_array
  g.heads[current_route].map(_ => g.doc_head.appendChild(_))
}
