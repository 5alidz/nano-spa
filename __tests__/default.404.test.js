const _404 = require('../default.404.js')

test('makes a vNode that describes 404', () => {
  expect(_404.default()).toEqual({
    $type: Symbol.for('component'),
    type: 'h1',
    props: {style: 'text-align: center;'},
    children: ['404']
  })
})
