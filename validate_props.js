const typeOf = object => Object.prototype.toString.call(object)
  .replace(/[[\]]/g, '').split(' ')[1].toLowerCase()

export default function validate_props(prop_types, v_node) {
  const props = v_node.props
  const all_props = Object.keys(props)
  const prop_types_keys = Object.keys(prop_types)
  const matched = all_props.filter(prop => !prop_types_keys.includes(prop))
  const singles = all_props.filter(prop => !matched.includes(prop))

  // check for required
  prop_types_keys.forEach(prop => {
    if(prop != '*') {
      const is_required = prop_types[prop].required
      if(Object.is(is_required, true) && !all_props.includes(prop)) {
        console.error(`
          <${v_node.type} />
          Property "${prop}" is required
        `)
      }
    }
  })

  // check for types
  singles.forEach(node_prop_key => {
    const value = props[node_prop_key]
    const possible_types = prop_types[node_prop_key].type
    if(!possible_types.includes(typeOf(value))) {
      console.warn(`
        <${v_node.type} />
        Expected property "${node_prop_key}" to be of type ${JSON.stringify(possible_types)}
        Recived "${JSON.stringify(value)}" of type "${typeOf(value)}" instead

        ${prop_types_keys[prop_types_keys.indexOf(node_prop_key)] ? '**** WARNING this might break the handler, this property is required' : ''}
      `)
    }
  })

  // check for types in * props
  matched.forEach(prop => {
    const value = props[prop]
    const possible_types = prop_types['*'].type
    if(!possible_types.includes(typeOf(value)) && typeOf(value) != 'undefined') {
      console.warn(`
        <${v_node.type} />
        Expected property "${prop}" to be of type ${JSON.stringify(possible_types)}
        Recived "${JSON.stringify(value)}" of type "${typeOf(value)}" instead.
      `)
    }
  })
}
