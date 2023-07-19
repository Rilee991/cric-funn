import React from 'react';
import ReactDOM from 'react-dom';

import "./assets/index.css";
import Context from './global/Context';

import App from './App.js';

ReactDOM.render(
  <React.StrictMode>
    <Context>
      <App />
    </Context>
  </React.StrictMode>,
  document.getElementById('root')
);