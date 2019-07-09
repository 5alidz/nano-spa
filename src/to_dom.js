const is_fragment = node => node.$type == Symbol.for('nano_spa.fragment')
const is_component = node => node.$type == Symbol.for('nano_spa.component')
const is_invalid = node => !node || typeof node != 'object'
const is_primitive = node => typeof node == 'string' || typeof node == 'number'
const is_upper_case = c => c.charCodeAt(0) < 97

const stock_handlers = [
  'Box',
  'Promise',
  'Reducer',
  'State',
  'Router',
  'Router::link',
]

const get_handler = (key) => import(`../handlers/${key}.js`)
const get_custom_handler = (key) => import(`../../../handlers/${key}.js`)

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
      child.children.forEach(c => {element.appendChild(to_dom(c))})
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
  let placeholder = document.createElement('div')
  const resolve_name = name => {
    let _name = name.replace(/::/g, '@')
    return _name
  }
  const render_module = _m => {
    const result = _m.default(node, to_dom, placeholder)
    if(typeof result == 'undefined') {
      placeholder.parentNode.removeChild(placeholder)
    } else {
      placeholder.replaceWith(result)
    }
  }

  const handle_err = err => {
    placeholder.innerHTML = `${node.type}: ${err}`
  }

  if(stock_handlers.includes(node.type)) {
    get_handler(resolve_name(node.type))
      .then(render_module)
      .catch(handle_err)
  } else {
    get_custom_handler(resolve_name(node.type))
      .then(render_module)
      .catch(handle_err)
  }

  return placeholder
}

function to_dom(node) {
  if(is_invalid(node)) {return}
  if(is_fragment(node)) {
    return node.children.map(child => to_dom_child(child))
  }
  if(is_component(node)) {
    if(is_upper_case(node.type[0])) {
      return to_dom_handler(node)
    } else {
      return to_dom_component(node)
    }
  }
}

export default to_dom
