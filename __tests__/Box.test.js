const render = require('../render.js').default
const to_dom = require('../to_dom.js').default

test('render box as expected', () => {
  const component = render`<Box grid />`
  const dom_node = to_dom(component)
  console.log(dom_node.style)
})
