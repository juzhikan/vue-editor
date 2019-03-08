var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var baseWebpackConfig = require('./webpack.base.conf')
var vueLoaderConfig = require('./vue-loader.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var env = config.dev.env

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
var webpackConfig = Object.assign({}, baseWebpackConfig, {
  entry: {
    vender: [
      'vue',
      'vuex',
      'element-ui',
      'vue-resource',
      'element-ui/lib/theme-default/index.css',
      'bootstrap/dist/css/bootstrap.css'
    ]
  },
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('dll/[name].dll.js'), //.[chunkhash]
    chunkFilename: utils.assetsPath('dll/[id].dll.js'),
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, './manifest.dll.json'),
      name: '[name]_library',
      context: path.resolve(__dirname, '../src/')
    }),
    new webpack.optimize.UglifyJsPlugin({}),
    new OptimizeCSSPlugin(),
    new ExtractTextPlugin("static/dll/common.css")
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: utils.cssLoaders({
            sourceMap: false,
            extract: false
          })
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: '[name].[ext]',
          outputPath: '/static/dll/',
          publicPath: '/dist/dll/'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: '[name].[ext]',
          outputPath: '/static/dll/',
          publicPath: '/dist/static/dll/'
        }
      }
    ]
  },
})


module.exports = webpackConfig
