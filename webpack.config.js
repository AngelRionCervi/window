const path = require('path');
const outputDir = path.resolve(__dirname, 'build');
module.exports = {
    entry: {
        preload: './dist/windows.js'
      },
      output: {
          path: path.join(__dirname, 'dist'),
          publicPath: './dist/',
          filename: '[name].bundle.js',
          chunkFilename: '[id].bundle.js'
      }
};