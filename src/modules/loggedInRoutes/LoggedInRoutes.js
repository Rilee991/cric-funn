import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Header/Header';
import Notifications from './Notifications/Notifications';
import SideNavbar from './SideNavbar.js/SideNavbar';

const LoggedInRoutes = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [navSelected, setNavSelected] = useState(1);

    console.log(window.location.pathname);

    return (
        <Switch>
            <div className="tw-flex tw-flex-col">
                <div>
                    <Header setIsDrawerOpen={setIsDrawerOpen} setIsNotificationsOpen={setIsNotificationsOpen} />
                </div>
                <div className="tw-flex">
                    <div>
                        <SideNavbar 
                            setIsDrawerOpen={setIsDrawerOpen}
                            isDrawerOpen={isDrawerOpen}
                            setIsNotificationsOpen={setIsNotificationsOpen}
                            isNotificationsOpen={isNotificationsOpen}
                        />
                        <Notifications
                            setIsNotificationsOpen={setIsNotificationsOpen}
                            isNotificationsOpen={isNotificationsOpen}
                        />
                    </div>
                    {/* <div className={`tw-pt-16 tw-py-6 md:tw-px-14 tw-w-full`}>
                        <Route exact path="/">
                            <Auth/> 
                        </Route> 
                        <Route exact path="/bets">
                            <MyBets/> 
                        </Route>
                        <Route exact path="/points">
                            <Graph exact />
                        </Route>
                        <Route exact path="/global-stats">
                            <GlobalStats exact />
                        </Route>
                        <Route exact path="/points-table">
                            <PointsTableNew exact />
                        </Route>
                        <Route exact path="/admin">
                            <Admin exact />
                        </Route>
                        <Route>
                            <NotFoundError />
                        </Route>
                    </div> */}
                </div>
            </div> 
        </Switch>
	);
}

export default LoggedInRoutes;
