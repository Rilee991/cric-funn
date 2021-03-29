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

function BetCard(props) {
    const { mobileView, bet = {} } = props;
    const { betTime = "", team1, team2, selectedTeam, selectedPoints, isSettled, betWon, unique_id, team1Abbreviation, team2Abbreviation } = bet;
    const team1Logo = getTeamLogo(team1Abbreviation);
    const team2Logo = getTeamLogo(team2Abbreviation);
    const [message, setMessage] = useState(isSettled ? (betWon ? `Bet CLOSED. You WON this bet for ${selectedPoints} POINTS.` : `Bet CLOSED. You LOST this bet for ${selectedPoints} POINTS.`) : `Bet IN PROGRESS.`);
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

    function getTeamLogo(team) {
      if(team == "SRH") return srhLogo;
      else if(team == "KKR") return kkrLogo;
      else if(team == "DC") return dcLogo;
      else if(team == "CSK") return cskLogo;
      else if(team == "MI") return miLogo;
      else if(team == "KXIP") return pkLogo;
      else if(team == "RCB") return rcbLogo;
      else return rrLogo;
    }
    console.log(moment(betTime.seconds).format("LLL"));
    return (
      <>
        <Card style={root}>
          <CardActionArea>
            <CardContent>
              <Grid container justify="center" spacing={4} alignContent="center" style={backgroundImage}>
                <Grid item>
                  <img src={team1Logo} style={{width: mobileView ? 110 : 150}}/>
                </Grid>
                
                <Grid item>
                  <img src={vsLogo} style={{width: mobileView ? 75 : 150}}/>
                </Grid>
                
                <Grid item>
                  <img src={team2Logo} style={{width: mobileView ? 110 : 150}}/>  
                </Grid>  
              </Grid>
              <Typography gutterBottom variant="h5" component="h2">
                <b>{team1} VS {team2}</b>
              </Typography>
              <Typography variant="body1" color="textSecondary" component="p">
                Betting Time: <b>{betTime ? moment.unix(betTime.seconds).format("LLL") : "NA"}</b>
              </Typography>
              <Typography variant="body1" color="textSecondary" component="p">
                Betting Team: <b>{selectedTeam}</b>
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            
          </CardActions>
          <Alert severity={severity}>
            {message}
          </Alert>
        </Card>
      </>
    );
}

export default BetCard;
