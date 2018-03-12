
function MultipleHtmlWebpackPlugin() {

};

MultipleHtmlWebpackPlugin.prototype.apply = function(compiler) {
  compiler.plugin('compile', function(params){
    // 在这里进行各种事件回调的绑定
    console.log(params);
  });
  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('optimize', function() {
      console.log('优化中..')
    });
  });
};

module.exports = MultipleHtmlWebpackPlugin;
