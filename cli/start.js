const webpack = require('webpack')
const express = require('express')
const mw = require('webpack-dev-middleware')
const hot_mw = require('webpack-hot-middleware')
const history = require('connect-history-api-fallback')
const int_ip = require('internal-ip')
const clear = require('clear')
const fs = require('fs')
const path = require('path')
const webpack_conf = require('./utils/webpack_config.js')
const Logger = require('./utils/logger.js')
const mkdirp = require('mkdirp')
const merge = require('webpack-merge')

module.exports = (_args) => {
  const app = express()
  let conf = webpack_conf({ mode: 'development', root: _args.src || 'app' })
  if(fs.existsSync(path.resolve('.', 'webpack.dev.js'))) {
    conf = merge(require(path.resolve('.', 'webpack.dev.js')), conf)
  }
  const compiler = webpack(conf)
  const PORT = _args.port || 3000
  const ROOT = _args.src || 'app'
  const { _log, green, yellow, red, normal_blue } = Logger.utils

  // for cloud function still experimental. index.js
  app.get('/api', (req, res) => {
    const module_path = path.resolve('.', `${ROOT}/functions/index.js`)
    if(fs.existsSync(module_path)) {
      const _module =  require.resolve(module_path)
      _module(req, res)
    } else {
      res.status(404).end('this function is not implemented')
    }
  })

  // for cloud function still experimental. /*.js
  app.get('/api/:id', (req, res) => {
    const module_path = path.resolve('.', `${ROOT}/functions/${req.params.id}.js`)
    if(fs.existsSync(module_path)) {
      const _module = require(module_path)
      _module(req, res)
    } else {
      res.status(404).end('this function is not implemented')
    }
  })

  // webpack middlewares.
  app.use(history()) // for index.html fallback.
  const wdmw_instance = mw(compiler, {
    logLevel: 'error',
    publicPath: conf.output.publicPath,
    logger: Logger.logger(_args)
  })

  app.use(wdmw_instance)

  app.use(hot_mw(compiler, {log: false}))

  const main_js_file = `
import render from 'nano_spa/render'
import to_dom from 'nano_spa/to_dom'

function app() {
  return render\`
    <div>Hello, world</div>
  \`
}

document
  .getElementById('root')
  .appendChild(to_dom(render\`<\${app} />\`))
`.trim()
  const html_file = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=7">
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
    <meta charset="UTF-8">
    <style>*{padding: 0; margin: 0; position: relative; box-sizing: border-box;}</style>
  </head>
  <body dir="ltr"><div id='root'></div><script src='/main.js'></script></body>
</html>
`.trim()

  const required = [
    './handlers',
    './handlers-props',
    `./${ROOT}`,
    `./${ROOT}/static`,
    `./${ROOT}/index.html`,
    `./${ROOT}/main.js`
  ]

  app.listen(PORT, async () => {
    clear()
    const internal_ip = await int_ip.v4()
    _log(green('ready'), `Server started.
    ${ROOT} is running on:
      \t - ${normal_blue('localhost:' + PORT)}\t- ${normal_blue(`localhost:${PORT}/api`)}
      \t - ${normal_blue(internal_ip + ':' + PORT)}\t- ${normal_blue(`${internal_ip}:${PORT}/api`)}
    `)
    required.forEach((path_to_check, index) => {
      if(!fs.existsSync(path_to_check)) {
        if(/\.\w+/.test(path_to_check)) {
          // it's a file
          if(path_to_check.endsWith('js')) {
            fs.writeFile(path_to_check, main_js_file, (err) => {
              if(err) _log(red('error'), 'error while writing', path_to_check)
              _log(green('+'), `created ${ROOT}/main.js`)
              index.length == required.length - 1 && wdmw_instance.invalidate()
            })
          } else {
            fs.writeFile(path_to_check, html_file, (err) => {
              if(err) _log(red('error'), 'error while writing', path_to_check)
              _log(green('+'), `created ${ROOT}/index.html`)
              index.length == required.length - 1 && wdmw_instance.invalidate()
            })
          }
        } else {
          // it's a directory
          mkdirp(path_to_check)
          _log(green('+'), `created ${path_to_check}`)
          index.length == required.length - 1 && wdmw_instance.invalidate()
        }
      }
    })
  })
}
