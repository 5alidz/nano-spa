const webpack = require('webpack')
const webpack_conf = require('./webpack_config.js')
const express = require('express')
const mw = require('webpack-dev-middleware')
const hot_mw = require('webpack-hot-middleware')
const history = require('connect-history-api-fallback')
const fs = require('fs')
const path = require('path')
const int_ip = require('internal-ip')
const { green, red, normal_blue } = require('./logger.js').utils
const clear = require('clear')

const _log = console.log

module.exports = (_args) => {
  const app = express()
  const conf = webpack_conf({ mode: 'development' })
  const compiler = webpack(conf)
  const PORT = _args.port || 3000
  clear()

  const listen_cb = async () => {
    const internal_ip = await int_ip.v4()
    const msg = `app is ready on localhost:\`${normal_blue(PORT)}\` & on local network \`${normal_blue(internal_ip)}\`:${normal_blue(PORT)}`
    _log(green('done'), msg)
  }

  if(!fs.existsSync(path.resolve('.', 'handlers'))) {
    return _log(red('error'), 'handlers directory is required.')
  }

  app.use(history())

  app.use(mw(compiler, {
    logLevel: 'error',
    publicPath: conf.output.publicPath,
  }))

  app.use(hot_mw(compiler, {log: false}))

  app.listen(PORT, listen_cb)
}
