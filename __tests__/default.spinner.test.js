const spinner = require('../default.spinner.js')

test('spinner that indicates waiting for async operation', () => {
  expect(spinner.default()).toEqual({
    $type: Symbol.for('nano_spa.component'),
    type: 'p',
    props: {},
    children: ['...']
  })
})
