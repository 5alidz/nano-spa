function handle_props(props, element) {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('on') && window.hasOwnProperty(key)) {
      element[key] = value
    } else if(key in element){
      element.setAttribute(key, value)
    }
  })
}

function handle_children(children, element) {
  children.forEach(child => {
    if (child == undefined) {
      return
    } else if (typeof child == 'string' || typeof child == 'number') {
      element.appendChild(document.createTextNode(child))
    } else if (Array.isArray(child)) {
      child.map(node => element.appendChild(
          create_dom_nodes.call(this, {...node})
        )
      )
    } else {
      element.appendChild(create_dom_nodes.call(this, {...child}))
    }
  })
}

export default function create_dom_nodes(node) {
  let {type, props, children} = node
  const children_with_handlers = handle_children.bind(this)
  if(type === 'Link') { return this.LINK(node) }
  if(type === '__PROMISE__') { return this.PROMISE(node) }
  const element = document.createElement(type)
  handle_props(props, element)
  children_with_handlers(children, element)
  return element
}
