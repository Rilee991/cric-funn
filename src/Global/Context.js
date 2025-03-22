import React, { createContext, useState, useEffect } from 'react';
import { find, findIndex, flattenDeep, get, isEmpty, merge, orderBy, round, sortBy } from 'lodash';
import emailChecker from 'mailchecker';
import moment from 'moment';

import { auth } from '../config';
import { getBetEndTime, getDefaultMatchOdds, getFirebaseCurrentTime, getToppgerBgImage, getWinnerEtaParams, getWinningAmount } from './adhocUtils';
import { DEFAULT_USER_PARAMS } from '../configs/userConfigs';
import { getUserByKey, getUserByUsername, createUser, updateUserByEmail, updateUserByUsername, getUsers, getCareerByUsername } from '../apis/userController';
import { getMatchById, getMatches, updateMatchById } from '../apis/matchController';
import { getMatchDetailsById } from '../apis/cricapiController';
import { DEFAULT_PENALTY_TEAM, getPenaltyPoints } from '../configs/matchConfigs';
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
                isAdmin: false, isChampion: false, dob: "", isRewardClaimed: false, showWishModal: false
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
            const { username, image, points, bets = [], isAdmin = false, isChampion = false, isOut = false, dob, isRewardClaimed = true, showWishModal = false, isDummyUser = false } = records.docs[0].data();

            setLoggedInUserDetails({ username, email, image, points, bets, isAdmin, isChampion, isOut, isRewardClaimed, dob, showWishModal, isDummyUser });
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
        let maxTillNow = 0;
        const userDocs = await getUsers();

        userDocs.docs.forEach(user => {
            const userData = user.data();
            const { bets = [], username, isDummyUser = false } = userData;
            if(!isDummyUser) {
                const betData = find(bets, {"matchId": matchId}) || {};
                bets.forEach(bet => {
                    if(bet.selectedPoints > maxTillNow) {
                        maxTillNow = bet.selectedPoints;
                    }
                });

                if(!isEmpty(betData)) {
                    result.push({
                        username,
                        betTime: betData.betTime,
                        betPoints: parseInt(betData.selectedPoints),
                        betTeam: betData.team1 == betData.selectedTeam ? betData.team1Abbreviation : (betData.team2 == betData.selectedTeam ? betData.team2Abbreviation : DEFAULT_PENALTY_TEAM),
                        teamName: betData.selectedTeam,
                        isAllIn: betData?.isAllIn || false
                    });
                }
            }
        });

        result = sortBy(result, ["betPoints"]);
        result.forEach((userBet) => {
            if(parseInt(userBet.betPoints) === parseInt(maxTillNow)) {
                userBet["isHighest"] = true;
            } else {
                userBet["isHighest"] = false;
            }
        });

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

    const getCareerData = async (username) => {
        const userDocs = await getCareerByUsername(username);
        const yearWiseDataObj = userDocs.data();
        const result = [];
        const totalObj = { season: "Total", played: 0, win: 0, loss: 0, miss: 0, maxPoints: 0, avgBetPoints: 0,
            maxWinStreak: 0, maxLoseStreak: 0, maxPointsBetInAMatch: 0, leastPointsBetInAMatch: 0
        };

        Object.keys(yearWiseDataObj).forEach(year => {
            const data = yearWiseDataObj[year];

            result.push({
                season: year,
                played: data.play,
                "w-l-m": `${data.win}-${data.loss}-${data.miss}`,
                winPercent: round((data.win * 100)/(data.play || 1), 2),
                lossPercent: round((data.loss * 100)/(data.play || 1), 2),
                maxPoints: data.maxPoints,
                avgBetPoints: data.avgBetPoints,
                maxWinStreak: data.maxWinStreak,
                maxLoseStreak: data.maxLoseStreak,
                maxPointsBetInAMatch: data.maxPointsBetInAMatch,
                leastPointsBetInAMatch: data.leastPointsBetInAMatch,
                betTimeAnalysis: data.betTimeAnalysis
            });

            totalObj.played += data.play;
            totalObj.win += data.win;
            totalObj.loss += data.loss;
            totalObj.miss += data.miss;
            totalObj.maxPoints = Math.max(totalObj.maxPoints, data.maxPoints);
            totalObj.avgBetPoints += data.avgBetPoints * data.play;
            totalObj.maxWinStreak = Math.max(totalObj.maxWinStreak, data.maxWinStreak);
            totalObj.maxLoseStreak = Math.max(totalObj.maxLoseStreak, data.maxLoseStreak);
            totalObj.maxPointsBetInAMatch = Math.max(totalObj.maxPointsBetInAMatch, data.maxPointsBetInAMatch);
            totalObj.leastPointsBetInAMatch = Math.max(totalObj.leastPointsBetInAMatch, data.leastPointsBetInAMatch);
        });

        totalObj["winPercent"] = round((totalObj["win"] * 100)/(totalObj["played"] || 1), 2);
        totalObj["lossPercent"] = round((totalObj["loss"] * 100)/(totalObj["played"] || 1), 2);
        totalObj["avgBetPoints"] = round(totalObj["avgBetPoints"]/totalObj["played"], 2);
        totalObj["w-l-m"] = `${totalObj.win}-${totalObj.loss}-${totalObj.miss}`;

        result.push(totalObj);

        return { data: result, cols: ["season", "played", "w-l-m", "winPercent", "lossPercent", "maxPoints", 
            "avgBetPoints", "maxWinStreak", "maxLoseStreak"], 
            caption: "Muft ka chandan ghis mere nandan", title: "Year on Year Comparision" 
        };
    }

    const getAllUsersData = async () => {
        try {
            let mostBetsDone = [], mostBetsWon = [], mostBetsLost = [], mostImpactfulPlayer = [], mostBetsPenalized = [], maxAvgBetsPoints = [],
                mostPointsWon = [], mostPointsLost = [], mostPointsPenalized = [], longestWinningStreak = [], longestLosingStreak = [],
                longestPenalizedStreak = [], earliestBetsTime = [], mostPointsBetInAMatch = [], leastPointsBetInAMatch = [], betPtsDistribution = [], 
                timeSeriesPts = [], bettingOddsDistribution = [], betPtsSplitDistribution = [], winsSplitDistribution = [], betTimeAnalysis = [],
                extremeBets = [];
            let maxBreachedPts = 0;
            const landmarkColsMapping = {
                "5000": [3750, 4000, 4200, 4500, 4800, 4900],
                "8000": [4000, 4500, 5000, 6500, 7000, 7500],
                "10000": [4000, 5000, 6500, 7500, 8500, 9500],
                "20000": [5000, 8000, 10000, 13000, 15000, 19000],
                "30000": [5000, 10000, 15000, 18000, 25000, 29000],
                "50000": [10000, 15000, 20000, 30000, 40000, 48000],
                "100000": [10000, 20000, 30000, 50000, 70000, 90000],
                "150000": [20000, 50000, 70000, 100000, 130000, 145000],
                // "200000": [3750, 4000, 4200, 4500, 4800, 5000],
                // "350000": [3750, 4000, 4200, 4500, 4800, 5000],
                // "500000": [3750, 4000, 4200, 4500, 4800, 5000],
                // "800000": [3750, 4000, 4200, 4500, 4800, 5000],
                // "1000000": [3750, 4000, 4200, 4500, 4800, 5000],
                // "1500000": [3750, 4000, 4200, 4500, 4800, 5000],
            };

            const allUsersSnap = await getUserByKey("isDummyUser", false);
            const allUsersDocs = allUsersSnap.docs;
            const matchesByUserBet = {};

            const allUsersData = allUsersDocs.map(eachUserDoc => {
                const eachUserData = eachUserDoc.data();
                const userSplitData = {}, winSplitData = {}, username = eachUserData.username, bets = eachUserData.bets, 
                    currPts = [{ match: 0, [username]: DEFAULT_USER_PARAMS.STARTING_POINTS }],
                    betTimeAnalysisObj = { "4pmTo7pm": 0, "7_30pmTo10_30pm": 0, "10_30pmTo5am": 0, "5amTo4pm": 0 };
                let currPtsLen = 1;

                let betsDone = 0, betsWon = 0, betsLost = 0, betsPenalized = 0, pointsBet = 0, pointsWon = 0, pointsLost = 0,
                    pointsPenalized = 0, longestWinStreak = 0, currentWinStreak = 0, longestLoseStreak = 0, currentLoseStreak = 0,
                    longestPenalizStreak = 0, currentPenalizStreak = 0, betOnTeamsLikelyToWin = 0, betOnTeamsLikelyToLose = 0,
                    pointsFluctuations = 0, pointsArr = [], 
                    extremeBetsObj = { maxBet: Number.MIN_VALUE, minBet: Number.MAX_VALUE, maxBetTeam: "", minBetTeam: ""};

                bets.forEach((bet, idx) => {
                    const betTime = moment.unix(bet.betTime.seconds);
                    const startOfDay = moment(betTime).startOf('day');
                    const diff = betTime.diff(startOfDay).valueOf();
                    bet.selectedPoints = parseInt(bet.selectedPoints);
                    const lKey = Math.floor(idx/10)*10+1;
                    const rKey = Math.floor(idx/10)*10+10;

                    if(bet.isBetDone) {
                        const betTime = new Date(bet.betTime * 1000);
                        const hour = betTime.getHours();
                        const mins = betTime.getMinutes();
                        if(hour >= 19 && mins >= 30 && hour <= 22 && mins < 30)
                            betTimeAnalysisObj["7_30pmTo10_30pm"]++;
                        else if(hour >= 16 && hour <= 18 && mins <= 59 )
                            betTimeAnalysisObj["4pmTo7pm"]++;
                        else if(hour >= 5 && hour < 16 && mins <= 59)
                            betTimeAnalysisObj["5amTo4pm"]++;
                        else
                            betTimeAnalysisObj["10_30pmTo5am"]++;
                        betsDone++;
                        pointsBet += parseInt(bet.selectedPoints);
                        
                        if(userSplitData[`${lKey}-${rKey}`]) {
                            userSplitData[`${lKey}-${rKey}`] += bet.selectedPoints;
                        } else {
                            userSplitData[`${lKey}-${rKey}`] = bet.selectedPoints;
                        }

                        if(winSplitData[`${lKey}-${rKey}`]) {
                            winSplitData[`${lKey}-${rKey}`] += bet.betWon ? 1 : 0;
                        } else {
                            winSplitData[`${lKey}-${rKey}`] = bet.betWon ? 1 : 0;
                        }

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

                        bet.team = bet.selectedTeam == bet.team1 ? bet.team1Abbreviation : bet.team2Abbreviation;

                        if(bet.isSettled) {
                            if(!matchesByUserBet[bet.matchId]) {
                                matchesByUserBet[bet.matchId] = { [username]: { win: bet.betWon }  };
                            } else {
                                matchesByUserBet[bet.matchId] = { ...matchesByUserBet[bet.matchId], [username]: { win: bet.betWon }  };
                            }

                            if(bet.betWon) {
                                betsWon++;
                                const pts = Math.ceil(parseInt(bet.selectedPoints)*bet.odds[bet.selectedTeam]);
                                pointsWon += pts;
                                currentWinStreak++;
                                pointsArr.push(pts);

                                longestLoseStreak = Math.max(longestLoseStreak, currentLoseStreak);
                                currentLoseStreak = 0;
                                pointsFluctuations += pts;

                                currPts.push({ match: idx+1, [username]: currPts[currPtsLen-1][username]+pts });
                            } else {
                                betsLost++;
                                pointsLost += parseInt(bet.selectedPoints);
                                currentLoseStreak++;
                                pointsFluctuations -= parseInt(bet.selectedPoints);
                                pointsArr.push(parseInt(bet.selectedPoints));

                                longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
                                currentWinStreak = 0;

                                currPts.push({ match: idx+1, [username]: currPts[currPtsLen-1][username]-parseInt(bet.selectedPoints) });
                            }

                            if(extremeBetsObj.maxBet <= bet.selectedPoints) {
                                extremeBetsObj.maxBet = bet.selectedPoints;
                                extremeBetsObj.maxBetTeam = bet.team;
                            }

                            if(extremeBetsObj.minBet >= bet.selectedPoints) {
                                extremeBetsObj.minBet = bet.selectedPoints;
                                extremeBetsObj.minBetTeam = bet.team;
                            }
                            currPtsLen++;
                        }
                    } else {
                        if(userSplitData[`${lKey}-${rKey}`])
                            userSplitData[`${lKey}-${rKey}`] += 0;
                        else
                            userSplitData[`${lKey}-${rKey}`] = 0;
                        
                        if(winSplitData[`${lKey}-${rKey}`])
                            winSplitData[`${lKey}-${rKey}`] += 0;
                        else
                            winSplitData[`${lKey}-${rKey}`] = 0;

                        if(parseInt(bet.selectedPoints) == 50) {
                            betsPenalized++;
                            pointsPenalized += parseInt(bet.selectedPoints);
                            currentPenalizStreak++;
                            pointsFluctuations -= parseInt(bet.selectedPoints);
                            pointsArr.push(parseInt(bet.selectedPoints));

                            // currPts.push(currPts[currPtsLen-1]-parseInt(bet.selectedPoints));
                            currPts.push({ match: idx+1, [username]: currPts[currPtsLen-1][username]-parseInt(bet.selectedPoints) });
                            currPtsLen++;
                        }
                    }

                    maxBreachedPts = Math.max(maxBreachedPts, currPts[currPtsLen-1][username]);
                    bet.rawBetTime = bet.betTime.seconds;
                    bet.betTime = moment.unix(bet.betTime.seconds).format("DD MMM, hh:mm A");
                    bet.username = username;
                    bet.diff = diff;
                    bet.betWon = bet.betWon ? "Yes" : "No";
                });


                extremeBets.push({
                    username,
                    minBet: extremeBetsObj.minBet,
                    minBetTeam: extremeBetsObj.minBetTeam,
                    maxBet: extremeBetsObj.maxBet,
                    maxBetTeam: extremeBetsObj.maxBetTeam
                });

                const relevantBets = betsWon + betsLost;
                const totalBets = relevantBets + betsPenalized;
                const avgPtsFluctuations = round(pointsFluctuations/totalBets, 2) || 0;
                const sqDiff = pointsArr.map((elem) => Math.pow(elem - avgPtsFluctuations, 2));
                const avgSqDiff = (sqDiff.reduce((sum, elem) => sum + elem, 0))/(totalBets || 1);
                const impactScore = parseFloat(Math.sqrt(avgSqDiff).toFixed(2));

                betPtsDistribution.push({ username, points: pointsBet });
                timeSeriesPts = merge(timeSeriesPts, currPts);

                bettingOddsDistribution.push({ username, betOnTeamsLikelyToWin, betOnTeamsLikelyToLose });
                longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
                longestLoseStreak = Math.max(longestLoseStreak, currentLoseStreak);
                longestPenalizStreak = Math.max(longestPenalizStreak, currentPenalizStreak);

                mostBetsDone.push({ username, betsDone });
                mostBetsWon.push({ username, betsWon, winPercent: (round(betsWon/(relevantBets || 1),4).toFixed(4)*100).toFixed(2) });
                mostBetsLost.push({ username, betsLost, lossPercent: (round(betsLost/(relevantBets || 1),4)*100).toFixed(2) });
                mostBetsPenalized.push({ username, betsPenalized, penalizedPercent: (round(betsPenalized/(relevantBets || 1),4)*100).toFixed(2) });
                maxAvgBetsPoints.push({ username, avgBetPoints: round(pointsBet/betsDone, 2) || 0 });
                mostPointsWon.push({ username, pointsWon });
                mostImpactfulPlayer.push({ username, impactScore });
                mostPointsLost.push({ username, pointsLost });
                mostPointsPenalized.push({ username, pointsPenalized });
                longestWinningStreak.push({ username, longestWinStreak });
                longestLosingStreak.push({ username, longestLoseStreak });
                longestPenalizedStreak.push({ username, longestPenalizStreak });
                betPtsSplitDistribution.push({ ...userSplitData, username });
                winsSplitDistribution.push({ ...winSplitData, username });
                betTimeAnalysis.push({ username, ...betTimeAnalysisObj });

                return bets;
            });

            const rankDays = {}, avgRankParams = {}, userLandmarkObj = {};
            const landmarkCols = [5000, 8000, 10000, 15000, 25000, 40000, 50000, 70000, 100000, 150000, 200000];
            // const landmarkCols = [5000, 8000, 10000, 15000, 25000, 40000, 50000, 70000, 100000, 150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000, 1294492];
            // Object.keys(landmarkColsMapping).forEach(key => {
            //     if(parseInt(key) <= maxBreachedPts) {
            //         landmarkCols = landmarkColsMapping[key];
            //     }
            // });

            timeSeriesPts.forEach((matchPoint, mIdx) => {
                if(mIdx == 0) return;
                const matchNum = matchPoint["match"];
                delete matchPoint["match"];

                const usersList = Object.keys(Object.fromEntries(Object.entries(matchPoint).sort((a,b) => b[1] - a[1])));

                usersList.forEach((username, idx) => {
                    if(userLandmarkObj[username]) {
                        landmarkCols.forEach(col => {
                            if(userLandmarkObj[username][col] === "-" && matchPoint[username] > col) {
                                userLandmarkObj[username][col] = matchNum;
                            }
                        });
                    } else {
                        userLandmarkObj[username] = {};
                        landmarkCols.forEach(col => userLandmarkObj[username] = {...userLandmarkObj[username], [col]: "-"});
                        landmarkCols.forEach(col => {
                            if(userLandmarkObj[username][col] === "-" && matchPoint[username] > col) {
                                userLandmarkObj[username][col] = matchNum;
                            }
                        });
                    }

                    if(rankDays[username]) {
                        if(rankDays[username][idx+1]) {
                            rankDays[username] = { ...rankDays[username], [idx+1]: rankDays[username][idx+1] + 1 };
                        } else {
                            rankDays[username] = { ...rankDays[username], [idx+1]: 1 };
                        }
                        avgRankParams[username]["totalRank"] = avgRankParams[username].totalRank+idx+1;
                        avgRankParams[username]["totalMatches"] = avgRankParams[username].totalMatches+1;
                    } else {
                        rankDays[username] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7:0, [idx+1]: 1 };
                        avgRankParams[username] = { totalRank: idx+1, totalMatches: 1 };
                        // rankDays[username] = { ...rankDays[username],  };
                    }
                });

                matchPoint["match"] = matchNum;
            });

            const betDiversity = {};
            
            Object.keys(matchesByUserBet).forEach(matchId => {
                let wins = 0, loss = 0;

                Object.keys(matchesByUserBet[matchId]).forEach(username => {
                    if(!betDiversity[username]) {
                        betDiversity[username] = {
                            "majorityBets": 0,
                            "majorityBetWins": 0,
                            "minorityBets": 0,
                            "minorityBetWins": 0
                        };
                    }
                    if(matchesByUserBet[matchId][username]["win"])  wins++;
                    else loss++;
                });

                Object.keys(matchesByUserBet[matchId]).forEach(username => {
                    if(wins >= loss) {
                        if(matchesByUserBet[matchId][username]["win"]) {
                            betDiversity[username]["majorityBets"]++;
                            betDiversity[username]["majorityBetWins"]++;
                        } else {
                            betDiversity[username]["minorityBets"]++;
                        }
                    } else {
                        if(matchesByUserBet[matchId][username]["win"]) {
                            betDiversity[username]["minorityBets"]++;
                            betDiversity[username]["minorityBetWins"]++;
                        } else {
                            betDiversity[username]["majorityBets"]++;
                        }
                    }
                })
            });

            let rankMatchArray = [], userLandmarks = [], betsDiversity = [];

            Object.keys(betDiversity).forEach(user => {
                const majorityBetWinsPercent = ((betDiversity[user]["majorityBetWins"]/betDiversity[user]["majorityBets"] || 1).toFixed(4)*100).toFixed(2);
                const minorityBetWinsPercent = ((betDiversity[user]["minorityBetWins"]/betDiversity[user]["minorityBets"] || 1).toFixed(4)*100).toFixed(2);
                betsDiversity.push({ username: user, majorityBetWinsPercent, minorityBetWinsPercent,  ...betDiversity[user] });
            });

            Object.keys(rankDays).forEach(user => {
                const avgRank = parseFloat(avgRankParams[user]["totalRank"]/(avgRankParams[user]["totalMatches"] || 1)).toFixed(2);
                rankMatchArray.push({ username: user, ...rankDays[user], avgRank });
            });

            Object.keys(userLandmarkObj).forEach(user => {
                userLandmarks.push({ username: user, ...userLandmarkObj[user] });
            });

            mostBetsDone = sortBy(mostBetsDone, ["betsDone"]).reverse();
            mostBetsWon = sortBy(mostBetsWon, ["betsWon"]).reverse();
            mostBetsLost = sortBy(mostBetsLost, ["betsLost"]).reverse();
            mostBetsPenalized = sortBy(mostBetsPenalized, ["betsPenalized"]).reverse();
            maxAvgBetsPoints = sortBy(maxAvgBetsPoints, ["avgBetPoints"]).reverse();
            rankMatchArray = sortBy(rankMatchArray, ["1", "2", "3", "4", "5", "6", "7", "username"]).reverse();

            const totalWinPoints = mostPointsWon.reduce((acc, val) => acc+val.pointsWon, 0);
            mostPointsWon.forEach(dist => dist["ptsPercent"] = ((dist["pointsWon"]/(totalWinPoints || 1))*100).toFixed(2));
            mostPointsWon = sortBy(mostPointsWon, ["pointsWon"]).reverse();

            const totalLosePoints = mostPointsLost.reduce((acc, val) => acc+val.pointsLost, 0);
            mostPointsLost.forEach(dist => dist["ptsPercent"] = ((dist["pointsLost"]/(totalLosePoints || 1))*100).toFixed(2));
            mostPointsLost = sortBy(mostPointsLost, ["pointsLost"]).reverse();

            mostPointsPenalized = sortBy(mostPointsPenalized, ["pointsPenalized"]).reverse();
            longestWinningStreak = sortBy(longestWinningStreak, ["longestWinStreak"]).reverse();
            longestLosingStreak = sortBy(longestLosingStreak, ["longestLoseStreak"]).reverse();
            mostImpactfulPlayer = sortBy(mostImpactfulPlayer, ["impactScore"]).reverse();
            longestPenalizedStreak = sortBy(longestPenalizedStreak, ["longestPenalizStreak"]).reverse();
            betPtsSplitDistribution = sortBy(betPtsSplitDistribution, ["username"]);
            winsSplitDistribution = sortBy(winsSplitDistribution, ["username"]);
            
            const totalBetPoints = betPtsDistribution.reduce((acc, val) => acc+val.points, 0);
            betPtsDistribution.forEach(dist => dist["ptsPercent"] = ((dist["points"]/totalBetPoints)*100).toFixed(2));
            betPtsDistribution = sortBy(betPtsDistribution, ["points"]).reverse();
            const allBetsData = flattenDeep(allUsersData);
            const betsWithoutPenalty = allBetsData.filter(bet => bet.isBetDone === true && bet.isSettled === true);
            earliestBetsTime = sortBy(betsWithoutPenalty, ["diff"]).slice(0,5).map(eachBet => ({...eachBet, time: moment().startOf('day').add(eachBet.diff/1000,"seconds").format("hh:mm: A")}));
            mostPointsBetInAMatch = orderBy(betsWithoutPenalty, ["selectedPoints", "rawBetTime"], ["desc", "desc"]).slice(0,6);
            leastPointsBetInAMatch = orderBy(betsWithoutPenalty, ["selectedPoints", "rawBetTime"], ["asc", "desc"]).slice(0,6);

            bettingOddsDistribution = sortBy(bettingOddsDistribution, ["betOnTeamsLikelyToWin"]).reverse();

            const globalStats = { 
                mostBetsDone: { data: mostBetsDone, cols: Object.keys(mostBetsDone[0]), caption: "Most number of bets done. Penalized bets is not included." }, 
                mostBetsWon: { data: mostBetsWon, cols: Object.keys(mostBetsWon[0]), caption: "Most number of bets won." }, 
                mostBetsLost: { data: mostBetsLost, cols: Object.keys(mostBetsLost[0]), caption: "Most number of bets lost." },
                mostBetsPenalized: { data: mostBetsPenalized, cols: Object.keys(mostBetsPenalized[0]), caption: "Most number of bets penalized." },
                maxAvgBetsPoints: { data: maxAvgBetsPoints, cols: Object.keys(maxAvgBetsPoints[0]), caption: "Most points bet per match. Penalized points is not included." },
                extremeBets: { data: extremeBets, cols: Object.keys(extremeBets[0]), caption: "Highest and lowest bets done over the season." },
                leastPointsBetInAMatch: { data: leastPointsBetInAMatch, cols: ["username", "betWon", mobileView ? "team" : "selectedTeam", "selectedPoints", "betTime"], caption: "Min points bet in a match over the season." },
                mostPointsBetInAMatch: { data: mostPointsBetInAMatch, cols: ["username", "betWon", mobileView ? "team" : "selectedTeam", "selectedPoints", "betTime"], caption: "Max points bet in a match over the season." },
                betPtsDistribution: { data: betPtsDistribution, cols: ["username", "points", "ptsPercent"], caption: "Most points bet this season."},
                mostPointsWon: { data: mostPointsWon, cols: Object.keys(mostPointsWon[0]), caption: "Most points won over the season." },
                mostPointsLost: { data: mostPointsLost, cols: Object.keys(mostPointsLost[0]), caption: "Most points lost over the season." },
                earliestBetsTime: { data: earliestBetsTime, cols: ["username", "time"], caption: "Earliest bets done over a day."},
                betTimeAnalysis: { data: betTimeAnalysis, cols: ["username", "7_30pmTo10_30pm", "10_30pmTo5am", "5amTo4pm", "4pmTo7pm"], caption: "Betting done across time period."},
                betsDiversity: { data: betsDiversity, cols: ["username", "majorityBets", "majorityBetWins", "majorityBetWinsPercent", , "minorityBets", "minorityBetWins", "minorityBetWinsPercent"], caption: "A majority bet is a bet where atleast 50% people selected the same team." },
                
                longestWinningStreak: { data: longestWinningStreak, cols: Object.keys(longestWinningStreak[0]), caption: "Most consecutive wins." },
                longestLosingStreak: { data: longestLosingStreak, cols: Object.keys(longestLosingStreak[0]), caption: "Most consecutive loses." },
                
                // mostPointsPenalized: { data: mostPointsPenalized, cols: Object.keys(mostPointsPenalized[0]), caption: "Most points penalized over the season." },
                mostImpactfulPlayer: { data: mostImpactfulPlayer, cols: Object.keys(mostImpactfulPlayer[0]), caption: "Impact score over the season." },
                // longestPenalizedStreak: { data: longestPenalizedStreak, cols: Object.keys(longestPenalizedStreak[0]), caption: "Most consecutive penalties." },
                bettingOddsDistribution: { data: bettingOddsDistribution, cols: Object.keys(bettingOddsDistribution[0]), caption: "Betting trends based on odds" },
                longestReignInRankings: { data: rankMatchArray, cols: ["username", "1", "2", "3", "4", "5", "6", "7", "avgRank"], caption: "Longest reign at a particular rank." },
                betPtsSplitDistribution: { data: betPtsSplitDistribution, cols: [...new Set(["username", ...betPtsSplitDistribution.flatMap(Object.keys)])], hyphendCols: [1,2,3,4,5,6,7,8], caption: "Points bet in 10 match splits." },
                winsSplitDistribution: { data: winsSplitDistribution, cols: [...new Set(["username", ...winsSplitDistribution.flatMap(Object.keys)])], hyphendCols: [1,2,3,4,5,6,7,8], caption: "Wins in 10 match splits." },
                matchesTakenToReach: { data: userLandmarks, cols: ["username", ...landmarkCols], caption: "Matches taken by users to reach particular scores."},
            };

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

    const wishModalSeen = async () => {
        try {
            await updateUserByUsername(loggedInUserDetails.username, { showWishModal: false });
            setLoggedInUserDetails(prev => ({ ...prev, showWishModal: false }));
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
            if(match.team1 === "Royal Challengers Bangalore")
                match.team1 = "Royal Challengers Bengaluru";

            if(match.team2 === "Royal Challengers Bangalore")
                match.team2 = "Royal Challengers Bengaluru";

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
            let { bets = [], points = 0, isOut: currIsOut } = userDetails;

            for(const match of matches) {
                const betEndTime = getBetEndTime(match.dateTimeGMT);

                if(betEndTime < moment()) {
                    // Considerable Bet
                    const betIndex = findIndex(bets, { matchId: match.id });

                    if(betIndex == -1) {
                        // Missed
                        const updatedInfo = updateMissingBet(bets, points, match, currIsOut);
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

            const isOut = currIsOut || (unsettledBets == 0 && points == 0);

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

    const updateMissingBet = (bets, points, match, isOut) => {
        const { id: matchId, team1, team2, team1Abbreviation, team2Abbreviation, odds = [] } = match;
        const selectedPoints = isOut === true ? 0 : getPenaltyPoints(points);
        points -= selectedPoints;

        bets.push({
            betTime: getFirebaseCurrentTime(),
            betWon: false,
            isBetDone: false,
            isNoResult: false,
            isSettled: true,
            hasMissed: true,
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

    const updateUserDetails = async (username, points, bets, matches, currIsOut) => {
        let settledBets = 0, unsettledBets = 0, notifications = [];

        for(const match of matches) {
            const betEndTime = getBetEndTime(match.dateTimeGMT);

            if(betEndTime < moment()) {
                // Considerable Bet
                const betIndex = findIndex(bets, { matchId: match.id });

                if(betIndex == -1) {
                    // Missed
                    const updatedInfo = updateMissingBet(bets, points, match, currIsOut);
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

        const isOut = currIsOut || (unsettledBets == 0 && points <= 0);

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
            const configObj = {};
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
                    configObj[configDocId] = currentHits;
                    // await updateCredits(configDocId, username, currentHits, configurations, setConfigurations);

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

            return { matches, configObj };
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
                    isRewardClaimed = true, showWishModal = false, isDummyUser = false
                } = userSnap.docs[0].data();
                const configs = await getConfigurations();
                setConfigurations(configs);
                const { matches, configObj } = await updateAndGetMatches();
                if(!isEmpty(configObj)) {
                    Object.keys(configObj).map(docId => {
                        updateCredits(docId, username, configObj[docId], configs, setConfigurations)
                        .then(() => console.log("Updation done")).catch(err => console.log(err));
                    });
                }
                const updatedDetails = await updateUserDetails(username, points, bets, matches, isOut);
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
                    isOut: updatedDetails.latestIsOut,
                    showWishModal,
                    isDummyUser
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
                claimReward, setConfigurations, wishModalSeen, getCareerData
            }}
        >
            {props.children}
        </ContextProvider.Provider>
    )
}

export default Context;
