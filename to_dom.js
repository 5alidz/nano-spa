import { is_type, typeOf } from './utils/index.js'
import {
  is_invalid,
  is_primitive,
  create_handler,
  __placeholder
} from './utils/to_dom_utils.js'

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

function to_dom_handler(node) {
  const placeholder = __placeholder(node.type)
  const stock_handlers = [
    'Box',
    'Promise',
    'Reducer',
    'Router',
    'Router::link',
    'Router::head',
    'State'
  ]
  const module_utils = { to_dom, placeholder, node }

  const get_handler = (key) => import(
    /* webpackChunkName: "[request]" */
    `./handlers/${key}.js`
  )
  const get_custom_handler = (key) => import(
    /* webpackChunkName: "[request]" */
    `../../handlers/${key}.js`
  )

  if(stock_handlers.includes(node.type)) {
    create_handler(get_handler, module_utils)
  } else {
    create_handler(get_custom_handler, module_utils)
  }
  return placeholder.node
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
