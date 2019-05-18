import htm from './htm.min.js'

const minify_style = s => s.trim().split('\n').map(s => s.trim()).join('')
let count = 0
export default htm.bind(function create_element(type, props, ...children) {
  const node = {type, props, children}
  node.props = node.props || {}
  function handle_custom_element(_node) {
    if(_node.type.constructor.name === 'AsyncFunction'){
      return create_element('__PROMISE__', {promise: _node, id: ++count}, [])
    }
    const render = _node.type(_node.props)
    const new_node = typeof render === 'function' ? render() : render
    return create_element(
      new_node.type,
      new_node.props,
      ...new_node.children.concat(_node.children)
    )
  }
  if(node.props.style) node.props.style = minify_style(node.props.style)
  return typeof type === 'function' ? handle_custom_element(node) : node
})
