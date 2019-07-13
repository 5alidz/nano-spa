import render from 'nano_spa/render.js'
import to_dom from 'nano_spa/to_dom.js'

const with_data = ({ comp }) => {
  const fetch_data = async () => {
    const get_default_json = fetch('/handlers.json')
    const get_custom_json = fetch('/custom_handlers.json')
    const [def_json, cust_json] = await Promise.all([get_default_json, get_custom_json])
    return await { ...def_json.json(), ...cust_json.json() }
  }
  return render`
    <div>
      <Promise
        promise=${fetch_data}
        render=${comp}
      />
    </div>
  `
}

const app = () => render`
  <div padding='1rem'>
    <${with_data}
      comp=${(data) => render`
        <pre>${JSON.stringify(data, null, 4)}</pre>
      `}
    />
  <//>
`

document
  .getElementById('root')
  .appendChild(to_dom(render`<${app} />`))
