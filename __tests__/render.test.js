const render_module = require('../render.js')
const render = render_module.default

test('returns string when input is string', () => {
  expect(render`hello world`).toBe('hello world')
})

test('returns undefined when expression evaluates to undefined', () => {
  function noop() {}
  expect(render`${undefined}`).toBe(undefined)
  expect(render`${noop()}`).toBe(undefined)
})

test('function component must return a valid vNode', () => {
  function noop() {}
  function comp() { return render`<div>hello, world<//>` }
  function comp_n() { return 42 }
  expect(render`<${noop} />`).toBe(undefined)
  expect(render`<${comp_n} />`).toBe(undefined)
  expect(render`<${comp} />`).toEqual({
    type: 'div',
    props: {},
    children: ['hello, world'],
    $type: Symbol.for('component')
  })
})
