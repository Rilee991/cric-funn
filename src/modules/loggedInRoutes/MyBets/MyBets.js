import React, { useContext, useEffect } from 'react';
import { Card, CardActionArea, CardContent, Typography, Grid } from '@material-ui/core';
import { find, round, sumBy, upperCase } from 'lodash';

import { ContextProvider } from '../../../global/Context';
import BetCard from './BetCard';
import StatsCard from './StatsCard';
import PageLoader from '../../../components/common/PageLoader';
import StatsCardV2 from './StatsCardV2';
import bowledImg from '../../../res/images/wkt.png';
import { CheckOutlined, CloseOutlined, HourglassEmptyOutlined, PriorityHighOutlined } from '@material-ui/icons';
import { updateConfig } from '../../../apis/configurationsController';

export default function MyBets() {
    const contextConsumer = useContext(ContextProvider);
    const { loggedInUserDetails = {}, mobileView, loading, matches = [], configurations = {}, setConfigurations } = contextConsumer;
    const { bets = [], username = "", points = "" } = loggedInUserDetails;

    useEffect(() => {
        updateConfig(configurations, username, "MyBets", setConfigurations);
    },[]);

    bets.map(bet => {
        const match = find(matches, { id: bet.matchId });
        bet.team1Logo = match.teamInfo[0].img;
        bet.team2Logo = match.teamInfo[1].img;

        if(bet.isBetDone) {
			if(bet.isSettled) {
				if(bet.isNoResult) {
					bet.message = "No result";
                    bet.severity = "success";
                    bet.affectedPts = bet.selectedPoints;
				} else if(bet.betWon) {
					bet.message = "Won";
                    bet.severity = "success";
                    bet.affectedPts = Math.ceil(bet.odds[bet.selectedTeam] * bet.selectedPoints);
				} else {
					bet.message = "Lost";
                    bet.severity = "warning";
                    bet.affectedPts = bet.selectedPoints;
				}
			} else {
				bet.message = "In progress";
                bet.severity = "info";
                bet.affectedPts = bet.selectedPoints;
			}
		} else {
			bet.message = "Missed";
            bet.severity = "error";
            bet.affectedPts = bet.selectedPoints;
		}
    })

    let totalBets = 0, winBets = 0, lostBets = 0, inProgressBets = 0, finedBets = 0, accuracy = 0.00, 
        avgBettingPoints = 0.00, totalPointsBet = 0, last5ResultsString = "";

    bets.map(bet => {
        if(bet.isBetDone) {
            if(bet.isSettled) {
                if(bet.betWon) {
                    winBets++;
                    last5ResultsString += "W";
                } else {
                    lostBets++;
                    last5ResultsString += "L";
                }
            } else {
                inProgressBets++;
                last5ResultsString += "I";
            }
            totalBets++;
            totalPointsBet += parseInt(bet.selectedPoints);
        } else {
            finedBets++;
            last5ResultsString += "F";
        }
    });

    last5ResultsString = last5ResultsString.slice(-5);
    accuracy = (round(winBets/((winBets+lostBets)||1),2) * 100).toFixed(0) || 0;
    avgBettingPoints = round(totalPointsBet/(totalBets || 1),2) || 0;

    const shareTitle = `*${upperCase(username)}'s Statistics*\n-------------------------`;
    const shareBody = `*Total Bets Done: ${totalBets}*\n*Bets Won: ${winBets}*\n*Bets Lost: ${lostBets}*\n*Bets In-Progress: ${inProgressBets}*\n*Bets Penalized: ${finedBets}*\n*Accuracy: ${accuracy}%*\n*Points: ${points}*\n*Last 5 Bets Form: ${last5ResultsString}*\n\nCric-Funn - Boiz's Official Betting App`;

    const totalBetsWidth = round(totalBets/(totalBets+finedBets),2)*100;
    const finedBetsWidth = 100-totalBetsWidth;
    const winBetsWidth = round(winBets/(winBets+lostBets),2)*100;
    const lossBetsWidth = 100-winBetsWidth;
    const notBetsDone = bets.length == 0;

    const playedPercent = round((totalBets)/(totalBets+finedBets),2)*100;
    const winPercent = round(winBets/(winBets+lostBets),2)*100;
    const formPercent = round(sumBy(last5ResultsString, ch => ch === "W")/5,2)*100;

    const getRecentForm = (recentResults) => {
        return <div className="tw-flex tw-gap-1"> 
            {[...recentResults].map(ch => (
                ch == 'W' ? <CheckOutlined className="tw-w-9 tw-h-9 tw-rounded-3xl tw-bg-[#56bc00]" /> : 
                ch == "L" ? <CloseOutlined className="tw-w-9 tw-h-9 tw-rounded-3xl tw-bg-[#c10404]" /> : 
                ch == "I" ? <HourglassEmptyOutlined className="tw-w-9 tw-h-9 tw-rounded-3xl tw-bg-blue-500" /> :
                <PriorityHighOutlined className="tw-w-9 tw-h-9 tw-rounded-3xl tw-bg-[#bf01a0]" />
            ))}
        </div>
    }

    return (
        loading ? (<PageLoader tip="Loading History..." />) : (
            <div className="tw-w-full tw-mt-2">
                {/* <StatsCard bets={bets} mobileView={mobileView} username={username} points={points}/> */}
                <Grid container spacing={2} className="tw-mb-10">
                    <Grid item xs={6} sm={6} md={3} className="tw-flex tw-justify-center tw-items-center">
                        <StatsCardV2 barPercent={playedPercent} bgColor="linear-gradient(62deg, black, #cbb300)" background={"https://cdn-icons-png.flaticon.com/512/5971/5971593.png"} text={totalBets.toString()} title="Played" />
                    </Grid>
                    <Grid item xs={6} sm={3} md={3} className="tw-flex tw-justify-center tw-items-center">
                        <StatsCardV2 barPercent={100-playedPercent} bgColor="linear-gradient(62deg, black, #bf01a0)" background={"https://cdn-icons-png.flaticon.com/512/3761/3761701.png"} text={finedBets.toString()} title="Missed" />
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} className="tw-flex tw-justify-center tw-items-center">
                        <StatsCardV2 barPercent={100-winPercent} bgColor="linear-gradient(62deg, black, #c10404)" background={bowledImg} text={lostBets.toString()} title="Lost" />
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} className="tw-flex tw-justify-center tw-items-center">
                        <StatsCardV2 barPercent={winPercent} bgColor="linear-gradient(62deg, black, #56bc00)" background={"https://pngimg.com/d/cricket_PNG106.png"} text={winBets.toString()} title="Won" />
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} className="tw-flex tw-justify-center tw-items-center">
                        <StatsCardV2 barPercent={accuracy} bgColor="linear-gradient(62deg, black, #01b9bf)" background={"https://www.freeiconspng.com/uploads/white-spider-web-png-9.png"} text={accuracy+"%"} title="Accuracy" />
                    </Grid>
                    <Grid item xs={6} sm={3} md={3} className="tw-flex tw-justify-center tw-items-center">
                        <StatsCardV2 bgColor="linear-gradient(62deg, black, #0103bf)" background={"https://pngimg.com/d/speedometer_PNG49.png"} text={avgBettingPoints.toString()} title="Avg Pts Per Match" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} className="tw-flex tw-justify-center tw-items-center">
                        <StatsCardV2 barPercent={formPercent} bgColor="linear-gradient(62deg, black, #acff2d)" background={"https://static.vecteezy.com/system/resources/previews/008/505/869/original/candlestick-graph-bar-design-stock-market-business-concept-png.png"} text={getRecentForm(last5ResultsString)} title="Recent Form" />
                    </Grid>
                </Grid>
                <Card style={{ boxShadow: "5px 5px 20px", backgroundRepeat:"no-repeat", backgroundSize: "inherit",height: "auto", backgroundBlendMode: "hard-light" }} className="tw-mt-2 tw-mb-10 tw-rounded-[40px]">
                    <CardActionArea>
                        <CardContent className="tw-flex tw-bg-indigo-950 tw-flex-col tw-items-center">
                            {/* <div style={{ padding: "10px", border: "2px solid white" }} className="tw-bg-indigo-950 tw-h-[5vh] tw-rounded-[20px] tw-flex tw-justify-center tw-items-center tw-text-white"> */}
                                <Typography className="tw-flex tw-items-center tw-font-noto tw-gap-2 tw-text-white" variant={"button"} style={{fontSize: 20}} component="p">
                                    <b>Bet History</b> 
                                </Typography>
                            {/* </div> */}
                        </CardContent>
                    </CardActionArea>
                </Card>
                {bets.length ? bets.map((bet) => (
                    <BetCard key={bet.matchId} mobileView={mobileView} bet={bet} posterSrc="single" />
                )) :
                    <Card style={{ boxShadow: "5px 5px 20px", backgroundRepeat:"no-repeat", backgroundSize: "inherit",height: "auto", backgroundBlendMode: "hard-light" }} className="tw-mt-2 tw-mb-10 tw-rounded-[40px]">
                        <CardActionArea>
                            <CardContent className="tw-flex tw-bg-green-300 tw-flex-col tw-items-center">
                                <div style={{ padding: "10px", border: "2px solid white" }} className="tw-bg-indigo-950 tw-h-[5vh] tw-rounded-[20px] tw-flex tw-justify-center tw-items-center tw-text-white">
                                    <Typography className="tw-flex tw-items-center tw-gap-2" variant={"button"} style={{fontSize: 13}} component="p">
                                        <b>You've not made any bets. All your bets will be shown here.</b> 
                                    </Typography>
                                </div>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                }
            </div>
        )
    );
}