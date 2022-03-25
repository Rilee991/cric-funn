import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';
import { get } from 'lodash';

import { fontVariant } from '../../../config';

import MatchDetailsLoader from '../../common/MatchDetailsLoader';

const MatchDetails = (props) => {
    const { matchDetails, open, handleClose, team1Abbreviation, team2Abbreviation, isMatchDetailsLoading = false } = props;
    const { score = [], status = "", teams = [] } = matchDetails;
    const team1 = get(teams,'[0]','');
    const team2 = get(teams,'[1]','');

    const closeDialog = () => {
        handleClose && handleClose();
    }

    const getTeamName = (team) => {
        team = team.replace(' Inning 1','');
        team = team.replace(' Inning 2','');
        
        if(team === team1)  return team2;

        return team1;
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
                                        {score.map(sc => (
                                            <>
                                                {`${getTeamName(sc.inning)}: ${sc.r}/${sc.w} (${sc.o} Overs)`}
                                                <br/>
                                            </>
                                        ))}
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
