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

const plugins_common = (env) => [
  new CleanWebpackPlugin(),
  new HTMLwebpackPlugin({template: `./${env.root}/index.html`, inject: false}),
  new CopyPlugin([{ from: `./${env.root}/static`, to: 'static' }], { logLevel: 'silent' }),
]

const plugins_dev = (env) => [
  ...plugins_common(env),
  new webpack.HotModuleReplacementPlugin(),
]

module.exports = (env) => ({
  entry: env.mode ==  'production'
    ? `./${env.root}/main.js`
    : [
      'webpack-hot-middleware/client?reload=true',
      `./${env.root}/main.js`
    ]
  ,
  output: {
    path: path.resolve('.', `dist-${env.root}`),
    filename: 'main.js',
    publicPath: '/',
    chunkFilename: '[name].main.js'
  },
  plugins: env.mode == 'production' ? plugins_common(env) : plugins_dev(env),
  module: {rules: [babel_rules]},
  mode: env.mode,
})
