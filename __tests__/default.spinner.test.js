const spinner = require('../default.spinner.js')

test('spinner that indicates waiting for async operation', () => {
  expect(spinner.default()).toEqual({
    $type: Symbol.for('component'),
    type: 'p',
    props: {},
    children: ['...']
  })
})
