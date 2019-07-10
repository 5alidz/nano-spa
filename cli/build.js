const webpack = require('webpack')
const webpack_conf = require('./webpack_config.js')
const logger = require('./logger.js')

module.exports = (_args) => {
  const compiler_prod = webpack(webpack_conf({ mode: 'production' }))
  compiler_prod.run(logger.log)
}
