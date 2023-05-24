import React from 'react';
import { Switch, Route } from 'react-router-dom';

import NotFoundError from '../../components/common/NotFoundError';
import LandingPage from './landingpage/LandingPage';

const LoggedOutRoutes = () => {
    return (
		<Switch>
			<Route exact path="/">
				<LandingPage />
			</Route>
			<Route>
				<NotFoundError />
			</Route>
		</Switch>
	);
}

export default LoggedOutRoutes;
