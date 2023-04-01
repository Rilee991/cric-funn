import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Alert from '@material-ui/lab/Alert';

import backGround from '../../../images/background.jpg';
import MatchPic from '../../common/MatchPic';
import { getMsgForInProgressBets, getMsgForLostBets, getMsgForNoResultBets, getMsgForWonBets, getTeamLogo } from '../../../config';

const admin = require("firebase");

function BetCard(props) {
    const { mobileView, bet = {} } = props;
    const { betTime = "", team1, team2, selectedTeam, selectedPoints, isSettled, betWon, isNoResult = false, team1Abbreviation, team2Abbreviation } = bet;
    const team1Logo = getTeamLogo(team1Abbreviation);
    const team2Logo = getTeamLogo(team2Abbreviation);

    const [message, setMessage] = useState(
      isSettled ? (
        isNoResult ? 
          (
            getMsgForNoResultBets(selectedPoints, selectedTeam)
          ) 
            : 
          (
            betWon ? getMsgForWonBets(selectedPoints, selectedTeam) : getMsgForLostBets(selectedPoints, selectedTeam)
          )
      ) 
        : 
      (
        getMsgForInProgressBets(selectedPoints, selectedTeam)
      )
    );
    const [severity, setSeverity] = useState(isSettled ? (betWon ? `success` : `error`) : `warning`);

    const root = {
        width: mobileView ? '100%' : '70%',
        marginBottom: "50px"
    };
    const media = {
        height: 300
    };
    const backgroundImage = {
      backgroundImage: `url(${backGround})`, 
      backgroundRepeat:"no-repeat", 
      backgroundSize: "100% 90%",
      height: 200
    };
    
    return (
      <>
        <Card style={root}>
          <CardActionArea>
            <CardContent>
              <MatchPic src="bet" team1Logo={team1Logo} team2Logo={team2Logo} mobileView={mobileView}/>
              <Typography gutterBottom variant="overline" style={{fontSize: 20}} component="h2">
                <b>{team1} VS. {team2}</b>
              </Typography>
              <Typography variant="overline" style={{fontSize: 13}} color="textSecondary" component="p">
                Betting Time: <b>{betTime ? moment.unix(betTime.seconds).format("LLL") : "NA"}</b>
              </Typography>
              <Typography variant="overline" style={{fontSize: 13}} color="textSecondary" component="p">
                Betting Team: <b>{selectedTeam}</b>
              </Typography>
            </CardContent>
          </CardActionArea>
          <Alert severity={severity}>
            <b>{message}</b>
          </Alert>
        </Card>
      </>
    );
}

export default BetCard;
