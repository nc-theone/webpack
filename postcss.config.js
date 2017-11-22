

// var precss = require('precss');
// var autoprefixer = require('autoprefixer');

// https://github.com/postcss/postcss-loader#plugins
// https://github.com/michael-ciniawsky/postcss-load-config
// 第一种方式
module.exports = {
  // 配合webpack使用 需要有一个ident字段
  // https://github.com/postcss/postcss-loader#plugins
  // 经验证 ident 字段 暂时无用
  ident: 'postcss',
  plugins: {
    precss: {},
    autoprefixer: {}
  }
};

// 第二种方式
// module.exports = ({ file, options, env }) => {
//   return {
//     plugins: {
//       precss: {},
//       autoprefixer: {}
//     }
//   };
// };
