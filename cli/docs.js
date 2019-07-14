const fs = require('fs')
const path = require('path')
const mkdir = require('mkdirp')
const cp_file = require('cp-file')

const log = console.log

const generate_json = (prop_types_path, on_complete) => {
  fs.readdir(prop_types_path, {}, (err, files) => {
    if(err) log(err)
    files.forEach((file, index) => {
      const name = file.split('.')[0]
      const prop_types = require(path.resolve(`${prop_types_path}/${file}`))
      fs.writeFile(
        `./docs/static/${name}.json`,
        JSON.stringify(prop_types, null, 2),
        err => {
          if(err) log(err)
          log('write', name + '.json', 'complete')
          if(index == files.length - 1) {
            log('[ COMPLETE ] writing custom handlers props JSON')
            if(typeof on_complete == 'function') on_complete(files)
          }
        }
      )
    })
  })
}

const generate_pages = (pages) => {
  const transform = name => name.replace(/@/g, '-')
  pages.forEach((page, index) => {
    const name = page.split('.')[0]
    fs.writeFile(
      `./docs/pages/${transform(name).toLowerCase()}.js`,
      [`import render from 'nano_spa/render'

const fetch_data = async () => {
  const promise = await fetch('/static/${name}.json')
  const json = await promise.json()
  return json
}

const component = (json) => {
  return render\`
    <pre>\${JSON.stringify(json, null, 2)}</pre>
  \`
}

const placeholder = () => render\`
  <p>...</p>
\`

export default () => {
  return render\`
    <div style='padding: 1rem;'>
      <Router::head>
        <title>${name}</title>
      <//>
      <h1 style='margin-bottom: 1rem;'>${name}</h1>
      <Promise
        placeholder=\${placeholder}
        promise=\${fetch_data}
        render=\${component}
      />
    </div>
  \`
}`].join(''),
      (err) => err ? log(err) : log(`writing page ${transform(pages[index]).toLowerCase()} complete`)
    )
  })
}

module.exports = (/*args*/) => {
  mkdir('./docs')
  mkdir('./docs/pages')
  mkdir('./docs/static')
  mkdir('./handlers.props')

  // copy index.html and main.js if it does not exist.
  if(!fs.existsSync('./docs/index.html')) {
    cp_file(
      './node_modules/nano_spa/cli/utils/docs_temp/index.html',
      './docs/index.html'
    )
  }
  if(!fs.existsSync('./docs/main.js')) {
    cp_file(
      './node_modules/nano_spa/cli/utils/docs_temp/main.js',
      './docs/main.js'
    )
  }
  if(!fs.existsSync('./docs/pages/index.js')) {
    cp_file(
      './node_modules/nano_spa/cli/utils/docs_temp/index-page.js',
      './docs/pages/index.js'
    )
  }
  // make sure all handlers have handlers.props prop type.
  fs.readdir('./handlers', {}, (err, files) => {
    if(err) log(err)
    files.forEach(file => {
      const name = file.split('.')[0]
      if(!fs.existsSync(`./handlers.props/${file}`)) {
        fs.writeFileSync(`./handlers.props/${file}`, 'module.exports = {}', err => {
          if(err) log(err)
          log(`write empty prop types for ${name}.`)
        })
      }
    })
  })
  // generate all required json files.
  generate_json('./handlers.props', generate_pages)
  generate_json('./node_modules/nano_spa/handlers.props', generate_pages)
  // generate all pages.
}
