const box_handler = require('../handlers.Box.js')
const to_dom = require('../to_dom.js')

const handler = box_handler.default
const to_dom_ = to_dom.default

test('when it has no type it defaults to div', () => {
  expect(handler({
    type: 'Box',
    props: {},
    children: [],
    $type: Symbol.for('component')
  })).toEqual(to_dom_({
    type: 'div',
    props: {},
    children: [],
    $type: Symbol.for('component')
  }))
})

test('when it has type as only prop it will use it without making any styles', () => {
  expect(handler({
    type: 'Box',
    props: {type: 'ul'},
    children: [],
    $type: Symbol.for('component')
  })).toEqual(to_dom_({
    type: 'ul',
    props: {},
    children: [],
    $type: Symbol.for('component')
  }))
})

test('transforms all proprs to style attribute', () => {
  expect(handler({
    type: 'Box',
    props: { 'background-color': 'red', 'display': 'grid' },
    children: ['hello, world'],
    $type: Symbol.for('component')
  })).toEqual(to_dom_({
    type: 'div',
    props: {style: 'background-color: red; display: grid;'},
    children: ['hello, world'],
    $type: Symbol.for('component')
  }))
})

test('order of type prop does not matter and gets deleted after usage', () => {
  expect(handler({
    type: 'Box',
    props: { 'background-color': 'red', type: 'ul', 'display': 'grid' },
    children: ['hello, world'],
    $type: Symbol.for('component')
  })).toEqual(to_dom_({
    type: 'ul',
    props: {style: 'background-color: red; display: grid;'},
    children: ['hello, world'],
    $type: Symbol.for('component')
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
      $type: Symbol.for('component')
    }],
    $type: Symbol.for('component')
  })).toEqual(to_dom_({
    type: 'ul',
    props: {style: 'background-color: red; display: grid;'},
    children: [{
      type: 'div',
      props: {},
      children: ['123'],
      $type: Symbol.for('component')
    }],
    $type: Symbol.for('component')
  }))
})
