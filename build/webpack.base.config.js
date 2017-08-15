'use strict'
const WebpackHtmlPlugin = require('html-webpack-plugin')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const publicPath = '/ChinaAreaSelector/'

module.exports = {
  entry: {
    'index': './src/app/index.js',
  },

  output: {
    path: path.resolve(__dirname, '../dist/reactForm/'),
    publicPath: publicPath,
    filename: '[name].[chunkhash].bundle.js',
    chunkFilename: '[name].[chunkhash].chunk.js'
  },
  plugins: [
    new WebpackHtmlPlugin({
      template: 'src/app/index.html',
      filename: 'index.html',
      chunks: ['manifest', 'vendor', 'index'],
      chunksSortMode: 'dependency',
    }),
  ],
  module: {

    rules: [
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: function () {
                return [
                  require('autoprefixer')({ browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 8'] })
                ];
              }
            }
          },
          'stylus-loader'
        ]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, '../node_modules')
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
    ]
  }
}
