var conf = require('./webpack.prod.conf')
var config = require('../config')
var utils = require('./utils')
module.exports = Object.assign({}, conf, {
  output: {
    path: config.online.assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[id].js')
  }
})
