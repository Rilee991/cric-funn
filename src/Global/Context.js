import React, { createContext, useState, useEffect } from 'react';
import { find, findIndex, flattenDeep, get, isEmpty, merge, orderBy, round, sortBy } from 'lodash';
import emailChecker from 'mailchecker';
import moment from 'moment';

import { auth } from '../config';
import { getBetEndTime, getDefaultMatchOdds, getFirebaseCurrentTime, getToppgerBgImage, getWinnerEtaParams, getWinningAmount } from './adhocUtils';
import { DEFAULT_USER_PARAMS } from '../configs/userConfigs';
import { getUserByKey, getUserByUsername, createUser, updateUserByEmail, updateUserByUsername, getUsers } from '../apis/userController';
import { getMatchById, getMatches, updateMatchById } from '../apis/matchController';
import { getMatchDetailsById } from '../apis/cricapiController';
import { DEFAULT_PENALTY_POINTS, DEFAULT_PENALTY_TEAM } from '../configs/matchConfigs';
import { getConfigurations, updateCredits } from '../apis/configurationsController';

const admin = require('firebase');
export const ContextProvider = createContext();

const Context = (props) => {
    const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
    const [matches, setMatches] = useState([]);
    const [configurations, setConfigurations] = useState({});
    const [loading, setLoading] = useState(true);
    const [mobileView, setMobileView] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [width, setWidth] = useState(window.screen.width);
    const [height, setHeight] = useState(window.screen.height);
    const [scrollY, setScrollY] = useState(window.scrollY);

    const signUp = async (user) => {
        const { username, email, password } = user;
        try {
            const isValidEmail = await emailChecker.isValid(email);

            if(!isValidEmail) throw new Error(`Email is invalid. Please don't try to be oversmart.`);

            const user = await getUserByUsername(username);

            if(user.exists) throw new Error("Username already exists");

            const resp = await auth.createUserWithEmailAndPassword(email, password);
            resp.user.updateProfile({ displayName: username });
            const points = DEFAULT_USER_PARAMS.STARTING_POINTS, image = DEFAULT_USER_PARAMS.PROFILE_PICTURE, bets = DEFAULT_USER_PARAMS.STARTING_BETS;

            await createUser(username, { username, email, password, image, points, bets, isDummyUser: true, 
                isAdmin: false, isChampion: false, dob: "", isRewardClaimed: false
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    const signIn = async (user) => {
        const { email, password } = user;
        try {
            await auth.signInWithEmailAndPassword(email, password);
            const records = await getUserByKey("email", email);
            const { username, image, points, bets = [], isAdmin = false, isChampion = false, isOut = false, dob, isRewardClaimed = true } = records.docs[0].data();

            setLoggedInUserDetails({ username, email, image, points, bets, isAdmin, isChampion, isOut, isRewardClaimed, dob });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    const sendResetPasswordEmail = async (user) => {
        const { email } = user;
        try {
            await auth.sendPasswordResetEmail(email);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    const resetPassword = async (resetInfo) => {
        const { password, actionCode } = resetInfo;
        try {
            const email = await auth.verifyPasswordResetCode(actionCode);
            await auth.confirmPasswordReset(actionCode, password);
            await updateUserByEmail(email, {
                password,
                updatedAt: getFirebaseCurrentTime()
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    const logout = async () => {
        try {
            await auth.signOut();
            setLoggedInUserDetails({});
            setNotifications([]);
            setMatches([]);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    const clearNotifications = () => {
        setNotifications([]);
    }

    const betOnMatch = async (betDetails) => {
        const { username, bets, points } = loggedInUserDetails;
        try {
            const newBets = [...bets, betDetails];
            const newPoints = points - betDetails.selectedPoints;

            await updateUserByUsername(username, {
                bets: admin.default.firestore.FieldValue.arrayUnion(betDetails),
                points: newPoints,
                updatedBy: `${username}_betOnMatch`,
                updatedAt: getFirebaseCurrentTime()
            });

            setLoggedInUserDetails({ ...loggedInUserDetails, bets: newBets, points: newPoints });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    const updateSeenBets = async (id, username) => {
        try {
            const doc = await getMatchById(id);

            if(doc.exists) {
                const data = doc.data();
                const value = get(data, `seenBy[${username}]`, []);
                value.push(getFirebaseCurrentTime());

                await doc.ref.update(`seenBy.${username}`, value);
            }
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    const viewBetsData = async (matchId) => {
        let result = [];
        const userDocs = await getUsers();

        userDocs.docs.map(user => {
            const userData = user.data();
            const { bets = [], username, isDummyUser = false } = userData;
            if(!isDummyUser) {
                const betData = find(bets, {"matchId": matchId}) || {};
                if(!isEmpty(betData)) {
                    result.push({
                        username,
                        betTime: betData.betTime,
                        betPoints: parseInt(betData.selectedPoints),
                        betTeam: betData.team1 == betData.selectedTeam ? betData.team1Abbreviation : (betData.team2 == betData.selectedTeam ? betData.team2Abbreviation : DEFAULT_PENALTY_TEAM),
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
        const userDocs = await getUsers();

        userDocs.docs.map(user => {
            const userData = user.data();
            let { bets = [], username, points, isDummyUser = false, isChampion = false, image, isOut = false } = userData;

            if(isDummyUser) return;
            
            let won = 0, lost = 0, inprogress = 0, totalBets = 0, fined = 0;

            bets.map(bet => {
                if(bet.isBetDone) {
                    if(bet.isSettled) {
                        if(bet.betWon)  won++;
                        else    lost++;
                    } else {
                        const match = find(matches, { id: bet.matchId });
                        if(match && moment() < getBetEndTime(match.dateTimeGMT)) {
                            points += parseInt(bet.selectedPoints);
                        }
                        inprogress++;
                    }
                    totalBets++;
                } else {
                    fined++;
                }
            });

            result.push({ player: username, bets: totalBets, won, lost, inprogress, fined, points,
                "w-l-i": `${won}-${lost}-${inprogress}`, isOut, isChampion, image, 
                subText: isChampion ? "Undisputed Universal Champion" : "#1 Contender", 
                bgImage: getToppgerBgImage(isChampion)
            });
        });

        result = orderBy(result, ["points", "won", "bets", "player"], ["desc", "desc", "asc", "asc"]);

        return { data: result, cols: ["player", "bets", "w-l-i", "points"], caption: "Penalised bets not included in bet count.", title: "Points Table" };
    }

    const getAllUsersData = async () => {
        try {
            let mostBetsDone = [], mostBetsWon = [], mostBetsLost = [], mostBetsPenalized = [], maxAvgBetsPoints = [],
                mostPointsWon = [], mostPointsLost = [], mostPointsPenalized = [], longestWinningStreak = [], longestLosingStreak = [],
                longestPenalizedStreak = [], earliestBetsTime = [], mostPointsBetInAMatch = [], betPtsDistribution = [], 
                timeSeriesPts = [], bettingOddsDistribution = [], betPtsSplitDistribution = [];

            const allUsersSnap = await getUserByKey("isDummyUser", false);
            const allUsersDocs = allUsersSnap.docs;

            const allUsersData = allUsersDocs.map(eachUserDoc => {
                const eachUserData = eachUserDoc.data();
                const userSplitData = { }, username = eachUserData.username, bets = eachUserData.bets, 
                    currPts = [{ match: 0, [username]: DEFAULT_USER_PARAMS.STARTING_POINTS }];
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
                        bet.team = bet.selectedTeam == bet.team1 ? bet.team1Abbreviation : bet.team2Abbreviation;
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

                const relevantBets = betsWon + betsLost;

                betPtsDistribution.push({ username, points: pointsBet });
                timeSeriesPts = merge(timeSeriesPts, currPts);

                bettingOddsDistribution.push({ username, betOnTeamsLikelyToWin, betOnTeamsLikelyToLose });
                longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
                longestLoseStreak = Math.max(longestLoseStreak, currentLoseStreak);
                longestPenalizStreak = Math.max(longestPenalizStreak, currentPenalizStreak);

                mostBetsDone.push({ username, betsDone });
                mostBetsWon.push({ username, betsWon, winPercent: (round(betsWon/(relevantBets || 1),4).toFixed(4)*100).toFixed(2) });
                mostBetsLost.push({ username, betsLost, lossPercent: (round(betsLost/(relevantBets || 1),4)*100).toFixed(2) });
                mostBetsPenalized.push({ username, betsPenalized, penalizedPercent: round(betsPenalized/(relevantBets || 1),2) || 0 });
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
            mostPointsWon.forEach(dist => dist["ptsPercent"] = ((dist["pointsWon"]/(totalWinPoints || 1))*100).toFixed(2));
            mostPointsWon = sortBy(mostPointsWon, ["pointsWon"]).reverse();

            const totalLosePoints = mostPointsLost.reduce((acc, val) => acc+val.pointsLost, 0);
            mostPointsLost.forEach(dist => dist["ptsPercent"] = ((dist["pointsLost"]/(totalLosePoints || 1))*100).toFixed(2));
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
                mostPointsBetInAMatch: { data: mostPointsBetInAMatch, cols: ["username", "betWon", mobileView ? "team" : "selectedTeam", "selectedPoints", "betTime"], caption: "Max points bet in a match over the season." },
                betPtsDistribution: { data: betPtsDistribution, cols: ["username", "points", "ptsPercent"], caption: "Most points bet this season."},
                bettingOddsDistribution: { data: bettingOddsDistribution, cols: Object.keys(bettingOddsDistribution[0]), caption: "Betting trends based on odds" },
                longestReignInRankings: { data: rankMatchArray, cols: ["username", "1", "2", "3", "4", "5", "6", "avgRank"], caption: "Longest reign at a particular rank." },
                betPtsSplitDistribution: { data: betPtsSplitDistribution, cols: [...new Set(["username", ...betPtsSplitDistribution.flatMap(Object.keys)])], caption: "Points bet in 10 match splits." },
            };

            console.log(globalStats.longestReignInRankings, "betPtsSplitDistribution:", globalStats.betPtsSplitDistribution);

            return { globalStats, timeSeriesPts };
        } catch (err) {
            console.log(err);
        }
    }

    const claimReward = async (amount) => {
        try {
            await updateUserByUsername(loggedInUserDetails.username, { points: loggedInUserDetails.points + amount, isRewardClaimed: true });
            setLoggedInUserDetails(prev => ({ ...prev, points: prev.points + amount, isRewardClaimed: true }));
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    const getTeamWiseStats = async () => {
        let penalizedPts = 0, betsPenalized = 0, result = [];
        const { bets = [] } = loggedInUserDetails;
        const teamAttributes = {};
        
        matches.forEach(match => {
            if(isEmpty(teamAttributes[match.team1])) {
                teamAttributes[match.team1] = {
                    abbr: match.team1Abbreviation
                }
            }

            if(isEmpty(teamAttributes[match.team2])) {
                teamAttributes[match.team2] = {
                    abbr: match.team2Abbreviation
                }
            }
        });

        teamAttributes[DEFAULT_PENALTY_TEAM] = { abbr: DEFAULT_PENALTY_TEAM };

        Object.keys(teamAttributes).forEach(team => {
            const qualifedBets = bets.filter(bet => bet.selectedTeam === team);
            let betsDone = 0, betsWon = 0, betsLost = 0, totalPts = 0, wonPts = 0, lostPts = 0;

            qualifedBets.forEach(bet => {
                if(bet.isBetDone) {
                    if(bet.isSettled) {
                        if(bet.betWon) {
                            betsWon++;
                            wonPts += getWinningAmount(bet.selectedPoints, bet.odds[bet.selectedTeam]);
                        } else {
                            betsLost++;
                            lostPts += parseInt(bet.selectedPoints);
                        }
                    }
                    betsDone++;
                    totalPts += parseInt(bet.selectedPoints);
                } else {
                    betsPenalized++;
                    penalizedPts += parseInt(bet.selectedPoints);
                }
            });

            if(team != DEFAULT_PENALTY_TEAM) {
                result.push({
                    team: teamAttributes[team].abbr,
                    bets: betsDone,
                    betsWon,
                    betsLost,
                    ptsBet: totalPts.toLocaleString("en-IN"),
                    ptsWon: wonPts.toLocaleString("en-IN"),
                    ptsLost: lostPts.toLocaleString("en-IN")
                });
            }
        });

        result = orderBy(result, ["team"], ["asc"]);

        result.push({
            team: DEFAULT_PENALTY_TEAM,
            bets: betsPenalized,
            betsWon: 0,
            betsLost: betsPenalized,
            ptsBet: penalizedPts.toLocaleString("en-IN"),
            ptsWon: 0,
            ptsLost: penalizedPts
        });

        return { data: result, cols: Object.keys(result[0]), caption: "Team wise pts distribution.", dangerCols: [3, 6] };
    }

    const resetUserDetails = async (username) => {
        try {
            await updateUserByUsername(username, {
                bets: DEFAULT_USER_PARAMS.STARTING_BETS, points: DEFAULT_USER_PARAMS.STARTING_POINTS, isOut: false,
                updatedBy: `resetUserDetails_${loggedInUserDetails.username}`, updatedAt: getFirebaseCurrentTime()
            });

            if(username == loggedInUserDetails?.username) {
                setLoggedInUserDetails({
                    ...loggedInUserDetails,
                    bets: DEFAULT_USER_PARAMS.STARTING_BETS,
                    points: DEFAULT_USER_PARAMS.STARTING_POINTS,
                    isOut: false,
                });
            }
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    const syncUserDetails = async (username) => {
        try {
            let userDetails = await getUserByUsername(username);
            userDetails = userDetails.data();

            let settledBets = 0, unsettledBets = 0;
            let { bets = [], points = 0 } = userDetails;

            for(const match of matches) {
                const betEndTime = getBetEndTime(match.dateTimeGMT);

                if(betEndTime < moment()) {
                    // Considerable Bet
                    const betIndex = findIndex(bets, { matchId: match.id });

                    if(betIndex == -1) {
                        // Missed
                        const updatedInfo = updateMissingBet(bets, points, match);
                        points = updatedInfo.points;
                        settledBets++;
                    } else {
                        // Result
                        const bet = bets[betIndex];

                        if(!bet.isSettled && match.matchWinner) {
                            const updatedInfo = updateUnsettledBet(bet, points, match);
                            points = updatedInfo.points;
                            settledBets++;
                        } else {
                            unsettledBets++;
                        }
                    }
                } else {
                    // Future bets - don't do anything
                    break;
                }
            }

            const isOut = unsettledBets == 0 && points == 0;

            if(settledBets) {
                await updateUserByUsername(username, {
                    bets,
                    points,
                    isOut,
                    updatedBy: `${loggedInUserDetails?.username}_syncUserDetails`,
                    updatedAt: getFirebaseCurrentTime()
                });
            }

            return { bets, points, isOut };
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    const updateMissingBet = (bets, points, match) => {
        const { id: matchId, team1, team2, team1Abbreviation, team2Abbreviation, odds = [] } = match;
        const selectedPoints = points < DEFAULT_PENALTY_POINTS ? points : DEFAULT_PENALTY_POINTS;
        points -= selectedPoints;

        bets.push({
            betTime: getFirebaseCurrentTime(),
            betWon: false,
            isBetDone: false,
            isNoResult: false,
            isSettled: true,
            matchId: matchId,
            selectedPoints,
            selectedTeam: DEFAULT_PENALTY_TEAM,
            team1: team1,
            team2: team2,
            odds: {
                [odds[0].name]: parseFloat(odds[0].price),
                [odds[1].name]: parseFloat(odds[1].price),
            },
            team1Abbreviation: team1Abbreviation,
            team2Abbreviation: team2Abbreviation
        });

        const notify = {
            body: `You did not bet for the match ${team1Abbreviation} vs ${team2Abbreviation}. You lost ${selectedPoints} POINTS.`,
            betWon: false,
            isNoResult: false,
            isBetDone: false
        };

        return { points, notify };
    }

    const updateUnsettledBet = (bet, points, match) => {
        let notify = {};
        if(match.matchWinner == "No Winner") {
            bet.betWon = true;
            bet.isNoResult = true;
            points += parseInt(bet.selectedPoints);
            notify = {
                body: `Your bet for the match ${bet.team1} vs ${bet.team2} has been ended in NO Result!. You got back ${bet.selectedPoints} POINTS.`,
                betWon: bet.betWon,
                isNoResult: bet.isNoResult,
                isBetDone: bet.isBetDone
            };
        } else {
            if(match.matchWinner == bet.selectedTeam) {
                points += getWinningAmount(bet.selectedPoints, bet.odds[bet.selectedTeam]);
                bet.betWon = true;
            } else {
                bet.betWon = false;
            }
            bet.isNoResult = false;
            notify = {
                body: `Your bet for the match ${bet.team1} vs ${bet.team2} has been ${bet.betWon ? "Won" : "Lost"}!. You ${bet.betWon ? "Won" : "Lost"} ${bet.betWon ? getWinningAmount(bet.selectedPoints, bet.odds[bet.selectedTeam]) : bet.selectedPoints} POINTS.`,
                betWon: bet.betWon,
                isNoResult: false
            };
        }

        bet.isSettled = true;

        return { points, notify };
    }

    const updateUserDetails = async (username, points, bets, matches) => {
        let settledBets = 0, unsettledBets = 0, notifications = [];

        for(const match of matches) {
            const betEndTime = getBetEndTime(match.dateTimeGMT);

            if(betEndTime < moment()) {
                // Considerable Bet
                const betIndex = findIndex(bets, { matchId: match.id });

                if(betIndex == -1) {
                    // Missed
                    const updatedInfo = updateMissingBet(bets, points, match);
                    points = updatedInfo.points;
                    notifications.push(updatedInfo.notify);
                    settledBets++;
                } else {
                    // Result
                    const bet = bets[betIndex];

                    if(!bet.isSettled) {
                        if(match.matchWinner) {
                            const updatedInfo = updateUnsettledBet(bet, points, match);
                            points = updatedInfo.points;
                            notifications.push(updatedInfo.notify);
                            settledBets++;
                        } else {
                            unsettledBets++;
                        }
                    }
                }
            } else {
                // Future bets - don't do anything
                break;
            }
        }

        const isOut = unsettledBets == 0 && points == 0;

        if(settledBets) {
            setNotifications(notifications);
            await updateUserByUsername(username, {
                bets,
                points,
                isOut,
                updatedBy: `${username}_updateUserInfo`,
                updatedAt: getFirebaseCurrentTime()
            });
        }

        return { latestPoints: points, latestBets: bets, latestIsOut: isOut };
    }

    const updateAndGetMatches = async (username) => {
        try {
            const dbMatches = await getMatches();
            const matchPromises = [], matches = [];

            for(let match of dbMatches.docs) {
                match = match.data();
                const winnerEtaParams = getWinnerEtaParams(match.matchType);
                
                if(isEmpty(match.odds)) {
                    match.odds = getDefaultMatchOdds(match.team1, match.team2);
                }

                if(isEmpty(match.matchWinner) && moment(match.dateTimeGMT).add(winnerEtaParams.value, winnerEtaParams.unit) <= moment()) {
                    const { matchDetails, configDocId, currentHits } = await getMatchDetailsById(match.id);
                    await updateCredits(configDocId, username, currentHits, configurations, setConfigurations);

                    if(!isEmpty(matchDetails?.matchWinner)) {
                        matchPromises.push(updateMatchById(match.id, {
                            matchWinner: matchDetails.matchWinner,
                            status: matchDetails.status,
                            matchStarted: matchDetails.matchStarted,
                            matchEnded: matchDetails.matchEnded,
                            updatedAt: getFirebaseCurrentTime()
                        }));

                        match.matchWinner = matchDetails.matchWinner;
                        match.status = matchDetails.status;
                        match.matchStarted = matchDetails.matchStarted;
                        match.matchEnded = matchDetails.matchEnded;
                    }
                }

                matches.push(match);
            };

            await Promise.all(matchPromises);

            return matches;
        } catch (e) {
            console.log(e);
        }
    }

    const checkMobileView = () => {
        const setResponsiveness = () => {
            setWidth(window.screen.width);
            setHeight(window.screen.height);
            setScrollY(window.scrollY);
            return window.innerWidth < 960 ? setMobileView(true) : setMobileView(false);
        }
      
        setResponsiveness();
      
        window.addEventListener("resize", () => setResponsiveness());
        window.addEventListener("scroll", () => setResponsiveness());
    }

    useEffect(async () => {
        checkMobileView();
        setLoading(true);
        auth.onAuthStateChanged(async user => {
            if(user) {
                const userSnap = await getUserByKey("email", user.email);
                const { username, email, image, points, bets, isAdmin = false, isChampion = false, isOut = false, dob,
                    isRewardClaimed = true
                } = userSnap.docs[0].data();
                const configs = await getConfigurations();
                setConfigurations(configs);
                console.log("setting configs 1: ", configs);
                const matches = await updateAndGetMatches(username);
                console.log("setting configs 2: ", configurations);
                const updatedDetails = await updateUserDetails(username, points, bets, matches);
                setMatches(matches);
                setLoggedInUserDetails({
                    username,
                    email,
                    image,
                    dob,
                    points: updatedDetails.latestPoints,
                    bets: updatedDetails.latestBets,
                    isAdmin,
                    isChampion,
                    isRewardClaimed,
                    isOut: updatedDetails.latestIsOut
                });
            } else {
                setLoggedInUserDetails({});
            }
            setLoading(false);
        });
    },[]);

    return (
        <ContextProvider.Provider
            value={{ loggedInUserDetails, loading, mobileView, notifications, matches, width, height, scrollY, configurations,

                signUp, signIn, sendResetPasswordEmail, resetPassword, logout, clearNotifications, betOnMatch, updateSeenBets,
                viewBetsData, getPointsTableData, resetUserDetails, syncUserDetails, getTeamWiseStats, getAllUsersData,
                claimReward, setConfigurations
            }}
        >
            {props.children}
        </ContextProvider.Provider>
    )
}

export default Context;
