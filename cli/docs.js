const fs = require('fs')
const path = require('path')
const mkdir = require('mkdirp')
const cp_file = require('cp-file')
const { yellow, red, blue, green, _log } = require('./utils/logger.js').utils

const generate_json = (prop_types_path, on_complete) => {
  fs.readdir(prop_types_path, {}, (err, files) => {
    if(err) _log(err)
    files.forEach((file, index) => {
      const name = file.split('.')[0]
      const prop_types = require(path.resolve(`${prop_types_path}/${file}`))
      fs.writeFile(
        `./docs/static/${name}.json`,
        JSON.stringify(prop_types, null, 2),
        err => {
          if(err) _log(err)
          _log(green('+'), `created docs/static/${name}.json`)
          if(index == files.length - 1) {
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
    const page_path = `./docs/pages/${transform(name).toLowerCase()}.js`
    const file_content = `import render from 'nano_spa/render'
import page from '../page.js'
export default () => render\`
  <\${page} link='/static/${name}.json' name='${name}'/>
\``.trim()
    if(!fs.existsSync(page_path)) {
      fs.writeFile(page_path, file_content, (err) => {
        return err
          ? _log(red('error'), err)
          : _log(green('+'), `created docs/pages/${transform(pages[index]).toLowerCase()}`)
      })
    }
  })
}

module.exports = (/*args*/) => {
  const dirs = ['./docs', './docs/pages', './docs/static', './handlers-props']
  dirs.forEach(dir => mkdir(dir))

  const temps_path = './node_modules/nano_spa/cli/utils/docs_temp/'
  Object.entries({
    [`${temps_path}index.html`]: './docs/index.html',
    [`${temps_path}main.js`]: './docs/main.js',
    [`${temps_path}index-page.js`]: './docs/pages/index.js',
    [`${temps_path}page.js`]: './docs/page.js',
  }).forEach(([src, dest]) => !fs.existsSync(dest) && cp_file(src, dest))

  // make sure all handlers have handlers-props prop type.
  fs.readdir('./handlers', {}, (err, files) => {
    if(err) _log(red('error'), err)
    files.forEach(file => {
      const name = file.split('.')[0]
      if(!fs.existsSync(`./handlers-props/${file}`)) {
        fs.writeFile(`./handlers-props/${file}`, 'module.exports = {}', err => {
          if(err) {_log(red('error'), err)}
          _log(yellow('+'), `created handlers-props/${name}.js`)
        })
      }
    })
  })

  generate_json('./handlers-props', generate_pages)
  generate_json('./node_modules/nano_spa/handlers-props', generate_pages)
}
