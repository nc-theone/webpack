
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
  var isDev = env && env.dev && env.dev === true;
  var isAnalysis = env && env.analysis && env.analysis === true;

  isAnalysis && (isDev = true);

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
    // the home directory for webpack
    // the entry and module.rules.loader option is resolved relative to this directory
    context: __dirname,
    // string | object | array
    entry: {
      'pages/home/index': './src/pages/home/index.js'
    },
    output: {
      // 在开发阶段 一定要指定为一个相对路径 否则会导致html中的依赖资源加载失败
      path: isDev ? '/dist/' : path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      // 和path的配置 解释相同
      publicPath: isDev ? '/dist/' : path.resolve(__dirname, 'dist'),
      chunkFilename: '[chunkhash].js'
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    },
    // 打包&编译时的兼容处理
    resolve: {
      // modules: [ 'node_modules' ], // 不太清楚是怎么用的
      // import date from 'utils/date' 会自动进行后缀拼接
      // 如果不带后缀 会自动 进行下面的文件查找
      // utils/date.js  utils/date.jsx utils/date.json 知道找到对应的文件
      // 建议引入的时候 直接添加后缀 减少解析和比对的时间
      extensions: ['.js', '.jsx', '.json'],
      alias: {
        components: path.resolve(__dirname, './src/components/'), // 组件目录别名
        utils: path.resolve(__dirname, './src/utils/'),
        styles: path.resolve(__dirname, './src/styles')
      }
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
                // 禁用es6-module -> commonjs-module 这样webpack2可以使用tree-shaking
                // https://www.zhihu.com/question/41922432
                presets: ['react', 'stage-0', ['es2015', { modules: false }]],
                plugins: [
                  'transform-decorators-legacy',  // 支持 @
                  'transform-class-properties'    // 支持 onClick = () => {} 
                ]
              }
            }
          ],
          // 只有一个loader的话 直接使用loader字段进行配置
          // loader: 'babel-loader', // 用来编译指定的文件
          // options: { // loader配置 具体可以查看每一个loader支持的配置
          //   cacheDirectory: true,
          //   presets: ['react', 'es2015', 'stage-0'],
          //   plugins: ['transform-decorators-legacy']
          // },
          // 这里千万不要设置啊 否则会导致二级引用不会被编译
          // 如果这里设置为[] 则 import * as a from 'utils/date'; utils/date.js 的语法不会被转换
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
            // use: 'raw-loader!postcss-loader!fast-sass-loader?includePaths[]=' + path.join(__dirname, 'src')
            use: [
              {
                loader: 'postcss-loader',
                options: {
                  plugins: loader => [precss, autoprefixer]
                }
              },
              {
                loader: 'fast-sass-loader',
                options: {
                  includePaths: [
                    path.join(__dirname, 'src')
                  ]
                }
              }
            ]
          })
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            use: [
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
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
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
    // 开发工具
    // devtool: 'source-map', // inlint-source-map | eval-source-map | cheap-source-map
    devServer: {
      // proxy: { // proxy URLs to backend development server
      //   '/api': 'http://localhost:3000'
      // },
      // 可以直接这么访问了 http://127.0.0.1:9000/src/demos/index.html
      // 之所以这是为 ./ 是为了在*.html中引用的时候 可以指定到 /node_modules/ 目录
      // 建议直接设置为 ./ 如果设置为 ./src/
      // 那么页面的访问链接将减少一级 变成 http://127.0.0.1:9000/demos/index.html
      contentBase: isDev ? './' : path.join(__dirname, './'), // boolean | string | array, static file location
      compress: true, // enable gzip compression
      // 这里一般设置为false 否则 访问类似于 http://127.0.0.1:9000/src/demos/ 会直接报错
      historyApiFallback: false, // true for index.html upon 404, object for multiple paths
      // 没有hot-replacement-plugin的话 该项不要设置为true
      hot: false, // hot module replacement. Depends on HotModuleReplacementPlugin
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

  if (isAnalysis) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  if (isDev) {
    config.plugins.push(new webpack.SourceMapDevToolPlugin({}));
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
      //   output: {
      //     comments: true
      //   },
      //   uglifyOptions: {
      //     ecma: 7
      //   },
      //   mangle: {
      //     except: ['$', 'exports', 'require']
      //   },
      //   compress: {
      //     warning: true,
      //     drop_console: true
      //   }
      // })
      new UglifyJsParallelPlugin({
        workers: os.cpus().length, // usually having as many workers as cpu cores gives good results
        // other uglify options
        output: {
          // comments: true
        },
        compress: {
          warnings: false // 禁止打包过程中 在终端输出warning信息
        },
        uglifyOptions: {
          ecma: 7
        },
        // beautify: true // true 表示会格式化压缩后的代码 多出很多空格和换行
      })
    );
  }
  return config;
};
