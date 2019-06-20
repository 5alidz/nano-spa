import default_spinner from './default.spinner.js'
import to_dom from './to_dom.js'

export default (vNode) => {
  const { props } = vNode
  let placeholder
  if(typeof props.placeholder == 'undefined') {
    placeholder = default_spinner()
  } else if(typeof props.placeholder == 'function') {
    placeholder = props.placeholder()
  } else {
    placeholder = props.placeholder
  }
  const element = to_dom(placeholder)
  props
    .promise()
    .then(data => {
      if(typeof props.component !== 'function')  {
        return console.warn('handler `<Promise />` requires property `component` to be a function')
      } else {
        element.replaceWith(to_dom(props.component(data)))
      }
    })
  return element
}
