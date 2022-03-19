import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';

import { fontVariant } from '../../../config';

import MatchDetailsLoader from '../../common/MatchDetailsLoader';

const MatchDetails = (props) => {
    const { matchDetails, open, handleClose, team1Abbreviation, team2Abbreviation, isMatchDetailsLoading = false } = props;
    const { score = [], status = "" } = matchDetails;

    const closeDialog = () => {
        handleClose && handleClose();
    }

    const getDetailsCard = () => {
        return (
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <> 
                        { score.length ? 
                            <>
                                <Typography variant={fontVariant}>
                                    <span style={{fontStyle: "italic", fontWeight: "bold"}}>
                                        {`${score[0].inning.replace(' Inning 1','')}: ${score[0].r}/${score[0].w} (${score[0].o})`}
                                        <br/>
                                        {`${score[1].inning.replace(' Inning 1','')}: ${score[1].r}/${score[1].w} (${score[1].o})`}
                                        <br/>
                                    </span>
                                </Typography> 
                            </> : null
                        } 
                        <Typography variant={fontVariant}>
                            <span style={{fontWeight: "bold", fontStyle: "italic"}}>
                                {status}
                            </span>
                        </Typography>
                    </>
                </DialogContentText>
            </DialogContent>
        );
    }

    return (
        <Dialog open={open} onClose={closeDialog} aria-labelledby="responsive-dialog-title" maxWidth="xl">
            <DialogTitle id="alert-dialog-title">
                <Typography variant={fontVariant} style={{fontSize: 14}}>
                    <b>{team1Abbreviation} vs {team2Abbreviation} - Details </b>
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
