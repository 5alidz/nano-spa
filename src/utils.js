export const get_current = () => window.location.pathname
export const __PUSH_STATE__ = route => window.history.pushState({}, '', route)

const UNMOUNT = 'on_route_unmount'
const MOUNT = 'on_route_mount'

export const on_unmount = (methods, root_handler, route) => methods[UNMOUNT]
  && methods[UNMOUNT](
    route || get_current(),
    root_handler.root.children[0]
  )

export const on_mount = (methods, route_dom) => methods[MOUNT]
  && methods[MOUNT](get_current(), route_dom)

export const traverse = (root, callback) => {
  root = callback(root)
  if(root.children && root.children.length) {
    root.children = root.children.map(child => {
    return traverse(child, callback)
    })
  }
  return root
}
