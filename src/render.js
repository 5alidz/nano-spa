import htm from './htm.min.js'

const minify_style = s => s.trim().split('\n').map(s => s.trim()).join('')

export default htm.bind(function create_element(type, props, ...children) {
  const node = {type, props, children}
  node.props = node.props || {}
  function handle_custom_element(_node) {
    const new_node = _node.type(_node.props)()
    return create_element(
      new_node.type,
      new_node.props,
      ...new_node.children.concat(_node.children)
    )
  }
  if(node.props.style) node.props.style = minify_style(node.props.style)
  return typeof type === 'function' ? handle_custom_element(node) : node
})
