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

module.exports = (env) => ({
  entry: './src/main.js',
  output: {
    path: path.resolve('.', 'dist'),
    filename: 'main.js',
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLwebpackPlugin({template: './src/index.html', inject: false}),
    new CopyPlugin([{ from: './src/static', to: 'static' }]),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [babel_rules]
  },
  mode: env.mode,
})
