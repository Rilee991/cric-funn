import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import LoadingScreen from 'react-loading-screen';

import cricFunnLogo from './res/images/logo.png';

import './App.css';
import { ContextProvider } from './global/Context';

import LoggedInRoutes from './modules/loggedInRoutes/LoggedInRoutes';
import LoggedOutRoutes from './modules/loggedOutRoutes/LoggedOutRoutes';
import { updateAppData } from './apis/configurationsController';
import moment from 'moment';
import md5 from 'md5';

const App = () => {
	const contextConsumer = useContext(ContextProvider);
	const { loading, loggedInUserDetails, configurations, setConfigurations } = contextConsumer;
	const [timeSpent, setTimeSpent] = useState(0);
	const [deviceInfo, setDeviceInfo] = useState('');
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));

	useEffect(() => {
		const startTime = Date.now();

		const timeInterval = setInterval(async () => {
			const username = loggedInUserDetails?.username;
			if(!username)	return;

			const now = moment().format("YYYY-MM-DD");
			const currentTime = Date.now();
			const secondsSpent = Math.floor((currentTime-startTime)/1000);
			setTimeSpent(secondsSpent);

			if(date != now || secondsSpent%20 == 0) {
				setDate(now);
				const appDataObj = configurations["appData"];
				const deviceInfo = getDeviceInfo();
				const prevTimeSpent = get(appDataObj, `${username}.timeSpent`, 0);

				if(appDataObj[username]) {
					const isUniqueDevice = appDataObj[username]["devices"].filter(devInfo => devInfo.deviceId == deviceInfo.deviceId).length == 0;
					if(isUniqueDevice) {
						appDataObj[username]["devices"].push(deviceInfo);
					}

					appDataObj[username] = {
						timeSpent: prevTimeSpent + secondsSpent,
						devices: appDataObj[username]["devices"]
					};
				} else {
					appDataObj[username] = {
						username,
						timeSpent: prevTimeSpent + secondsSpent,
						devices: [{ ...deviceInfo }]
					}
				}

				await updateAppData(now, loggedInUserDetails.username, appDataObj, configurations, setConfigurations);
			}
		},1000);
		
		return () => {
			clearInterval(timeInterval);
		}
	}, [loggedInUserDetails.username]);

	const generateDeviceId = () => {
		const fingerprintAttributes = {
			userAgent: navigator.userAgent,
			screenResolution: `${window.screen.width}x${window.screen.height}`,
			platform: navigator.maxTouchPoints,
			hardwareConcurrency: navigator.hardwareConcurrency
		};

		const attrString = Object.values(fingerprintAttributes).join(",");
		const hash = md5(attrString);

		return hash;
	}

	const getDeviceInfo = () => {
		const keys = ["userAgent", "platform", "maxTouchPoints", "language", "screenResolution", "hardwareConcurrency", "deviceMemory", "appVersion"];
		const deviceInfo = { deviceId: generateDeviceId() };

		for(const key of keys) {
			if(key === "geolocation") {
				navigator.geolocation.getCurrentPosition((pos) => {
					deviceInfo[key] = { latitude: pos.coords.latitude, longitude: pos.coords.longitude,
						altitude: pos.coords.altitude, timestamp: pos.timestamp, speed: pos.coords.speed,
						accuracy: pos.coords.altitude
					};
				}, (error) => {
					deviceInfo[key] = error.message;
				}, { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 });
			} else if(key === "screenResolution") {
				deviceInfo[key] = `${window.screen.width}x${window.screen.height}`;
			} else {
				deviceInfo[key] = navigator[key];
			}
		}

		return deviceInfo;
	}

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
