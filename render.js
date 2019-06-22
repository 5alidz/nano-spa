import htm from './lib.htm.min.js'

const minify_style = s => s.trim().split('\n').map(s => s.trim()).join('')

function handle_custom_element(_node) {
  const rendered = _node.type.call(_node, _node.props)
  const new_node =  typeof rendered === 'function' ? rendered() : rendered

  if(typeof new_node !== 'object') {
    return
  } else if(new_node.type === '') {
    new_node.$type = Symbol.for('nano_spa.fragment')
    return new_node
  } else {
    return render(
      new_node.type,
      new_node.props,
      ...new_node.children.concat(_node.children)
    )
  }
}

function render(type, props, ...children) {
  const node = {
    type,
    props: props || {},
    children: children || [],
    $type: Symbol.for('nano_spa.component')
  }
  if(node.props.style) node.props.style = minify_style(node.props.style)
  return typeof type === 'function' ? handle_custom_element(node) : node
}

export default htm.bind(render)
