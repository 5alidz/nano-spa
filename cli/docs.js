const fs = require('fs')
const path = require('path')
const mkdir = require('mkdirp')
const cp_file = require('cp-file')

const gen_json = (prop_types_path, to_path) => {
  const _JSON_ = {}

  const append_json = files => files.forEach(file => {
    const name = file.split('.')[0]
    const _module = require(path.join(prop_types_path, file))
    _JSON_[name] = _module
  })

  const write_json = () => fs.writeFile(
    path.resolve(to_path),
    JSON.stringify(_JSON_, null, 2),
    (_err) => {
      if(_err) console.log(_err)
      console.log(`created JSON file. at ${to_path}`)
    }
  )

  fs.readdir(prop_types_path, (err, files) => {
    if(err) console.log(err)
    append_json(files)
    write_json()
  })
}

module.exports = (/*args*/) => {
  const prop_types_path = path.resolve('./node_modules/nano_spa/handlers.props')
  const custom_prop_types_path = path.resolve('./handlers.props')

  mkdir(path.resolve('./docs'))
  mkdir(path.resolve('./docs/static'))
  mkdir(custom_prop_types_path)

  (async () => {
    await cp_file(
      './node_modules/nano_spa/cli/utils/docs_temp/index.html',
      './docs/index.html'
    )
    await cp_file(
      './node_modules/nano_spa/cli/utils/docs_temp/main.js',
      './docs/main.js'
    )
  })()

  const handlers_path = path.resolve('./handlers')
  const on_complete = () => {
    gen_json(custom_prop_types_path, './docs/custom_handlers.json')
    gen_json(prop_types_path, './docs/handlers.json')
  }

  fs.readdir(handlers_path, (err, files) => {
    const without_dirs = files.filter(file => {
      return fs.lstatSync(path.join(handlers_path, file)).isFile()
    })

    without_dirs.forEach((file, i) => {
      if(!fs.existsSync(path.join(custom_prop_types_path, file))) {
        fs.writeFile(
          path.join(custom_prop_types_path, file),
          'module.exports = {}',
          (err) => {
            if(err) return console.log(err)
            console.log(`[ INFO ] could not find prop types for ${file}`)
            console.log(`created empty prop types in './handlers.props' for ${file}`)
            if(i === without_dirs.length - 1) {
              console.log('writing empty prop types complete')
              on_complete()
            }
          }
        )
      }
    })
  })
}










