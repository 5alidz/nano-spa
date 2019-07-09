const webpack = require('webpack')
const webpack_conf = require('./webpack_config.js')
const express = require('express')
const mw = require('webpack-dev-middleware')
const hot_mw = require('webpack-hot-middleware')
const history = require('connect-history-api-fallback')

module.exports = (_args) => {
  const app = express()
  const conf = webpack_conf({ mode: 'development' })
  const compiler = webpack(conf)

  app.use(history())
  app.use(mw(compiler, {
    logLevel: 'silent',
    publicPath: conf.output.publicPath,
  }))
  app.use(hot_mw(compiler, {log: false}))
  app.listen(_args.port || 3000, () => console.log('app running on port 3000'))
}
