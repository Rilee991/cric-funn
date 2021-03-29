import { Dialog, DialogContent, DialogContentText, DialogTitle, Switch, Typography, Select } from '@material-ui/core';
import React, { useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Alert } from '@material-ui/lab';

import { ContextProvider } from '../Global/Context';

function BettingDialog(props) {
    const { matchDetails, open, handleBettingCloseDialog, betEndTime, mobileView } = props;
    const { team1Abbreviation, team2Abbreviation, "team-1": team1, "team-2": team2, unique_id } = matchDetails;
    const contextConsumer = useContext(ContextProvider);
    const { loggedInUserDetails, betOnMatch } = contextConsumer;
    const { points } = loggedInUserDetails;
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedPoints, setSelectedPoints] = useState(0);
    const [error, setError] = useState("");
    const [disabledSave, setDisableSave] = useState(true);

    const closeDialog = () => {
        handleBettingCloseDialog && handleBettingCloseDialog();
    }

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
        console.log(selectedTeam, selectedPoints, points);
        if(isEmpty(event.target.value) || isEmpty(selectedPoints) || selectedPoints > points) {
            setDisableSave(true);
        } else {
            setDisableSave(false);
        }
    }

    const handlePointsChange = (event) => {
        setSelectedPoints(event.target.value);
        if(event.target.value > points) {
            setError("Entered points is greater than your current points. Please select a lower value.");
            setDisableSave(true);
        } else {
            setError("");
        }

        
        if(isEmpty(selectedTeam) || isEmpty(event.target.value) || event.target.value > points || event.target.value <= 0) {
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
            await betOnMatch({selectedTeam, selectedPoints, unique_id, isSettled: false, betWon: false, team1, team2, betTime: new Date(), team1Abbreviation, team2Abbreviation});
            closeDialog();
        }
    }

    return (
        <Dialog open={open} onClose={closeDialog} aria-labelledby="responsive-dialog-title" maxWidth="xl">
            <DialogTitle id="alert-dialog-title">Betting Match - {team1Abbreviation} vs {team2Abbreviation}</DialogTitle>
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
                        >
                            <MenuItem value="" disabled>Select Team</MenuItem>
                            <MenuItem value={team1}>{team1}</MenuItem>
                            <MenuItem value={team2}>{team2}</MenuItem>
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
                        />
                        {error ? <Typography variant="overline" color="error">{error}</Typography>: ""}
                        <br/><br/>
                        <Button fullWidth size="small" color="primary" variant="contained" disabled={disabledSave} onClick={() => betInTheMatch()}>
                            Save
                        </Button>
                        <br/><br/>
                        <Alert severity="warning" >
                            <Typography variant="overline">
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