import render from './create_element.js'
import router from './router.js'

import create_dom_nodes from './create_dom_nodes.js'
import { handlers } from './render_route.js'


export default {render, router, to_dom: create_dom_nodes.bind(handlers)}
