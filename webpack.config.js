const rucksack = require('rucksack-css');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: path.join(__dirname, './client'),
  entry: {
    jsx: './index.js',
    html: './index.html',
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'superagent',
      'redux',
      'classnames',
      'material-ui',
      'react-chartjs',
    ],
  },
  output: {
    path: path.join(__dirname, './static'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jpe?g$/,
        loader: 'file',
      },
      {
        test: /\.png$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.css$/,
        include: /client/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: /client/,
        loader: 'style!css',
      },
      {
        test: /\.sass$/,
        exclude: /client/,
        loader: 'style!css!sass',
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        loaders: ['react-hot', 'babel'],
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.sass', '.scss'],
  },
  postcss: [
    rucksack({
      autoprefixer: true,
    }),
  ],
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
  ],
  devServer: {
    contentBase: './client',
    hot: true,
  },
};
