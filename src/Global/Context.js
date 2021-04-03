import { find, isEmpty, orderBy, sortBy } from 'lodash';
import React, { createContext, useState, useEffect } from 'react';

import { auth, db, storage, iplMatches } from '../config';
import { getMatchDetailsForId } from '../components/apis';
import moment from 'moment';
const admin = require('firebase');

export const ContextProvider = createContext();

const Context = (props) => {
    const DEFAULT_PROFILE_IMAGE = "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/defaultImages%2Fdefault.png?alt=media&token=9ccd045b-3ece-4d06-babf-04c267c38d40";
    const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const signUp = async (user) => {
        setLoading(true);
        const { username, email, password } = user;
        try {
            const resp = await auth.createUserWithEmailAndPassword(email, password);
            resp.user.updateProfile({displayName: username});
            const points = 1000, image = DEFAULT_PROFILE_IMAGE, bets = [];
            db.collection("users").doc(username).set({
                username,
                email,
                password,
                image,
                points,
                bets
            });

            setErrorMessage('');
            setLoading(false);
        } catch (error) {
            console.log(error);
            setErrorMessage(error.message);
            setLoading(false);
        }
    }

    const signIn = async (user) => {
        setLoading(true);
        const { email, password } = user;
        try {
            const resp = await auth.signInWithEmailAndPassword(email, password);
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

    const logout = async () => {
        setLoading(true);
        try {
            const resp = await auth.signOut()
            .then(() => {
                setLoggedInUserDetails({});
                setErrorMessage('');
            })
            .catch(error => {
                console.log(error);
                setErrorMessage(error.message);
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
            setErrorMessage(error.message);
            setLoading(false);
        }
    }

    const betOnMatch = (betDetails) => {
        const { username, bets, points } = loggedInUserDetails;
        const newBets = [...bets, betDetails];
        const newPoints = points - betDetails.selectedPoints;
        db.collection("users").doc(username).update({
            bets : newBets,
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
            const { bets = [], username } = userData;
            const betData = find(bets, {"unique_id": id}) || {};
            if(!isEmpty(betData)) {
                result.push({
                    username,
                    betTime: betData.betTime,
                    betPoints: parseInt(betData.selectedPoints),
                    betTeam: betData.selectedTeam
                });
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
            let won = 0, lost = 0, inprogress = 0;
            bets.map(bet => {
                if(bet.isSettled) {
                    if(bet.betWon)  won++;
                    else    lost++;
                } else {
                    inprogress++;
                }
            });

            result.push({
                username,
                totalBets: won + lost + inprogress,
                won,
                lost,
                inprogress,
                points
            });
        });

        result = orderBy(result, ["points"], "desc");

        return result;
    }

    const clearUsernameBetsData = async(username) => {
        const resp = await db.collection("users").doc(username).update({
            bets: [],
            points: 1000
        });

        setLoggedInUserDetails({
            ...loggedInUserDetails,
            bets: [],
            points: 1000
        });
    }

    const updateUserInfo = async (username, points, bets) => {
        try {
            let finalPoints = points, betSettledCount = 0;

            for(let i=0; i<bets.length; i++){
                const bet = bets[i];
                if(!bet.isSettled) {
                    const matchDetails = await getMatchDetailsForId(bet.unique_id) || {};
                    if(isEmpty(matchDetails)) {
                        bet.isSettled = true;
                        bet.betWon = true;
                        finalPoints += parseInt(bet.selectedPoints);
                        betSettledCount++;
                        bet.isNoResult = true;
                    } else if(matchDetails.winner_team) {
                        if(matchDetails.winner_team == bet.selectedTeam) {
                            finalPoints += 2*bet.selectedPoints;
                            bet.betWon = true;
                        } else {
                            bet.betWon = false;
                        }
                        bet.isSettled = true;
                        bet.isNoResult = false;
                        betSettledCount++;
                    }
                }
            };

            for(let j=0; j<iplMatches.length; j++) {
                const match = iplMatches[j];
                const { dateTimeGMT: matchTime, unique_id, "team-1": team1, "team-2": team2, team1Abbreviation, team2Abbreviation } = match;
                const betEndTime = moment(matchTime).subtract(30,"minutes");
                if(moment() > betEndTime) {
                    const betData = find(bets, {"unique_id": unique_id}) || {};

                    if(isEmpty(betData)) {
                        bets.push({
                            betTime: admin.default.firestore.Timestamp.fromDate(new Date()),
                            betWon: false,
                            isSettled: true,
                            isBetDone: false,
                            selectedPoints: 50,
                            selectedTeam: "No Betting Done.",
                            team1: team1,
                            team2: team2,
                            team1Abbreviation: team1Abbreviation,
                            team2Abbreviation: team2Abbreviation,
                            unique_id: unique_id,
                            isNoResult: false
                        });

                        finalPoints -= 50;
                        betSettledCount++;
                    }
                } else {
                    break;
                }
            }

            if(betSettledCount) {
                console.log("Bets:", bets);
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

    useEffect(async () => {
        setLoading(true);
        await auth.onAuthStateChanged(async user => {
            if(user) {
                await db.collection("users").where("email", "==", user.email).get().then(async userSnap => {
                    const { username, email, image, points, bets, isAdmin = false } = userSnap.docs[0].data();
                    const { latestPoints = "", latestBets = [] } = await updateUserInfo(username,points,bets) || {};
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
//loggedInUserDetails, loading
    return (
        <ContextProvider.Provider value={{
            loggedInUserDetails,
            errorMessage,
            loading,

            signUp,
            signIn,
            logout,
            betOnMatch,
            viewBetsData,
            getPointsTableData,
            clearUsernameBetsData
        }}>
            {props.children}
        </ContextProvider.Provider>
    )
}

export default Context
