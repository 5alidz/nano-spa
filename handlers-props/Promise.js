module.exports = {
  promise: {
    required: true,
    type: ['promise', 'asyncfunction']
  },
  render: {
    required: true,
    type: ['function']
  },
  placeholder: {
    required: true,
    type: ['function']
  },
  delay: {
    type: ['number']
  }
}
