import _global from './global.js'

import { render_route } from './render_route.js'

import { mount_first_head } from './head.js'

import { get_current, on_unmount, __PUSH_STATE__ } from  './utils.js'

const bind_initial = (render_route) => {
  document.querySelectorAll('.LINK').forEach(link => {
    link.onclick = function(e) {
      e.preventDefault()
      const href = this.getAttribute('href')
      if(get_current() === href) {return}
      on_unmount()
      __PUSH_STATE__(href)
      render_route()
    }
  })
}

export default function router(o) {
  Object.assign(_global, o)

  bind_initial(render_route)
  mount_first_head()
  render_route()

  let prev = get_current()
  window.onpopstate = () => {
    on_unmount(prev)
    prev = get_current()
    render_route()
  }
}
