import { find, isEmpty } from 'lodash';
import React, { createContext, useState, useEffect } from 'react';

import { auth, db, storage } from '../config';
import { getMatchDetailsForId } from '../components/apis';

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
                const { username, email, image, points, bets = [] } = userSnap.docs[0].data();
                setLoggedInUserDetails({
                    username,
                    email,
                    image,
                    points,
                    bets
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
        const result = [];
        const userDocs = await db.collection("users").get();
        userDocs.docs.map(user => {
            const userData = user.data();
            const { bets = [], username } = userData;
            const betData = find(bets, {"unique_id": id}) || {};
            if(!isEmpty(betData)) {
                result.push({
                    username,
                    betTime: betData.betTime,
                    betPoints: betData.selectedPoints,
                    betTeam: betData.selectedTeam
                });
            }
        });
        return result;
    }

    const updateUserInfo = async (username, points, bets) => {
        try {
            let finalPoints = points, betSettledCount = 0;

            for(let i=0; i<bets.length;i++){
                const bet = bets[i];
                if(!bet.isSettled) {
                    const matchDetails = await getMatchDetailsForId(bet.unique_id) || {};
                    if(matchDetails.winner_team) {
                        if(matchDetails.winner_team == bet.selectedTeam) {
                            finalPoints += 2*bet.selectedPoints;
                            bet.betWon = true;
                        } else {
                            bet.betWon = false;
                        }
                        bet.isSettled = true;
                        betSettledCount++;
                    }
                }
            };
            if(betSettledCount) {
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
                    const { username, email, image, points, bets } = userSnap.docs[0].data();
                    const { latestPoints = "", latestBets = [] } = await updateUserInfo(username,points,bets) || {};
                    setLoggedInUserDetails({
                        username,
                        email,
                        image,
                        points: latestPoints,
                        bets: latestBets
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
            viewBetsData
        }}>
            {props.children}
        </ContextProvider.Provider>
    )
}

export default Context
