
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
              loader: path.resolve(pwd, './loader/multiple-html-webpack-plugin.js'),
              options: {
                param: 123
              }
            }
          ]
        }
      ]
    }
  };

  return config;
};
