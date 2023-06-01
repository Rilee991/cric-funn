import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Alert from '@material-ui/lab/Alert';

import backGround from '../../../images/background.jpg';
import MatchPic from '../../../components/common/MatchPic';
import { getMsgForInProgressBets, getMsgForLostBets, getMsgForNoResultBets, getMsgForWonBets, getTeamLogo } from '../../../config';

const admin = require("firebase");

function BetCard(props) {
    const { mobileView, bet = {} } = props;
    const { betTime = "", team1, odds = {}, team2, selectedTeam, selectedPoints, isSettled, betWon, isNoResult = false, 
		team1Abbreviation, team2Abbreviation, isBetDone } = bet;
    const team1Logo = getTeamLogo(team1Abbreviation);
    const team2Logo = getTeamLogo(team2Abbreviation);
    
    return (
		<Card style={{ boxShadow: "5px 5px 20px"}} className="tw-mt-2 tw-mb-10 xl:tw-w-[70%] md:tw-w-[90%] tw-rounded-[40px]">
			<CardActionArea>
				<CardContent>
					<MatchPic src="bet" team1Logo={team1Logo} team2Logo={team2Logo} mobileView={mobileView}/>
					<Typography gutterBottom variant="overline" style={{fontSize: 20, lineHeight: "28px", }} component="h2">
						<b>{team1} VS. {team2}</b>
					</Typography>
					<Typography variant="overline" style={{fontSize: 13}} color="textSecondary" component="p">
						Betting Time: <b>{betTime ? moment.unix(betTime.seconds).format("LLL") : "NA"}</b><br/>
						Betting Team: <b>{selectedTeam}</b><br/>
						Betting Points: <b>{selectedPoints}</b>
					</Typography>
				</CardContent>
			</CardActionArea>
			<Alert style={{ alignItems: "center" }} severity={bet.severity} variant="filled" className="tw-rounded-[40px]">
				<Typography gutterBottom variant="button" style={{fontSize: 15, lineHeight: "28px", }} component="p">
					<b>Bet Status: {bet.message}, {bet.affectedPts} POINTS</b>
				</Typography>
			</Alert>
        </Card>
    );
}

export default BetCard;
