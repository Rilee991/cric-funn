import { Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import { Area, AreaChart, Bar, CartesianGrid, ComposedChart, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { themeColor } from '../../../config';

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
            <br/><br/>
            <ResponsiveContainer height={400} width="100%">
                <ComposedChart
                    width={1500}
                    height={300}
                    data={userJourney}
                    margin={{
                        top: 5, right: 30, left: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis style={{fontWeight: "bold", color:"black"}} dataKey="totalMatches" scale="band" textAnchor="end" height={90} interval={0}/>
                    <YAxis style={{fontWeight: "bold", color:"black"}} dataKey="points" />
                    <Tooltip />
                    <Legend />
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={themeColor} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" fill="url(#colorPv)" name="Points" fillOpacity={1} dataKey="points" />
                    <Line type="monotone" dataKey="totalMatches" name="Matches" stroke="green"/>
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Graph;