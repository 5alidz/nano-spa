import _global from './internal/global.js'
import render_route from './internal/render_route.js'

import { bind_initial } from './internal/bind_initial.js'
import { mount_first_head } from './internal/head.js'

export default function router(o) {
  /* save config in global */
  Object.assign(_global, o)

  /* handle first time router mounts */
  if(document.querySelectorAll('.LINK').length > 0) { bind_initial() }
  if(_global.head['*']) {mount_first_head()}
  render_route()

  /* saving prev route to execute on route unmount correctly */
  let prev = window.location.pathname
  window.onpopstate = () => {
    _global.methods.on_route_unmount(prev, _global.root.children[0])
    prev = window.location.pathname
    render_route()
  }
}
