const webpack = require('webpack')
const webpack_conf = require('./webpack_config.js')
const express = require('express')
const mw = require('webpack-dev-middleware')
const hot_mw = require('webpack-hot-middleware')
const history = require('connect-history-api-fallback')
const fs = require('fs')
const path = require('path')
const int_ip = require('internal-ip')
const { green, red } = require('./logger.js').utils

const _log = console.log

module.exports = (_args) => {
  const app = express()
  const conf = webpack_conf({ mode: 'development' })
  const compiler = webpack(conf)
  const PORT = _args.port || 3000

  const listen_cb = async () => {
    const internal_ip = await int_ip.v4()
    const msg = `app is ready on port ${PORT} & on local network ${internal_ip}`
    _log(green('done'), msg)
  }

  if(!fs.existsSync(path.resolve('.', 'handlers'))) {
    _log(red('error'), 'handlers directory is required.')
    return
  }

  app.use(history())

  app.use(mw(compiler, {
    logLevel: 'silent',
    publicPath: conf.output.publicPath,
  }))

  app.use(hot_mw(compiler, {log: false}))

  app.listen(PORT, listen_cb)
}
