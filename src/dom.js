export default function create_dom_nodes(node) {
  let {type, props, children} = node
  const element = document.createElement(type)
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('on') && key.toLowerCase() === key) {
      element[key] = value
    } else {
      element.setAttribute(key, value)
    }
  })
  children.forEach(child => {
    if (child === undefined || child === null) {
      return
    } else if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(child))
    } else if (Array.isArray(child)) {
      child.map(({type, props, children}) => {
        element.appendChild(create_dom_nodes({type, props, children}))
      })
    } else {
      element.appendChild(create_dom_nodes({...child}))
    }
  })
  return element
}
