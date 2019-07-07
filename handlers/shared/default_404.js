export default () => {
  const create_el = tag => document.createElement(tag)
  const el = create_el('div')
  const h3 = create_el('h3')
  const p = create_el('p')
  el.style = 'display: grid; padding: 2rem; justify-content: center; grid-gap: .5rem;'
  p.style = h3.style = 'text-align: center;font-family: "Lucida Console", Monaco, "Consolas", Monospace;'
  h3.textContent = '404'
  p.textContent = `cannot find page ${window.location.pathname}`
  el.appendChild(h3)
  el.appendChild(p)
  return el
}
