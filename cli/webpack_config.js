const path = require('path')
const HTMLwebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

const babel_rules = {
  test: /\.js/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        ['@babel/preset-env', { targets: {edge: '44'}, modules: false }]
      ],
      plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-transform-template-literals',
        '@babel/plugin-syntax-object-rest-spread',
        '@babel/plugin-syntax-dynamic-import'
      ]
    }
  }
}

const plugins_common = [
  new CleanWebpackPlugin(),
  new HTMLwebpackPlugin({template: './src/index.html', inject: false}),
  new CopyPlugin([{ from: './src/static', to: 'static' }]),
]

const plugins_dev = [
  ...plugins_common,
  new webpack.HotModuleReplacementPlugin()
]

module.exports = (env) => ({
  entry: env.mode ==  'production'
    ? './src/main.js'
    : [
      'webpack-hot-middleware/client?reload=true',
      './src/main.js'
    ]
  ,
  output: {
    path: path.resolve('.', 'dist'),
    filename: 'main.js',
    publicPath: '/',
    chunkFilename: '[name].main.js'
  },
  plugins: env.mode == 'production' ? plugins_common : plugins_dev,
  module: {rules: [babel_rules]},
  mode: env.mode
})
