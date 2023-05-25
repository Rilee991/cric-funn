import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFoundError from '../../components/common/NotFoundError';
import { BubbleChartOutlined, PublicOutlined, StarBorderOutlined, StarsOutlined, TimelineOutlined, VpnKey, Whatshot, WhatshotOutlined } from '@material-ui/icons';


import Header from './Header/Header';
import Home from './Home/Home';
import MyBets from './MyBets/MyBets';
import Notifications from './Notifications/Notifications';
import SideNavbar from './SideNavbar.js/SideNavbar';
import { find } from 'lodash';

const LoggedInRoutes = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [navSelected, setNavSelected] = useState(1);

    const navItems = [{
        id: 1,
        name: "Home",
        to: "/",
        icon: <WhatshotOutlined />
    }, {
        id: 2,
        name: "My Bets",
        to: "/my-bets",
        icon: <TimelineOutlined />
    }, {
        id: 3,
        name: "Graphs",
        to: "/graphs",
        icon: <BubbleChartOutlined />
    }, {
        id: 4,
        name: "Global Stats",
        to: "/global-stats",
        icon: <PublicOutlined />
    }, {
        id: 5,
        name: "Points Table",
        to: "/points-table",
        icon: <StarBorderOutlined />
    }, {
        id: 6,
        name: "Logout",
        to: "/",
        onClick: () => {console.log("3")},
        icon: <VpnKey />
    }];

    useEffect(() => {
        handleSelectedNav();
    },[]);

    const handleSelectedNav = () => {
        const location = window.location.pathname.split("/")[1];

        if(location == "") {
            setNavSelected(1);
        } else {
            const currentNavItem = find(navItems, { to: `/${location}` });
            setNavSelected(currentNavItem?.id || 0);
        }
    }

    return (
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
                        navItems={navItems}
                        navSelected={navSelected}
                        setNavSelected={setNavSelected}
                    />
                    <Notifications
                        setIsNotificationsOpen={setIsNotificationsOpen}
                        isNotificationsOpen={isNotificationsOpen}
                    />
                </div>
                <div className={`tw-pt-16 tw-py-6 md:tw-px-14 tw-w-full`}>
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route> 
                        <Route exact path="/my-bets">
                            <MyBets /> 
                        </Route>
                        {/* <Route exact path="/points">
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
                        </Route> */}
                        <Route>
                            <NotFoundError />
                        </Route>
                    </Switch>
                </div>
            </div>
        </div> 
	);
}

export default LoggedInRoutes;
