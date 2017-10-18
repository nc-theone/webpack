
import React from 'react';

import ReactDOM from 'react-dom';

import getNow, { getYear } from 'utils/date';

import './index.scss';

class Demo extends React.Component {
  componentDidMount() {
    console.log(getNow());

    console.log(getYear());
  }
  render() {
    return <h1>不是吧</h1>;
  }
}

ReactDOM.render(<Demo />, document.getElementById('container'));
