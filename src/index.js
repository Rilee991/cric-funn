import React from 'react';
import ReactDOM from 'react-dom';

import App from './App.js';
import "./assets/index.css";
import Context from './global/Context';

ReactDOM.render(
  <React.StrictMode>
    <Context>
      <App />
    </Context>
  </React.StrictMode>,
  document.getElementById('root')
);