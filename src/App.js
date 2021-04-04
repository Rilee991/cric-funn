import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import Context from './Global/Context';
import Auth from './components/Auth';
import Header from './components/Header';
import MyBets from './components/MyBets';
import PointsTable from './components/PointsTable';
import Admin from './components/Admin';

function App() {
  return (
    <Router>
      <Context>
        <Header/> 
        <Route exact path="/">
          <Auth/> 
        </Route> 
        <Route exact path="/bets">
          <MyBets/> 
        </Route>
        <Route exact path="/points-table">
          <PointsTable exact />
        </Route>
        <Route exact path="/admin">
          <Admin exact />
        </Route>
      </Context>
    </Router>
  );
}

export default App;
