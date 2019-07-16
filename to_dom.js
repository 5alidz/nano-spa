import {
  is_type,
  typeOf,
  stock_handlers,
  error_style,
  is_invalid,
  is_primitive,
} from './utils/utils.js'

const get_handler = (key) => import(
  /* webpackChunkName: "[request]" */
  `./handlers/${key}.js`
)
const get_custom_handler = (key) => import(
  /* webpackChunkName: "[request]" */
  `../../handlers/${key}.js`
)

const events = (() => {
  const listeners = new Map()
  return {
    send: (event, payload) => {
      if(listeners.has(event)){
        listeners.get(event)(payload)
      }
    },
    on: (event, callback) => {
      listeners.set(event, callback)
    }
  }
})()

function handle_props(props, element) {
  if(!props) { return }
  Object.entries(props).forEach(([key, value]) => {
    if(typeof value == 'undefined') {
      return
    } else if(key.startsWith('on') && key in element) {
      element[key] = value
    } else {
      element.setAttribute(key, value)
    }
  })
}

function handle_children(children, element) {
  if(!children) return

  children.forEach(child => {
    if(typeof child == 'undefined') {
      return
    } else if(is_type('FRAGMENT')(child)) {
      to_dom(child).forEach(c => element.appendChild(c))
    } else if(Array.isArray(child)) {
      child.map(c => element.appendChild(to_dom_child(c)))
    } else {
      element.appendChild(to_dom_child(child))
    }
  })
}

function to_dom_child(child) {
  if(is_primitive(child)) {
    return document.createTextNode(child)
  } else {
    return to_dom(child)
  }
}

function to_dom_component(node) {
  let {type, props, children} = node
  const element = document.createElement(type)
  handle_props(props, element)
  handle_children(children, element)
  return element
}

function __placeholder() {
  const _ = document.createElement('div')
  return {
    node: _,
    err: (err, mem_type) => {
      _.style = error_style
      _.innerText = `<${mem_type} /> ${err}`
    }
  }
}

function to_dom_handler(node) {
  let placeholder = document.createElement('div')
  const resolve_name = name => name.replace(/::/g, '@')
  const mem_type = node.type
  const handle_err = (err, mem_type) => {
    placeholder.style = error_style
    placeholder.innerText = `<${mem_type} /> ${err}`
  }
  const render_module = _module => {
    const result = _module.default(node, {to_dom, typeOf, on: events.on})
    events.send(node, result)
    if(typeof result == 'undefined') {
      placeholder.parentNode.removeChild(placeholder)
    } else {
      placeholder.replaceWith(result)
    }
  }
  if(stock_handlers.includes(node.type)) {
    get_handler(resolve_name(node.type)).then(render_module)
      .catch(err => handle_err(err, mem_type))
  } else {
    get_custom_handler(resolve_name(node.type)).then(render_module)
      .catch(err => handle_err(err, mem_type))
  }
  return placeholder
}

function to_dom(node) {
  if(is_invalid(node)) {
    if(process.env.NODE_ENV != 'production') {
      console.error(`node of type ${typeOf(node)} is not a valid component`)
    }
    return
  } else if(is_type('FRAGMENT')(node)) {
    return node.children.map(child => to_dom_child(child))
  } else if(is_type('COMPONENT')(node)) {
    return to_dom_component(node)
  } else if(is_type('HANDLER')(node)) {
    return to_dom_handler(node)
  } else {
    return undefined
  }
}

export default to_dom
