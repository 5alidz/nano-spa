export default function(vNode, to_dom) {
  const dom_node = document.createElement('div')

  if(!vNode.props.template) {
    return console.warn('template component is required')
  }
  if(!vNode.props.data) {
    return console.warn('data is required [{...}, {...}]')
  }
  if(!vNode.props.lazy_load) {
    return console.warn('function lazy_load is required. (target) => {...}')
  }

  window.requestAnimationFrame(() => {
    vNode.props.data.forEach((o) => {
      const dom_child = to_dom(vNode.props.template(o))
      dom_node.appendChild(dom_child)
      window.requestIdleCallback(() => vNode.props.lazy_load(dom_child))
    })
  })

  return dom_node
}
