
/**
 * 异步组件加载
 */
import React from 'react';
export default function AsyncComponent(wrapComponent) {
  class WrappedComponent extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        component: null
      };
    }
    componentDidMount() {
      this.setState({
        component: wrapComponent()
      });
    }
    render() {
      const { component: Component } = this.state;
      return Component ? <Component {...this.props} /> : false;
    }
  }
  return WrappedComponent;
}
