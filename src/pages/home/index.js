
import React from 'react';
import ReactDOM from 'react-dom';

import GoodsList from 'components/goods-list/';
import PureGoodsList from 'components/pure-component/';

import getNow, { getYear, getMinutes } from 'utils/date.js';

import './index.scss';

const { Fragment } = React;
let rootInstance;

class Demo extends React.Component {
  componentDidMount() {
    console.log(getNow());

    console.log(getYear());
    console.log(getMinutes())
  }
  render() {
    return (
      <div ref={(instance) => {console.log(instance)}}>
        <GoodsList ref={(instance) => {
          // stateless component ref 是不生效的
          console.log(instance);
        }}>
          <li className="list-item">第1个商品</li>
          <li className="list-item">第2个商品</li>
          <li className="list-item">第3个商品</li>
          <li className="list-item">第4个商品</li>
          <li className="list-item">第5个商品</li>
        </GoodsList>
        <PureGoodsList ref={(instance) => {
          console.log(instance);
        }} />
      </div>
    );
  }
}

/**
 * ReactDom.render 接收三个参数
 * @param {ReactElement}
 * @param {DOMNode}
 * @param {Function} 组件渲染完毕之后的回调方法
 */
const container = ReactDOM.render(<Demo ref={(ref) => {
  rootInstance = ref;
  console.log(rootInstance);
}}/>, document.getElementById('container'), () => {
  console.log('根组件完全渲染完毕');
});

console.log(container);

setTimeout(() => {
  // 两个值是完全相等的
  console.log(rootInstance === container);
}, 1000);
