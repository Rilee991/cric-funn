import React, { useState, useContext, useEffect } from 'react';
import { makeStyles, TextField, MenuItem, Typography, Select, withStyles, Dialog, DialogTitle, IconButton, 
    DialogContent, DialogContentText
} from '@material-ui/core';
import { CheckCircleOutline, CheckCircle, Close } from '@material-ui/icons';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Divider, Tag } from 'antd';

import { ContextProvider } from '../../../global/Context';
import { getFirebaseCurrentTime } from '../../../global/adhocUtils';
import SwipeButton from '../../../components/common/SwipeButton';

const useStyles = makeStyles((theme) => ({
    customRoot: {
        borderRadius: "40px"
    },
    customIcon: {
        display: "none"
    }
}));

const CustomTextField = withStyles({
    root: {
        '& fieldset': {
            borderWidth: 2,
            borderRadius: "40px",
            borderColor: "grey",
            fontFamily: "Noto Sans",
        },
        '& label': {
            fontFamily: "Noto Sans",
        },
        '& div': {
            fontFamily: "Noto Sans"
        },
    },
})(TextField);

const BettingDialog = (props) => {
    const { matchDetails, open, handleClose, betEndTime, points, oddsParams } = props;
    const classes = useStyles();

    const contextConsumer = useContext(ContextProvider);
    const { betOnMatch } = contextConsumer;

    const { team1Abbreviation, team2Abbreviation, teams, id: matchId, odds } = matchDetails;
    const team1 = teams[0], team2 = teams[1];
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedPoints, setSelectedPoints] = useState(0);
    const [error, setError] = useState("");
    const [disabledSave, setDisableSave] = useState(true);
    const [allInEnabled, setAllInEnabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const closeDialog = () => {
        handleClose && handleClose();
    }

    useEffect(() => {
        if(isEmpty(selectedTeam) || !selectedPoints || selectedPoints <= 0 || selectedPoints > points || selectedPoints.toString().includes(".")) {
            setDisableSave(true);
        } else {
            setDisableSave(false);
        }
    },[selectedTeam, selectedPoints])

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
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
    }

    const betInTheMatch = async () => {
        setLoading(true);
        if(betEndTime < moment()) {
            setError("Betting is closed for this match.");
        } else {
            const betObject = {
                betTime: getFirebaseCurrentTime(),
                betWon: false,
                isBetDone: true,
                isNoResult: false,
                isSettled: false,
                matchId,
                selectedPoints: parseInt(selectedPoints),
                selectedTeam,
                team1,
                team1Abbreviation,
                team2,
                team2Abbreviation,
                odds: {
                    [odds[0].name]: parseFloat(odds[0].price),
                    [odds[1].name]: parseFloat(odds[1].price),
                }
            }

            await betOnMatch(betObject);
            setSelectedTeam("");
            setSelectedPoints(0);
        }
        setLoading(false);
        setTimeout(() => {
            closeDialog();
        },1000);
    }

    const onClickAllIn = () => {
        if(allInEnabled) {
            setAllInEnabled(false);
            setSelectedPoints("");
        } else {
            setAllInEnabled(true);
            setSelectedPoints(points);
        }
    }

    const getBettingContent = () => {
        return (
            <div>
                <form className="tw-mt-1">
                    <Select
                        fullWidth
                        defaultValue="placeholder"
                        variant="outlined"
                        value={selectedTeam}
                        displayEmpty
                        onChange={handleTeamChange}
                        inputProps={{ 'aria-label': 'Without label' }}
                        required
                        className="tw-rounded-[40px] tw-mb-3"
                    >
                        <MenuItem value="" disabled><Typography variant="overline" className="tw-font-noto">Select Team</Typography></MenuItem>
                        <MenuItem value={team1} style={{ justifyContent: "center", marginBottom: "1px", borderRadius: "40px", color:"white", background: `linear-gradient(172deg, ${oddsParams.team1Color || "blue"}, #0c0000)`, width: "100%" }}><Typography variant="button" className="tw-font-noto">{team1}</Typography></MenuItem>
                        <MenuItem value={team2} style={{ justifyContent: "center", borderRadius: "40px", color:"white", background: `linear-gradient(172deg, ${oddsParams.team2Color || "red"}, #0c0000)`, width: "100%" }}><Typography variant="button" className="tw-font-noto">{team2}</Typography></MenuItem>
                    </Select>
                    <CustomTextField
                        fullWidth
                        type="number"
                        label="Enter Betting Points"
                        variant="outlined"
                        value={selectedPoints}
                        onChange={handlePointsChange}
                        required
                        disabled={allInEnabled}
                        className="tw-mb-3"
                    />
                    {error ? <Typography variant="body1" color="error">*{error}</Typography>: ""}
                    {/* <Button fullWidth size="small" className="tw-w-full tw-rounded-[40px] tw-mb-3" style={{ background: !disabledSave ? "linear-gradient(0deg, #1b004a, #50045a)" : 'grey', color: "white" }} variant="contained" disabled={disabledSave} onClick={() => betInTheMatch()}>
                        <Typography variant="overline" style={{ fontSize: 15, fontWeight: 500}}>
                            {"Go For Glory!"}
                        </Typography>
                    </Button> */}
                    <SwipeButton loading={loading} disabled={disabledSave} color='#6c5be1' text='SLIDE TO EXECUTE' onSuccess={() => betInTheMatch()} />
                    {/* <Alert severity="warning" variant="filled" className="tw-rounded-[40px] tw-flex tw-justify-center" classes={{ icon: classes.customIcon }}>
                        <Typography variant="body">
                            <b>{allInEnabled ? "Warning! You're going ALL IN! Shout victory is mine! " : ""}Once bet cannot be edited.</b>
                        </Typography>
                    </Alert> */}
                </form>
            </div>
        );
    }

    return (
        <Dialog open={open} onClose={closeDialog} maxWidth="xl">
            <DialogTitle className="tw-p-2" style={{ borderRadius: "40px 40px 0px 0px", background: "linear-gradient(353deg, black, #0c4371)" }}>
                <Typography variant="button" style={{fontSize: 14 }} className="tw-flex tw-justify-between tw-text-white tw-font-noto">
                    <b>{team1Abbreviation} v/s {team2Abbreviation}</b>
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={closeDialog}
                        className="tw-p-0"
                    >
                        <Close className="tw-text-white" />
                    </IconButton>
                </Typography>
            </DialogTitle>
            <div className="tw-flex tw-justify-between tw-p-1" style={{ background: "linear-gradient(180deg, black, #199309)" }}>
                 <div>
                     <Tag color={points - selectedPoints < 500 ? "red-inverse" : "geekblue"} className="tw-rounded-3xl">
                         <Typography variant="button" style={{fontSize: 12}} className="tw-font-noto">
                             <b>Pts Left: {points - selectedPoints}</b><br/>
                         </Typography>
                     </Tag>
                 </div>
                 <div className="tw-cursor-pointer glow-on-hover" onClick={() => onClickAllIn()}>
                     <Tag color={allInEnabled ? "green-inverse" : "green"} className="tw-rounded-3xl">
                         <Typography variant="button" style={{fontSize: 12}}>
                             <b className="tw-flex tw-items-center tw-justify-between tw-font-noto">Go All In {allInEnabled ? <CheckCircle className="tw-h-5" /> : <CheckCircleOutline className="tw-h-5" />} </b>
                         </Typography>
                     </Tag>
                 </div>
             </div>
            <Divider className="tw-m-0 tw-bg-white tw-h-[1px]" />
            <DialogContent style={{ borderRadius: "0px 0px 40px 40px", padding: "0px 8px 0px 8px", background: "#fff" }}>
                <DialogContentText id="alert-dialog-description">
                    { getBettingContent() }
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

export default BettingDialog;