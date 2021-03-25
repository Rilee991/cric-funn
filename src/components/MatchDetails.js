import { Dialog, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';
import React, { useState } from 'react';

function MatchDetails(props) {
    const { matchDetails, open, handleClose, team1Abbreviation, team2Abbreviation, toss = "", winnerTeam = "" } = props;

    const closeDialog = () => {
        handleClose && handleClose();
    }

    return (
        <Dialog open={open} onClose={closeDialog} aria-labelledby="responsive-dialog-title" maxWidth="xl">
            <DialogTitle id="alert-dialog-title">{team1Abbreviation} vs {team2Abbreviation}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Typography>Stats</Typography>
                    <Typography>
                        Match {" "}
                        <span style={{fontStyle: "italic", fontWeight: "bold"}}>
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
                        <Typography>
                            Score {" "}
                            <span style={{fontStyle: "italic", fontWeight: "bold"}}>
                                {matchDetails.score}
                            </span>
                        </Typography>
                        {winnerTeam ? (
                        <Typography>
                            Result: {" "}
                            <span style={{fontStyle: "italic", fontWeight: "bold"}}>
                                {winnerTeam} won.
                            </span>
                        </Typography>) : "" }
                    </> : "Score not present yet."}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

export default MatchDetails;