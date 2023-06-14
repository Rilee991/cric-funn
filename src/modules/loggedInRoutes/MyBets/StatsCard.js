import React from 'react';
import { Card, Typography, CardContent, CardActionArea } from '@material-ui/core';
import { round, upperCase } from 'lodash';
import { CheckOutlined, CloseOutlined, HourglassEmptyOutlined, PriorityHighOutlined } from '@material-ui/icons';
import { WhatsappIcon, WhatsappShareButton } from 'react-share';

import backGround from '../../../images/stats.jpg';
import ComparisionBar from '../../../components/common/ComparisionBar';

const StatsCard = (props) => {
    const { mobileView, bets = [], username = "", points = "" } = props;

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
    accuracy = round(winBets/(winBets+lostBets),2) * 100 || 0;
    avgBettingPoints = round(totalPointsBet/(winBets+lostBets),2) || 0;

    const shareTitle = `*${upperCase(username)}'s Statistics*\n-------------------------`;
    const shareBody = `*Total Bets Done: ${totalBets}*\n*Bets Won: ${winBets}*\n*Bets Lost: ${lostBets}*\n*Bets In-Progress: ${inProgressBets}*\n*Bets Penalized: ${finedBets}*\n*Accuracy: ${accuracy}%*\n*Points: ${points}*\n*Last 5 Bets Form: ${last5ResultsString}*\n\nCric-Funn - Boiz's Official Betting App`;

    const totalBetsWidth = round(totalBets/(totalBets+finedBets),2)*100;
    const finedBetsWidth = 100-totalBetsWidth;
    const winBetsWidth = round(winBets/(winBets+lostBets),2)*100;
    const lossBetsWidth = 100-winBetsWidth;

    return (
        <>
            <Card style={{ boxShadow: "5px 5px 20px", backgroundImage: `url(${backGround})`, backgroundRepeat:"no-repeat", backgroundSize: "cover", height: "auto", backgroundBlendMode: "hard-light" }} className="tw-mt-2 tw-mb-10 xl:tw-w-[70%] md:tw-w-[90%] tw-rounded-[40px]">
                <CardActionArea>
                    <CardContent className="tw-flex tw-flex-col tw-items-center">
                        <div style={{ padding: "10px", border: "2px solid white" }} className="tw-bg-indigo-950 tw-h-[5vh] tw-rounded-[20px] tw-flex tw-justify-center tw-items-center tw-text-white">
                            <Typography className="tw-flex tw-items-center tw-gap-2" variant={"button"} style={{fontSize: 13}} component="p">
                                <b>Statistics</b> 
                                <WhatsappShareButton 
                                    style={{float: "right", justifyContent:"center", alignContent: "center"}}
                                    title={shareTitle}
                                    separator={"\n"}
                                    children={(<WhatsappIcon size={mobileView ? "3vh" : "4vh"} round={true}/>)}
                                    url={shareBody}
                                />
                            </Typography>
                        </div>
                        <div className="tw-flex tw-w-full">
                            <div className="tw-flex tw-flex-col tw-justify-between tw-w-full">
                                {/* 20% mini width for better ux */}
                                <ComparisionBar color1="#1C315E" width1={`${totalBetsWidth < 20 ? 20 : totalBetsWidth}%`} text1={`${totalBets} total`} fontSize={mobileView ? 13 : 16} color2="#FC7300" width2={`${finedBetsWidth < 20 ? 20 : finedBetsWidth}%`} text2={`${finedBets} Fined`} />
                                {/* 13% mini width for better ux */}
                                <ComparisionBar color1="#6C4AB6" width1={`${winBetsWidth < 13 ? 13 : winBetsWidth}%`} text1={`${winBets} ${mobileView ? "W" : "Wins"}`} fontSize={mobileView ? 13 : 16} color2="#EB6440" width2={`${lossBetsWidth < 13 ? 13 : lossBetsWidth}%`} text2={`${lostBets} ${mobileView ? "L" : "Losses"}`} />
                                <ComparisionBar color1="#5DA7DB" width1={`${accuracy < 13 ? 13 : accuracy}%`} text1={`${accuracy}% ${mobileView ? "W" : "Accurate"}`} fontSize={mobileView ? 13 : 16} color2="#E8AA42" width2={`${(100-accuracy) < 13 ? 13 : (100-accuracy)}%`} text2={`${100-accuracy}% ${mobileView ? "L" : "Missed"}`} />
                                <div className="tw-flex tw-mt-2 tw-gap-1">
                                    <div style={{ padding: "10px" }} className="tw-w-1/2 tw-bg-[#379237] tw-h-[5vh] tw-rounded-[20px] tw-flex tw-justify-center tw-items-center tw-text-white">
                                        <Typography variant={"button"} style={{fontSize: 13}} component="p">
                                            <b>Balance: {points}</b>
                                        </Typography>
                                    </div>
                                    <div style={{ padding: "10px" }} className="tw-w-1/2 tw-bg-[#5800FF] tw-h-[5vh] tw-rounded-[20px] tw-flex tw-justify-center tw-items-center tw-text-white">
                                        <Typography variant={"button"} style={{fontSize: 13}} component="p">
                                            <b>Avg Points Bet: {avgBettingPoints}</b>
                                        </Typography>
                                    </div>
                                </div>
                                <div style={{ padding: "10px" }} className="tw-w-full tw-mt-2 tw-bg-indigo-950 tw-h-[5vh] tw-rounded-[20px] tw-flex tw-justify-center tw-items-center tw-text-white">
                                    <Typography className="tw-flex tw-gap-1 tw-items-center tw-justify-center" variant={"button"} style={{fontSize: 13}} component="p">
                                        <b>Recent Form:</b>
                                        { [...last5ResultsString].map(ch => (
                                            ch == 'W' ? <CheckOutlined className="tw-w-5 tw-h-5 tw-rounded-3xl tw-bg-green-500" /> : 
                                            ch == "L" ? <CloseOutlined className="tw-w-5 tw-h-5 tw-rounded-3xl tw-bg-red-500" /> : 
                                            ch == "I" ? <HourglassEmptyOutlined className="tw-w-5 tw-h-5 tw-rounded-3xl tw-bg-blue-500" /> :
                                            <PriorityHighOutlined className="tw-w-5 tw-h-5 tw-rounded-3xl tw-bg-red-700" />
                                        ))}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    );
}

export default StatsCard;
