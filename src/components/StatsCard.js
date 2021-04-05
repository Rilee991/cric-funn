import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Grid, Paper } from '@material-ui/core';

import winLogo from '../images/win1.svg';
import lossLogo from '../images/loss.svg';
import inProgressLogo from '../images/inprogress.svg';
import backGround from '../images/background.jpg';
import { round, toUpper } from 'lodash';

function StatsCard(props) {
    const { mobileView, bets = [], username = "", points = "" } = props;

    let totalBets = 0, winBets = 0, lostBets = 0, inProgressBets = 0, accuracy = 0.00, avgBettingPoints = 0.00, 
        totalSettledBets = 0, totalPointsBet = 0, last5Results = [];

    bets.map(bet => {
        if(bet.isSettled) {
            if(bet.betWon) {
                winBets++;
                last5Results.push('W');
            } else {
                lostBets++;
                last5Results.push('L');
            }
            totalSettledBets++;
        } else {
            inProgressBets++;
            last5Results.push('I');
        }

        if(last5Results.length > 5) {
            last5Results.shift();
        }

        totalPointsBet += parseInt(bet.selectedPoints);
        totalBets++;
    });

    accuracy = round(winBets/totalSettledBets,2) * 100 || 0;
    avgBettingPoints = round(totalPointsBet/totalBets,2) || 0;

    const root = {
        width: mobileView ? '100%' : '70%',
        marginBottom: "50px"
    };

    const divRoot = {
        flexGrow: 1
    }

    const paper = {
        padding: "12px",
        textAlign: 'center',
        color: "blue",
        fontWeight: "bold"
    }

    const backgroundImage = {
      backgroundImage: `url(${backGround})`, 
      backgroundRepeat:"no-repeat", 
      backgroundSize: "100% 90%",
      height: 350
    };

    const stylingText = {
        fontWeight:"bold", 
        color:"white"
    }

    return (
      <>
        <Card style={root}>
            <CardActionArea>
                <CardContent>
                    <div style={divRoot}>
                        <Grid container justify="center" spacing={4} alignContent="center" style={backgroundImage}>
                            <Grid item xs={10}>
                                <Paper style={paper}>STATISTICS - {toUpper(username)}</Paper>
                            </Grid>

                            <Grid container justify="center" spacing={5} alignContent="center">
                                <Grid item xs={4}>
                                    <Typography style={{fontWeight:"bold", color:"white"}} gutterBottom variant="overline" component="animate">
                                        Total Bets: {totalBets}
                                    </Typography>
                                </Grid>
                                 <Grid item xs={4}>
                                    <Typography style={stylingText} gutterBottom variant="overline" component="animate">
                                        Bets Won: {winBets}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography style={stylingText} gutterBottom variant="overline" component="animate">
                                        Bets Lost: {lostBets}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography style={stylingText} gutterBottom variant="overline" component="animate">
                                        Bets In-Progress: {inProgressBets}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography style={stylingText} gutterBottom variant= "overline" component="animate">
                                        Accuracy: {accuracy}%
                                    </Typography>
                                </Grid>

                                <Grid item xs={3}>
                                    <Typography style={stylingText} gutterBottom variant="overline" component="animate">
                                        Points: {points}
                                    </Typography>
                                </Grid>  
                                
                                <Grid item xs={8} alignContent="center" justify="center">
                                    <Typography style={stylingText} gutterBottom variant= "overline" component="animate">
                                        Avg Points Bet Per Match: {avgBettingPoints}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid item xs={10}>
                                <Paper style={paper}>LAST 5 BETS RESULTS:  
                                    { last5Results.length == 0 ? "NO BETTING DONE" : last5Results.map(result => 
                                        (<>  {"  "}
                                            {result == 'I' ? <img width={mobileView ? 15 : 18} src={inProgressLogo}/> 
                                            : 
                                            result == 'W' ? <img width={mobileView ? 15 : 18} src={winLogo} /> 
                                            : <img width={mobileView ? 15 : 18} src={lossLogo} />
                                            }
                                        </>)
                                        )
                                    }
                                </Paper>
                            </Grid> 
                        </Grid>
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
      </>
    );
}

export default StatsCard;
