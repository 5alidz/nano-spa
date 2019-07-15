const render = require('../render.js').default
const to_dom = require('../to_dom.js').default

test('render box as expected', () => {
  const dom_node = to_dom(render`<Box grid />`)
  const div = document.createElement('div')
  div.style.display = 'grid'

  expect(dom_node).toEqual(div)
})
