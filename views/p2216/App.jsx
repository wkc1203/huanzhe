import 'babel-polyfill';
import './config/init/init';
import React from 'react';
import ReactDom from 'react-dom';
import Routers from 'config/router/Router';
import 'react-weui/lib/react-weui.min.css';

ReactDom.render(
  <Routers />,
  document.getElementById('app')
);
