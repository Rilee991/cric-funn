import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';

import wmLogo from '../images/wm.png';

function Prizes() {

    const root = {
        width: '70%',
        marginBottom: "50px"
    };

    const backgroundImage = {
        backgroundImage: `url(${wmLogo})`, 
        backgroundRepeat:"no-repeat", 
        backgroundSize: "100% 90%",
        height: 200
    };

    return (
        <>
        <Card style={root}>
          <CardActionArea>
            <CardContent>
              <Grid container justify="center" spacing={4} alignContent="center" style={backgroundImage}>
                  
              </Grid>
              <Typography gutterBottom variant="h5" component="h2">
                <b>Main Event Of WrestleMania 21</b>
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Start Time: 6th June, 2021
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                1 Tasty Double-Egg Chicken Roll with Rabdi Lassi worth Rs. 200
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </>
    )
}

export default Prizes
