import React from 'react';
import { Card, CardActionArea, CardContent, Typography } from '@material-ui/core';
import moment from 'moment';
import Alert from '@material-ui/lab/Alert';

import MatchPic from '../../../components/common/MatchPic';

function BetCard(props) {
    const { mobileView, bet = {} } = props;
    const { betTime = "", team1, team2, selectedTeam, selectedPoints, team1Abbreviation, team2Abbreviation, team1Logo, team2Logo } = bet;
    
    return (
		<Card style={{ boxShadow: "5px 5px 20px"}} className="tw-mt-2 tw-mb-10 tw-rounded-[40px]">
			<CardActionArea>
				<CardContent>
					<MatchPic posterSrc="single" team1Logo={team1Logo} team2Logo={team2Logo} mobileView={mobileView}/>
					<Typography gutterBottom className="tw-font-noto" style={{fontSize: 20, lineHeight: "28px", }} component="h2">
						<b>{team1} VS. {team2}</b>
					</Typography>
					<Typography className="tw-font-noto" style={{fontSize: 20}} color="textSecondary" component="p">
						Betting Time: <b>{betTime ? moment.unix(betTime.seconds).format("LLL") : "NA"}</b><br/>
						Betting Team: <b>{selectedTeam}</b><br/>
						Betting Points: <b>{selectedPoints}</b>
					</Typography>
				</CardContent>
			</CardActionArea>
			<Alert style={{ alignItems: "center" }} severity={bet.severity} variant="filled" className="tw-rounded-[40px]">
				<Typography gutterBottom variant="button" className="tw-font-noto" style={{fontSize: 15, lineHeight: "28px", }} component="p">
					<b>Bet Status: {bet.message}, {bet.affectedPts} POINTS</b>
				</Typography>
			</Alert>
        </Card>
    );
}

export default BetCard;
