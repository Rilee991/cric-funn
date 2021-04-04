import React, { useState, useContext, useEffect } from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core';

import { ContextProvider } from '../Global/Context';

function ViewBetsDialog(props) {
    const { matchDetails, open, handleClose } = props;
    const contextConsumer = useContext(ContextProvider);
    const { viewBetsData } = contextConsumer;

    const { team1Abbreviation, team2Abbreviation, unique_id } = matchDetails;
    const [betsData, setBetsData] = useState([]);

    const closeDialog = () => {
        handleClose && handleClose();
    }

    const viewBets = async() => {
        const data = await viewBetsData(unique_id);
        setBetsData(data);
    }

    useEffect(() => {
        viewBets();
    },[]);

    function getBetsTable() {
        return (
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
                            <TableRow key={eachBet.username}>
                                <TableCell component="th" scope="row">{eachBet.username}</TableCell>
                                <TableCell align="center">{eachBet.betTeam}</TableCell>
                                <TableCell align="center">{eachBet.betPoints}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
          </TableContainer>
        );
    }

    return (
        <Dialog open={open} onClose={closeDialog} aria-labelledby="responsive-dialog-title" maxWidth="xl">
            <DialogTitle id="alert-dialog-title">
                <Typography variant="overline" style={{fontSize: 14}}>
                    <b>View Bets - {team1Abbreviation} vs {team2Abbreviation}</b>
                </Typography>
            </DialogTitle>
            <hr/>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {   betsData.length ? (
                            getBetsTable()
                        ) : (
                            <Typography variant="overline" align="center">No Bets Done.</Typography>
                        )
                    }
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

export default ViewBetsDialog;