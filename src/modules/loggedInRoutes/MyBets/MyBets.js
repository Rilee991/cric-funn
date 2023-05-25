import React, { useContext } from 'react';

import { Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import { ContextProvider } from '../../../Global/Context';

import BetCard from './BetCard';
import StatsCard from './StatsCard';
import LoadingComponent from '../../../components/common/LoadingComponent';

export default function MyBets() {
    const contextConsumer = useContext(ContextProvider);
    const { loggedInUserDetails = {}, mobileView, loading } = contextConsumer;
    const { bets = [], username = "", points = "" } = loggedInUserDetails;
    const container = {
        width: "100%", 
        // padding: mobileView ? "70px 0px" : "70px 200px"
    };

    return (
        loading ? (
            <LoadingComponent />
        ) : (
            <div style={container}>
                <StatsCard bets={bets} mobileView={mobileView} username={username} points={points}/>
                {bets.length ? bets.map((bet) => (
                    <BetCard key={bet.unique_id} mobileView={mobileView} bet={bet}/>
                ))  : 
                <Alert severity="info" variant="filled" style={{width: mobileView ? "100%" : "70%"}}>
                    <Typography variant="overline">
                        <b>You have not bet in any matches yet.</b>
                    </Typography>
                </Alert>
                }
            </div>
        )
    );
}