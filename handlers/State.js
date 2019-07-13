import { init_diff, is_noop } from './shared/init_diff.js'

export default function stateful_handler(component, { to_dom }) {
  if(process.env.NODE_ENV !== 'production') {
    (async () => {
      try{
        const [prop_types, validate_props] = await Promise.all([
          import('../handlers.props/State.js'),
          import('../validate_props.js')
        ])
        validate_props.default(prop_types.default, component)
      } catch(err) {console.log(err)}
    })()
  }
  let state = component.props.state
  let dom_node = undefined

  const render = component.props.render
  const diff = init_diff(to_dom)

  const setState = (new_state) => {
    const _new = typeof new_state == 'function' ? new_state(state) : new_state
    if(is_noop(_new, state)) { return }
    state = _new
    diff(render(state, setState), dom_node)
  }
  dom_node = to_dom(render(state, setState))
  return dom_node
}
