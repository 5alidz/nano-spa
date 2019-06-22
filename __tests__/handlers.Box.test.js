const box_handler = require('../handlers.Box.js')
const to_dom = require('../to_dom.js')

const handler = box_handler.default
const to_dom_ = to_dom.default

const C_TYPE = Symbol.for('nano_spa.component')

test('when it has no type it defaults to div', () => {
  expect(handler({
    type: 'Box',
    props: {},
    children: [],
    $type: C_TYPE
  })).toEqual(to_dom_({
    type: 'div',
    props: {},
    children: [],
    $type: C_TYPE
  }))
})

test('when it has type as only prop it will use it without making any styles', () => {
  expect(handler({
    type: 'Box',
    props: {type: 'ul'},
    children: [],
    $type: C_TYPE
  })).toEqual(to_dom_({
    type: 'ul',
    props: {},
    children: [],
    $type: C_TYPE
  }))
})

test('transforms all proprs to style attribute', () => {
  expect(handler({
    type: 'Box',
    props: { 'background-color': 'red', 'display': 'grid' },
    children: ['hello, world'],
    $type: C_TYPE
  })).toEqual(to_dom_({
    type: 'div',
    props: {style: 'background-color: red; display: grid;'},
    children: ['hello, world'],
    $type: C_TYPE
  }))
})

test('order of type prop does not matter and gets deleted after usage', () => {
  expect(handler({
    type: 'Box',
    props: { 'background-color': 'red', type: 'ul', 'display': 'grid' },
    children: ['hello, world'],
    $type: C_TYPE
  })).toEqual(to_dom_({
    type: 'ul',
    props: {style: 'background-color: red; display: grid;'},
    children: ['hello, world'],
    $type: C_TYPE
  }))
})

test('handles children correctly', () => {
  expect(handler({
    type: 'Box',
    props: { 'background-color': 'red', type: 'ul', 'display': 'grid' },
    children: [{
      type: 'div',
      props: {},
      children: ['123'],
      $type: C_TYPE
    }],
    $type: C_TYPE
  })).toEqual(to_dom_({
    type: 'ul',
    props: {style: 'background-color: red; display: grid;'},
    children: [{
      type: 'div',
      props: {},
      children: ['123'],
      $type: C_TYPE
    }],
    $type: C_TYPE
  }))
})
