import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Badge, Avatar, Grid, Card, CardActionArea, CardContent } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import { round } from 'lodash';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Area, AreaChart, Cell, CartesianGrid, ComposedChart, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getFormattedFirebaseTime, themeColor } from '../../../config';

import { ContextProvider } from '../../../Global/Context';
import TeamStatsTable from '../PointsTable/TeamStatsTable';

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      borderRightWidth: 1,
      borderRightColor: theme.palette.grey[300],
      borderRightStyle: "solid",
    },
    body: {
      fontSize: 14,
      borderRightWidth: 1,
      borderRightColor: theme.palette.grey[300],
      borderRightStyle: "solid"
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover
      },
    },
}))(TableRow);

function Graph() {
    const contextConsumer = useContext(ContextProvider);
    const { loggedInUserDetails, mobileView, getAllUsersData } = contextConsumer;
    const { bets = [] } = loggedInUserDetails;
    const [timeSeriesData, setTimeSeriesData] = useState([]);

    useEffect(() => {
        getTimeSeriesData();
    },[])

    const getTimeSeriesData = async () => {
        const data = await getAllUsersData();
        setTimeSeriesData(data.timeSeriesPts);
    }

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
        
    const RADIAN = Math.PI / 180;

    let points = 3500, betWon = true, totalMatches = 0;
    let userJourney = [{
        totalMatches,
        betWon,
        points
    }];

    let firstQuad = 0, secondQuad = 0, thirdQuad = 3, fourthQuad = 0;

    bets.map(bet => {
        if(bet.betWon) {
            if(bet.isNoResult) {
                points += parseInt(bet.selectedPoints);
                betWon = true;
                totalMatches += 1; 
            } else {
                points += parseInt(Math.ceil(bet.selectedPoints*bet.odds[bet.selectedTeam]));
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

        const hours = moment.unix(bet.betTime).hours();
        if(hours < 6)   firstQuad++;
        else if(hours < 12) secondQuad++;
        else if(hours < 18) thirdQuad++;
        else    fourthQuad++;
    });

    const totalQuads = firstQuad + secondQuad + thirdQuad + fourthQuad;

    const selfBetTimeStats = [{ 
        name: "0-6 Hrs", value: round(firstQuad/1, 2)
    }, { 
        name: "6-12 Hrs", value: round(secondQuad/1, 2)
    }, { 
        name: "12-18 Hrs", value: round(thirdQuad/1, 2)
    }, { 
        name: "18-24 Hrs", value: round(fourthQuad/1, 2)
    }];

    const getPointsJourney = () => {
        return (
            <>
                <Typography variant="overline" align="center" style={{fontSize: 20}}>POINTS JOURNEY</Typography>
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
            </>
        );
    }

    const getTimeSeriesOfUsers = () => {
        return (
            <>
                <Typography variant="overline" align="center" style={{fontSize: 20}}>TIME SERIES AGAINST OPPONENTS</Typography>
                <hr/>
                <br/><br/>
                <ResponsiveContainer height={400} width="100%">
                    <LineChart width={730} height={250} data={timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="match" />
                        <YAxis />
                        {/* <Tooltip /> */}
                        <Legend />
                        <Line type="monotone" dataKey="Broly" stroke="#872806" strokeWidth="2.5" dot={false} />
                        <Line type="monotone" dataKey="SD" stroke="#82ca9d" strokeWidth="2.5" dot={false} />
                        <Line type="monotone" dataKey="Cypher33" stroke="#0142a1" strokeWidth="2.5" dot={false} />
                        <Line type="monotone" dataKey="desmond" stroke="#F60F78" strokeWidth="2.5" dot={false} />
                        <Line type="monotone" dataKey="ashu" stroke="#A108D6" strokeWidth="2.5" dot={false} />
                        <Line type="monotone" dataKey="kelly" stroke="#0BBEF8" strokeWidth="2.5" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </>
        );
    }

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, payload, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return ( <text x={x} y={y} fill="black" textAnchor={x > cx ? "start" : "end"} >
            {`${payload.name} - ${payload.value}(${(percent * 100).toFixed(0)}%)`}
          </text>
        );
    };

    const getBetTimeStats = () => {
        return (
            <>
                <Typography variant="overline" align="center" style={{fontSize: 20}}>BET TIME STATS</Typography>
                <hr/>
                <br/><br/>
                <ResponsiveContainer height={400} width="100%">
                    <PieChart width={730} height={250}>
                        <Pie
                            data={selfBetTimeStats}
                            cx="50%"
                            cy="50%"
                            label={renderCustomizedLabel}
                            outerRadius={200}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                        >
                            {selfBetTimeStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </>
        );
    }

    return (
        <div style={{
            width: "100%", 
            padding: mobileView ? "70px 0px" : "70px 200px"
        }}>
            {getPointsJourney()}
            <br /><br /><br />
            {getTimeSeriesOfUsers()}
            <br /><br /><br />
            {/* <br /><br /><br /> */}
            {/* {!mobileView && getBetTimeStats()} */}
            <TeamStatsTable />
        </div>
    );
}

export default Graph;