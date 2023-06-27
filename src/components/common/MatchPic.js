import React from 'react';
import { Grid } from '@material-ui/core';
import moment from 'moment';

import nightBackGround from '../../images/bg35.jpeg';
import dayBackGround from '../../images/bg31.jpeg';
import vsLogo from '../../images/vs.png';

function MatchPic(props) {
    const { team1Logo, team2Logo, mobileView, matchTime, poster = "", posterSrc = "" } = props;
    const isNightMatch = moment(matchTime).hours() > 18;

    const backgroundImage = {
        backgroundImage: posterSrc == "single" ? `url(${isNightMatch ? nightBackGround : dayBackGround})` : `url(${poster})`,
        backgroundRepeat:"no-repeat", 
        backgroundSize: "100% 90%",
        height: mobileView ? 200 : 400
    };
    
    return (
        <Grid container justify="space-evenly" spacing={4} alignContent="center" style={{ ...backgroundImage, backgroundBlendMode: "normal", backgroundColor: "" }} direction="row">
            {posterSrc == "single" ? <> <Grid  className="tw-p-1">
                <img src={team1Logo} style={{width: mobileView ? "6.5em" : 150, height: "auto", mixBlendMode: isNightMatch ? "lighten" : "hard-light"}}/>
            </Grid>
            
            <Grid >
                <img src={vsLogo} style={{width: mobileView ? "5em" : 150, height: "auto"}}/>
            </Grid>
            
            <Grid  className="tw-p-1">
                <img src={team2Logo} style={{width: mobileView ? "6.5em" : 150, height: "auto", mixBlendMode: isNightMatch ? "lighten" : "hard-light"}}/>  
            </Grid>  </> : null }
        </Grid>
    );
}

export default MatchPic;