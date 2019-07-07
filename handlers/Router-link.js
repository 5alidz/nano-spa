import { g } from './shared/router_utils.js'

export default function router_link_handler(vNode, to_dom) {
  const href = vNode.props.href
  const action_node = to_dom(vNode.children[0])
  if('href' in action_node) {
    action_node.href = href || '/'
  }
  action_node.onclick = (e) => {
    e.preventDefault()
    window.history.pushState({}, '', href)
    g.render(href)
  }
  return action_node
}
