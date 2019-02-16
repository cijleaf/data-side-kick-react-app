const { resolve } = require('path');
const {
  DefinePlugin,
  HotModuleReplacementPlugin,
  SourceMapDevToolPlugin,
  optimize: {
    CommonsChunkPlugin,
    OccurenceOrderPlugin,
    UglifyJsPlugin,
  },
} = require('webpack');
const { smart, smartStrategy } = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const combineLoaders = require('webpack-combine-loaders');
const { dependencies } = require('./package.json');

const { stringify } = JSON;

const { env: { NODE_ENV, PORT } } = process;

const packages = Object.keys(dependencies);

const config = {
  target: 'web',
  context: resolve('src'),
  entry: {
    packages: packages,
    app: './index',
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    publicPath: '/',
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: combineLoaders([
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:5]',
            },
          },
          {
            loader: 'autoprefixer-loader',
            query: {
              browsers: ['last 2 version', 'Safari >= 8'],
            },
          },
        ]),
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: combineLoaders([
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:5]',
            },
          },
          {
            loader: 'autoprefixer-loader',
            query: {
              browsers: ['last 2 version', 'Safari >= 8'],
            },
          },
          {
            loader: 'sass-loader',
            query: {
              sourceMap: true,
            },
          },
        ]),
      },
      {
        test: /\.(png|jpg|otf|eot|woff|ttf|svg)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
      },
    ],
  },
  eslint: {
    quiet: true,
  },
  plugins: [
    new DefinePlugin({
      process: {
        env: {
          NODE_ENV: stringify(NODE_ENV),
        },
      },
    }),
    new CommonsChunkPlugin('packages', 'common.js'),
    new SourceMapDevToolPlugin({
      include: 'app',
      exclude: 'packages',
    }),
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      { from: 'index.html', to: 'index.html' },
      { from: 'OAuth2/salesforce.html', to: 'OAuth2/salesforce.html' },
    ]),
  ],
};

if (NODE_ENV === 'development') {
  module.exports = smartStrategy({
    'entry.packages': 'prepend',
  })(config, {
    entry: {
      packages: [
        'react-hot-loader/patch',
        'react-hot-loader',
        'redux-devtools-instrument',
      ],
    },
    plugins: [
      new HotModuleReplacementPlugin(),
    ],
    output: {
      pathinfo: true,
    },
    debug: true,
    devServer: {
      port: 3000,
      hot: true,
      inline: true,
      historyApiFallback: true,
      publicPath: config.output.publicPath,
      https: true,
    },
  });
}

if (NODE_ENV === 'production') {
  module.exports = smart(config, {
    plugins: [
      new OccurenceOrderPlugin(),
      new UglifyJsPlugin({
        compress: { warnings: false },
        comments: false,
        sourceMap: true,
        mangle: true,
        minimize: true,
      }),
    ],
  });
}
