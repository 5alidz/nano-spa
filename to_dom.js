import _global from './internal.global.js'

const create_pre = (src) => {
  const pre = document.createElement('pre')
  pre.appendChild(document.createTextNode(src))
  return pre
}

const from_component = (node) => {
  let {type, props, children} = node
  const element = document.createElement(type)
  handle_props.call(this, props, element)
  handle_children.call(this, children, element)
  return element
}

function handle_props(props, element) {
  if(!props) { return }
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('on') && window.hasOwnProperty(key)) {
      element[key] = value
    } else {
      element.setAttribute(key, value)
    }
  })
}

function handle_children(children, element) {
  if(!children) { return }
  children.forEach(child => {
    if (child == undefined) {
      return
    } else if (typeof child == 'string' || typeof child == 'number') {
      element.appendChild(document.createTextNode(child))
    } else if (Array.isArray(child)) {
      child.map(node => {element.appendChild(to_dom.call(this, node))})
    } else if(typeof child == 'function') {
      element.appendChild(create_pre(child.toString()))
    } else if(child.$type == Symbol.for('component')) {
      element.appendChild(to_dom.call(this, {...child}))
    } else if(typeof child == 'object') {
      element.appendChild(create_pre(JSON.stringify(child, null, 2)))
    } else { return }
  })
}

function to_dom(node) {
  const handlers = Object.keys(_global.handlers)
  if(!node) {
    return
  } else if(node.$type == Symbol.for('component')) {
    if(handlers.includes(node.type)) {
      return _global.handlers[node.type](node)
    } else {
      return from_component(node)
    }
  } else if(Array.isArray(node)) {
    return node.map(_child => to_dom(_child))
  } else if(typeof node == 'string' || typeof node == 'number') {
    return document.createTextNode(node)
  } else if(typeof node == 'function') {
    return create_pre(node.toString())
  } else if(typeof node == 'object') {
    return create_pre(JSON.stringify(node, null, 2))
  } else {return}
}

export default to_dom.bind(_global.handlers)
