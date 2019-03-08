var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: false,
      extract: true
    })
  },
  devtool: 'source-map',
  cache: true,
  watchOptions: {
    aggregateTimeout: 100
  },
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].js'), //.[chunkhash]
    chunkFilename: utils.assetsPath('js/[id].js'),
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require('./manifest.dll.json'),
      context: path.resolve(__dirname, '../src/')
    }),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': '"development"'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].css')//.[contenthash]
    }),
    new FriendlyErrorsPlugin()
  ]
})

module.exports = webpackConfig
