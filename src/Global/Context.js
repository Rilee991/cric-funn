import { ceil, each, find, flattenDeep, get, isEmpty, merge, orderBy, round, sortBy } from 'lodash';
import React, { createContext, useState, useEffect } from 'react';
import emailChecker from 'mailchecker';

import { auth, db, storage, teamNames, getFormattedFirebaseTime, logger, iplMatches, teamProps } from '../config';
import { getMatchDetailsById, getMatches } from '../components/apis';
import moment from 'moment';
import { getToppgerBgImage } from './adhocUtils';
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

    const clearNotifications = () => {
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

    const updateSeenBets = async (id, username) => {
        const docRef = db.collection("ipl_matches").doc(id);
        
        docRef.get().then(doc => {
            if(doc.exists) {
                const data = doc.data();
                let value = get(data, `seenBy[${username}]`, []);
                if(data.seenBy) {
                    if(data.seenBy[username]) {
                        value.push(admin.default.firestore.Timestamp.fromDate(new Date()));
                    } else {
                        value.push(admin.default.firestore.Timestamp.fromDate(new Date()));
                    }
                } else {
                    value.push(admin.default.firestore.Timestamp.fromDate(new Date()));
                }

                docRef.update(`seenBy.${username}`, value).then(resp => console.log("doc updated :)"));
            }
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
                        betTeam: betData.team1 == betData.selectedTeam ? betData.team1Abbreviation : (betData.team2 == betData.selectedTeam ? betData.team2Abbreviation : "Penalty"),
                        teamName: betData.selectedTeam
                    });
                }
            }
        });

        result = sortBy(result, ["betPoints"]);

        return result;
    }

    const getPointsTableData = async () => {
        let result = [];
        const userDocs = await db.collection("users").get();
        userDocs.docs.map(user => {
            const userData = user.data();
            const { bets = [], username, points, isDummyUser = false, isChampion = false, image } = userData;

            if(isDummyUser) return;
            
            let won = 0, lost = 0, inprogress = 0, totalBets = 0, fined = 0;

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
                    fined++;
                }
            });

            result.push({
                player: username,
                bets: totalBets,
                won,
                lost,
                inprogress,
                fined,
                points,
                "w-l-i": `${won}-${lost}-${inprogress}`,
                isOut: (inprogress === 0 && points === 0) ? true : false,
                isChampion,
                image,
                subText: isChampion ? "Undisputed Universal Champion" : "#1 Contender",
                bgImage: isChampion ? getToppgerBgImage(true) : getToppgerBgImage(false)
            });
        });

        result = orderBy(result, ["points", "won", "bets", "player"], ["desc", "desc", "asc", "asc"]);

        return { data: result, cols: ["player", "bets", "w-l-i", "points"], caption: "Penalised bets not included in bet count.", title: "Points Table" };
    }

    const getAllUsersData = async () => {
        try {
            let mostBetsDone = [], mostBetsWon = [], mostBetsLost = [], mostBetsPenalized = [], maxAvgBetsPoints = [],
                mostPointsWon = [], mostPointsLost = [], mostPointsPenalized = [], longestWinningStreak = [], longestLosingStreak = [],
                longestPenalizedStreak = [], earliestBetsTime = [], mostPointsBetInAMatch = [], betPtsDistribution = [];
            let timeSeriesPts = [], bettingOddsDistribution = [], betPtsSplitDistribution = [];
            const allUsersSnap = await db.collection("users").where("isDummyUser", "==", false).get();
            const allUsersDocs = allUsersSnap.docs;
            const allUsersData = allUsersDocs.map(eachUserDoc => {
                const userSplitData = { };
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
                    const lKey = Math.floor(idx/10)*10+1;
                    const rKey = Math.floor(idx/10)*10+10;

                    if(bet.isBetDone) {
                        betsDone++;
                        pointsBet += parseInt(bet.selectedPoints);
                        
                        if(userSplitData[`${lKey}-${rKey}`])
                            userSplitData[`${lKey}-${rKey}`] += bet.selectedPoints;
                        else
                            userSplitData[`${lKey}-${rKey}`] = bet.selectedPoints;

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
                        bet.selectedTeamAbbr = bet.selectedTeam == bet.team1 ? bet.team1Abbreviation : bet.team2Abbreviation;
                    } else {
                        if(userSplitData[`${lKey}-${rKey}`])
                            userSplitData[`${lKey}-${rKey}`] += 0;
                        else
                            userSplitData[`${lKey}-${rKey}`] = 0;

                        if(parseInt(bet.selectedPoints) == 50) {
                            betsPenalized++;
                            pointsPenalized += parseInt(bet.selectedPoints);
                            currentPenalizStreak++;

                            // currPts.push(currPts[currPtsLen-1]-parseInt(bet.selectedPoints));
                            currPts.push({ match: idx+1, [username]: currPts[currPtsLen-1][username]-parseInt(bet.selectedPoints) });
                            currPtsLen++;
                        }
                    }

                    bet.betTime = moment.unix(bet.betTime.seconds).format("DD MMM, hh:mm A");
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
                mostBetsWon.push({ username, betsWon, winPercent: (round(betsWon/(betsWon+betsLost),4).toFixed(4)*100).toFixed(2) });
                mostBetsLost.push({ username, betsLost, lossPercent: (round(betsLost/(betsWon+betsLost),4)*100).toFixed(2) });
                mostBetsPenalized.push({ username, betsPenalized, penalizedPercent: round(betsPenalized/(betsWon+betsLost),2) || 0 });
                maxAvgBetsPoints.push({ username, avgBetPoints: round(pointsBet/betsDone, 2) || 0 });
                mostPointsWon.push({ username, pointsWon });
                mostPointsLost.push({ username, pointsLost });
                mostPointsPenalized.push({ username, pointsPenalized });
                longestWinningStreak.push({ username, longestWinStreak });
                longestLosingStreak.push({ username, longestLoseStreak });
                longestPenalizedStreak.push({ username, longestPenalizStreak });
                betPtsSplitDistribution.push({ ...userSplitData, username });

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

            const totalLosePoints = mostPointsLost.reduce((acc, val) => acc+val.pointsWon, 0);
            mostPointsLost.forEach(dist => dist["ptsPercent"] = ((dist["pointsLost"]/totalLosePoints)*100).toFixed(2));
            mostPointsLost = sortBy(mostPointsLost, ["pointsLost"]).reverse();

            mostPointsPenalized = sortBy(mostPointsPenalized, ["pointsPenalized"]).reverse();
            longestWinningStreak = sortBy(longestWinningStreak, ["longestWinStreak"]).reverse();
            longestLosingStreak = sortBy(longestLosingStreak, ["longestLoseStreak"]).reverse();
            longestPenalizedStreak = sortBy(longestPenalizedStreak, ["longestPenalizStreak"]).reverse();
            betPtsSplitDistribution = sortBy(betPtsSplitDistribution, ["username"]);
            
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
                mostBetsDone: { data: mostBetsDone, cols: Object.keys(mostBetsDone[0]), caption: "Most number of bets done. Penalized bets is not included in it." }, 
                mostBetsWon: { data: mostBetsWon, cols: Object.keys(mostBetsWon[0]), caption: "Most number of bets won." }, 
                mostBetsLost: { data: mostBetsLost, cols: Object.keys(mostBetsLost[0]), caption: "Most number of bets lost." },
                // mostBetsPenalized: { data: mostBetsPenalized, cols: Object.keys(mostBetsPenalized[0]), caption: "Most number of bets penalized." },
                maxAvgBetsPoints: { data: maxAvgBetsPoints, cols: Object.keys(maxAvgBetsPoints[0]), caption: "Most points bet per match. Penalized points is not included in it." },
                mostPointsWon: { data: mostPointsWon, cols: Object.keys(mostPointsWon[0]), caption: "Most points won over the season." },
                mostPointsLost: { data: mostPointsLost, cols: Object.keys(mostPointsLost[0]), caption: "Most points lost over the season." },
                // mostPointsPenalized: { data: mostPointsPenalized, cols: Object.keys(mostPointsPenalized[0]), caption: "Most points penalized over the season." },
                longestWinningStreak: { data: longestWinningStreak, cols: Object.keys(longestWinningStreak[0]), caption: "Most consecutive wins." },
                longestLosingStreak: { data: longestLosingStreak, cols: Object.keys(longestLosingStreak[0]), caption: "Most consecutive loses." },
                // longestPenalizedStreak: { data: longestPenalizedStreak, cols: Object.keys(longestPenalizedStreak[0]), caption: "Most consecutive penalties." },
                earliestBetsTime: { data: earliestBetsTime, cols: ["username", "time"], caption: "Earliest bets done over a day."},
                mostPointsBetInAMatch: { data: mostPointsBetInAMatch, cols: ["username", "betWon", mobileView ? "selectedTeamAbbr" : "selectedTeam", "selectedPoints", "betTime"], caption: "Max points bet in a match over the season." },
                betPtsDistribution: { data: betPtsDistribution, cols: ["username", "points", "ptsPercent"], caption: "Most points bet this season."},
                bettingOddsDistribution: { data: bettingOddsDistribution, cols: Object.keys(bettingOddsDistribution[0]), caption: "Betting trends based on odds" },
                longestReignInRankings: { data: rankMatchArray, cols: ["username", "1", "2", "3", "4", "5", "6", "avgRank"], caption: "Longest reign at a particular rank." },
                betPtsSplitDistribution: { data: betPtsSplitDistribution, cols: [...new Set(["username", ...Object.keys(betPtsSplitDistribution[0])])], caption: "Points bet in 10 match splits." },
            };

            return { globalStats, timeSeriesPts };
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
                    let betsDone = 0, betsWon = 0, betsLost = 0, betsInProgress = 0, totalPts = 0, wonPts = 0, 
                        lostPts = 0, inprogressPts = 0;
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
                            team: teamProps[team].abbr,
                            bets: betsDone,
                            betsWon,
                            betsLost,
                            // betsInProgress,
                            ptsBet: totalPts.toLocaleString("en-IN"),
                            ptsWon: wonPts.toLocaleString("en-IN"),
                            ptsLost: lostPts.toLocaleString("en-IN"),
                            // inprogressPts,
                        });
                    }
                });
            });

            result = orderBy(result, ["teamName"], ["asc"]);

            result.push({
                team: "Penalized",
                bets: betsPenalized,
                betsWon: 0,
                betsLost: betsPenalized,
                // betsInProgress: 0,
                ptsBet: penalizedPts.toLocaleString("en-IN"),
                ptsWon: 0,
                ptsLost: penalizedPts,
                // inprogressPts: 0,
            });

            return { data: result, cols: Object.keys(result[0]), caption: "Team wise pts distribution.", dangerCols: [3, 6] };
        }

        return { data: [], cols: [], caption: "Team wise pts distribution.", dangerCols: [] };
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
                                body: `Your bet for the match ${bet.team1} vs ${bet.team2} has been ended in NO Result!. You got ${bet.selectedPoints} POINTS.`,
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
                                body: `Your bet for the match ${bet.team1} vs ${bet.team2} has been ${bet.betWon ? "Won" : "Lost"}!. You ${bet.betWon ? "Won" : "Lost"} ${bet.selectedPoints} POINTS.`,
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
                console.log("Updating users:", { bets, finalPoints, username, t: admin.default.firestore.Timestamp.fromDate(new Date())})
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
            return window.innerWidth < 960 ? setMobileView(true) : setMobileView(false);
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
            clearNotifications,
            sendResetPasswordEmail,
            getTeamStatsData,
            getAllUsersData,
            updateSeenBets
        }}>
            {props.children}
        </ContextProvider.Provider>
    )
}

export default Context;
