import _global from './internal.global.js'

const is_fragment = node => node.$type == Symbol.for('nano_spa.fragment')
const is_component = node => node.$type == Symbol.for('nano_spa.component')
const is_invalid = node => !node || typeof node != 'object'
const is_primitive = node => typeof node == 'string' || typeof node == 'number'

function handle_props(props, element) {
  if(!props) { return }
  Object.entries(props).forEach(([key, value]) => {
    if(typeof value == 'undefined') { return }
    if (key.startsWith('on') && key in element) {
      element[key] = value
    } else {
      element.setAttribute(key, value)
    }
  })
}

function handle_children(children, element) {
  if(!children) { return }
  children.forEach(child => {
    if(typeof child == 'undefined') { return }
    if(is_fragment(child)) {
      child.children.map(c => element.appendChild(to_dom_child.call(this, c)))
    } else if(Array.isArray(child)) {
      child.map(c => element.appendChild(to_dom_child.call(this, c)))
    } else {
      element.appendChild(to_dom_child.call(this, child))
    }
  })
}

function to_dom_child(child) {
  if (is_primitive(child)) {
    return document.createTextNode(child)
  } else if (is_fragment(child) || is_component(child)) {
    return to_dom.call(this, child)
  } else {return}
}

function to_dom_component(node) {
  let {type, props, children} = node
  const element = document.createElement(type)
  handle_props.call(this, props, element)
  handle_children.call(this, children, element)
  return element
}


function to_dom(node) {
  const handlers = Object.keys(_global.handlers)
  if(is_invalid(node)) {return}

  if(is_component(node)) {
    if(handlers.includes(node.type) && this !== undefined) {
      return  _global.handlers[node.type](node, to_dom.bind(_global.handlers))
    }
    return to_dom_component.call(this, node)
  }

  if(is_fragment(node)) {
    return node.children.map(child => to_dom_child.call(this, child))
  }
}

export default to_dom.bind(_global.handlers)
