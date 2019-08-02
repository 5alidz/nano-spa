const typeOf = object => Object.prototype.toString
  .call(object)
  .replace(/[[\]]/g, '')
  .split(' ')[1]
  .toLowerCase()

const err_node = (type) => `\t<${type} />\n`

const errors = {
  'UNDOC': function(v_node, msgs) {
    console.warn(`${err_node(v_node.type)}\n${msgs.join('\n')}\n`)
  },
  'REQUI': function(v_node, msgs) {
    console.error(`${err_node(v_node.type)}\n${msgs.join('\n')}\n`)
  },
  'TYPEE': function(v_node, msgs) {
    console.warn(`${err_node(v_node.type)}\n${msgs.join('\n')}\n`)
  }
}

const log = ({ errType, v_node, msgs }) => errors[errType](v_node, msgs)

export default function validate_props(prop_types, v_node) {
  const props = v_node.props
  const prop_types_keys = Object.keys(prop_types)
  const props_keys = Object.keys(props)
  const msgs = { UNDOC: [], REQUI: [], TYPEE: [] }

  // check for used props.
  props_keys.forEach(prop_name => {
    const has_docs = prop_types_keys.includes(prop_name)
    const is_required = Boolean(has_docs && prop_types[prop_name].required)
    const has_type = Boolean(has_docs && prop_types[prop_name].type)

    const value = props[prop_name]
    const type = typeOf(value)

    if(!has_docs) {
      const prop_type = `\n\t\tType:\t${type}`
      const prop_value = `\n\t\tValue:\t${value}\n`
      msgs.UNDOC.push(`\t${prop_name} (undocumented)${prop_type}${prop_value}`)
    } else if(has_docs && !has_type) {
      const prop_type = `\n\t\tType:\t${type}`
      const prop_value = `\n\t\tValue:\t${value}\n`
      msgs.UNDOC.push(`\t${prop_name} (type information missing)${prop_type}${prop_value}`)
    } else if(has_type && !prop_types[prop_name].type.includes(typeOf(value))) {
      if(!is_required) {
        const expected = `\n\t\tExpected:\t${prop_types[prop_name].type.join(' || ')}`
        const recived = `\n\t\tRecived:\t${typeOf(props[prop_name])} (${value})\n`
        msgs.UNDOC.push(`\t${prop_name} (type mismatch)${expected}${recived}`)
      } else {
        if(typeOf(value) == 'undefined') {
          msgs.REQUI.push(`\t${prop_name} (required but not found)`)
        } else {
          const expected = `\n\t\tExpected:\t${prop_types[prop_name].type}`
          const recived = `\n\t\tRecived:\t${type} (${value})\n`
          msgs.REQUI.push(`\t${prop_name} (required type is invalid)${expected}${recived}`)
        }
      }
    }
  })

  // check for documented props
  prop_types_keys.forEach(prop_name => {
    if(prop_name == '*children') {
      console.log('')
    } else if(prop_name == '*') {
      console.log('')
    } else {
      const is_required = prop_types[prop_name]
      const value = props[prop_name]
      if(is_required && typeof value == 'undefined') {
        const expected = `\n\t\tExpected:\t${prop_types[prop_name].type.join(' || ')}`
        const recived = `\n\t\tRecived:\t${typeOf(props[prop_name])}\n`
        msgs.REQUI.push(`\t${prop_name} (required and not found)${expected}${recived}`)
      }
    }
  })

  Object.keys(errors)
    .forEach(err => {
      if(msgs[err].length > 0) {
        log({ errType: err, v_node, msgs: msgs[err] })
      }
    })

}
