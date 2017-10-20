
## 简介

> Tree-shaking 找到需要的代码，灌入最终的结果；传统 DCE 找到执行不到的代码，从 AST 里清除。

- [webpack2引入tree-skaking技术](https://www.zhihu.com/question/41922432)

- 个人理解：业务代码的引用，一般只是引用某一个util里面的某一些方法，而大多数util包含很多方法，大多数是用不到的；如果遍历如找哪些代码不会被用到，则成本相对较高一些，因此tree-shaking的方式比较适合utils太大，但是引用比较分散的业务使用。

## 要求

- 由于webpack2的tree-shaking基于es6-module进行分析，因此要求util在抛出function时有一定的格式

- `date.js`

```javascript
// getYear
// 单独的function抛出方式 如果不被用到 那么使用了tree-shaking以及uglify之后 该方法会被删除
export function getYear() {
  return 'year';
}
// getMonth
export function getMonth() {
  return 'month';
}

function getMinutes() {
  return 'minutes';
}

function getSeconds() {
  return 'seconds';
}

// 如果采用这种方式，即使在业务代码中没有用到 getSeconds 那么该方法也会被打包
// 正确的方式 可以修改为 export { getMinutes, getSeconds }
export default { getMinutes, getSeconds }

```

## 建议

- 使用webpack2及以上版本，低版本中是没有tree-shaking的
- `babel-preset-es2015`中，需要添加下述配置
  ```
  { module: false }
  ```

- utils中的方法，建议直接使用`export function () => {}`的方式
- 如果一定要抛出default字段，请不要抛出一个Object，比如下面的使用方式是不建议的
  ```
  export default { // 请删除这里的 default 字段
    func1: func1,
    func2: func2
  };
  ```
