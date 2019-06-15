import _render from './create_element.js'
import _router from './router.js'
import create_dom_nodes from './create_dom_nodes.js'

import { handlers } from './render_route.js'


export const render = _render
export const router = _router
export const to_dom = create_dom_nodes.bind(handlers)
