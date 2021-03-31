import { Dialog, DialogContent, DialogContentText, DialogTitle, Switch, Typography, Select } from '@material-ui/core';
import React, { useState, useContext, useEffect } from 'react';
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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { ContextProvider } from '../Global/Context';

function ViewBetsDialog(props) {
    const { matchDetails, open, handleBettingCloseDialog, betEndTime, mobileView } = props;
    const { team1Abbreviation, team2Abbreviation, unique_id } = matchDetails;
    const contextConsumer = useContext(ContextProvider);
    const { viewBetsData } = contextConsumer;
    const [betsData, setBetsData] = useState([]);

    const closeDialog = () => {
        handleBettingCloseDialog && handleBettingCloseDialog();
    }

    const viewBets = async() => {
        const data = await viewBetsData(unique_id);
        setBetsData(data);
    }

    useEffect(() => {
        viewBets();
    },[]);

    return (
        <Dialog open={open} onClose={closeDialog} aria-labelledby="responsive-dialog-title" maxWidth="xl">
            <DialogTitle id="alert-dialog-title"><Typography variant="overline" style={{fontSize: 15}}><b>View Bets - {team1Abbreviation} vs {team2Abbreviation}</b></Typography></DialogTitle>
            <hr/>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {betsData.length ?  (
                        <TableContainer component={Paper}>
                            <Table aria-label="caption table">
                                <caption><Typography variant="overline">Sorted By Points</Typography></caption>
                                <TableHead>
                                    <TableRow>
                                        <TableCell variant="footer">USERNAME</TableCell>
                                        <TableCell align="center" variant="footer">TEAM</TableCell>
                                        <TableCell align="center" variant="footer">POINTS</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {betsData.map((eachBet) => (
                                        <TableRow key={eachBet.name}>
                                            <TableCell component="th" scope="row">{eachBet.username}</TableCell>
                                            <TableCell align="center">{eachBet.betTeam}</TableCell>
                                            <TableCell align="center">{eachBet.betPoints}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                      </TableContainer>
                    ): (
                        <Typography variant="overline" align="center">No Bets Done.</Typography>
                    )}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

export default ViewBetsDialog;