import { each, find, flattenDeep, isEmpty, orderBy, round, sortBy } from 'lodash';
import React, { createContext, useState, useEffect } from 'react';
import emailChecker from 'mailchecker';

import { auth, db, storage, teamNames, getFormattedFirebaseTime, logger, iplMatches } from '../config';
import { getMatchDetailsById, getMatches, getIplMatches } from '../components/apis';
import moment from 'moment';
const admin = require('firebase');

export const ContextProvider = createContext();

const Context = (props) => {
    const DEFAULT_PROFILE_IMAGE = "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/defaultImages%2Fdefault.png?alt=media&token=9ccd045b-3ece-4d06-babf-04c267c38d40";
    const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [mobileView, setMobileView] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const signUp = async (user) => {
        setLoading(true);
        const { username, email, password } = user;
        try {
            const isValidEmail = await emailChecker.isValid(email);

            if(!isValidEmail) throw new Error(`Email is invalid. Please don't try to be oversmart.`);

            const resp = await auth.createUserWithEmailAndPassword(email, password);
            resp.user.updateProfile({displayName: username});
            const points = 2000, image = DEFAULT_PROFILE_IMAGE, bets = [];
            db.collection("users").doc(username).set({
                username,
                email,
                password,
                image,
                points,
                bets,
                isDummyUser: true
            });

            setErrorMessage('');
            setNotifications([]);
            setLoading(false);
        } catch (error) {
            logger.logEvent("Signup", { ...user });
            console.log(error);
            setErrorMessage(error.message);
            setNotifications([]);
            setLoading(false);
        }
    }

    const signIn = async (user) => {
        setLoading(true);
        const { email, password } = user;
        try {
            await auth.signInWithEmailAndPassword(email, password);
            db.collection("users").where("email", "==", email).get().then(userSnap => {
                const { username, email, image, points, bets = [], isAdmin = false } = userSnap.docs[0].data();
                setLoggedInUserDetails({
                    username,
                    email,
                    image,
                    points,
                    bets,
                    isAdmin
                });
                setLoading(false);
            });

            setErrorMessage('');
        } catch (error) {
            console.log(error);
            setErrorMessage(error.message);
            setLoading(false);
        }
    }

    const sendResetPasswordEmail = async (user) => {
        setLoading(true);
        const { email } = user;
        try {
            await auth.sendPasswordResetEmail(email);
            setErrorMessage('');
        } catch (error) {
            console.log(error);
            setErrorMessage(error.message);
        }
        setLoading(false);
    }

    const logout = async () => {
        setLoading(true);
        try {
            await auth.signOut()
            .then(() => {
                setLoggedInUserDetails({});
                setErrorMessage('');
            })
            .catch(error => {
                console.log(error);
                setErrorMessage(error.message);
            });
            setNotifications([]);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setErrorMessage(error.message);
            setNotifications([]);
            setLoading(false);
        }
    }

    const markNotificationsAsRead = () => {
        setNotifications([]);
    }

    const betOnMatch = (betDetails) => {
        const { username, bets, points } = loggedInUserDetails;
        const newBets = [...bets, betDetails];
        const newPoints = points - betDetails.selectedPoints;

        db.collection("users").doc(username).update({
            bets: newBets,
            points: newPoints
        }).then(() => {
            console.log("Document updated Successfully.");
            setLoggedInUserDetails({
                ...loggedInUserDetails,
                bets: newBets,
                points: newPoints
            });
        }).catch(err => {
            console.log("Error while updating user details:",err);
        });
    }

    const viewBetsData = async(id) => {
        let result = [];
        const userDocs = await db.collection("users").get();
        userDocs.docs.map(user => {
            const userData = user.data();
            const { bets = [], username, isDummyUser = false } = userData;
            if(!isDummyUser) {
                const betData = find(bets, {"matchId": id}) || {};
                if(!isEmpty(betData)) {
                    result.push({
                        username,
                        betTime: betData.betTime,
                        betPoints: parseInt(betData.selectedPoints),
                        betTeam: betData.selectedTeam
                    });
                }
            }
        });

        result = sortBy(result, ["betPoints"]);

        return result;
    }

    const getPointsTableData = async() => {
        let result = [];
        const userDocs = await db.collection("users").get();
        userDocs.docs.map(user => {
            const userData = user.data();
            const { bets = [], username, points, isDummyUser = false } = userData;
            if(isDummyUser)    
                return;
            let won = 0, lost = 0, inprogress = 0, totalBets = 0, penalized = 0;
            bets.map(bet => {
                if(bet.isBetDone) {
                    if(bet.isSettled) {
                        if(bet.betWon)  won++;
                        else    lost++;
                    } else {
                        inprogress++;
                    }
                    totalBets++;
                } else {
                    penalized++;
                }
            });

            result.push({
                username,
                totalBets,
                won,
                lost,
                inprogress,
                penalized,
                points,
                isOut: (inprogress === 0 && points === 0) ? true : false
            });
        });

        result = orderBy(result, ["points", "totalBets", "won", "username"], ["desc", "desc", "desc", "asc"]);

        return result;
    }

    const getAllUsersData = async () => {
        try {
            let mostBetsDone = [], mostBetsWon = [], mostBetsLost = [], mostBetsPenalized = [], maxAvgBetsPoints = [],
                mostPointsWon = [], mostPointsLost = [], mostPointsPenalized = [], longestWinningStreak = [], longestLosingStreak = [],
                longestPenalizedStreak = [], earliestBetsTime = [], mostPointsBetInAMatch = [];
            const allUsersSnap = await db.collection("users").where("isDummyUser", "==", false).get();
            const allUsersDocs = allUsersSnap.docs;
            const allUsersData = allUsersDocs.map(eachUserDoc => {
                const eachUserData = eachUserDoc.data();
                const username = eachUserData.username;
                const bets = eachUserData.bets;

                let betsDone = 0, betsWon = 0, betsLost = 0, betsPenalized = 0, pointsBet = 0, pointsWon = 0, pointsLost = 0,
                    pointsPenalized = 0, longestWinStreak = 0, currentWinStreak = 0, longestLoseStreak = 0, currentLoseStreak = 0,
                    longestPenalizStreak = 0, currentPenalizStreak = 0;

                bets.map(bet => {
                    const betTime = moment.unix(bet.betTime.seconds);
                    const startOfDay = moment(betTime).startOf('day');
                    const diff = betTime.diff(startOfDay).valueOf();
                    bet.selectedPoints = parseInt(bet.selectedPoints);

                    if(bet.isBetDone) {
                        betsDone++;
                        pointsBet += parseInt(bet.selectedPoints);

                        longestPenalizStreak = Math.max(longestPenalizStreak, currentPenalizStreak);
                        currentPenalizStreak = 0;
                        
                        if(bet.isSettled) {
                            if(bet.betWon) {
                                betsWon++;
                                pointsWon += parseInt(bet.selectedPoints);
                                currentWinStreak++;

                                longestLoseStreak = Math.max(longestLoseStreak, currentLoseStreak);
                                currentLoseStreak = 0;
                            } else {
                                betsLost++;
                                pointsLost += parseInt(bet.selectedPoints);
                                currentLoseStreak++;

                                longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
                                currentWinStreak = 0;
                            }
                        }
                    } else {
                        if(parseInt(bet.selectedPoints) == 50) {
                            betsPenalized++;
                            pointsPenalized += parseInt(bet.selectedPoints);
                            currentPenalizStreak++;
                        }
                    }

                    bet.betTime = moment.unix(bet.betTime.seconds).format("lll");
                    bet.username = username;
                    bet.diff = diff;
                    bet.betWon = bet.betWon ? "Yes" : "No";
                });

                longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
                longestLoseStreak = Math.max(longestLoseStreak, currentLoseStreak);
                longestPenalizStreak = Math.max(longestPenalizStreak, currentPenalizStreak);

                mostBetsDone.push({ username, betsDone });
                mostBetsWon.push({ username, betsWon, winPercent: round(betsWon/betsDone,2) || 0 });
                mostBetsLost.push({ username, betsLost, lossPercent: round(betsLost/betsDone,2) || 0 });
                mostBetsPenalized.push({ username, betsPenalized, penalizedPercent: round(betsPenalized/betsDone,2) || 0 });
                maxAvgBetsPoints.push({ username, avgBetPoints: round(pointsBet/betsDone, 2) || 0 });
                mostPointsWon.push({ username, pointsWon });
                mostPointsLost.push({ username, pointsLost });
                mostPointsPenalized.push({ username, pointsPenalized });
                longestWinningStreak.push({ username, longestWinStreak });
                longestLosingStreak.push({ username, longestLoseStreak });
                longestPenalizedStreak.push({ username, longestPenalizStreak });

                return bets;
            });

            mostBetsDone = sortBy(mostBetsDone, ["betsDone"]).reverse();
            mostBetsWon = sortBy(mostBetsWon, ["betsWon"]).reverse();
            mostBetsLost = sortBy(mostBetsLost, ["betsLost"]).reverse();
            mostBetsPenalized = sortBy(mostBetsPenalized, ["betsPenalized"]).reverse();
            maxAvgBetsPoints = sortBy(maxAvgBetsPoints, ["avgBetPoints"]).reverse();
            mostPointsWon = sortBy(mostPointsWon, ["pointsWon"]).reverse();
            mostPointsLost = sortBy(mostPointsLost, ["pointsLost"]).reverse();
            mostPointsPenalized = sortBy(mostPointsPenalized, ["pointsPenalized"]).reverse();
            longestWinningStreak = sortBy(longestWinningStreak, ["longestWinStreak"]).reverse();
            longestLosingStreak = sortBy(longestLosingStreak, ["longestLoseStreak"]).reverse();
            longestPenalizedStreak = sortBy(longestPenalizedStreak, ["longestPenalizStreak"]).reverse();
            
            const allBetsData = flattenDeep(allUsersData);
            earliestBetsTime = sortBy(allBetsData, ["diff"]).slice(0,5).map(eachBet => ({...eachBet, time: moment().startOf('day').add(eachBet.diff/1000,"seconds").format("HH:mm: A")}));
            mostPointsBetInAMatch = sortBy(allBetsData, ["selectedPoints"]).reverse().slice(0,5);

            // earlierBetsDone, longestWinningStreak(done), longestLosingStreak(done), longestPenalizedStreak(done),
            // mostPointsBetInAMatch, mostPointsWonOverall(done), mostPointsLostOverall(done), mostPointsPenalizedOverall(done) 
            // mostBetsDone(done), mostBetsWon(done), mostBetsLost(done), mostBetsPenalized(done),highestAvgBetPointsOverall(done)

            const globalStats = { 
                mostBetsDone: { data: mostBetsDone, cols: Object.keys(mostBetsDone[0]), description: "Most number of bets done. Penalized bets is not included in it." }, 
                mostBetsWon: { data: mostBetsWon, cols: Object.keys(mostBetsWon[0]), description: "Most number of bets won." }, 
                mostBetsLost: { data: mostBetsLost, cols: Object.keys(mostBetsLost[0]), description: "Most number of bets lost." },
                mostBetsPenalized: { data: mostBetsPenalized, cols: Object.keys(mostBetsPenalized[0]), description: "Most number of bets penalized." },
                maxAvgBetsPoints: { data: maxAvgBetsPoints, cols: Object.keys(maxAvgBetsPoints[0]), description: "Most points bet per match. Penalized points is not included in it." },
                mostPointsWon: { data: mostPointsWon, cols: Object.keys(mostPointsWon[0]), description: "Most points won over the season." },
                mostPointsLost: { data: mostPointsLost, cols: Object.keys(mostPointsLost[0]), description: "Most points lost over the season." },
                mostPointsPenalized: { data: mostPointsPenalized, cols: Object.keys(mostPointsPenalized[0]), description: "Most points penalized over the season." },
                longestWinningStreak: { data: longestWinningStreak, cols: Object.keys(longestWinningStreak[0]), description: "Most consecutive wins." },
                longestLosingStreak: { data: longestLosingStreak, cols: Object.keys(longestLosingStreak[0]), description: "Most consecutive loses." },
                longestPenalizedStreak: { data: longestPenalizedStreak, cols: Object.keys(longestPenalizedStreak[0]), description: "Most consecutive penalties." },
                earliestBetsTime: { data: earliestBetsTime, cols: ["username", "time"], description: "Earliest bets done over a day."},
                mostPointsBetInAMatch: { data: mostPointsBetInAMatch, cols: ["username", "betWon", "selectedTeam", "selectedPoints", "betTime"], description: "Max points bet in a match over the season." }
            };
            
            return globalStats;
        } catch (err) {
            console.log(err);
        }
    }

    const getTeamStatsData = async () => {
        if(loggedInUserDetails && loggedInUserDetails.username) {
            let result = [];
            const userDocs = await db.collection("users").where("username", "==", loggedInUserDetails.username).get();

            let penalizedPts = 0, betsPenalized = 0;
            userDocs.docs.map(user => {
                const userData = user.data();
                const { bets = [] } = userData;
                
                teamNames.map(team => {
                    const qualifedBets = bets.filter(bet => bet.selectedTeam === team);
                    let betsDone = 0, betsWon = 0, betsLost = 0, betsInProgress = 0, totalPts = 0, wonPts = 0, lostPts = 0, inprogressPts = 0;
                    qualifedBets.map(bet => {
                        if(bet.isBetDone) {
                            if(bet.isSettled) {
                                if(bet.betWon) {
                                    betsWon++;
                                    wonPts += parseInt(bet.selectedPoints);
                                } else {
                                    betsLost++;
                                    lostPts += parseInt(bet.selectedPoints);
                                }
                            } else {
                                betsInProgress++;
                                inprogressPts += parseInt(bet.selectedPoints);
                            }
                            betsDone++;
                            totalPts += parseInt(bet.selectedPoints);
                        } else {
                            betsPenalized++;
                            penalizedPts += parseInt(bet.selectedPoints);
                        }
                    });

                    if(team !== "No Betting Done.") {
                        result.push({
                            teamName: team,
                            betsDone,
                            betsWon,
                            betsLost,
                            betsInProgress,
                            totalPts,
                            wonPts,
                            lostPts,
                            inprogressPts,
                        });
                    }
                });
            });

            result = orderBy(result, ["teamName"], ["asc"]);

            result.push({
                teamName: "Penalized",
                betsDone: betsPenalized,
                betsWon: 0,
                betsLost: betsPenalized,
                betsInProgress: 0,
                totalPts: penalizedPts,
                wonPts: 0,
                lostPts: penalizedPts,
                inprogressPts: 0,
            });

            return result;
        }

        return [];
    }

    const clearUsernameBetsData = async(username) => {
        await db.collection("users").doc(username).update({
            bets: [],
            points: 2000
        });

        setLoggedInUserDetails({
            ...loggedInUserDetails,
            bets: [],
            points: 2000
        });
    }

    const syncUsernameBetsData = async (username) => {
        try {
            let userDetails = await db.collection("users").where("username", "==", username).get();
            userDetails = await userDetails.docs[0].data();
            const { bets = [], points = 0 } = userDetails;
            let finalPoints = points;
            let inprogressBets = 0;

            for(let i=0; i<bets.length; i++) {
                const bet = bets[i];
                if(!bet.isSettled) {
                    const matchDetails = await getMatchDetailsById(bet.matchId) || {};
                    if(!isEmpty(matchDetails.matchWinner)) {
                        if(matchDetails.matchWinner == "No Winner") {
                            bet.isSettled = true;
                            bet.betWon = true;
                            finalPoints += parseInt(bet.selectedPoints);
                            bet.isNoResult = true;
                        } else {
                            if(matchDetails.matchWinner == bet.selectedTeam) {
                                finalPoints += bet.selectedPoints*(1+bet.odds[bet.selectedTeam]);
                                bet.betWon = true;
                            } else {
                                bet.betWon = false;
                            }
                            bet.isSettled = true;
                            bet.isNoResult = false;
                        }
                    } else {
                        inprogressBets++;
                    }
                }
            }

            for(let j=0; j<iplMatches.length; j++) {
                const match = iplMatches[j];
                const { dateTimeGMT: matchTime, id: matchId, team1, team2, team1Abbreviation, team2Abbreviation } = match;
                const betEndTime = moment(matchTime).subtract(30,"minutes");
                if(moment() > betEndTime && finalPoints > 0) {
                    const betData = find(bets, {"matchId": matchId}) || {};
                    const isOut = (inprogressBets === 0 && finalPoints === 0) ? true : false;

                    if(isEmpty(betData)) {
                        bets.push({
                            betTime: admin.default.firestore.Timestamp.fromDate(new Date()),
                            betWon: false,
                            isSettled: true,
                            isBetDone: false,
                            selectedPoints: isOut ? 0 : 50,
                            selectedTeam: "No Betting Done.",
                            team1: team1,
                            team2: team2,
                            team1Abbreviation: team1Abbreviation,
                            team2Abbreviation: team2Abbreviation,
                            matchId: matchId,
                            isNoResult: false
                        });

                        finalPoints = Math.max(finalPoints-50, 0);
                    }
                } else {
                    break;
                }
            }

            await db.collection("users").doc(username).update({
                bets,
                points: finalPoints
            });
        } catch (err) {
            console.log(err);
        }
    }

    const updateUserInfo = async (username, points, bets) => {
        try {
            let finalPoints = points, betSettledCount = 0;
            let notifications = [];
            let inprogressBets = 0;
            for(let i=0; i<bets.length; i++) {
                const bet = bets[i];
                if(!bet.isSettled) {
                    const matchDetails = await getMatchDetailsById(bet.matchId) || {};
                    if(!isEmpty(matchDetails.matchWinner)) {
                        if(matchDetails.matchWinner == "No Winner") {
                            bet.isSettled = true;
                            bet.betWon = true;
                            finalPoints += parseInt(bet.selectedPoints);
                            betSettledCount++;
                            bet.isNoResult = true;
                            notifications.push({
                                title: "Oh no! Nobody Won!",
                                body: `Your bet on ${moment.unix(bet.betTime.seconds).format("LLL")} for the match ${bet.team1} vs ${bet.team2} has been ended in NO Result!. You got ${bet.selectedPoints} POINTS.`,
                                betWon: true,
                                isNoResult: true
                            });
                        } else {
                            if(matchDetails.matchWinner == bet.selectedTeam) {
                                finalPoints += bet.selectedPoints*(1 + bet.odds[bet.selectedTeam]);
                                bet.betWon = true;
                            } else {
                                bet.betWon = false;
                            }
                            bet.isSettled = true;
                            bet.isNoResult = false;
                            betSettledCount++;
                            notifications.push({
                                title: `You ${bet.betWon ? "Won" : "Lost"}!`,
                                body: `Your bet on ${moment.unix(bet.betTime.seconds).format("LLL")} for the match ${bet.team1} vs ${bet.team2} has been ${bet.betWon ? "Won" : "Lost"}!. You ${bet.betWon ? "Won" : "Lost"} ${bet.selectedPoints} POINTS.`,
                                betWon: bet.betWon,
                                isNoResult: false
                            });
                        }
                    } else {
                        inprogressBets++;
                    }
                }
            };

            for(let j=0; j<iplMatches.length; j++) {
                const match = iplMatches[j];
                const { dateTimeGMT: matchTime, id: matchId, team1, team2, team1Abbreviation, team2Abbreviation } = match;
                const betEndTime = moment(matchTime).subtract(30,"minutes");
                if(moment() > betEndTime) {
                    const betData = find(bets, {"matchId": matchId}) || {};
                    const isOut = (inprogressBets === 0 && finalPoints === 0) ? true : false;

                    if(isEmpty(betData)) {
                        bets.push({
                            betTime: admin.default.firestore.Timestamp.fromDate(new Date()),
                            betWon: false,
                            isSettled: true,
                            isBetDone: false,
                            selectedPoints: isOut ? 0 : 50,
                            selectedTeam: "No Betting Done.",
                            team1: team1,
                            team2: team2,
                            team1Abbreviation: team1Abbreviation,
                            team2Abbreviation: team2Abbreviation,
                            matchId: matchId,
                            isNoResult: false
                        });

                        finalPoints = Math.max(finalPoints-50,0);
                        betSettledCount++;
                        if(!isOut) {
                            notifications.push({
                                title: `You Lost!`,
                                body: `You did not bet for the match ${team1Abbreviation} vs ${team2Abbreviation}. You lost 50 POINTS.`,
                                betWon: false,
                                isNoResult: false
                            });
                        }
                    }
                } else {
                    break;
                }
            }

            if(betSettledCount) {
                setNotifications(notifications);
                await db.collection("users").doc(username).update({
                    bets,
                    points: finalPoints
                });
            }
            return { latestPoints: finalPoints, latestBets: bets };
        } catch(err) {
            console.log(err);
        }
    }

    const checkMobileView = () => {
        const setResponsiveness = () => {
            return window.innerWidth < 900 ? setMobileView(true) : setMobileView(false);
        }
      
        setResponsiveness();
      
        window.addEventListener("resize", () => setResponsiveness());
    }

    useEffect(async () => {
        checkMobileView();
        setLoading(true);
        await auth.onAuthStateChanged(async user => {
            if(user) {
                await db.collection("users").where("email", "==", user.email).get().then(async userSnap => {
                    const { username, email, image, points, bets, isAdmin = false } = userSnap.docs[0].data();
                    const { latestPoints = points, latestBets = [] } =  await updateUserInfo(username,points,bets) || {};
                    setLoggedInUserDetails({
                        username,
                        email,
                        image,
                        points: latestPoints,
                        bets: latestBets,
                        isAdmin
                    });
                });
                setLoading(false);
            } else {
                setLoggedInUserDetails({});
                setLoading(false);
            }
        });
    },[]);

    return (
        <ContextProvider.Provider value={{
            loggedInUserDetails,
            errorMessage,
            loading,
            mobileView,
            notifications,

            signUp,
            signIn,
            logout,
            betOnMatch,
            viewBetsData,
            getPointsTableData,
            clearUsernameBetsData,
            syncUsernameBetsData,
            markNotificationsAsRead,
            sendResetPasswordEmail,
            getTeamStatsData,
            getAllUsersData
        }}>
            {props.children}
        </ContextProvider.Provider>
    )
}

export default Context;
