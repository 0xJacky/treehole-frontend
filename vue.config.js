const webpack = require('webpack');

module.exports = {
  devServer: {
    proxy: 'https://usilo.app'
  },

  productionSourceMap: false,

  configureWebpack: config => {
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
  },
}
