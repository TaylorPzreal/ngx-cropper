const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const SERVER = {
  host: 'localhost',
  port: '3000'
};

module.exports = {
  cache: true,
  devtool: 'cheap-module-eval-source-map',

  entry: {
    app: './sample/main.ts',
    vendor: './sample/vendor.ts',
    polyfills: './sample/polyfills.ts'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: `http://${SERVER.host}:${SERVER.port}/`,
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['.ts', '.js', '.json']
  },

  module: {
    rules: [{
      enforce: 'pre',
      test: /\.ts$/,
      use: [{
        loader: 'tslint-loader',
        options: {
          tsConfigFile: './tsconfig.json'
        }
      }]
    }, {
      test: /\.ts$/,
      loaders: [{
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: './tsconfig.json'
        }
      }, 'angular2-template-loader']
    }, {
      test: /\.html$/,
      loader: 'html-loader'
    }, {
      test: /\.css$/,
      use: [
        'raw-loader'
      ]
    }]
  },
  plugins: [
        // 用于去掉浏览器console的warning
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      './sample', {}
    ),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest'],
      // minChunks: 2
    }),
 new HtmlWebpackPlugin({
      template: 'sample/index.html',
      chunksSortMode: 'dependency'
    }),

    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: true // workaround for ng2
      },
      debug: true,
      options: {
        context: __dirname
      }
    })
  ],
  devServer: {
      historyApiFallback: true,
      stats: 'minimal',
      compress: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      },
      host: SERVER.host,
      port: SERVER.port
    }
};
