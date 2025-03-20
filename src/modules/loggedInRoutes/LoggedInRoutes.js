import React, { useContext, useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { find, get } from 'lodash';
import moment from 'moment';
import Confetti from 'react-confetti';
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
import PageLoader from '../../components/common/PageLoader';
import WishModal from './WishModal/WishModal';
import Gallery from './Gallery/Gallery';
import Career from './Career/Career';

const CoundownRenderer = ({ days, hours, minutes, seconds, completed, ...props }) => {
    if(completed) {
        return <div className="tw-flex tw-justify-center tw-items-center xl:tw-w-[60%] lg:tw-w-[80%] tw-w-full">
            <PageLoader tip="Loading matches! Gear up..." />;
        </div>
    }

    return (
        <div className="container" style={{ 
                background: 'url(https://media3.giphy.com/media/5JUo71ZxKREZPbZLuZ/giphy.gif?cid=6c09b9526p59k7qu890lc7i65mg7pvgfsbc1apm8sioz5dsv&ep=v1_gifs_search&rid=giphy.gif&ct=g)',
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%", 
            }}
        >
            <div className="tw-flex tw-place-content-center tw-gap-3">
                <img src={cricFunnLogo} alt="Ipl t20 logo" className="tw-w-40 tw-border-r-4 tw-border-black-app tw-p-3" />
                <img src={"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1f2e3247-62d6-4d91-8b66-596cdde4d62b/decfzk2-bfe338d1-df73-4136-a8e3-39a4a6ed3b84.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzFmMmUzMjQ3LTYyZDYtNGQ5MS04YjY2LTU5NmNkZGU0ZDYyYlwvZGVjZnprMi1iZmUzMzhkMS1kZjczLTQxMzYtYThlMy0zOWE0YTZlZDNiODQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.hH9eh3faKC5msXFFF9c3p2vZpPqMG7RuspdmRR833pY"} alt="Ipl t20 logo" className="tw-w-40" />
            </div>
            <ul className="tw-text-white">
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
                <span className="tw-text-xl tw-text-white">TO GO</span>
            </div>
            <div>
                <div className="tw-flex tw-items-center tw-justify-center">
                    <div className="tw-flex tw-justify-center">
                        <img src={"https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/profilePictures%2FChamp_beria.png?alt=media&token=726d7092-67f4-43d5-9178-9e10c9609104"} alt="Ipl t20 logo" className="tw-h-80 tw-w-56" />
                    </div>
                    <div className="tw-flex tw-justify-center">
                        <img src={"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bd931675-f863-457b-8dbf-81fdc58137fc/df0jn63-7d278969-b93b-4ae3-92be-d88e3c5f96dd.png/v1/fill/w_894,h_894/wwe_road_to_wrestlemania_38_logo_png_by_suplexcityeditions_df0jn63-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2JkOTMxNjc1LWY4NjMtNDU3Yi04ZGJmLTgxZmRjNTgxMzdmY1wvZGYwam42My03ZDI3ODk2OS1iOTNiLTRhZTMtOTJiZS1kODhlM2M1Zjk2ZGQucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.WXa1IzRCfVLNGYFIoJRe0eigIYkBFJtR_rxSsI6_Zmc"} alt="Ipl t20 logo" className="tw-h-96 tw-w-96" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const LoggedInRoutes = () => {
    const contextConsumer = useContext(ContextProvider);
    const { mobileView, logout, notifications = [], clearNotifications, width, height, scrollY, claimReward,
        loggedInUserDetails: { isAdmin, username, points, dob = "18-07-3212", isRewardClaimed = true, showWishModal = false, isDummyUser = true },
        configurations = {}, setConfigurations, wishModalSeen
    } = contextConsumer;
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [navSelected, setNavSelected] = useState(1);
    const [toggleConfetti, setToggleConfetti] = useState(true);
    const [isBday, setIsBday] = useState(dob && dob.slice(0,5) == moment().format("DD-MM"));
    const [openBdayModal, setOpenBdayModal] = useState(isBday);
    const [openWishModal, setOpenWishModal] = useState(showWishModal);

    useEffect(() => {
        handleSelectedNav();
        const startTime = Date.now();
        const docId = moment().format("YYYY-MM-DD");
        const appDataObj = configurations["appData"] || {};
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
                    ...appDataObj[username],
                    timeSpent: prevTimeSpent + timeSpent,
                    devices: appDataObj[username]["devices"],
                };
            } else {
                appDataObj[username] = {
                    pageVisits: [],
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
                    devices: JSON.parse(localStorage.getItem("devices")),
                    pageVisits: JSON.parse(localStorage.getItem("pageVisits"))
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

    const isGlobalStatsDisabled = moment().isBefore(moment("05-03-2025").add(12, "hours"));

    const navItems = [{
        name: <div className="tw-flex tw-items-center">
            <div className="tw-flex">
                <span className="tw-text-xl">{`@`}</span><span>{`${username}`}</span>
            </div>
        </div>,
        to: "/",
        subText: `${points} Points`,
        icon: <i className="pi pi-user tw-text-2xl" />,
        component: <Home handleSelectedNav={handleSelectedNav} />
    }, {
        name: "My Bets",
        to: "/my-bets",
        icon: <i className="pi pi-history tw-text-2xl" />,
        component: <MyBets />
    }, {
        name: "My Stats",
        to: "/my-stats",
        icon: <i className="pi pi-gauge tw-text-2xl" />,
        component: <MyStats />
    }, {
        name: "Global Stats",
        to: "/global-stats",
        icon: <i className="pi pi-globe tw-text-2xl" />,
        subText: isGlobalStatsDisabled ? "Live on May 3, 12pm" : "",
        disabled: isGlobalStatsDisabled,
        component: <GlobalStats />
    }, {
        name: "Points Table",
        to: "/points-table",
        icon: <i className="pi pi-trophy tw-text-2xl" />,
        component: <PointsTable />
    }, {
        name: "Hall of Fame",
        to: "/hall-of-fame",
        icon: <i className="pi pi-sparkles tw-text-2xl" />,
        component: <Legends />,
        hidden: isDummyUser ? true : false
    }, {
        name: "Gallery",
        to: "/gallery",
        icon: <i className="pi pi-images tw-text-2xl" />,
        component: <Gallery />,
        hidden: isDummyUser ? true : false
    }, {
        name: "Career",
        to: "/career",
        icon: <i className="pi pi-warehouse tw-text-2xl" />,
        component: <Career />,
        hidden: isDummyUser ? true : false
    }, {
        name: "Control Panel",
        to: "/control-panel",
        icon: <i className="pi pi-cog tw-text-2xl" />,
        component: <ControlPanel />,
        hidden: isAdmin ? false : true
    }, {
        name: "Logout",
        to: "/",
        onClick: () => logout(),
        icon: <i className="pi pi-sign-out tw-text-2xl" />
    }].map((item, idx) => ({ ...item, id: idx+1 }));

	const isOnline = useOnline();
    const date = Date.now() + (new Date("03-22-2025 00:00:00") - new Date());
    const isDatePassed = (date - new Date()) < 0;

    return (
        <div className="tw-bg-white-app">
            {(isBday || !isDatePassed) && toggleConfetti && <Confetti width={width} height={height + scrollY} className="tw-z-[10000]" numberOfPieces={width <= 600 ? 200: 500} />}
            {isBday && <BirthdayModal claimReward={claimReward} isRewardClaimed={isRewardClaimed} width={width} open={openBdayModal} closeDialog={() => setOpenBdayModal(false)} />}
            {openWishModal && <WishModal wishModalSeen={wishModalSeen} username={username} open={openWishModal} closeDialog={() => setOpenWishModal(false)} />}

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
                        <CountDown date={date} renderer={CoundownRenderer}
                            updateFrequency={({ minutes, seconds }) => 1000 }
                        /> :
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
                                {!isDummyUser && <Route exact path="/hall-of-fame">
                                    <Legends />
                                </Route>}
                                {!isDummyUser && <Route exact path="/gallery">
                                    <Gallery />
                                </Route>}
                                {!isDummyUser && <Route exact path="/career">
                                    <Career />
                                </Route>}
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
