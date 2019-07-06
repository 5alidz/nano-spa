import _global from './global.js'
import render_route from './render_route.js'

export const bind_initial = () => {
  document.querySelectorAll('.LINK').forEach(link => {
    link.onclick = function(e) {
      e.preventDefault()
      const href = this.getAttribute('href')
      if(window.location.pathname === href) {return}
      _global.methods.on_route_unmount(
        window.location.pathname,
        _global.root.children
      )
      window.history.pushState({}, '', href)
      render_route()
    }
  })
}
