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

module.exports = (_args) => {
  const app = express()
  const conf = webpack_conf({ mode: 'development', root: _args.src || 'app' })
  const compiler = webpack(conf)
  const PORT = _args.port || 3000
  const ROOT = _args.src || 'app'
  const { _log, green, normal_blue } = Logger.utils

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

  app.use(mw(compiler, {
    logLevel: 'error',
    publicPath: conf.output.publicPath,
    logger: Logger.logger(_args)
  }))

  app.use(hot_mw(compiler, {log: false}))

  app.listen(PORT, async () => {
    clear()
    const internal_ip = await int_ip.v4()
    _log(green('ready'), `Server started.
    ${ROOT} is running on:
      \t - ${normal_blue('localhost:' + PORT)}\t- ${normal_blue(`localhost:${PORT}/api`)}
      \t - ${normal_blue(internal_ip + ':' + PORT)}\t- ${normal_blue(`${internal_ip}:${PORT}/api`)}
    `)
  })
}
