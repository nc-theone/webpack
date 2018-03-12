
var webpack = require('webpack');
var path = require('path');
var pwd = process.cwd();

module.exports = function(env) {
  var config = {
    context: pwd,
    entry: {
      'pages/test-loader': './src/pages/test-loader/index.jsc'
    },
    output: {
      path: path.resolve(pwd, './build/'),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.jsc$/,
          use: [
            {
              loader: path.resolve(pwd, './loader/test-loader.js'),
              options: {
                param: 123
              }
            }
          ]
        }
      ]
    },
    plugins: [
      // 利用 webpack 3 的新特性 提升作用域 减少代码体积 提升代码执行性能
      new webpack.optimize.ModuleConcatenationPlugin()
    ]
  };

  return config;
};
