import { each, find, flattenDeep, get, isEmpty, orderBy, round, sortBy } from 'lodash';
import React, { createContext, useState, useEffect } from 'react';
import moment from 'moment';

import { auth, db, storage, iplMatches, DEFAULT_PROFILE_IMAGE, DEFAULT_START_POINTS, TEAM_NAMES } from '../config';
import { getMatchDetailsById, getMatches } from '../components/apis';
import { createUserInDb, getFormattedTimeFromSeconds, getIsMobileView, getUserFromKey, setResponsiveness, updateUserDetailsByUsername } from './Utils';
const admin = require('firebase');

export const ContextProvider = createContext();

const Context = (props) => {
    const [loading, setLoading] = useState(true);
    const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
    const [pointsTableData, setPointsTableData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [mobileView, setMobileView] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const signUp = async (userDetails) => {
        setLoading(true);
        try {
            const { username, email, password } = userDetails;
            await auth.createUserWithEmailAndPassword(email, password);
            auth.currentUser.updateProfile({ displayName: username });

            const loggedInUserDetails = {
                bets: [],
                email,
                isAdmin: false,
                isDummyUser: true,
                isEliminated: false,
                password,
                points: DEFAULT_START_POINTS,
                profilePic: DEFAULT_PROFILE_IMAGE,
                username
            };
            
            createUserInDb(loggedInUserDetails);
        } catch (error) {
            console.log(error);
            setErrorMessage(`Sign Up failed with error code: ${error.code} and error: ${error.message}`);
        }
        setLoading(false);
    }

    const signIn = async (userDetails) => {
        setLoading(true);
        const { email, password } = userDetails;
        try {
            await auth.signInWithEmailAndPassword(email, password);
            const userSnapshot = await getUserFromKey("email", email);
            const docs = !isEmpty(userSnapshot.docs) ? userSnapshot.docs[0].data() : {};
            const { bets, email, isAdmin, isDummyUser, isEliminated, points, profilePic, username } = docs;
            
            setLoggedInUserDetails({
                bets,
                email,
                isAdmin,
                isDummyUser,
                isEliminated,
                points,
                profilePic,
                username
            });
        } catch (error) {
            console.log(error);
            setErrorMessage(error.message);
        }
        setLoading(false);
    }

    const sendResetPasswordEmail = async (user) => {
        setLoading(true);
        const { email } = user;
        try {
            await auth.sendPasswordResetEmail(email);
        } catch (error) {
            console.log(error);
            setErrorMessage(error.message);
        }
        setLoading(false);
    }

    const logout = async () => {
        setLoading(true);
        try {
            await auth.signOut();
            setLoggedInUserDetails({});
        } catch (error) {
            console.log(error);
            setErrorMessage(error.message);
        }
        setNotifications([]);
        setLoading(false);
    }

    const markNotificationsAsRead = () => {
        setNotifications([]);
    }

    const betOnMatch = async (betDetails) => {
        const { username, bets, points } = loggedInUserDetails;
        bets = [ ...bets, betDetails ];
        points = points - parseInt(betDetails.selectedPoints);
        
        try {
            await updateUserDetailsByUsername(username, { bets, points });
            setLoggedInUserDetails({
                ...loggedInUserDetails,
                bets,
                points
            });
        } catch (err) {
            console.log(err);
            setErrorMessage(err.message);
        }
    }

    const viewBetsData = async (matchId) => {
        let result = [];
        const userSnapshot = await getUserFromKey("username", "all");
        const userDetails = !isEmpty(userSnapshot.docs) ? userSnapshot.docs : [];
        
        userDetails.map(eachUser => {
            const userData = eachUser.data();
            const { bets = [], username, isDummyUser = false } = userData;
            
            if(!isDummyUser) {
                const betData = find(bets, { matchId }) || {};
                
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
        let pointsTableData = [];
        const userSnapshot = await getUserFromKey("username", "all");
        const docs = !isEmpty(userSnapshot.docs) ? userSnapshot.docs : [];

        docs.map(eachUser => {
            const userData = eachUser.data();
            const { bets = [], username, points, isDummyUser = false, isEliminated = false } = userData;

            if(!isDummyUser) {
                let won = 0, lost = 0, inprogress = 0, totalBets = 0, penalized = 0;
                
                bets.map(eachBet => {
                    if(eachBet.isBetDone) {
                        if(eachBet.isSettled) {
                            if(eachBet.betWon)  won++;
                            else    lost++;
                        } else {
                            inprogress++;
                        }
                        totalBets++;
                    } else {
                        penalized++;
                    }
                });

                pointsTableData.push({
                    username,
                    totalBets,
                    won,
                    lost,
                    inprogress,
                    penalized,
                    points,
                    isEliminated
                });
            }
        });

        pointsTableData = orderBy(pointsTableData, ["points", "won", "lost", "username"], ["desc", "desc", "asc", "asc"]);
        setPointsTableData(pointsTableData);

        return pointsTableData;
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

    const getTeamStatsData = async (username) => {
        // let result = [], pointsPenalized = 0, betsPenalized = 0;
        // const userSnapshot = await getUserFromKey("username", username);
        // const docs = !isEmpty(userSnapshot.docs) ? userSnapshot.docs : [];

        // docs.map(user => {
        //     const userData = user.data();
        //     const { bets = [] } = userData;
            
        //     TEAM_NAMES.map(team => {
        //         const qualifedBets = bets.filter(bet => bet.selectedTeam === team);
        //         let betsDone = 0, betsWon = 0, betsLost = 0, betsInProgress = 0, totalPts = 0, wonPts = 0, lostPts = 0, inprogressPts = 0;
        //         qualifedBets.map(bet => {
        //             if(bet.isBetDone) {
        //                 if(bet.isSettled) {
        //                     if(bet.betWon) {
        //                         betsWon++;
        //                         wonPts += parseInt(bet.selectedPoints);
        //                     } else {
        //                         betsLost++;
        //                         lostPts += parseInt(bet.selectedPoints);
        //                     }
        //                 } else {
        //                     betsInProgress++;
        //                     inprogressPts += parseInt(bet.selectedPoints);
        //                 }
        //                 betsDone++;
        //                 totalPts += parseInt(bet.selectedPoints);
        //             } else {
        //                 betsPenalized++;
        //                 penalizedPts += parseInt(bet.selectedPoints);
        //             }
        //         });

        //         if(team !== "No Betting Done.") {
        //             result.push({
        //                 teamName: team,
        //                 betsDone,
        //                 betsWon,
        //                 betsLost,
        //                 betsInProgress,
        //                 totalPts,
        //                 wonPts,
        //                 lostPts,
        //                 inprogressPts,
        //             });
        //         }
        //     });
        // });

        // result = orderBy(result, ["teamName"], ["asc"]);

        // result.push({
        //     teamName: "Penalized",
        //     betsDone: betsPenalized,
        //     betsWon: 0,
        //     betsLost: betsPenalized,
        //     betsInProgress: 0,
        //     totalPts: penalizedPts,
        //     wonPts: 0,
        //     lostPts: penalizedPts,
        //     inprogressPts: 0,
        // });

        // return result;
    }

    const clearUsernameBetsData = async(username) => {
        const updatedDetails = { bets: [], points: 2000, isEliminated: false };
        await updateUserDetailsByUsername(username, updatedDetails);

        setLoggedInUserDetails({
            ...loggedInUserDetails,
            ...updatedDetails
        });
    }

    const syncUsernameBetsData = async (username) => {
        try {
            let userSnapshot = await getUserFromKey("username", username);
            const userDetails = !isEmpty(userSnapshot.docs) ? userSnapshot.docs[0].data() : {};
            const { bets = [], points = 0 } = userDetails;

            const { latestIsEliminated = false, latestBets = [], latestPoints = 0 } = await syncBetsData(bets, points, username) || {};

            await updateUserDetailsByUsername(username, { bets: latestBets, points: latestPoints, isEliminated: latestIsEliminated });
        } catch (err) {
            console.log(err);
        }
    }

    const syncUnsettledBets = async (bets, betSettledCount, finalPoints, inprogressBets, notifications) => {
        for(let i=0; i<bets.length; i++) {
            const bet = bets[i];
            if(!bet.isSettled) {
                const matchDetails = await getMatchDetailsById(bet.matchId) || {};
                
                if(!isEmpty(matchDetails.matchWinner)) {
                    bet.isSettled = true;
                    betSettledCount++;
                    if(matchDetails.matchWinner == "No Winner") {
                        bet.betWon = true;
                        bet.isNoResult = true;
                        finalPoints += parseInt(bet.selectedPoints);
                        notifications.push({
                            title: "Phew! No Result!",
                            body: `Your bet on ${getFormattedTimeFromSeconds(bet.betTime.seconds)} for the match ${bet.team1} vs ${bet.team2} has been ended in NO Result!. You got back ${bet.selectedPoints} POINTS.`,
                            betWon: true,
                            isNoResult: true
                        });
                    } else {
                        bet.isNoResult = false;
                        if(matchDetails.matchWinner == bet.selectedTeam) {
                            bet.betWon = true;
                            finalPoints += 2*bet.selectedPoints;
                        } else {
                            bet.betWon = false;
                        }
                        notifications.push({
                            title: `You ${bet.betWon ? "Won" : "Lost"}!`,
                            body: `Your bet on ${getFormattedTimeFromSeconds(bet.betTime.seconds)} for the match ${bet.team1} vs ${bet.team2} has been ${bet.betWon ? "Won" : "Lost"}!. You ${bet.betWon ? "Won" : "Lost"} ${bet.selectedPoints} POINTS.`,
                            betWon: bet.betWon,
                            isNoResult: false
                        });
                    }
                } else {
                    inprogressBets++;
                }
            }
        }
    }

    const syncMissedBets = (bets, betSettledCount, finalPoints, inprogressBets) => {
        let isEliminated = false;
        
        for(let j=0; j<iplMatches.length; j++) {
            const match = iplMatches[j];
            const { dateTimeGMT: matchTime, id: matchId, team1, team2, team1Abbreviation, team2Abbreviation } = match;
            const betEndTime = moment(matchTime).subtract(30,"minutes");
            
            if(moment() > betEndTime) {
                const betData = find(bets, {"matchId": matchId}) || {};
                isEliminated = (inprogressBets === 0 && finalPoints === 0) ? true : false;

                if(isEmpty(betData)) {
                    bets.push({
                        betTime: admin.default.firestore.Timestamp.fromDate(new Date()),
                        betWon: false,
                        isSettled: true,
                        isBetDone: false,
                        selectedPoints: isEliminated ? 0 : 50,
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
                    
                    if(!isEliminated) {
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

        return isEliminated;
    }

    const syncBetsData = async (bets, points, username) => {
        try {
            let finalPoints = points, betSettledCount = 0;
            let notifications = [];
            let inprogressBets = 0;
            
            await syncUnsettledBets(bets, betSettledCount, finalPoints, inprogressBets, notifications);
            const isEliminated = syncMissedBets(bets, betSettledCount, finalPoints, inprogressBets);

            if(betSettledCount) {
                setNotifications(notifications);
                await updateUserDetailsByUsername(username, { bets, points: finalPoints, isEliminated });
            }
            
            return { latestIsEliminated: isEliminated, latestBets: bets, latestPoints: finalPoints };
        } catch(err) {
            console.log(err);
        }
    }

    const checkMobileView = () => {      
        const mobileView = getIsMobileView();
        setMobileView(mobileView);
    }

    const handleAuthStateChange = async (user) => {
        setLoggedInUserDetails({});
        
        if(user) {
            const userSnapshot = await getUserFromKey("email", user.email); 
            const userDetails = !isEmpty(userSnapshot.docs) ? userSnapshot.docs[0].data() : {};
            const { bets, email, isAdmin = false, isDummyUser = false, isEliminated = false, points, profilePic, username } = userDetails;
            
            const { latestIsEliminated = false, latestBets = [], latestPoints = 0 } = await syncBetsData(bets, points, username) || {};
            
            setLoggedInUserDetails({
                bets: latestBets,
                email,
                isAdmin,
                isDummyUser,
                isEliminated: latestIsEliminated,
                points: latestPoints,
                profilePic,
                username
            });
        }
    }

    useEffect(async () => {
        setLoading(true);
        window.addEventListener("resize", () => checkMobileView());
        checkMobileView();
        auth.onAuthStateChanged(handleAuthStateChange);
        setLoading(false);
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
