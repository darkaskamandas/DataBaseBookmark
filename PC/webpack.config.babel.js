/*** PACKAGES ***/
import CompressionPlugin from 'compression-webpack-plugin'
import dotenv from 'dotenv'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'

/*** TOOLS ***/
dotenv.load()
const PROD = process.env.NODE_ENV === 'production'

/*** COMMON CONFIGURATIONS ***/
//https://webpack.js.org/configuration/node/
const nodeConfig = {
  console: false, //default
  //global: false,
  //process: false,
  //Buffer: false,
  __filename: false, //use regular Node __filename behavior instead of 'mock'
  __dirname: false, //use regular Node __dirname behavior instead of 'mock'
  fs: 'empty' //Prevents webpack error "Cannot resolve module 'fs'..."
}

//This loads the value INTO the code. Don't use for sensitive information.
const environmentConfig = new webpack.EnvironmentPlugin({
  NODE_ENV: 'development' //Use 'development' unless process.env.NODE_ENV is found
})

const compConfig = new CompressionPlugin({
  asset: '[path].gz[query]',
  test: /\.(js|html|css|json|ico|eot|otf|ttf)$/, //Defaults to all plugins, but using this: https://www.fastly.com/blog/new-gzip-settings-and-deciding-what-compress/
  algorithm: 'gzip',
  threshold: 10240,
  minRatio: 0.8,
  deleteOriginalAssets: false
})

const uglyConfig = new webpack.optimize.UglifyJsPlugin({ ie8: false, ecma: 8 })

/*** CLIENT CONFIG ***/
const client = {
  entry: {
    login: [__dirname + '/client/login.jsx', 'babel-polyfill'],
    index: [__dirname + '/client/index.jsx', 'babel-polyfill']
  },
  devtool: PROD ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        include: [/common/, /client/],
        exclude: [/node_modules/, /server/],
        loader: 'babel-loader',
        options: { presets: ['env', 'react'] }
      },
      {
        test: /\.(css|sass|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          publicPath: '../', //The Plugin assumes css is in the same directory as the html by default (?) and redoes paths!
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: PROD ? true : false
              }
            },
            'postcss-loader', //autoprefixer is bundled with cssnext; cssnano is bundled with css-loader, though we could require it explicitly in .postcssrc
            {
              loader: 'sass-loader',
              options: {
                minimize: PROD ? true : false
              }
            }
          ]
        })
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'url-loader',
        options: {
          limit: 10000, //limit =< 10000 ? Data URL : fallback to file-loader
          name: 'img/[sha256:hash:5].[ext]' //If using file-loader, emit to img/ as a 10 digit sha256 has with the proper extension.
        }
      },
      {
        test: /\.ico$/i,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]'
        }
      },
      {
        test: /\.(eot|otf|ttf|svg|woff|woff2)$/i,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
          name: 'fonts/[sha256:hash:5].[ext]' //must use full output path
        }
      }
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'js/[name].client.bundle.js'
  },
  target: 'web',
  node: nodeConfig,
  plugins: PROD
    ? [
        new HTMLWebpackPlugin({
          title: 'Charmed Books',
          template: __dirname + '/client/' + 'index.html',
          filename: __dirname + '/dist/' + 'index.html',
          inject: false //'body' // Injects *all* scripts and css if enabled
        }),
        new HTMLWebpackPlugin({
          title: 'Test',
          template: __dirname + '/client/' + 'login.html',
          filename: __dirname + '/dist/' + 'login.html',
          inject: false //'body' // Injects *all* scripts and css if enabled
        }),
        new ExtractTextPlugin({
          filename: 'styles/[name].css'
        }),
        environmentConfig,
        uglyConfig,
        compConfig
      ]
    : [
        new HTMLWebpackPlugin({
          title: 'Login',
          template: __dirname + '/client/' + 'login.html',
          filename: __dirname + '/dist/' + 'login.html',
          inject: false //'body' // Injects *all* scripts and css if enabled
        }),
        new HTMLWebpackPlugin({
          title: 'Sorcerer City',
          template: __dirname + '/client/' + 'index.html',
          filename: __dirname + '/dist/' + 'index.html',
          inject: false //'body' // Injects *all* scripts and css if enabled
        }),
        new ExtractTextPlugin({
          filename: 'styles/[name].css'
        }),
        environmentConfig
      ]
}

/*** SERVER CONFIG ***/
const server = {
  entry: ['babel-polyfill', __dirname + '/server/server.js'],
  output: {
    path: __dirname + '/dist',
    filename: 'server.bundle.js'
  },
  devtool: PROD ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        include: [/common/, /server/],
        exclude: [/node_modules/, /client/],
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    ]
  },
  target: 'node',
  node: nodeConfig,
  externals: [nodeExternals()],
  plugins: PROD ? [environmentConfig, compConfig, uglyConfig] : [environmentConfig]
}

export default [client, server]
