import React, { Component } from 'react';

export default class Widget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { show, msg } = this.props;
    return (
      <div  className='no-data'>
        <img src='./././resources/images/no-result.png'/>
        <div>{msg}</div>
    </div>
    );
  }
}