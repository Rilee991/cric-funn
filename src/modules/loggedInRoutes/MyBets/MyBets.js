import React, { useContext } from 'react';
import { Card, CardActionArea, CardContent, Typography } from '@material-ui/core';
import { find } from 'lodash';

import { ContextProvider } from '../../../global/Context';
import BetCard from './BetCard';
import StatsCard from './StatsCard';
import LoaderV2 from '../../../components/common/LoaderV2';

export default function MyBets() {
    const contextConsumer = useContext(ContextProvider);
    const { loggedInUserDetails = {}, mobileView, loading, matches = [] } = contextConsumer;
    const { bets = [], username = "", points = "" } = loggedInUserDetails;

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

    return (
        loading ? (<LoaderV2 tip="Loading History..." />) : (
            <div className="tw-w-full tw-mt-2">
                <StatsCard bets={bets} mobileView={mobileView} username={username} points={points}/>
                <Card style={{ boxShadow: "5px 5px 20px", backgroundRepeat:"no-repeat", backgroundSize: "inherit",height: "auto", backgroundBlendMode: "hard-light" }} className="tw-mt-2 tw-mb-10 xl:tw-w-[70%] md:tw-w-[90%] tw-rounded-[40px]">
                    <CardActionArea>
                        <CardContent className="tw-flex tw-bg-indigo-950 tw-flex-col tw-items-center">
                            <div style={{ padding: "10px", border: "2px solid white" }} className="tw-bg-indigo-950 tw-h-[5vh] tw-rounded-[20px] tw-flex tw-justify-center tw-items-center tw-text-white">
                                <Typography className="tw-flex tw-items-center tw-gap-2" variant={"button"} style={{fontSize: 13}} component="p">
                                    <b>Bet History</b> 
                                </Typography>
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
                {bets.length ? bets.map((bet) => (
                    <BetCard key={bet.matchId} mobileView={mobileView} bet={bet} posterSrc="single" />
                )) :
                    <Card style={{ boxShadow: "5px 5px 20px", backgroundRepeat:"no-repeat", backgroundSize: "inherit",height: "auto", backgroundBlendMode: "hard-light" }} className="tw-mt-2 tw-mb-10 xl:tw-w-[70%] md:tw-w-[90%] tw-rounded-[40px]">
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