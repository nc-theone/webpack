
import React from 'react';
import ReactDOM from 'react-dom';

import GoodsList from 'components/goods-list/';

import getNow, { getYear, getMinutes } from 'utils/date.js';

import './index.scss';

class Demo extends React.Component {
  componentDidMount() {
    console.log(getNow());

    console.log(getYear());
    console.log(getMinutes())
  }
  render() {
    return (
      <div className="page-container">
        <GoodsList />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('container'));
