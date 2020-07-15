var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js'
  },
  mode: 'development',
  resolve: {
    modules: ['node_modules']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Ecsy task',
      template: './src/index.html'
    })
  ]
};
