
import React from 'react';
import ReactDOM from 'react-dom';

// import GoodsList from 'components/goods-list/';
// import PureGoodsList from 'components/pure-component/';
import AsyncComponent from 'components/async-component/';

import getNow, { getYear, getMinutes } from 'utils/date.js';

import './index.scss';

const { Fragment } = React;
let rootInstance;

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listSwitch: false,
    };

    this.goodsList = AsyncComponent(() => {
      return import('components/goods-list/');
    });
    this.pureGoodsList = AsyncComponent(() => {
      return import('components/pure-component/');
    });
  }
  componentDidMount() {
    console.log(getNow());

    console.log(getYear());
    console.log(getMinutes())
  }
  render() {
    const { listSwitch } = this.state;
    return (
      <div ref={(instance) => {console.log(instance)}}>
        { listSwitch ? this.goodsList : this.pureGoodsList }
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
