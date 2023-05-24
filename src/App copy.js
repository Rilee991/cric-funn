import React, { useContext, useState } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { isEmpty } from 'lodash';
import LoadingScreen from 'react-loading-screen';

import './App.css';
import { ContextProvider } from './Global/Context';
import Auth from './components/modules/Auth/Auth';
import Header from './components/modules/Header/Header';
import MyBets from './components/modules/MyBets/MyBets';
import PointsTableNew from './components/modules/PointsTable/PointsTableNew';
import Admin from './components/modules/Admin/Admin';
import Graph from './components/modules/Points/Graph';
import GlobalStats from './components/modules/GlobalStats/GlobalStats';
import SideNavbar from './components/modules/Header/SideNavbar';
import LoggedInRoutes from './modules/loggedInRoutes/LoggedInRoutes';
import LoggedOutRoutes from './modules/loggedOutRoutes/LoggedOutRoutes';
import cricFunnLogo from './images/logo.png';

const App = () => {
	const contextConsumer = useContext(ContextProvider);
	const { loading, loggedInUserDetails } = contextConsumer;

	return (
		<Router>
			<LoadingScreen
				loading={loading}
				bgColor="rgb(17,24,39)"
				spinnerColor="#fff"
				textColor="#fff"
				text="Loading your details. Please wait..."
				logoSrc={cricFunnLogo}
			>
				{!isEmpty(loggedInUserDetails) ?
					<LoggedInRoutes /> : <LoggedOutRoutes /> }
			</LoadingScreen>
		</Router>
	);
}

export default App;
