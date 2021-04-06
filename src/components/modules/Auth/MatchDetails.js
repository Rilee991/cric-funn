import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';

import { fontVariant } from '../../../config';

import MatchDetailsLoader from '../../common/MatchDetailsLoader';

function MatchDetails(props) {
    const { matchDetails, open, handleClose, team1Abbreviation, team2Abbreviation, toss = "", winnerTeam = "", isMatchDetailsLoading = false } = props;
    const { matchStarted = "", score = "" } = matchDetails;

    const closeDialog = () => {
        handleClose && handleClose();
    }

    function getDetailsCard() {
        return (
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Typography variant={fontVariant}>
                        Match Status: {" "}
                        <span style={{fontWeight: "bold", fontStyle: "italic"}}>
                            {matchStarted ? "Started." : "Not Started Yet."}
                        </span>
                    </Typography>
                    {   matchStarted ? (
                            <>
                                {   toss ? 
                                    <>
                                        <br/>
                                        <Typography variant={fontVariant}>
                                            Toss: {" "}
                                            <span style={{fontStyle: "italic", fontWeight: "bold"}}>
                                                { toss }
                                            </span>
                                        </Typography> 
                                    </> : null
                                    
                                }
                                {   score ? 
                                    <>
                                        <br/>
                                        <Typography variant={fontVariant}>
                                            Score: {" "}
                                            <span style={{fontStyle: "italic", fontWeight: "bold"}}>
                                                {score}
                                            </span>
                                        </Typography> 
                                    </> : null
                                }
                                {   winnerTeam ? 
                                    <>
                                        <br/>
                                        <Typography variant={fontVariant}>
                                            Result: {" "}
                                            <span style={{fontStyle: "italic", fontWeight: "bold"}}>
                                                {winnerTeam} won.
                                            </span>
                                        </Typography>
                                    </> : null 
                                }
                            </>
                        ) : 
                        null
                    }
                </DialogContentText>
            </DialogContent>
        );
    }

    return (
        <Dialog open={open} onClose={closeDialog} aria-labelledby="responsive-dialog-title" maxWidth="xl">
            <DialogTitle id="alert-dialog-title">
                <Typography variant={fontVariant} style={{fontSize: 14}}>
                    <b>Match Details - {team1Abbreviation} vs {team2Abbreviation}</b>
                </Typography>
            </DialogTitle>
            <hr/>
            {isMatchDetailsLoading ? (
                <MatchDetailsLoader />
            ) : (
                getDetailsCard()
            )} 
        </Dialog>
    );
}

export default MatchDetails;