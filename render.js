import htm from './lib.htm.min.js'

const minify_style = s => s.trim().split('\n').map(s => s.trim()).join('')
const is_comp = vn => vn.$type == Symbol.for('component')

function render(type, props, ...children) {
  const node = {type, props: props || {}, children: children || []}
  node.$type = Symbol.for('component')
  function handle_custom_element(_node) {
    const rendered = _node.type.call(_node, _node.props)
    const new_node =  typeof rendered === 'function' ? rendered() : rendered
    if(Array.isArray(new_node)) {
      return new_node
    } else if(typeof new_node == 'undefined' || !is_comp(new_node)) {
      return
    } else {
      return render(
        new_node.type,
        new_node.props,
        ...new_node.children.concat(_node.children)
      )
    }
  }
  if(node.props.style) node.props.style = minify_style(node.props.style)
  return typeof type === 'function' ? handle_custom_element(node) : node
}

export default htm.bind(render)
