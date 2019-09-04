const webpack = require('webpack');

module.exports = {
  devServer: {
    proxy: 'https://treehole.app'
  },

  productionSourceMap: false,

  configureWebpack: config => {
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
  },
}
