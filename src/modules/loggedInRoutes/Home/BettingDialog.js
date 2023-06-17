import React, { useState, useContext, useEffect } from 'react';
import { makeStyles, TextField, MenuItem, Button, Typography, Select, withStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { CheckCircleOutline, CheckCircle } from '@material-ui/icons';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Divider, Modal, Tag } from 'antd';

import { ContextProvider } from '../../../global/Context';
import { getFirebaseCurrentTime } from '../../../global/adhocUtils';

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
        borderRadius: "40px"
      }
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
    const [selectedPoints, setSelectedPoints] = useState("");
    const [error, setError] = useState("");
    const [disabledSave, setDisableSave] = useState(true);
    const [allInEnabled, setAllInEnabled] = useState(false);

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
        if(betEndTime < moment()) {
            setError("Betting is closed for this match.");
            window.location.reload(false);
            return;
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
            closeDialog();
        }
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
                <form>
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
                        <MenuItem value="" disabled><Typography variant="overline">Select Team</Typography></MenuItem>
                        <MenuItem value={team1} style={{ justifyContent: "center", marginBottom: "1px", borderRadius: "40px", color:"white", background: `linear-gradient(172deg, ${oddsParams.team1Color || "blue"}, #0c0000)`, width: "100%" }}><Typography variant="button">{team1}</Typography></MenuItem>
                        <MenuItem value={team2} style={{ justifyContent: "center", borderRadius: "40px", color:"white", background: `linear-gradient(172deg, ${oddsParams.team2Color || "red"}, #0c0000)`, width: "100%" }}><Typography variant="button">{team2}</Typography></MenuItem>
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
                    <Button fullWidth size="small" className="tw-w-full tw-rounded-[40px] tw-mb-3" style={{ background: !disabledSave ? "linear-gradient(44deg, #250c51, #605317)" : 'grey', color: "white" }} variant="contained" disabled={disabledSave} onClick={() => betInTheMatch()}>
                        <Typography variant="overline" style={{ fontSize: 15, fontWeight: 500}}>
                            {"Save"}
                        </Typography>
                    </Button>
                    <Alert severity="warning" variant="filled" className="tw-rounded-[40px] tw-flex tw-justify-center" classes={{ icon: classes.customIcon }}>
                        <Typography variant="body">
                            <b>{allInEnabled ? "Warning! You've opted for Double OR Nothing! If you loose, it'll be over. " : ""}Once bet cannot be edited.</b>
                        </Typography>
                    </Alert>
                </form>
            </div>
        );
    }

    return (
        <Modal style={{ top: 20 }} open={open} title={`${team1Abbreviation} v/s ${team2Abbreviation}`} onCancel={() => closeDialog()} centered footer={null}>
            <div className="tw-flex tw-justify-between tw-mb-2">
                <div>
                    <Tag color="geekblue" className="tw-rounded-3xl">
                        <Typography variant="button" style={{fontSize: 11}}>
                            <b>Pts Left: {points - selectedPoints}</b><br/>
                        </Typography>
                    </Tag>
                </div>
                <div className="tw-cursor-pointer" onClick={() => onClickAllIn()}>
                    <Tag color={allInEnabled ? "green-inverse" : "green"} className="tw-rounded-3xl">
                        <Typography variant="button" style={{fontSize: 11}}>
                            <b className="tw-flex tw-items-center tw-justify-between">Double Or Nothing {allInEnabled ? <CheckCircle className="tw-h-5" /> : <CheckCircleOutline className="tw-h-5" />} </b>
                        </Typography>
                    </Tag>
                </div>
            </div>
            <Divider className="tw-m-0 tw-bg-black tw-h-[1px] tw-mb-2" />
            {getBettingContent()}
        </Modal>
    );
}

export default BettingDialog;