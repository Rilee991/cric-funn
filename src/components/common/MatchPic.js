import React from 'react';
import { Grid } from '@material-ui/core';

import nightBackGround from '../../images/bg35.jpeg';
import dayBackGround from '../../images/bg31.jpeg';
import vsLogo from '../../images/vs.png';
import moment from 'moment';

function MatchPic(props) {
    const { team1Logo, team2Logo, mobileView, matchTime } = props;
    const isNightMatch = moment(matchTime).hours() > 18;

    const backgroundImage = {
        backgroundImage: isNightMatch ? `url(${nightBackGround})` : `url(${dayBackGround})`, 
        backgroundRepeat:"no-repeat", 
        backgroundSize: "100% 90%",
        height: 200
    };
    
    return (
        <Grid container justify="space-evenly" spacing={4} alignContent="center" style={{ ...backgroundImage, backgroundBlendMode: "normal", backgroundColor: "" }} direction="row">
            <Grid item>
                <img src={team1Logo} style={{width: mobileView ? "6.5em" : 150, height: "auto", mixBlendMode: isNightMatch ? "lighten" : "hard-light"}}/>
            </Grid>
            
            <Grid item>
                <img src={vsLogo} style={{width: mobileView ? "5em" : 150, height: "auto"}}/>
            </Grid>
            
            <Grid item>
                <img src={team2Logo} style={{width: mobileView ? "6.5em" : 150, height: "auto", mixBlendMode: isNightMatch ? "lighten" : "hard-light"}}/>  
            </Grid>  
        </Grid>
    );
}

export default MatchPic;