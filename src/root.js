import _global from './global.js'

export const replace_with = (dom_node) => {
  _global.root.innerHTML = ''
  _global.root.appendChild(dom_node)
}
