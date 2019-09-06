'use strict';

process.env.BABEL_ENV = 'renderer';

const path = require('path');
const { dependencies } = require('../package.json');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */
let blackListedModules = [
];

const commonConifg = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    // entry is dynamic
    main: path.join(
      __dirname,
      `../src/install.js`
    )
  },
  externals: [
    ...Object.keys(dependencies || {}).filter(d =>
      blackListedModules.includes(d)
    )
  ],
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      },
      // {
      //   test: /\.scss$/,
      //   use: ['vue-style-loader', 'css-loader', 'sass-loader']
      // },
      // {
      //   test: /\.sass$/,
      //   use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
      // },
      // {
      //   test: /\.less$/,
      //   use: ['vue-style-loader', 'css-loader', 'less-loader']
      // },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            extractCSS: process.env.NODE_ENV === 'production',
            loaders: {
              sass:
                'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
              scss: 'vue-style-loader!css-loader!sass-loader',
              less: 'vue-style-loader!css-loader!less-loader'
            }
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'imgs/[name]--[folder].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name]--[folder].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  output: {
    filename: `[name].js`,
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, `../dist/`)
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.css', '.node']
  },
  target: 'electron-renderer'
}

module.exports = commonConifg