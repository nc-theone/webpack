import React from 'react';
import PropTypes from 'prop-types'

import './index.scss';

const { Fragment } = React;

export default (props) => {
  const { children } = props;
  // const newChilds = React.Children.map(children, function(child) {
  //   console.log(child, this);
  // });
  // React.Children.only(children);
  return (
    <Fragment key={new Date().getTime()}>
      <div className="title">这里是商品标题</div>
      {children}
    </Fragment>
  );
};
