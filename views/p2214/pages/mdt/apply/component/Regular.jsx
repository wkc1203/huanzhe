
import React, { Component } from 'react';
import { Link } from 'react-router';
import Connect from '../../../../components/connect/Connect';

function RegularChildComponent({seconds}){
  console.log('I am rendering');
  return (
      <div>I am update every {seconds} seconds</div>
  )
};
export default React.memo(RegularChildComponent)

