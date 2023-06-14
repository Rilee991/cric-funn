import React from 'react';
import { Switch, Route } from 'react-router-dom';

import NotFoundError from '../../components/common/NotFoundError';
import LandingPage from './landingpage/LandingPage';
import ResetPassword from './landingpage/ResetPassword';

const LoggedOutRoutes = () => {
	return (
		<Switch>
			<Route exact path="/">
				<LandingPage />
			</Route>
			<Route exact path="/reset-password">
				<ResetPassword />
			</Route>
			<Route>
				<NotFoundError />
			</Route>
		</Switch>
	);
}

export default LoggedOutRoutes;
