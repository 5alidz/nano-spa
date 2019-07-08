export default (vNode, to_dom) => {
  const exclude = ['type']
  if(!vNode.props.type) {
    vNode.type = 'div'
  } else {
    vNode.type = vNode.props.type
    delete vNode.props.type
  }
  const reducer = (style_string, current_prop) => {
    if(exclude.includes(current_prop)) {
      return style_string
    } else {
      return style_string += `${current_prop}: ${vNode.props[current_prop]}; `
    }
  }
  const final_style_string = Object.keys(vNode.props).reduce(reducer, '')
  if(vNode.props.type) {vNode.type = vNode.props.type || 'div'}
  if(final_style_string) {vNode.props = { style: final_style_string.trim() }}
  const dom_node = to_dom(vNode)
  return dom_node
}
