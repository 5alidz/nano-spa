const typeOf = object => Object.prototype.toString
  .call(object)
  .replace(/[[\]]/g, '')
  .split(' ')[1]
  .toLowerCase()

const validate_enum = (arr, value) => arr.map(v => {
  if(typeOf(v) == 'regexp') {
    return v.test(value)
  } else {
    return v === value
  }
})

const err_node = (type) => `\t<${type} />\n`

const create_msg = (type) =>
  (id, msgs) => console[type](`${err_node(id)}\n${msgs.join('\n')}\n`)

const log = ({ errType, id, msgs }) => errors[errType](id, msgs)
const msg_header = (prop, msg, last) => `\t${prop}\t(${msg})${last ? '\n' : ''}`
const msg_inner = (key, value, last) => `\n\t\t${key}:\t${value}${last ? '\n' : ''}`

const msg_info = (head, type, value) => `${head}${msg_inner('Type', type)}${msg_inner('Value', value, true)}`

const msg_expc = (head, expected, recived) => `${head}${msg_inner('Expected', expected)}${msg_inner('Recived', recived, true)}`

const errors = {
  UNDOC: create_msg('warn'),
  REQUI: create_msg('error')
}

function from_props(prop_types, msgs) {
  // these are all used props in the handler.
  const has_wild_card = Boolean(prop_types['*'])
  return ([name, value]) => {
    if(!has_wild_card) {
      const validation = prop_types[name] || {}
      const is_arr = t => Array.isArray(t)
      const enums = validation.enum
      const types = validation.type
      // case no validation.
      if(Object.keys(validation).length < 1) {
        const warn = 'missing documation'
        msgs.UNDOC.push(msg_info(msg_header(name, warn), typeOf(value), value))
      } else if(!is_arr(enums) && !is_arr(types)) {
        if(typeOf(types) == 'undefined') {
          const warn = 'missing type information'
          msgs.UNDOC.push(msg_info(msg_header(name, warn), typeOf(value), value))
        }
      }
    }
  }
}

function from_prop_types(props, msgs, prop_types, children) {
  return ([name, value]) => {
    if(name == '*') {
      // wild card validation
      const has_types = Array.isArray(value.type) || typeOf(value.type) == 'string'
      if(!has_types) {
        msgs.UNDOC.push(`\t\t* (wild card type information missing)`)
      } else {
        const props_to_validate = Object.keys(props).filter(p => !(p in prop_types))
        props_to_validate.forEach(p => {
          if(Array.isArray(value.type)) {
            if(!value.type.includes(typeOf(props[p]))) {
              msgs.UNDOC.push(msg_expc(
                msg_header(`${name}\t${p}`, 'wild card type error'),
                value.type.join(' || '),
                `${typeOf(props[p])} (${props[p]})`
              ))
            }
          } else {
            if(value.type !== typeOf(props[p])) {
              msgs.UNDOC.push(msg_expc(
                msg_header(`${name}\t${p}`, 'wild card type error'),
                value.type,
                `${typeOf(props[p])} (${props[p]})`
              ))
            }
          }
        })
      }
    } else if(name == '*children') {
      // TODO
      // count
      // validate each children
    } else {
      const prop_value = props[name]
      const is_required = value.required
      const has_enums = Array.isArray(value.enum)
      const has_types = Array.isArray(value.type)
      const has_type = typeOf(value.type) == 'string'
      if(has_enums && (has_types || has_type)) {
        const warn = 'Too many type information'
        msgs.UNDOC.push(msg_info(msg_header(name, warn), typeOf(prop_value), prop_value))
      } else if(has_enums) {
        const valid_enum = validate_enum(value.enum, prop_value)
        const res = valid_enum.some(v => Boolean(v))
        if(!res && is_required) {
          const err_msg = 'required property type error'
          msgs.REQUI.push(msg_expc(
            msg_header(name, err_msg),
            value.enum.join(' || '),
            prop_value
          ))
        } else if(!res) {
          const warn_msg = 'property type error'
          msgs.UNDOC.push(msg_expc(
            msg_header(name, warn_msg),
            value.enum.join(' || '),
            prop_value
          ))
        }
      } else if(has_types && !value.type.includes(typeOf(prop_value))) {
        if(is_required) {
          const err_msg = 'required property type error'
          msgs.REQUI.push(msg_expc(
            msg_header(name, err_msg),
            value.type.join(' || '),
            `${typeOf(prop_value)} (${prop_value})`
          ))
        } else if(!is_required && (name in props)) {
          const warn_msg = 'property type error'
          msgs.UNDOC.push(msg_expc(
            msg_header(name, warn_msg),
            value.type.join(' || '),
            `${typeOf(prop_value)} (${prop_value})`
          ))
        }
      } else if(has_type && value.type !== typeOf(prop_value)) {
        if(is_required) {
          const err_msg = 'required property type error'
          msgs.REQUI.push(msg_expc(
            msg_header(name, err_msg),
            value.type,
            `${typeOf(prop_value)} (${prop_value})`
          ))
        } else {
          const warn_msg = 'property type error'
          msgs.UNDOC.push(msg_expc(
            msg_header(name, warn_msg),
            value.type,
            `${typeOf(prop_value)} (${prop_value})`
          ))
        }
      }
    }
  }
}

export default function validate_props(prop_types, v_node) {
  const props = v_node.props
  const msgs = { UNDOC: [], REQUI: [] }

  // check for used props.
  Object.entries(props)
    .forEach(from_props(prop_types, msgs))

  // check for documented props.
  Object.entries(prop_types)
    .forEach(from_prop_types(props, msgs, prop_types, v_node.children))

  // dispatch messages.
  Object
    .keys(errors)
    .forEach(err => msgs[err].length > 0
      && log({ errType: err, id: v_node.type, msgs: msgs[err] })
    )

}
