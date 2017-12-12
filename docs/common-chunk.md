
> 这里记录一下代码体积减少的几种配置方法

### externals

```javascript
externals: {
  react: 'window.React',
  'react-dom': 'window.ReactDOM',
  ...
}
```

- 使用上述配置的话，webpack在打包的时候，会直接跳过对应模块的打包过程
- 这种配置方式一般用在下述几种情况
  - 依赖包无需编译，变动频率较小，比如react全家桶
  - 希望通过版本控制依赖包，比如发布到cdn的某一个业务组件或者库

### commonsChunk

```javascript
context: __dirname,
entry: {
  vendor: ['request', 'lodash', 'moment']
},
plugin: [
  new webpack.optimize.CommonsChunkPlugin({
    // 如果vendor直接命中了entry中的某个字段 则将entry中对应的文件提取出来
    // 如果没有命中，则会提取入口文件中共用的部分到指定的文件中去
    names: ['vendor'],
    minChunks: Infinity
  }),
]
```

- 使用上述配置，会将`request`、`lodash`以及`moment`三个包打包在一个`vendor.js`文件里面
- 这样做的好处是，当一个仓库包含多个页面时，将多个页面的相同部分抽离到一个js文件，减少了单个页面的代码体积，使得单个页面仅仅包含和页面逻辑相关的业务代码，比较干净
- 这种配置方式一般用在下面几种情况
  - 业务仓库，页面较多，某些模块被大部分页面所引用
  - **这些模块无需抽离为cdn资源，比如你的某个业务组件**

---

- 个人看法，和externals的主要区别在于，该方式依赖于webpack的整个打包流程，每次打包都会产生一份**新的**vendor.js，而后者会让webpack忽略其打包过程

### DllPlugin && DllReferencePlugin

> https://doc.webpack-china.org/plugins/dll-plugin/

- 生成`manifest.json`，依赖于DllPlugin，下述代码会在`__dirname`目录下生成`vendor-manifest.json`

```javascript
context: __dirname,
entry: {
  vendor: ['request', 'lodash', 'moment']
},
plugins: [
  new webpack.DllPlugin({
    context: __dirname,
    path: path.join(__dirname, '[name]-manifest.json'),
    name: '[name]_[hash]',
  }),
],

```

- 这种使用方式看文档就行了，说一下个人看法
  - `plugin`中定义的插件，[webpack在打包的时候会优先加载](http://taobaofed.org/blog/2016/09/09/webpack-flow/)，正式打包的时候会根据传入的`manifest.json`做模块映射，如果命中依赖的模块，那么就跳过该模块的打包过程
  - 这种方式的好处是，少了一步代码的提取操作

---
