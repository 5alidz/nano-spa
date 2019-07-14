const webpack = require('webpack')
const webpack_conf = require('./utils/webpack_config.js')
const logger = require('./utils/logger.js')

module.exports = (_args) => {
  const compiler_prod = webpack(webpack_conf({
    mode: 'production',
    root: _args.src || 'app'
  }))

  compiler_prod.run(logger.log)
}
