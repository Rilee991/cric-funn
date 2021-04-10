import { Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { ContextProvider } from '../../../Global/Context';

function Graph() {
    const contextConsumer = useContext(ContextProvider);
    const { loggedInUserDetails, mobileView } = contextConsumer;
    const { bets = [] } = loggedInUserDetails;

    let points = 1000, betWon = true, totalMatches = 0;
    let userJourney = [{
        totalMatches,
        betWon,
        points
    }];

    bets.map(bet => {
        if(bet.betWon) {
            if(bet.isNoResult) {
                points += parseInt(bet.selectedPoints);
                betWon = true;
                totalMatches += 1; 
            } else {
                points += parseInt(bet.selectedPoints);
                betWon = true;
                totalMatches += 1;
            }
        } else {
            points -= parseInt(bet.selectedPoints);
            betWon = false;
            totalMatches += 1;
        }

        userJourney.push({
            points,
            betWon,
            totalMatches
        });
    });

    return (
        <div style={{
            width: "100%", 
            padding: mobileView ? "70px 0px" : "70px 200px"
        }}>
            <Typography variant="overline" align="center" style={{fontSize: 20}}>GRAPHICAL STATISTICS</Typography>
            <hr/>
            <ResponsiveContainer height={400} width="100%">
                <ComposedChart
                    width={1500}
                    height={300}
                    data={userJourney}
                    margin={{
                        top: 5, right: 30, left: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis style={{fontWeight: "bold", color:"black"}} dataKey="totalMatches" scale="band" textAnchor="end" height={90} interval={0}/>
                    <YAxis style={{fontWeight: "bold", color:"black"}} dataKey="points" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="points" fill="#8884d8" name="Points" />
                    <Line type="monotone" dataKey="points" name="Points" stroke="#8884d8"/>
                    <Line type="monotone" dataKey="totalMatches" name="Matches" stroke="green"/>
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Graph;