const render_module = require('../render.js')

const render = render_module.default

test('returns string when input is string', () => {
  expect(render`hello world`).toBe('hello world')
})

test('returns undefined when expression evaluates to undefined', () => {
  console.log(render`<div>${() => render`<div></div>`}<//>`)
  expect(render`${undefined}`).toBe(undefined)
})
