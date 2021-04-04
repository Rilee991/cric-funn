import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import kkrLogo from '../images/kkr.png';
import rcbLogo from '../images/rcb.png';
import srhLogo from '../images/srh.png';
import cskLogo from '../images/csk.png';
import dcLogo from '../images/dc.png';
import rrLogo from '../images/rr.png';
import miLogo from '../images/mi.png';
import pkLogo from '../images/pk.png';
import vsLogo from '../images/vs.png';
import backGround from '../images/background.jpg';
import MatchPic from './MatchPic';
import { getMsgForInProgressBets, getMsgForLostBets, getMsgForNoResultBets, getMsgForWonBets, getTeamLogo } from '../config';

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
            getMsgForNoResultBets(selectedPoints)
          ) 
            : 
          (
            betWon ? getMsgForWonBets(selectedPoints) : getMsgForLostBets(selectedPoints)
          )
      ) 
        : 
      (
        getMsgForInProgressBets(selectedPoints)
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
              <MatchPic team1Logo={team1Logo} team2Logo={team2Logo} mobileView={mobileView}/>
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
