export const is_invalid = node => !node || typeof node != 'object'
export const is_primitive = node => typeof node == 'string' || typeof node == 'number'
export const is_upper_case = c => c.charCodeAt(0) < 97

export const typeOf = object => Object.prototype.toString.call(object)
  .replace(/[[\]]/g, '').split(' ')[1].toLowerCase()

export const error_style = `
  font-family: "Lucida Console", Monaco, "Consolas", Monospace;
  padding: .3rem;
  background-color: pink;
  color: darkRed;
`.split('\n').join('')

export const stock_handlers = [
  'Box',
  'Promise',
  'Reducer',
  'Router',
  'Router::link',
  'Router::head',
  'State',
]

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
