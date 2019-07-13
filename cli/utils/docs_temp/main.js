import render from 'nano_spa/render.js'
import to_dom from 'nano_spa/to_dom.js'

const get_hanlders = async () => {
  const p = await fetch('/handlers.json')
  const json = p.json()
  return json
}

const handlers_nav = data => {
  return render`
    <Box type='ul'>
      ${data.handlers.map((handler) => render`
        <li>
          <Router::link href=${`/${handler}`}>
            <a>handler</a>
          <//>
        </li>
      `)}
    </Box>
  `
}

const app = ({ links }) => render`
  <div padding='1rem'>
    <Promise promise=${get_hanlders} render=${handlers_nav}/>
    <Router dir=${(page) => import(`./pages/${page}`)} />
  <//>
`

// <${simple_box} text='Footer'/>
document
  .getElementById('root')
  .appendChild(to_dom(render`<${app} />`))
