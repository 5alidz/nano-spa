// what a mess!
const _head = (() => {
  const dom = document.getElementsByTagName('head')[0]
  let _head = []
  return {
    set: (arr, presis) => {
      const clean = Array.isArray(arr) ? arr : [arr].filter(_ => _)
      if(!presis) {
        _head.map(el => dom.removeChild(el))
        _head = clean
      }
      clean.map(node => dom.appendChild(node))
    }
  }
})()

const is_fn = (maybe_fn) => typeof maybe_fn === 'function'
const get_pathname = () => window.location.pathname

export default function router(_container, _) {

  function handle_props(props, element) {
    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith('on') && key.toLowerCase() === key) {
        element[key] = value
      } else if(key == '__INTERNAL_RERENDER__') {
        console.log('has rerender => ', element)
      } else {
        element.setAttribute(key, value)
      }
    })
  }

  function handle_children(children, element) {
    children.forEach(child => {
      if (child === undefined || child === null) {
        return
      } else if (typeof child === 'string' || typeof child === 'number') {
        element.appendChild(document.createTextNode(child))
      } else if (Array.isArray(child)) {
        child.map(({type, props, children}) => {
          element.appendChild(create_dom_nodes({type, props, children}))
        })
      } else {
        element.appendChild(create_dom_nodes({...child}))
      }
    })
  }

  function handle_link(_node) {
    const { props, children } = _node
    const node = children[0]
    const element = document.createElement(node.type)
    if(node.type == 'a') {element.href = props.href}
    element.onclick = e => {
      e.preventDefault()
      window.history.pushState({}, '', props.href)
      render_route(props.href)
      if(_._config.on_route_change) {_._config.on_route_change(props.href)}
    }
    handle_props(node.props, element)
    handle_children(node.children, element)
    return element
  }

  function handle_promise(node) {
    const { props } = node
    const { placeholder, ..._props } = props.promise.props
    const new_node = props.promise.type(_props)
    const _placeholder = placeholder()
    const element = create_dom_nodes(_placeholder)
    new_node.then(_node => {
      element.parentNode.replaceChild(create_dom_nodes(_node), element)
    })
    return element
  }

  function handle_default(node) {
    let {type, props, children} = node
    const element = document.createElement(type)
    handle_props(props, element)
    handle_children(children, element)
    return element
  }

  function create_dom_nodes(node) {
    if(node.type == 'Link') {
      return handle_link(node)
    } else if(node.type === '__PROMISE__') {
      return handle_promise(node)
    } else {
      return handle_default(node)
    }
  }

  function maybe_node_arr(arr){
    return Array.isArray(arr)
      ? arr.map((vnode => create_dom_nodes(vnode)))
      : create_dom_nodes(arr)
  }

  function render_route(path) {
    const route_component = _[path]
      ? _[path]()
      : _['*']()
    const head_component = (_._config.head[path] && path !== '*')
      ? _._config.head[path]()
      : []
    _head.set(maybe_node_arr(head_component))
    _container.innerHTML = ''
    _container.appendChild(create_dom_nodes(route_component))
  }

  if(_._config && _._config.head['*']) {
    const head_component = is_fn(_._config.head['*']) ? _._config.head['*']() : 0
    if(head_component) {_head.set(maybe_node_arr(head_component), true)}
  }

  Array.from(document.querySelectorAll('.spa-nav'))
    .map(element => {
      element.onclick = e => {
        e.preventDefault()
        const href = element.getAttribute('href')
        if(get_pathname() === href) {return}
        window.history.pushState({}, '', href)
        render_route(get_pathname())
        if(_._config.on_route_change) {
          _._config.on_route_change(get_pathname())
        }
      }
    })

  render_route(get_pathname())

  window.onpopstate = () => {render_route(get_pathname())}
}
