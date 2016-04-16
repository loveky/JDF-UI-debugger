var webpack = require('webpack')

module.exports = {
  entry: {
    devtools: './src/devtools.js',
    background: './src/background.js',
    'devtools-background': './src/devtools-background.js'
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader:  'babel',
        exclude: /node_modules/,
      }
    ]
  }
}