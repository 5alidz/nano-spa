export const is_invalid = node => !node || typeof node != 'object'
export const is_primitive = node => typeof node == 'string' || typeof node == 'number'
export const is_upper_case = c => c.charCodeAt(0) < 97

export const resolve_name_to_dir = name => name.replace(/::/g, '@')

export const typeOf = object => Object.prototype.toString.call(object)
  .replace(/[[\]]/g, '').split(' ')[1].toLowerCase()

export const error_style = `
  font-family: "Lucida Console", Monaco, "Consolas", Monospace;
  padding: .3rem;
  background-color: pink;
  color: darkRed;
`.split('\n').join('')



export const minify_style = s => s.trim().split('\n').map(s => s.trim()).join('')

export const flatten = (arr) => [].concat.apply([], arr)

export const types = Object.freeze({
  COMPONENT: Symbol.for('nano_spa.component'),
  FRAGMENT : Symbol.for('nano_spa.fragment'),
  HANDLER  : Symbol.for('nano_spa.handler'),
  FUNCTION : Symbol.for('nano_spa.function')
})
export const is_type = type => node => node.$type == types[type]

export const id = node_name => {
  if(typeOf(node_name) == 'string' && node_name === '') {
    return types.FRAGMENT
  } else if(typeOf(node_name) == 'string' && is_upper_case(node_name)) {
    return types.HANDLER
  } else if(typeOf(node_name) == 'function') {
    return types.FUNCTION
  } else {
    return types.COMPONENT
  }
}

export const events = (() => {
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

export const __placeholder = (type) => {
  const _ = document.createElement('div')
  return {
    node: _,
    err: (err) => {
      _.style = error_style
      _.innerText = `<${type} /> ${err}`
    }
  }
}

export const render_module = (node, {to_dom, placeholder}) => _module => {
  const __handler_result__ = _module.default(node, {to_dom, typeOf, on: events.on})

  events.send(node, __handler_result__)

  if(typeof __handler_result__ == 'undefined') {
    // treat handler as a side effect
    placeholder.node.parentNode.removeChild(placeholder.node)
  } else {
    // handler return dom node
    placeholder.node.replaceWith(__handler_result__)
  }
}

export const create_handler = (handler_dir, {to_dom, placeholder, node}) => {
    return handler_dir(resolve_name_to_dir(node.type))
      .then(render_module(node, {to_dom, placeholder}))
      .catch(placeholder.err)
  }
