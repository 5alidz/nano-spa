import to_dom from './to_dom.js'

export default (vNode) => {
  const exclude = ['type']
  const reducer = (style_string, current_prop) => {
    if(exclude.includes(current_prop)) {
      return style_string
    } else {
      return style_string += `${current_prop}: ${vNode.props[current_prop]};`
    }
  }
  const final_style_string = Object.keys(vNode.props).reduce(reducer, '')
  if(vNode.props.type) {vNode.type = vNode.props.type || 'div'}
  if(final_style_string) {vNode.props = { style: final_style_string }}
  return to_dom(vNode)
}
