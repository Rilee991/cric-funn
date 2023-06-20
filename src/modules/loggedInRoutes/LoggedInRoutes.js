import React, { useContext, useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { BubbleChartOutlined, PublicOutlined, StarBorderOutlined, TimelineOutlined, VpnKey, WhatshotOutlined, 
    ControlCamera
} from '@material-ui/icons';
import { find } from 'lodash';

import NotFoundError from '../../components/common/NotFoundError';
import { Header, SideNavbar, Notifications, Home, MyBets, MyStats, GlobalStats, PointsTable, ControlPanel } from './index';
import { ContextProvider } from '../../global/Context';

const LoggedInRoutes = () => {
    const contextConsumer = useContext(ContextProvider);
    const { mobileView, logout, notifications = [], clearNotifications, loggedInUserDetails: { isAdmin } } = contextConsumer;
    const [isNavOpen, setIsNavOpen] = useState(false);
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
        name: "My Stats",
        to: "/my-stats",
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
        name: "Control Panel",
        to: "/control-panel",
        icon: <ControlCamera />
    }, {
        id: 7,
        name: "Logout",
        to: "/",
        onClick: () => logout(),
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
                <Header totalNotifs={notifications.length} clearNotifications={clearNotifications} setIsNavOpen={setIsNavOpen} setIsNotificationsOpen={setIsNotificationsOpen} />
            </div>
            <div className="tw-flex">
                <div>
                    <SideNavbar 
                        setIsNavOpen={setIsNavOpen}
                        isNavOpen={isNavOpen}
                        setIsNotificationsOpen={setIsNotificationsOpen}
                        isNotificationsOpen={isNotificationsOpen}
                        navItems={navItems}
                        navSelected={navSelected}
                        setNavSelected={setNavSelected}
                        mobileView={mobileView}
                    />
                    <Notifications
                        setIsNotificationsOpen={setIsNotificationsOpen}
                        isNotificationsOpen={isNotificationsOpen}
                        notifications={notifications}
                    />
                </div>
                <div className={`tw-pt-16 tw-py-6 md:tw-px-14 tw-w-full`}>
                    <Switch>
                        {/* {navItems.map(eachNav => (
                            <Route exact path={eachNav.to}>
                                {eachNav.component || <div>{eachNav.name}</div>}
                            </Route>
                        ))} */}
                        <Route exact path="/">
                            <Home />
                        </Route> 
                        <Route exact path="/my-bets">
                            <MyBets /> 
                        </Route>
                        <Route exact path="/my-stats">
                            <MyStats exact />
                        </Route>
                        <Route exact path="/global-stats">
                            <GlobalStats />
                        </Route>
                        <Route exact path="/points-table">
                            <PointsTable />
                        </Route>
                        {isAdmin && <Route exact path="/control-panel">
                            <ControlPanel exact />
                        </Route> }
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
