import marked from 'marked'

export default function markdown_handler(vNode) {
  /*
   * TODO
   * usage with $type component.
   */
  let s = ''
  const parent = document.createElement('div')
  vNode.children.forEach(child => {
    if(typeof child == 'string') { s += marked(child) }
  })
  parent.innerHTML = s
  return parent
}
