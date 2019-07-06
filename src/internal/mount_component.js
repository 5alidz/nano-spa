export default function mount_component(root, component, clear) {
  if(!root || !component) { return }
  if(!clear) {root.innerHTML = ''}
  if(Array.isArray(component)) {
    component.map(node => root.appendChild(node))
  } else {
    root.appendChild(component)
  }
}
