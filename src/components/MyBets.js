import React, { useState, useEffect, useContext } from 'react';

import { ContextProvider } from '../Global/Context';
import { Typography } from '@material-ui/core';
import BetCard from './BetCard';
import StatsCard from './StatsCard';

export default function MyBets() {
    const contextConsumer = useContext(ContextProvider);
    const { loggedInUserDetails = {} } = contextConsumer;
    const { bets = [], username = "", points = "" } = loggedInUserDetails;
    const [mobileView, setMobileView] = useState(true);
    const container = {
        width: "100%", 
        padding: mobileView ? "70px 0px" : "70px 200px"
    };

    useEffect(() => {
        const setResponsiveness = () => {
        return window.innerWidth < 900
            ? setMobileView(true)
            : setMobileView(false)
        };

        setResponsiveness();

        window.addEventListener("resize", () => setResponsiveness());
    
    }, []);

    return (
        <div style={container}>
            <StatsCard bets={bets} mobileView={mobileView} username={username} points={points}/>
            {bets.length ? bets.map((bet) => (
                <BetCard key={bet.unique_id} mobileView={mobileView} bet={bet}/>
            ))  : 
            <Typography>You have not bet in any matches yet.</Typography>}
        </div>
    );
}