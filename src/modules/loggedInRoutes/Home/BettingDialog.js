import React, { useState, useContext } from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem, Button, Typography, Select } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { isEmpty } from 'lodash';
import moment from 'moment';

import { ContextProvider } from '../../../global/Context';
import { fontVariant, themeColor } from '../../../config';

const admin = require("firebase");

function BettingDialog(props) {
    const { matchDetails, open, handleClose, betEndTime, points } = props;

    const contextConsumer = useContext(ContextProvider);
    const { betOnMatch } = contextConsumer;

    const { team1Abbreviation, team2Abbreviation, teams, id: matchId, odds } = matchDetails;
    const team1 = teams[0], team2 = teams[1];
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedPoints, setSelectedPoints] = useState("");
    const [error, setError] = useState("");
    const [disabledSave, setDisableSave] = useState(true);

    const closeDialog = () => {
        handleClose && handleClose();
    }

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
        
        if(isEmpty(event.target.value) || isEmpty(selectedPoints) || selectedPoints > points) {
            setDisableSave(true);
        } else {
            setDisableSave(false);
        }
    }

    const handlePointsChange = (event) => {
        setSelectedPoints(event.target.value);
        if(event.target.value.includes(".")) {
            setError("Decimal not allowed bhadwe. Change kar maderchod");
        } else if(event.target.value > points) {
            setError("Entered points is greater than your current points. Please select a lower value.");
        } else {
            setError("");
        }

        
        if(isEmpty(selectedTeam) || isEmpty(event.target.value) || event.target.value > points || event.target.value <= 0 || event.target.value.includes(".")) {
            setDisableSave(true);
        } else {
            setDisableSave(false);
        }
    }

    const betInTheMatch = async () => {
        if(betEndTime < moment()) {
            setError("Betting is closed for this match.");
            window.location.reload(false);
            return;
        } else {
            const betObject = {
                betTime: admin.default.firestore.Timestamp.fromDate(new Date()),
                betWon: false,
                isBetDone: true,
                isNoResult: false,
                isSettled: false, 
                matchId,    
                selectedPoints,
                selectedTeam,  
                team1,
                team1Abbreviation,
                team2,
                odds: {
                    [odds[0].name]: odds[0].price,
                    [odds[1].name]: odds[1].price,
                },
                team2Abbreviation
            }

            await betOnMatch(betObject);
            closeDialog();
        }
    }

    return (
        <Dialog open={open} onClose={closeDialog} aria-labelledby="responsive-dialog-title" maxWidth="xl">
            <DialogTitle id="alert-dialog-title">
                <Typography variant={fontVariant} style={{fontSize: 14}}>
                    <b>{team1Abbreviation} vs {team2Abbreviation} - Betting Window</b>
                </Typography>
                <br/>
                <Typography variant={fontVariant} style={{fontSize: 10}}>
                    <b>Remaining Points: {points - selectedPoints}</b><br/>
                </Typography>
            </DialogTitle>
            <hr/>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <form>
                        <Select
                            labelId="demo-simple-select-placeholder-label-label"
                            id="demo-simple-select-placeholder-label"
                            fullWidth
                            aria-placeholder="Text"
                            defaultValue="placeholder"
                            variant="outlined"
                            value={selectedTeam}
                            displayEmpty
                            onChange={handleTeamChange}
                            inputProps={{ 'aria-label': 'Without label' }}
                            required
                        >
                            <MenuItem value="" disabled><Typography variant="overline">Select Team</Typography></MenuItem>
                            <MenuItem value={team1}><Typography variant="overline">{team1}</Typography></MenuItem>
                            <MenuItem value={team2}><Typography variant="overline">{team2}</Typography></MenuItem>
                        </Select>
                        <br/><br/>
                        <TextField 
                            fullWidth 
                            type="number" 
                            id="outlined-basic" 
                            label="Enter Betting Points"
                            variant="outlined"
                            value={selectedPoints}
                            onChange={handlePointsChange}
                            required
                        />
                        {error ? <Typography variant="overline" color="error">{error}</Typography>: ""}
                        <br/><br/>
                        <Button fullWidth size="small" style={{ backgroundColor: !disabledSave ? themeColor : 'grey', color: "white" }} variant="contained" disabled={disabledSave} onClick={() => betInTheMatch()}>
                            <Typography variant="overline" style={{ fontSize: 15, fontWeight: 500}}>
                                {"Save"}
                            </Typography>
                        </Button>
                        <br/><br/>
                        <Alert severity="warning" >
                            <Typography variant="body">
                                <b>Once bet cannot be edited.</b>
                            </Typography>
                        </Alert>
                    </form>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

export default BettingDialog;