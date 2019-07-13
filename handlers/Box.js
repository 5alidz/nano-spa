const style_reducer = props => Object.keys(props).reduce((acc, curr) => {
  const bools = ['grid', 'flex']
  const excludes = ['type']
  if(excludes.includes(curr)) {
    return acc
  } else if(typeof props[curr] == 'undefined') {
    return acc
  } if(bools.includes(props[curr])) {
    return acc
  } else if(typeof props[curr] == 'boolean') {
    const display_val = bools.filter(b => b == curr)[0]
    acc += `display: ${display_val};`
    return acc
  } else if(typeof props[curr] == 'string') {
    acc += `${curr}: ${props[curr]};`
    return acc
  } else {
    return acc
  }
}, '')

export default (vNode, { to_dom }) => {
  if(process.env.NODE_ENV !== 'production') {
    (async () => {
      try{
        const [prop_types, validate_props] = await Promise.all([
          import('../handlers.props/Box.js'),
          import('../validate_props.js')
        ])
        validate_props.default(prop_types.default, vNode)
      } catch(err) {console.log(err)}
    })()
  }
  const style_str = style_reducer(vNode.props)
  const new_node = {
    type: vNode.props.type || 'div',
    props: style_str ? {style: style_reducer(vNode.props)} : {},
    children: vNode.children,
    $type: vNode.$type
  }
  return to_dom(new_node)
}
