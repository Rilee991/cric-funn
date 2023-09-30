import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { isEmpty } from 'lodash';
import LoadingScreen from 'react-loading-screen';

import cricFunnLogo from './res/images/logo.png';

import './App.css';
import { ContextProvider } from './global/Context';

import LoggedInRoutes from './modules/loggedInRoutes/LoggedInRoutes';
import LoggedOutRoutes from './modules/loggedOutRoutes/LoggedOutRoutes';
import { SESSION_STORAGE } from './global/enums';

const App = () => {
	const [timeSpent, setTimeSpent] = useState(0);
	const [deviceInfo, setDeviceInfo] = useState('');
	const contextConsumer = useContext(ContextProvider);
	const { loading, loggedInUserDetails } = contextConsumer;

	// useEffect(() => {
	// 	const storedStartTime = sessionStorage.getItem(SESSION_STORAGE.START_TIME);
	// 	const storedDeviceInfo = sessionStorage.getItem(SESSION_STORAGE.DEVICE_INFO);

	// 	const startTime = storedStartTime ? parseInt(storedStartTime, 10) : Date.now();

	// 	if(!storedDeviceInfo) {
	// 		const userDeviceInfo = navigator.userAgent;
	// 		sessionStorage.setItem(SESSION_STORAGE.DEVICE_INFO, userDeviceInfo);
	// 		setDeviceInfo(userDeviceInfo);
	// 	} else {
	// 		setDeviceInfo(storedDeviceInfo);
	// 	}

	// 	const timeInterval = setInterval(() => {
	// 		const currentTime = Date.now();
	// 		const secondsSpent = Math.floor((currentTime-startTime)/1000);
	// 		setTimeSpent(secondsSpent);

	// 		sessionStorage.setItem(SESSION_STORAGE.START_TIME, secondsSpent.toString());

	// 		if(secondsSpent > 15) {
	// 			// need to save to db
	// 			console.log(`Saved to db: ${secondsSpent}, ${deviceInfo}`);
	// 		}
	// 	},1000);
		
	// 	return () => {
	// 		clearInterval(timeInterval);
	// 	}
	// }, []);

	// console.log(timeSpent);

	return (
		<Router>
			<LoadingScreen
				loading={loading}
				bgColor="black"
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
