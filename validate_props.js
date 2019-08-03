const typeOf = object => Object.prototype.toString
  .call(object)
  .replace(/[[\]]/g, '')
  .split(' ')[1]
  .toLowerCase()

const err_node = (type) => `\t<${type} />\n`

const create_msg = (type) =>
  (id, msgs) => console[type](`${err_node(id)}\n${msgs.join('\n')}\n`)

const log = ({ errType, id, msgs }) => errors[errType](id, msgs)
const msg_header = (prop, msg, last) => `\t${prop} (${msg})${last ? '\n' : ''}`
const msg_inner = (key, value, last) => `\n\t\t${key}:\t${value}${last ? '\n' : ''}`

const msg_info = (head, type, value) => `${head}${msg_inner('Type', type)}${msg_inner('Value', value, true)}`

const msg_expc = (head, expected, recived) => `${head}${msg_inner('Expected', expected)}${msg_inner('Recived', recived, true)}`

const errors = {
  UNDOC: create_msg('warn'),
  REQUI: create_msg('error')
}

function from_props(prop_types, msgs) {
  // these are all used props in the handler.
  return ([name, value]) => {
    const validation = prop_types[name] || {}
    const is_arr = t => Array.isArray(t)
    const enums = validation.enum
    const types = validation.type
    const is_required = validation.required
    // case no validation.
    if(Object.keys(validation).length < 1) {
      const warn = 'missing documation.'
      msgs.UNDOC.push(msg_info(msg_header(name, warn), typeOf(value), value))
    } else if(!is_arr(enums) && !is_arr(types)) {
      const warn = 'missing type information.'
      msgs.UNDOC.push(msg_info(msg_header(name, warn), typeOf(value), value))
    } else if(is_arr(types) && is_arr(enums)) {
      const warn = 'too many type information.'
      msgs.UNDOC.push(msg_info(msg_header(name, warn), typeOf(value), value))
    }
  }
}

export default function validate_props(prop_types, v_node) {
  const props = v_node.props
  const prop_types_keys = Object.keys(prop_types)
  const props_keys = Object.keys(props)
  const msgs = { UNDOC: [], REQUI: [] }

  // check for used props.
  props_keys.forEach(prop_name => {
    const has_docs = prop_types_keys.includes(prop_name)
    const is_required = Boolean(has_docs && prop_types[prop_name].required)
    const has_type = Boolean(has_docs && prop_types[prop_name].type)

    const value = props[prop_name]
    const type = typeOf(value)

    if(!has_docs) {
      msgs.UNDOC.push(msg_info(
        msg_header(prop_name, 'undocumented'),
        type,
        value
      ))
    } else if(has_docs && !has_type) {
      msgs.UNDOC.push(msg_info(
        msg_header(prop_name, 'type information missing'),
        type,
        value
      ))
    } else if(has_type && !prop_types[prop_name].type.includes(typeOf(value))) {
      if(!is_required) {
        msgs.UNDOC.push(msg_expc(
          msg_header(prop_name, 'type mismatch'),
          prop_types[prop_name].type.join(' || '),
          `${typeOf(value)} (${value})`
        ))
      } else {
        msgs.REQUI.push(msg_expc(
          msg_header(prop_name, 'required type is invalid'),
          prop_types[prop_name].type.join(' || '),
          `${type} (${value})`
        ))
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
      const is_required = prop_types[prop_name].required
      const value = props[prop_name]
      const has_types = Array.isArray(prop_types[prop_name].type)
      const has_enum = Array.isArray(prop_types[prop_name].enum)
      if(has_enum) {
        const enum_result = prop_types[prop_name].enum.map(e => {
          if(typeOf(e) == 'regexp') {
            const regx_match = e.test(value)
            if(regx_match) {
              return true
            } else {
              return false
            }
          } else {
            if(e === value) {
              return true
            } else {
              return false
            }
          }
        })
        if(!enum_result.some(v => v === true)) {
          console.log(prop_name, 'err enum')
        }
      }
      if(is_required && typeof value == 'undefined' && has_types) {
        msgs.REQUI.push(msg_expc(
          msg_header(prop_name, 'required and not found'),
          prop_types[prop_name].type.join(' || '),
          typeOf(value)
        ))
      } else if(is_required && typeof value == 'undefined' && !has_types) {
        msgs.REQUI.push(
          msg_header(prop_name, 'required but missing type information', true)
        )
      }
    }
  })

  Object
    .keys(errors)
    .forEach(err => msgs[err].length > 0
      && log({ errType: err, id: v_node.type, msgs: msgs[err] })
    )

}
