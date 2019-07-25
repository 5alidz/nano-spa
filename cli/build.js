const webpack = require('webpack')
const logger = require('./utils/logger.js')
const fs = require('fs')
const merge = require('webpack-merge')
const path = require('path')

const webpack_conf = require('./utils/webpack_config.js')

module.exports = (_args) => {

  let conf = webpack_conf({
    mode: 'production',
    root: _args.src || 'app'
  })

  if(fs.existsSync(path.resolve('.', 'webpack.prod.js'))) {
    conf = merge(require(path.resolve('.', 'webpack.prod.js')), conf)
  }

  const compiler_prod = webpack(conf)

  compiler_prod.run(logger.log)
}
