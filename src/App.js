import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import Context from './Global/Context';
import Auth from './components/modules/Auth/Auth';
import Header from './components/modules/Header/Header';
import MyBets from './components/modules/MyBets/MyBets';
import PointsTable from './components/modules/PointsTable/PointsTable';
import Admin from './components/modules/Admin/Admin';

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
