// 兼容
import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { isFBMP, CONFIG } from "@/utils";
import reportWebVitals from './reportWebVitals';
import Vconsole from 'vconsole';
import './index.css';
import App from './App';

if (CONFIG.env === 'development') {
  new Vconsole();
}

const init = () => {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter basename='/mp/138519745866498048/273383374205222914/v1/config/'>
        <Switch>
          <Route exact path='/' component={App} />
        </Switch>
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

const fb = window.fb

console.log('-----是否为fb-----', isFBMP())

if (isFBMP() && fb) {
  fb.init({
    success: () => {
      init();
    }
  });
}else{
  init();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
