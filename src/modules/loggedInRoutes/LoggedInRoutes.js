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
import CountDown from 'count-down-react';

import NotFoundError from '../../components/common/NotFoundError';
import { Header, SideNavbar, Notifications, Home, MyBets, MyStats, GlobalStats, PointsTable, ControlPanel, Legends } from './index';
import { ContextProvider } from '../../global/Context';
import BirthdayModal from './BirthdayModal/BirthdayModal';
import useOnline from '../../hooks/useOnline';
import { updateAppData } from '../../apis/configurationsController';
import NoConnection from '../../components/common/NoConnection';
import cricFunnLogo from '../../res/images/logo.png';

const CoundownRenderer = ({ days, hours, minutes, seconds, completed, ...props }) => {
    return (
        <div className="container">
            <div className="tw-flex tw-place-content-center">
                <img src={cricFunnLogo} alt="Ipl t20 logo" className="tw-w-40 tw-border-r-4 tw-border-black-app tw-p-3" />
                <img src={"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/377bb3e8-ff8c-4984-8530-64b9afb9d321/dff9nq3-9bd05d41-c893-44ea-af84-f18493cbd3e4.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzM3N2JiM2U4LWZmOGMtNDk4NC04NTMwLTY0YjlhZmI5ZDMyMVwvZGZmOW5xMy05YmQwNWQ0MS1jODkzLTQ0ZWEtYWY4NC1mMTg0OTNjYmQzZTQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BUTDCeXxdiYd5Tf0EQYbaGvq6fQ1q9LMW5bMZztAAVo"} alt="Ipl t20 logo" className="tw-w-40" />
            </div>
            <ul>
                <li>
                    <span id="days">{days}</span>days
                </li>
                <li>
                    <span id="hours">{hours}</span>Hours
                </li>
                <li>
                    <span id="minutes">{minutes}</span>Minutes
                </li>
                <li>
                    <span id="seconds">{seconds}</span>Seconds
                </li>
            </ul>
            <div className="tw-flex tw-flex-col tw-items-center">
                <span className="tw-text-xl ">To go for</span>
                <br/>
                <img src={"https://www.wwe.com/f/styles/og_image/public/all/2023/10/Road_to_WrestleMania_Logo--f3cb0721e33bff4bc015a9a278f87494.png"} alt="Ipl t20 logo" className="tw-w-full sm:tw-w-2/3" />
            </div>
        </div>
    );
};

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
    const date = Date.now() + (new Date("03-22-2024") - new Date());
    const isDatePassed = (date - new Date()) < 0;

    return (
        <div className="tw-bg-white-app">
            {(isBday || !isDatePassed) && toggleConfetti && <Confetti width={width} height={height + scrollY} className="tw-z-[10000]" numberOfPieces={width <= 600 ? 200: 500} />}
            {isBday && <BirthdayModal claimReward={claimReward} isRewardClaimed={isRewardClaimed} width={width} open={openBdayModal} closeDialog={() => setOpenBdayModal(false)} />}
            <div className="tw-h-16">
                <Header isOnline={isOnline} totalNotifs={notifications.length} clearNotifications={clearNotifications} setToggleConfetti={setToggleConfetti}
                    setIsNavOpen={setIsNavOpen} setIsNotificationsOpen={setIsNotificationsOpen} isBday={(isBday || !isDatePassed)} toggleConfetti={toggleConfetti}
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
                    {!isDatePassed ? 
                        <CountDown date={date} renderer={CoundownRenderer} /> :
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
                    }
                </div>
            :  <NoConnection />}
        </div> 
	);
}

export default LoggedInRoutes;
