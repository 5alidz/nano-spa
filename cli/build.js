const webpack = require('webpack')
const logger = require('./utils/logger.js')
const fs = require('fs')
const merge = require('webpack-merge')
const path = require('path')

let webpack_conf = require('./utils/webpack_config.js')

module.exports = (_args) => {
  if(fs.existsSync(path.resolve('.', 'webpack.prod.js'))) {
    webpack_conf = merge(require(path.resolve('.', 'webpack.prod.js')), webpack_conf)
  }
  const compiler_prod = webpack(webpack_conf({
    mode: 'production',
    root: _args.src || 'app'
  }))

  compiler_prod.run(logger.log)
}
