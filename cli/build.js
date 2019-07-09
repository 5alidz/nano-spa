const webpack = require('webpack')
const webpack_conf = require('./webpack_config.js')

module.exports = (args) => {
  const compiler_prod = webpack(webpack_conf({ mode: 'production' }))
  compiler_prod.run((err, stats) => {
    if(err || stats.hasErrors()) {
      console.log(err)
    } else {
      console.log('done')
    }
  })
}
