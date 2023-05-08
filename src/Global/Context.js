import { ceil, each, find, flattenDeep, get, isEmpty, merge, orderBy, round, sortBy } from 'lodash';
import React, { createContext, useState, useEffect } from 'react';
import emailChecker from 'mailchecker';

import { auth, db, storage, teamNames, getFormattedFirebaseTime, logger, iplMatches } from '../config';
import { getMatchDetailsById, getMatches } from '../components/apis';
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
            bets: admin.default.firestore.FieldValue.arrayUnion(betDetails),
            points: newPoints,
            updatedBy: `${username}_betOnMatch`,
            updatedAt: admin.default.firestore.Timestamp.fromDate(new Date())
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
                        betTeam: betData.team1 == betData.selectedTeam ? betData.team1Abbreviation : (betData.team2 == betData.selectedTeam ? betData.team2Abbreviation : "Penalty")
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
            const { bets = [], username, points, isDummyUser = false, isChampion = false } = userData;
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
                isOut: (inprogress === 0 && points === 0) ? true : false,
                isChampion
            });
        });

        result = orderBy(result, ["points", "won", "totalBets", "username"], ["desc", "desc", "asc", "asc"]);

        result.forEach((user, idx) => {
            if(idx === 0) {
                user.caption = `Woohoo!! You're leading the table ${user.username}. Maintain your position!`;
            } else if(user.isOut) {
                user.caption = `You're out for now ${user.username}. Comeback stronger next year :)`;
            } else {
                const diff = result[idx-1].points-user.points+1;
                user.caption = `${user.username} you need only ${diff} points to move to rank ${idx}. Get going!`;
            }
        })

        return result;
    }

    const getAllUsersData = async () => {
        try {
            let mostBetsDone = [], mostBetsWon = [], mostBetsLost = [], mostBetsPenalized = [], maxAvgBetsPoints = [],
                mostPointsWon = [], mostPointsLost = [], mostPointsPenalized = [], longestWinningStreak = [], longestLosingStreak = [],
                longestPenalizedStreak = [], earliestBetsTime = [], mostPointsBetInAMatch = [], betPtsDistribution = [];
            let timeSeriesPts = [], bettingOddsDistribution = [];
            const allUsersSnap = await db.collection("users").where("isDummyUser", "==", false).get();
            const allUsersDocs = allUsersSnap.docs;
            const allUsersData = allUsersDocs.map(eachUserDoc => {
                const eachUserData = eachUserDoc.data();
                const username = eachUserData.username;
                const bets = eachUserData.bets;
                const currPts = [{ match: 0, [username]: 3500 }];
                let currPtsLen = 1;

                let betsDone = 0, betsWon = 0, betsLost = 0, betsPenalized = 0, pointsBet = 0, pointsWon = 0, pointsLost = 0,
                    pointsPenalized = 0, longestWinStreak = 0, currentWinStreak = 0, longestLoseStreak = 0, currentLoseStreak = 0,
                    longestPenalizStreak = 0, currentPenalizStreak = 0, betOnTeamsLikelyToWin = 0, betOnTeamsLikelyToLose = 0;

                bets.map((bet, idx) => {
                    const betTime = moment.unix(bet.betTime.seconds);
                    const startOfDay = moment(betTime).startOf('day');
                    const diff = betTime.diff(startOfDay).valueOf();
                    bet.selectedPoints = parseInt(bet.selectedPoints);

                    if(bet.isBetDone) {
                        betsDone++;
                        pointsBet += parseInt(bet.selectedPoints);

                        longestPenalizStreak = Math.max(longestPenalizStreak, currentPenalizStreak);
                        currentPenalizStreak = 0;
                        
                        if(bet.odds) {
                            const [team1, team2] = Object.keys(bet.odds);
                            if(team1 == bet.selectedTeam) {
                                if(bet.odds[team1] <= bet.odds[team2])
                                    betOnTeamsLikelyToWin++;
                                else
                                    betOnTeamsLikelyToLose++;
                            } else if(team2 == bet.selectedTeam) {
                                if(bet.odds[team2] <= bet.odds[team1])
                                    betOnTeamsLikelyToWin++;
                                else
                                    betOnTeamsLikelyToLose++;
                            }
                        }

                        if(bet.isSettled) {
                            if(bet.betWon) {
                                betsWon++;
                                const pts = Math.ceil(parseInt(bet.selectedPoints)*bet.odds[bet.selectedTeam]);
                                pointsWon += pts;
                                currentWinStreak++;

                                longestLoseStreak = Math.max(longestLoseStreak, currentLoseStreak);
                                currentLoseStreak = 0;

                                // currPts.push(currPts[currPtsLen-1]+pts);
                                currPts.push({ match: idx+1, [username]: currPts[currPtsLen-1][username]+pts });
                            } else {
                                betsLost++;
                                pointsLost += parseInt(bet.selectedPoints);
                                currentLoseStreak++;

                                longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
                                currentWinStreak = 0;

                                currPts.push({ match: idx+1, [username]: currPts[currPtsLen-1][username]-parseInt(bet.selectedPoints) });
                            }
                            currPtsLen++;
                        }
                    } else {
                        if(parseInt(bet.selectedPoints) == 50) {
                            betsPenalized++;
                            pointsPenalized += parseInt(bet.selectedPoints);
                            currentPenalizStreak++;

                            // currPts.push(currPts[currPtsLen-1]-parseInt(bet.selectedPoints));
                            currPts.push({ match: idx+1, [username]: currPts[currPtsLen-1][username]-parseInt(bet.selectedPoints) });
                            currPtsLen++;
                        }
                    }

                    bet.betTime = moment.unix(bet.betTime.seconds).format("lll");
                    bet.username = username;
                    bet.diff = diff;
                    bet.betWon = bet.betWon ? "Yes" : "No";
                });

                betPtsDistribution.push({ username, points: pointsBet });
                timeSeriesPts = merge(timeSeriesPts, currPts);

                bettingOddsDistribution.push({ username, betOnTeamsLikelyToWin, betOnTeamsLikelyToLose });
                longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
                longestLoseStreak = Math.max(longestLoseStreak, currentLoseStreak);
                longestPenalizStreak = Math.max(longestPenalizStreak, currentPenalizStreak);

                mostBetsDone.push({ username, betsDone });
                mostBetsWon.push({ username, betsWon, winPercent: round(betsWon/(betsWon+betsLost),2) || 0 });
                mostBetsLost.push({ username, betsLost, lossPercent: round(betsLost/(betsWon+betsLost),2) || 0 });
                mostBetsPenalized.push({ username, betsPenalized, penalizedPercent: round(betsPenalized/(betsWon+betsLost),2) || 0 });
                maxAvgBetsPoints.push({ username, avgBetPoints: round(pointsBet/betsDone, 2) || 0 });
                mostPointsWon.push({ username, pointsWon });
                mostPointsLost.push({ username, pointsLost });
                mostPointsPenalized.push({ username, pointsPenalized });
                longestWinningStreak.push({ username, longestWinStreak });
                longestLosingStreak.push({ username, longestLoseStreak });
                longestPenalizedStreak.push({ username, longestPenalizStreak });

                return bets;
            });

            const rankDays = {}, avgRankParams = {};

            timeSeriesPts.forEach((matchPoint, mIdx) => {
                if(mIdx == 0) return;
                const matchNum = matchPoint["match"];
                delete matchPoint["match"];

                const sortedList = Object.keys(Object.fromEntries(Object.entries(matchPoint).sort((a,b) => b[1] - a[1])));

                sortedList.forEach((username, idx) => {
                    if(rankDays[username]) {
                        if(rankDays[username][idx+1]) {
                            rankDays[username] = { ...rankDays[username], [idx+1]: rankDays[username][idx+1] + 1 };
                        } else {
                            rankDays[username] = { ...rankDays[username], [idx+1]: 1 };
                        }
                        avgRankParams[username]["totalRank"] = avgRankParams[username].totalRank+idx+1;
                        avgRankParams[username]["totalMatches"] = avgRankParams[username].totalMatches+1;
                    } else {
                        rankDays[username] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, [idx+1]: 1 };
                        avgRankParams[username] = { totalRank: idx+1, totalMatches: 1 };
                        // rankDays[username] = { ...rankDays[username],  };
                    }
                });

                matchPoint["match"] = matchNum;
            })

            let rankMatchArray = [];

            Object.keys(rankDays).forEach(user => {
                const avgRank = parseFloat(avgRankParams[user]["totalRank"]/(avgRankParams[user]["totalMatches"] || 1)).toFixed(2);
                rankMatchArray.push({ username: user, ...rankDays[user], avgRank });
            });

            mostBetsDone = sortBy(mostBetsDone, ["betsDone"]).reverse();
            mostBetsWon = sortBy(mostBetsWon, ["betsWon"]).reverse();
            mostBetsLost = sortBy(mostBetsLost, ["betsLost"]).reverse();
            mostBetsPenalized = sortBy(mostBetsPenalized, ["betsPenalized"]).reverse();
            maxAvgBetsPoints = sortBy(maxAvgBetsPoints, ["avgBetPoints"]).reverse();
            rankMatchArray = sortBy(rankMatchArray, ["1", "2", "3", "4", "5", "6", "username"]).reverse();

            const totalWinPoints = mostPointsWon.reduce((acc, val) => acc+val.pointsWon, 0);
            mostPointsWon.forEach(dist => dist["ptsPercent"] = ((dist["pointsWon"]/totalWinPoints)*100).toFixed(2));
            mostPointsWon = sortBy(mostPointsWon, ["pointsWon"]).reverse();

            const totalLosePoints = mostPointsWon.reduce((acc, val) => acc+val.pointsWon, 0);
            mostPointsLost.forEach(dist => dist["ptsPercent"] = ((dist["pointsLost"]/totalLosePoints)*100).toFixed(2));
            mostPointsLost = sortBy(mostPointsLost, ["pointsLost"]).reverse();

            mostPointsPenalized = sortBy(mostPointsPenalized, ["pointsPenalized"]).reverse();
            longestWinningStreak = sortBy(longestWinningStreak, ["longestWinStreak"]).reverse();
            longestLosingStreak = sortBy(longestLosingStreak, ["longestLoseStreak"]).reverse();
            longestPenalizedStreak = sortBy(longestPenalizedStreak, ["longestPenalizStreak"]).reverse();
            
            const totalBetPoints = betPtsDistribution.reduce((acc, val) => acc+val.points, 0);
            betPtsDistribution.forEach(dist => dist["ptsPercent"] = ((dist["points"]/totalBetPoints)*100).toFixed(2));
            betPtsDistribution = sortBy(betPtsDistribution, ["points"]).reverse();
            
            const allBetsData = flattenDeep(allUsersData);
            earliestBetsTime = sortBy(allBetsData, ["diff"]).slice(0,5).map(eachBet => ({...eachBet, time: moment().startOf('day').add(eachBet.diff/1000,"seconds").format("hh:mm: A")}));
            mostPointsBetInAMatch = sortBy(allBetsData, ["selectedPoints"]).reverse().slice(0,5);

            bettingOddsDistribution = sortBy(bettingOddsDistribution, ["betOnTeamsLikelyToWin"]).reverse();

            // earlierBetsDone, longestWinningStreak(done), longestLosingStreak(done), longestPenalizedStreak(done),
            // mostPointsBetInAMatch, mostPointsWonOverall(done), mostPointsLostOverall(done), mostPointsPenalizedOverall(done) 
            // mostBetsDone(done), mostBetsWon(done), mostBetsLost(done), mostBetsPenalized(done),highestAvgBetPointsOverall(done)

            const globalStats = { 
                mostBetsDone: { data: mostBetsDone, cols: Object.keys(mostBetsDone[0]), description: "Most number of bets done. Penalized bets is not included in it." }, 
                mostBetsWon: { data: mostBetsWon, cols: Object.keys(mostBetsWon[0]), description: "Most number of bets won." }, 
                mostBetsLost: { data: mostBetsLost, cols: Object.keys(mostBetsLost[0]), description: "Most number of bets lost." },
                // mostBetsPenalized: { data: mostBetsPenalized, cols: Object.keys(mostBetsPenalized[0]), description: "Most number of bets penalized." },
                maxAvgBetsPoints: { data: maxAvgBetsPoints, cols: Object.keys(maxAvgBetsPoints[0]), description: "Most points bet per match. Penalized points is not included in it." },
                mostPointsWon: { data: mostPointsWon, cols: Object.keys(mostPointsWon[0]), description: "Most points won over the season." },
                mostPointsLost: { data: mostPointsLost, cols: Object.keys(mostPointsLost[0]), description: "Most points lost over the season." },
                // mostPointsPenalized: { data: mostPointsPenalized, cols: Object.keys(mostPointsPenalized[0]), description: "Most points penalized over the season." },
                longestWinningStreak: { data: longestWinningStreak, cols: Object.keys(longestWinningStreak[0]), description: "Most consecutive wins." },
                longestLosingStreak: { data: longestLosingStreak, cols: Object.keys(longestLosingStreak[0]), description: "Most consecutive loses." },
                // longestPenalizedStreak: { data: longestPenalizedStreak, cols: Object.keys(longestPenalizedStreak[0]), description: "Most consecutive penalties." },
                earliestBetsTime: { data: earliestBetsTime, cols: ["username", "time"], description: "Earliest bets done over a day."},
                mostPointsBetInAMatch: { data: mostPointsBetInAMatch, cols: ["username", "betWon", "selectedTeam", "selectedPoints", "betTime"], description: "Max points bet in a match over the season." },
                betPtsDistribution: { data: betPtsDistribution, cols: ["username", "points", "ptsPercent"], description: "Most points bet this season."},
                bettingOddsDistribution: { data: bettingOddsDistribution, cols: Object.keys(bettingOddsDistribution[0]), description: "Betting trends based on odds" },
                longestReignInRankings: { data: rankMatchArray, cols: ["username", "1", "2", "3", "4", "5", "6", "avgRank"], description: "Longest reign at a particular rank." }
            };
            
            return { globalStats, timeSeriesPts, betPtsDistribution };
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
            points: 2000,
            updatedBy: "clearUsernameBetsData",
            updatedAt: admin.default.firestore.Timestamp.fromDate(new Date())
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
                                finalPoints += ceil(bet.selectedPoints*(1+bet.odds[bet.selectedTeam]));
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
                points: finalPoints,
                updatedBy: `${loggedInUserDetails?.username}_syncUsernameBetsData`,
                updatedAt: admin.default.firestore.Timestamp.fromDate(new Date())
            });
        } catch (err) {
            console.log(err);
        }
    }

    const updateUserInfo = async (username, points, bets) => {
        try {
            logger.logEvent("update_user_info", { username, points, bets });
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
                                finalPoints += ceil(bet.selectedPoints*(1 + bet.odds[bet.selectedTeam]));
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

            logger.logEvent("Settling Count", { ...bets });
            console.log("Settling event counted");
            if(betSettledCount) {
                setNotifications(notifications);
                await db.collection("users").doc(username).update({
                    bets,
                    points: finalPoints,
                    updatedBy: `${username}_updateUserInfo`,
                    updatedAt: admin.default.firestore.Timestamp.fromDate(new Date())
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
