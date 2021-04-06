import React from 'react';
import { Grid } from '@material-ui/core';

import backGround from '../../images/background.jpg';
import vsLogo from '../../images/vs.png';

function MatchPic(props) {
    const { team1Logo, team2Logo, mobileView } = props;
    
    const backgroundImage = {
        backgroundImage: `url(${backGround})`, 
        backgroundRepeat:"no-repeat", 
        backgroundSize: "100% 90%",
        height: 200
    };
    
    return (
        <Grid container justify="space-evenly" spacing={4} alignContent="center" style={backgroundImage} direction="row">
            <Grid item>
                <img src={team1Logo} style={{width: mobileView ? "6.5em" : 150, height: "auto"}}/>
            </Grid>
            
            <Grid item>
                <img src={vsLogo} style={{width: mobileView ? "5em" : 150, height: "auto"}}/>
            </Grid>
            
            <Grid item>
                <img src={team2Logo} style={{width: mobileView ? "6.5em" : 150, height: "auto"}}/>  
            </Grid>  
        </Grid>
    );
}

export default MatchPic;