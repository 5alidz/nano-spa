import { is_noop, init_diff } from './shared/init_diff.js'

export default function reducer(vNode, { to_dom }) {
  if(process.env.NODE_ENV !== 'production') {
    (async () => {
      try{
        const [prop_types, validate_props] = await Promise.all([
          import('../handlers.props/Reducer.js'),
          import('../validate_props.js')
        ])
        validate_props.default(prop_types.default, vNode)
      } catch(err) {console.log(err)}
    })()
  }
  const diff = init_diff(to_dom)
  let state = vNode.props.initial || {}
  const reducer = vNode.props.reducer
  const render = vNode.props.render
  let dom_node = undefined

  const dispatch = (action) => {
    let new_state = reducer(state, action)
    if(!is_noop(state, new_state)) {
      state = new_state
      diff(render(state, dispatch), dom_node)
    }
  }
  dom_node = to_dom(render(state, dispatch))
  return dom_node
}
