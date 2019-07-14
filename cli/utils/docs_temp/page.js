import render from 'nano_spa/render'

const fetch_data = link => async () => {
  const promise = await fetch(link)
  const json = await promise.json()
  const transform = Object.keys(json).reduce((acc, curr) => {
    acc.push({
      name: curr,
      type: json[curr].type,
      def: json[curr].default || 'none',
      description: json[curr].description || 'none',
      required: json[curr].required ? 'true' : 'false'
    })
    return acc
  }, [])
  return transform
}

const component = (data) => {
  const styles = {
    required: val => `color: ${val == 'true' ? 'green' : '#aaa'};`,
    default: val => `color: ${val == 'none' ? '#aaa' : 'orange'};`,
    description: val => `color: ${val == 'none' ? '#aaa' : 'black'};`,
  }
  const line = ({ name, type, def, description, required }) => render`
    <tr>
      <td>${name}</td>
      <td>${type.map(t => render`<p style='margin-top: .3rem;'>${t}</p>`)}</td>
      <td>
        <p style=${styles.required(required)}>
          ${required}
        </p>
      </td>
      <td>
        <p style=${styles.default(def)}>
          ${def}
        </p>
      </td>
      <td>
        <p style=${styles.description(description)}>
          ${description}
        </p>
      </td>
    </tr>
  `
  return render`
    <table class='table-content'>
      <thead>
        <tr>
          <td>Name</td>
          <td>Type</td>
          <td>Required</td>
          <td>Default</td>
          <td>Description</td>
        </tr>
      </thead>
      <tbody>
        ${data.map(({ name, type, def, description, required }) => render`
          <${line}
            name=${name}
            type=${type}
            def=${def}
            description=${description}
            required=${required}
          />
        `)}
      </tbody>
    </table>
  `
}

export default ({ name, link }) => {
  const table_container = `
    max-width: 740px;
    overflow-x: auto;
  `
  return render`
    <div style='padding: 1rem; display: grid; grid-gap: 1rem;'>
      <Router::head>
        <title>${name}</title>
      <//>
      <h1>${name}</h1>
      <h2 style='padding: 10px;'>Props</h2>
      <div style=${table_container}>
        <Promise
          placeholder=${() => render`<p>...</p>`}
          promise=${fetch_data(link)}
          render=${component}
        />
      </div>
    </div>
  `
}
