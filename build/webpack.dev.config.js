const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
module.exports = merge(require('./webpack.base.config'), {
  output: {
    path: path.resolve(__dirname, '../dist/ChinaAreaSelector/'),
    publicPath: '/ChinaAreaSelector/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {

        NODE_ENV: JSON.stringify('development'),
      }
    }),
  ],
  devtool: 'source-map',
  devServer: {
    compress: true,
    noInfo: true,
    clientLogLevel: "error",
    disableHostCheck: true,
    headers: {
      'cache-control': 'no-cache',
      "X-Custom-Foo": "bar"
    }
  },
})
