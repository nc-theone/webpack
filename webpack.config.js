
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// css处理
var precss = require('precss');
var autoprefixer = require('autoprefixer');

var os = require('os');

// 开发插件
var NyanProgressPlugin = require('nyan-progress-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// 打包插件
var UglifyJsParallelPlugin = require('webpack-uglify-parallel');
// var UglifyJSPlugin = require('uglifyjs-webpack-plugin')

// 区分开发状态和发布状态

module.exports = function(env) {
  var isDev = env.dev === true;
  // 待优化
  // Happypack 多进程来加速代码构建
  // new HappyPack({
  //   id: 'happybabel',
  //   loaders: [{
  //     loader: 'babel-loader',
  //     options: {
  //       cacheDirectory: true,
  //       presets: ['react', 'es2015', 'stage-0'],
  //       plugins: [
  //         'transform-decorators-legacy'
  //       ]
  //     }
  //   }],
  //   threadPool: happyThreadPool,
  //   verbose: true
  // }),

  // webpack1升级指南  https://webpack.js.org/guides/migrating/

  // https://webpack.js.org/configuration/
  var config = {
    // string | object | array
    entry: './src/index',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/dist/',
      chunkFilename: '[chunkhash].js'
    },
    // 模块的编译规则 针对不同的文件后缀 使用不同的加载器
    module: {
      rules: [
        {
           // 这种配置方式允许 这种引用方式import getNow from './utils/date'; 依旧被babel编译
           // 如果没有正则中的 ? 则上面的使用方式则编译失败
          test: /\.(jsx)|(js)?$/,
          use: [ // 两种配置方式都可以
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: ['react', 'es2015', 'stage-0'],
                plugins: ['transform-decorators-legacy']
              }
            }
          ],
          // loader: 'babel-loader', // 用来编译指定的文件
          // options: { // loader配置 具体可以查看每一个loader支持的配置
          //   cacheDirectory: true,
          //   presets: ['react', 'es2015', 'stage-0'],
          //   plugins: ['transform-decorators-legacy']
          // },
          // 这里千万不要设置啊 否则会导致二级引用不会被编译
          // include: [], // 这个值 一般不设置的
          // enforce: '', // pre | post
          exclude: [
            path.resolve(__dirname, 'node_modules')
          ],
          // issuer: { test, include, exclude },
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            // use: 'raw-loader!postcss-loader!fast-sass-loader?includePaths[]=' + path.join(__dirname, 'src')
            use: [
              'raw-loader',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: loader => [precss, autpprefixer]
                }
              },
              {
                loader: 'fast-sass-loader',
                options: {
                  includePaths: [
                    path.join(__dirname, 'srx')
                  ]
                }
              }
            ]
          })
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'raw-loader',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [precss, autoprefixer]
                }
              },
              'less-loader'
            ]
          })
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i, // 图片的压缩处理 暂时无用
          use: [
            {
              loader: 'file-loader',
              options: {}
            },
            {
              loader: 'image-webpack-loader',
              options: {
                gifsicle: {
                  interlaced: false,
                },
                optipng: {
                  optimizationLevel: 7,
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4
                },
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                // Specifying webp here will create a WEBP version of your JPG/PNG images
                webp: {
                  quality: 75
                }
              }
            }
          ]
        }
        // { oneOf: [ /* rules */ ] },
        // // only use one of these nested rules
        //
        // { rules: [ /* rules */ ] },
        // // use all of these nested rules (combine with conditions to be useful)
        //
        // { resource: { and: [ /* conditions */ ] } },
        // // matches only if all conditions are matched
        //
        // { resource: { or: [ /* conditions */ ] } },
        // { resource: [ /* conditions */ ] },
        // // matches if any condition is matched (default for arrays)
        //
        // { resource: { not: /* condition */ } }
        // // matches if the condition is not matched
      ]
      // noParse: [
      //   /special-library\.js$/
      // ],
      // // do not parse this module
      //
      // unknownContextRequest: ".",
      // unknownContextRecursive: true,
      // unknownContextRegExp: /^\.\/.*$/,
      // unknownContextCritical: true,
      // exprContextRequest: ".",
      // exprContextRegExp: /^\.\/.*$/,
      // exprContextRecursive: true,
      // exprContextCritical: true,
      // wrappedContextRegExp: /.*/,
      // wrappedContextRecursive: true,
      // wrappedContextCritical: false,
      // // specifies default behavior for dynamic requests
    },
    // 打包&编译时的兼容处理
    resolve: {
      // modules: [ 'node_modules' ], // 不太清楚是怎么用的
      extensions: ['.js', '.jsx', 'json'], // 任何loader识别的文件后缀 都可以拼接此数组进行二次识别
      alias: {
        components: path.resolve(__dirname, './src/components/'), // 组件目录别名
        utils: path.resolve(__dirname, './src/utils/'),
        styles: path.resolve(__dirname, './src/styles')
      }
    },
    // 开发工具
    // devtool: 'source-map', // inlint-source-map | eval-source-map | cheap-source-map
    // the home directory for webpack
    // the entry and module.rules.loader option is resolved relative to this directory
    context: __dirname,
    devServer: {
      // proxy: { // proxy URLs to backend development server
      //   '/api': 'http://localhost:3000'
      // },
      contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
      compress: true, // enable gzip compression
      historyApiFallback: true, // true for index.html upon 404, object for multiple paths
      hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
      https: false, // true for self-signed, object for cert authority
      noInfo: true, // only errors & warns on hot reload
    },
    plugins: [
      new ExtractTextPlugin(
        {
          filename: '[name].css',
          disable: false,
          allChunks: true
        }),
      // post loader配置
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: () => [precss, autoprefixer]
        }
      }),

      // 允许错误不打断程序
      new webpack.NoEmitOnErrorsPlugin(),
      // 进度插件
      new NyanProgressPlugin(),
      // 环境变量定义
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(isDev ? 'development' : 'production')
        },
        __DEV__: JSON.stringify(JSON.parse(isDev ? 'true' : 'false'))
      })
    ]
  };

  if (isDev) {
    config.plugins.push(new webpack.SourceMapDevToolPlugin({}));
    config.plugins.push(new BundleAnalyzerPlugin());
  } else {
    config.plugins.push(
      // new webpack.optimize.UglifyJsPlugin({
      //   compress: {
      //     unused: true,
      //     dead_code: true,
      //     warnings: false
      //   },
        // mangle: {
        //   except: ['$', 'exports', 'require']
        // },
      //   output: {
      //     ascii_only: true
      //   },
      //
      // })
      // new UglifyJSPlugin({
      //   parallel: {
      //     cache: true,
      //     workers: os.cpus().length
      //   },
      //   uglifyOptions: {
      //     ecma: 7
      //   },
      //   mangle: {
      //     except: ['$', 'exports', 'require']
      //   }
      // })
      new UglifyJsParallelPlugin({
        workers: os.cpus().length, // usually having as many workers as cpu cores gives good results
        // other uglify options
        uglifyOptions: {
          ecma: 7
        },
        // beautify: true // true 表示会格式化压缩后的代码 多出很多空格和换行
      })
      // 查找相等或近似的模块，避免在最终生成的文件中出现重复的模块。***webpack2中已经移除了这些模块
      // new webpack.optimize.DedupePlugin()
      // new webpack.optimize.OccurenceOrderPlugin()
    );
  }
  return config;
};
