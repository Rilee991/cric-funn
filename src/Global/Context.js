import { find } from 'lodash';
import React, { createContext, useState, useEffect } from 'react';

import { auth, db, storage } from '../config';
import { getMatchDetails } from '../components/apis';

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
            });

            setErrorMessage('');
            setLoading(false);
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

    const updateUserInfo = (username, points, bets) => {
        const unsettledBets = bets.filter(bet => {
            if(bet.isSettled == false)
                return bet;
        }) || [];
        let finalPoints = points;
        console.log(unsettledBets);
        unsettledBets.map(bet => {
            const matchDetails = getMatchDetails(bet.unique_id);
            if(matchDetails.winner_team) {
                if(matchDetails.winner_team == bet.selectedTeam) {
                    finalPoints += 2*bet.selectedPoints;
                }
                bet.isSettled = true;

                console.log("Unsettled Bets:", unsettledBets);

                // db.collection("users").doc(username).update({
                //     bets : newBets,
                //     points: newPoints
                // }).then(() => {
                //     console.log("Document updated Successfully.");
                //     setLoggedInUserDetails({
                //         ...loggedInUserDetails,
                //         bets: newBets,
                //         points: newPoints
                //     });
                //     window.location.reload(false);
                // }).catch(err => {
                //     console.log("Error while updating user details:",err);
                // });
            }
        });

        return { latestPoints: points, latestBets: bets };
    }

    useEffect(async () => {
        setLoading(true);
        await auth.onAuthStateChanged(user => {
            if(user) {
                db.collection("users").where("email", "==", user.email).get().then(userSnap => {
                    const { username, email, image, points, bets } = userSnap.docs[0].data();
                    const { latestPoints = "", latestBets = [] } = updateUserInfo(username,points,bets);
                    setLoggedInUserDetails({
                        username,
                        email,
                        image,
                        points: latestPoints,
                        bets: latestBets
                    });
                });
            }
            setLoading(false);
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
            betOnMatch
        }}>
            {props.children}
        </ContextProvider.Provider>
    )
}

export default Context
