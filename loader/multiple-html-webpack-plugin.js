

function process(source, map) {
  const result = `  function defaultFn() {
    ${source}
  };
  module.exports = defaultFn;
  `;
  return result;
}

module.exports = function(source, map) {
  const {
    query   // 获取 loader 传入的 options 配置项
  } = this; // 此为 webpack 对象 可以从这个对象上面获取各种参数
  const result = process(source, map);
  // 返回结果 需要是Buffer 或者 String
  return result;
};
