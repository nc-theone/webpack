
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// css处理
var precss = require('precss');
var autoprefixer = require('autoprefixer');

var os = require('os');

// 开发插件
var NyanProgressPlugin = require('nyan-progress-webpack-plugin');
var undleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// 打包插件
var UglifyJsParallelPlugin = require('webpack-uglify-parallel');
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// https://github.com/ertrzyiks/happypack-postcss-example/blob/master/webpack.js
// 后面 postcss-loader 支持单独的文件配置方式 不用这样写key
// HappyPack.SERIALIZABLE_OPTIONS = HappyPack.SERIALIZABLE_OPTIONS.concat(['postcss'])

const genBabelPlugin = () => {
  // 待优化
  // Happypack 多进程来加速代码构建
  return new HappyPack({
    id: 'happy-babel',
    loaders: [{
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
    }],
    threadPool: happyThreadPool,
    verbose: true
  });
};

const genScssPlugin = () => {
  return new HappyPack({
    id: 'happy-scss',
    loaders: [
      // 如果使用HappyPack的形式 则需要在根目录下添加 postcss.config.js 文件
      // https://github.com/amireh/happypack/wiki/Loader-Compatibility-List
      // https://github.com/amireh/happypack/issues/84
      // https://github.com/postcss/postcss/issues/813
      'postcss-loader',
      {
        loader: 'fast-sass-loader',
        options: {
          includePaths: [
            path.join(__dirname, 'src')
          ]
        }
      }
    ],
    threadPool: happyThreadPool
  });
};

const genLessPlugin = () => {
  return new HappyPack({
    id: 'happy-less',
    loaders: [
      'postcss-loader',
      'less-loader'
    ],
    threadPool: happyThreadPool
  });
};

const genCssPlugin = () => {
  return new HappyPack({
    id: 'happy-css',
    loaders: ['style-loader', 'css-loader'],
    threadPool: happyThreadPool
  });
};

const genImagePlugin = () => {
  return new HappyPack({
    id: 'happy-image',
    loaders: [{
      loader: 'url-loader',
      options: {
        limit: 30 * 1024
      }
    }],
    threadPool: happyThreadPool
  });
};

// 区分开发状态和发布状态
module.exports = function(env) {
  // 是否为开发模式
  var isDev = env && env.dev && env.dev === true;
  // 是否为代码分析模式
  var isAnalysis = env && env.analysis && env.analysis === true;
  // 是否为压缩模式
  var nocompress = env && env.nocompress && env.nocompress === true;

  isAnalysis && (isDev = true);

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
      // 这个配置 很重要 直接影响了 file-loader等编译出来的文件可访问位置
      // 会挂载到 __webpack_require__.p 属性上面 可以设置为cdn地址
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
              loader: 'happypack/loader?id=happy-babel'
            }
          ],
          exclude: [
            path.resolve(__dirname, 'node_modules')
          ],
          // issuer: { test, include, exclude },
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            // use: 'raw-loader!postcss-loader!fast-sass-loader?includePaths[]=' + path.join(__dirname, 'src')
            use: 'happypack/loader?id=happy-scss'
          })
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            use: 'happypack/loader?id=happy-less'
          })
        },
        {
          test: /\.css$/,
          use: 'happypack/loader?id=happy-css'
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: 'happypack/loader?id=happy-image'
        },
      ]
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
      genBabelPlugin(),
      genScssPlugin(),
      genLessPlugin(),
      genCssPlugin(),
      genImagePlugin(),
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
    if (!nocompress) {
      config.plugins.push(
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
  }
  return config;
};
