import { typeOf } from './index.js'

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

const render_module = (node, {to_dom, placeholder}) => _module => {
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

const error_style = `
  font-family: "Lucida Console", Monaco, "Consolas", Monospace;
  padding: .3rem;
  background-color: pink;
  color: darkRed;
`.split('\n').join('')

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

export const is_invalid = node => !node || typeof node != 'object'

export const is_primitive = node => typeof node == 'string' || typeof node == 'number'

export const create_handler = (handler_dir, {to_dom, placeholder, node}) => {
  const resolve_name_to_dir = name => name.replace(/::/g, '@')
  return handler_dir(resolve_name_to_dir(node.type))
    .then(render_module(node, {to_dom, placeholder}))
    .catch(placeholder.err)
}
