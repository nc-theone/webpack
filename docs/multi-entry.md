
> 这里简单介绍一下不同的入口文件对打包结果带来的影响

> 主要讨论入口module的不同，即__webpack_require__(0)的返回结果

- 所有的文件生成均是基于下述loader

```javascript
{
  test: /.js$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets: ['stage-0', ['env']],
        plugins: [
          'add-module-exports'
        ]
      }
    }
  ]
}
```

- 如果使用`add-module-exports`插件，会在每一个单独的module的最后一行，添加如下代码

```javascript
// 之所以使用该插件在module的最后一行添加下面的代码 是为了 兼容node模块的commonjs规范
module.exports = exports['default'];
```

- 入口文件`home/index.js`

```jsx
export default class Page1{
  get name() {
    return 'nc-theone';
  }
}
```

- 入口文件`list/index.js`

```jsx
export default class Page2{
  name() {
    return 'ningchen'
  }
}
```

### entry为字符串

```
entry: './pages/home/index.js'
```

- 打包出来的入口模块的代码如下

```javascript
/* 0 */
/***/ (function(module, exports, __webpack_require__) {
  // 使用add-module-exports时 module.exports = function Page2(){};  // 是一个函数
  // 不使用add-module-exports时 module.exports = {  // 是一个对象
  //   default: function Page2(){},
  //   __esModule: {
  //     value: true
  //   }
  // };
  module.exports = __webpack_require__(1);
/***/ })
```


### entry为数组

```
entry: ['./pages/home/index.js', './pages/list/index.js']
```

- 打包出来的入口模块的代码如下

```javascript
/* 0 */
/***/ (function(module, exports, __webpack_require__) {
__webpack_require__(1);
module.exports = __webpack_require__(2);
/***/ })
```
- 仅仅抛出最后一个模块的返回结果，如果最后一个模块的执行上下文依赖前面几个模块们可以使用这种方式进行打包，比如一个库的许多模块单独挂载到window下，那么就可以使用这种方式来做，在最后一个文件抛出一个统一入口就行

### entry为对象

```javascript
entry: {
  bundle1: './pages/home/index.js',
  bundle2: './pages/list/index.js'
},
output: {
  path: '[name].js'
}
```

- 上述配置会生成独立的入口文件，每一个文件的入口module指向`export default`抛出的对象
- 单独的打包结果请参考第一种入口形式

### 不推荐

- 我不推荐同时使用下述配置(仅仅罗列差异部分)

```javascript
module: {
  rules: [
    {
      test: /(\.jsx)|(\.js)$/,
      loader: 'babel-loader',
      presets: ['react', 'stage-0', ['env', {modules: false}]],
      plugins: [
        'add-module-exports'
      ]
    }
  ]
}
```

- `modules: false 不要与 add-module-exports 同时使用`，如果同时使用，会在打包出来的代码中看到下述奇怪的代码

![](https://img.alicdn.com/tfs/TB1M0p0lb_I8KJjy1XaXXbsxpXa-2134-1294.png)

- 1：在使用了`tree-shaking`之后，打包出来的模块的第二个入参，已经由`exports -> __wbepack_exports__`
- 2：模块暴露的代码全都挂在`__webpack_exports__["default"]`上面
- 3：`add-module-exports`插件插入的代码还是向`exports`上面挂载方法，但是上下文已经找不到`exports`对象了，因此执行会报错

### Q&A

- 有任何问题可以提issue
