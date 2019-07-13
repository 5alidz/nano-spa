const fs = require('fs')
const path = require('path')
const mkdir = require('mkdirp')

const prop_types_JSON = {}

module.exports = (/*args*/) => {
  const prop_types_path = path.resolve('./node_modules/nano_spa/handlers.props')
  mkdir(path.resolve('.', 'docs'))
  // get default handlers.
  fs.readdir(prop_types_path, (err, files) => {
    if(err) console.log(err)
    files.forEach(file => {
      const name = file.split('.')[0]
      const _module = require(path.join(prop_types_path, file))
      console.log(name, _module)
    })
  })
}
