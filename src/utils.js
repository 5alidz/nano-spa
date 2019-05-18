export const get_current = () => window.location.pathname

const UNMOUNT = 'on_route_unmount'
const MOUNT = 'on_route_mount'

export const on_unmount = (methods, root_handler) => methods[UNMOUNT]
  && methods[UNMOUNT](
    get_current(),
    root_handler.root.children[0]
  )
export const on_mount = (methods, route_dom) => methods[MOUNT]
  && methods[MOUNT](get_current(), route_dom)
