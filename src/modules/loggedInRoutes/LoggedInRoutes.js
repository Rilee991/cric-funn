import React, { useContext, useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { BubbleChartOutlined, PublicOutlined, StarBorderOutlined, TimelineOutlined, VpnKey, WhatshotOutlined, 
    ControlCamera, LocalPlay
} from '@material-ui/icons';
import { find } from 'lodash';
import moment from 'moment';

import NotFoundError from '../../components/common/NotFoundError';
import { Header, SideNavbar, Notifications, Home, MyBets, MyStats, GlobalStats, PointsTable, ControlPanel, Legends } from './index';
import { ContextProvider } from '../../global/Context';

const LoggedInRoutes = () => {
    const contextConsumer = useContext(ContextProvider);
    const { mobileView, logout, notifications = [], clearNotifications, loggedInUserDetails: { isAdmin } } = contextConsumer;
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [navSelected, setNavSelected] = useState(1);


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

    const isGlobalStatsDisabled = !isAdmin && moment().isBefore(moment("01-05-2024"));

    const navItems = [{
        name: "Home",
        to: "/",
        icon: <LocalPlay />,
        component: <Home handleSelectedNav={handleSelectedNav} />
    }, {
        name: "My Bets",
        to: "/my-bets",
        icon: <TimelineOutlined />,
        component: <MyBets />
    }, {
        name: "My Stats",
        to: "/my-stats",
        icon: <BubbleChartOutlined />,
        component: <MyStats />
    }, {
        name: "Global Stats",
        to: "/global-stats",
        icon: <PublicOutlined />,
        subText: "Enabling on 1st May",
        disabled: isGlobalStatsDisabled,
        component: <GlobalStats />
    }, {
        name: "Points Table",
        to: "/points-table",
        icon: <StarBorderOutlined />,
        component: <PointsTable />
    }, {
        name: "Hall of Fame",
        to: "/legends",
        icon: <WhatshotOutlined />,
        component: <Legends />
    }, {
        name: "Control Panel",
        to: "/control-panel",
        icon: <ControlCamera />,
        component: <ControlPanel />
    }, {
        name: "Logout",
        to: "/",
        onClick: () => logout(),
        icon: <VpnKey />
    }].map((item, idx) => ({ ...item, id: idx+1 }));

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
                        <Route exact path="/">
                            <Home handleSelectedNav={handleSelectedNav} />
                        </Route> 
                        <Route exact path="/my-bets">
                            <MyBets /> 
                        </Route>
                        <Route exact path="/my-stats">
                            <MyStats exact />
                        </Route>
                        {!isGlobalStatsDisabled && <Route exact path="/global-stats">
                            <GlobalStats />
                        </Route> }
                        <Route exact path="/points-table">
                            <PointsTable />
                        </Route>
                        <Route exact path="/legends">
                            <Legends />
                        </Route>
                        {isAdmin && <Route exact path="/control-panel">
                            <ControlPanel />
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
