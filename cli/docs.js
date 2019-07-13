const fs = require('fs')
const path = require('path')
const mkdir = require('mkdirp')

module.exports = (/*args*/) => {
  mkdir(path.resolve('.', 'docs'))
  // get default handlers.
  fs.readdir(path.resolve('.', 'node_modules/nano_spa/handlers.props'), (err, files) => {
    if(err) console.log(err)
    files.forEach(file => {
      console.log(file)
    })
  })
}
