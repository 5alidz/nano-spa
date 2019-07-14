import render from 'nano_spa/render.js'
import to_dom from 'nano_spa/to_dom.js'

const app = () => {
  return render`
    <div padding='1rem'>
      <Router dir=${page => import(`./pages/${page}.js`)} />
    <//>
  `
}

document
  .getElementById('root')
  .appendChild(to_dom(render`<${app} />`))
