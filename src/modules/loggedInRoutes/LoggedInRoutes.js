import React, { useContext, useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { find, get } from 'lodash';
import moment from 'moment';
import Confetti from 'react-confetti';
import { IoMdLogOut } from 'react-icons/io';
import { SiTencentqq } from 'react-icons/si';
import { GiStarSwirl } from 'react-icons/gi';
import { RiDashboard2Line } from 'react-icons/ri';
import { FaHistory, FaMedal, FaSolarPanel } from 'react-icons/fa';
import { MdOutlineQueryStats } from 'react-icons/md';
import md5 from 'md5';

import NotFoundError from '../../components/common/NotFoundError';
import { Header, SideNavbar, Notifications, Home, MyBets, MyStats, GlobalStats, PointsTable, ControlPanel, Legends } from './index';
import { ContextProvider } from '../../global/Context';
import BirthdayModal from './BirthdayModal/BirthdayModal';
import useOnline from '../../hooks/useOnline';
import { updateAppData } from '../../apis/configurationsController';

const LoggedInRoutes = () => {
    const contextConsumer = useContext(ContextProvider);
    const { mobileView, logout, notifications = [], clearNotifications, width, height, scrollY, claimReward,
        loggedInUserDetails: { isAdmin, username, points, dob = "18-07-3212", isRewardClaimed = true },
        configurations = {}, setConfigurations
    } = contextConsumer;
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [navSelected, setNavSelected] = useState(1);
    const [toggleConfetti, setToggleConfetti] = useState(true);
    const [isBday, setIsBday] = useState(dob && dob.slice(0,5) == moment().format("DD-MM"));
    const [openBdayModal, setOpenBdayModal] = useState(isBday);

    useEffect(() => {
        handleSelectedNav();
        const startTime = Date.now();
        const docId = moment().format("YYYY-MM-DD");
        const appDataObj = configurations["appData"];
        const deviceInfo = getDeviceInfo();
        const prevTimeSpent = get(appDataObj, `${username}.timeSpent`, 0);

        const timer = setInterval(() => {
            const timeSpent = parseInt(((Date.now()-startTime)/1000).toFixed(0));

            if(appDataObj?.[username]) {
                const isUniqueDevice = appDataObj[username]["devices"].filter(devInfo => devInfo.deviceId == deviceInfo.deviceId).length == 0;
                if(isUniqueDevice) {
                    appDataObj[username]["devices"].push(deviceInfo);
                }

                appDataObj[username] = {
                    timeSpent: prevTimeSpent + timeSpent,
                    devices: appDataObj[username]["devices"]
                };
            } else {
                appDataObj[username] = {
                    timeSpent: prevTimeSpent,
                    devices: [{ ...deviceInfo }]
                }
            }

            if(timeSpent%3 == 0) {
                Object.keys(appDataObj[username]).forEach(key => {
                    localStorage.setItem(key, JSON.stringify(appDataObj[username][key]));
                });
            }

            if(timeSpent%9 == 0) {
                appDataObj[username] = {
                    timeSpent: parseInt(localStorage.getItem("timeSpent")),
                    devices: JSON.parse(localStorage.getItem("devices"))
                };
                updateAppData(docId, username, appDataObj, setConfigurations)
                .catch(e => console.log(e));
            }
        }, 3000);

        return () => {
            clearInterval(timer);
        }
    },[]);

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

    const handleSelectedNav = () => {
        const location = window.location.pathname.split("/")[1];

        if(location == "") {
            setNavSelected(1);
        } else {
            const currentNavItem = find(navItems, { to: `/${location}` });
            setNavSelected(currentNavItem?.id || 0);
        }
    }

    const isGlobalStatsDisabled = moment().isBefore(moment("05-01-2024"));

    const navItems = [{
        name: <div className="tw-flex tw-items-center">
            <div className="tw-flex">
                <span className="tw-text-xl">{`@`}</span><span>{`${username}`}</span>
            </div>
        </div>,
        to: "/",
        subText: `${points} Points`,
        icon: <SiTencentqq className="tw-h-6 tw-w-6" />,
        component: <Home handleSelectedNav={handleSelectedNav} />
    }, {
        name: "My Bets",
        to: "/my-bets",
        icon: <FaHistory className="tw-h-6 tw-w-6" />,
        component: <MyBets />
    }, {
        name: "My Stats",
        to: "/my-stats",
        icon: <RiDashboard2Line className="tw-h-6 tw-w-6" />,
        component: <MyStats />
    }, {
        name: "Global Stats",
        to: "/global-stats",
        icon: <MdOutlineQueryStats className="tw-h-6 tw-w-6" />,
        subText: isGlobalStatsDisabled ? "Enabling on 1st May" : "",
        disabled: isGlobalStatsDisabled,
        component: <GlobalStats />
    }, {
        name: "Points Table",
        to: "/points-table",
        icon: <FaMedal className="tw-h-6 tw-w-6" />,
        component: <PointsTable />
    }, {
        name: "Hall of Fame",
        to: "/hall-of-fame",
        icon: <GiStarSwirl className="tw-h-6 tw-w-6" />,
        component: <Legends />
    }, {
        name: "Control Panel",
        to: "/control-panel",
        icon: <FaSolarPanel className="tw-h-6 tw-w-6" />,
        component: <ControlPanel />
    }, {
        name: "Logout",
        to: "/",
        onClick: () => logout(),
        icon: <IoMdLogOut className="tw-h-7 tw-w-7" />
    }].map((item, idx) => ({ ...item, id: idx+1 }));

	const isOnline = useOnline();

    return (
        <div className="tw-bg-white-app">
            {isBday && toggleConfetti && <Confetti width={width} height={height + scrollY} className="tw-z-[10000]" numberOfPieces={500} />}
            {isBday && <BirthdayModal claimReward={claimReward} isRewardClaimed={isRewardClaimed} width={width} open={openBdayModal} closeDialog={() => setOpenBdayModal(false)} />}
            <div className="tw-h-16">
                <Header isOnline={isOnline} totalNotifs={notifications.length} clearNotifications={clearNotifications} setToggleConfetti={setToggleConfetti}
                    setIsNavOpen={setIsNavOpen} setIsNotificationsOpen={setIsNotificationsOpen} isBday={isBday} toggleConfetti={toggleConfetti}
                />
            </div>
            {isOnline ?
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
                            configurations={configurations}
                        />
                        <Notifications
                            setIsNotificationsOpen={setIsNotificationsOpen}
                            isNotificationsOpen={isNotificationsOpen}
                            notifications={notifications}
                        />
                    </div>
                    <div className={`tw-pb-6 md:tw-px-14 tw-w-full tw-min-h-screen xl:tw-w-[60%] lg:tw-w-[80%] `}>
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
                            <Route exact path="/hall-of-fame">
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
            :  <div className="tw-grid tw-place-items-center">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/no-internet-connection-8316263-6632283.png?f=webp" alt="No connection" />
                <div className="tw-font-bold tw-text-red-600">It seems you're not connected to the internet!</div>
                <div>Please fix your connection.</div>
                <div className="tw-text-green-800 tw-font-semibold">Content will be updated automatically.</div>
            </div>}
        </div> 
	);
}

export default LoggedInRoutes;
