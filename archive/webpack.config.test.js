const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'exp/index.ts'),
  output: {
    path: path.resolve(__dirname, 'build-test'),
    filename: 'index.js',
    // library: 'rocket',
    // libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'ts-loader',
        ],
      },
      // {
      //   test: /\.(js)$/,
      //   exclude: /node_modules/,
      //   use: [
      //     'babel-loader',
      //   ],
      // },
    ],
  },
  resolve: {
    // alias: {
    //   '~': path.resolve(__dirname, 'rocket/'),
    // },
    extensions: ['.ts', '.js'],
  },
  optimization: {
    usedExports: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new TerserPlugin()
  ],
}
