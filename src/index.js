import React from 'react';
import ReactDOM from 'react-dom';

import App from './App copy.js';
import "./assets/index.css";
import Context from './Global/Context';

ReactDOM.render(
  <React.StrictMode>
    <Context>
      <App />
    </Context>
  </React.StrictMode>,
  document.getElementById('root')
);