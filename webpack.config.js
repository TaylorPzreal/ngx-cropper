const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const os = require('os');

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
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        use: [
          {
            loader: 'tslint-loader',
            options: {
              tsConfigFile: './tsconfig.json'
            }
          }
        ]
      },
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: './tsconfig.json'
            }
          },
          'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        include: ['src', 'sample']
      },
      {
      test: /\.css$/,
      include: ['node_modules'],
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: () => {
              return [
                require('precss'),
                require('autoprefixer')
              ];
            },
            sourceMap: true
          }
        }]
      })
    },
      {
        test: /\.css$/,
        use: ['raw-loader'],
        include: ['./src', './sample']
      }
    ]
  },
  plugins: [
    // 用于去掉浏览器console的warning
    new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)@angular/, './sample', {}),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor']
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
    }),

    new ParallelUglifyPlugin({
      workerCount: os.cpus().length,
      cacheDir: '.cache/',
      sourceMap: true,
      uglifyJS: {
        compress: {
          warnings: true,
          drop_debugger: false,
          drop_console: false
        },
        // comments: DEVELOPMENT,
        mangle: {
          // Skip mangling these
          reserved: ['$super', '$', 'exports', 'require'],
          keep_fnames: true
        }
      }
    }),

    new ExtractTextPlugin('[name].css')
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
