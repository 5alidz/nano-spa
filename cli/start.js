const webpack = require('webpack')
const webpack_conf = require('./webpack_config.js')
const express = require('express')
const mw = require('webpack-dev-middleware')
const hot_mw = require('webpack-hot-middleware')
const history = require('connect-history-api-fallback')
const Logger = require('./logger.js')
const int_ip = require('internal-ip')
const clear = require('clear')

module.exports = (_args) => {
  const app = express()
  const conf = webpack_conf({ mode: 'development' })
  const compiler = webpack(conf)
  const PORT = _args.port || 3000
  const { _log, green, normal_blue } = Logger.utils

  const listen_cb = async () => {
    clear()
    const internal_ip = await int_ip.v4()
    _log(green('ready'), `Server is ready on \`${normal_blue('localhost:' + PORT)}\` and on your local network \`${normal_blue(internal_ip + ':' + PORT)}\``)
  }
  app.use(history())

  app.use(mw(compiler, {
    logLevel: 'error',
    publicPath: conf.output.publicPath,
    logger: Logger.logger(_args)
  }))

  app.use(hot_mw(compiler, {log: false}))

  app.listen(PORT, listen_cb)
}
