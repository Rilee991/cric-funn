import { Dialog, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

function MatchDetails(props) {
    const { matchDetails, open, handleClose, team1Abbreviation, team2Abbreviation, toss = "", winnerTeam = "", matchDetailsLoading = false } = props;

    const closeDialog = () => {
        handleClose && handleClose();
    }

    return (
        <Dialog open={open} onClose={closeDialog} aria-labelledby="responsive-dialog-title" maxWidth="xl">
            <DialogTitle id="alert-dialog-title">{team1Abbreviation} vs {team2Abbreviation}</DialogTitle>
            <hr/>
            {matchDetailsLoading ? (
                <DialogContent>
                    <DialogContentText>
                        <Typography>
                            <Skeleton variant="text" />
                        </Typography>
                        <Typography>
                            <Skeleton variant="text" />
                        </Typography>
                        <Typography>
                            <Skeleton variant="text" />
                        </Typography>
                        <Typography>
                            <Skeleton variant="text" />
                        </Typography>
                    </DialogContentText>
                </DialogContent>
            ) : (
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography>
                            Match Status: {" "}
                            <span style={{fontWeight: "bold"}}>
                                {matchDetails.matchStarted ? "Started" : "Not Started Yet"}
                            </span>
                        </Typography>
                        {matchDetails.matchStarted ? 
                        <>
                            {   toss ? 
                                <Typography>
                                    Toss: {" "}
                                    <span style={{fontStyle: "italic", fontWeight: "bold"}}>
                                        { toss }
                                    </span>
                                </Typography> : ""
                            }
                            {   matchDetails.score ? 
                                <Typography>
                                    Score: {" "}
                                    <span style={{fontStyle: "italic", fontWeight: "bold"}}>
                                        {matchDetails.score}
                                    </span>
                                </Typography> : ""
                            }
                            {winnerTeam ? (
                            <Typography>
                                Result: {" "}
                                <span style={{fontStyle: "italic", fontWeight: "bold"}}>
                                    {winnerTeam} won.
                                </span>
                            </Typography>) : "" }
                        </> : "Match not started yet."}
                    </DialogContentText>
                </DialogContent>
            )} 
        </Dialog>
    );
}

export default MatchDetails;