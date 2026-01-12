const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const SERVER = {
  host: 'localhost',
  port: '3000'
};

module.exports = {
  mode: 'development',
  cache: {
    type: 'filesystem'
  },
  devtool: 'eval-cheap-module-source-map',

  entry: {
    app: './sample/main.ts',
    vendor: './sample/vendor.ts',
    polyfills: './sample/polyfills.ts'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: `http://${SERVER.host}:${SERVER.port}/`,
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    clean: true
  },

  resolve: {
    extensions: ['.ts', '.js', '.json']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json')
            }
          },
          {
            loader: 'angular2-template-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'sample')]
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)([\w\?=\.]*)?$/,
        type: 'asset/resource',
        include: [path.resolve(__dirname, 'node_modules/bootstrap/dist/fonts')]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer')
                ]
              },
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'sample/index.html',
      chunksSortMode: 'auto'
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 20
        }
      }
    }
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'dist')
    },
    compress: true,
    watchFiles: {
      paths: ['src/**/*', 'sample/**/*'],
      options: {
        aggregateTimeout: 300,
        poll: 1000
      }
    },
    host: SERVER.host,
    port: SERVER.port,
    hot: true
  }
};
