import React, { useState, useContext, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, DialogTitle, 
    DialogContent, DialogContentText, IconButton, Collapse } from '@material-ui/core';
import moment from 'moment';
import { Divider, Tag } from 'antd';
import { Close } from '@material-ui/icons';

import { ContextProvider } from '../../../global/Context';
import { TEAM_PROPS } from '../../../configs/teamConfigs';
import './Modal.css';

const ViewBetsDialog = (props) => {
    const { matchDetails, open, handleClose, isAdmin } = props;
    const contextConsumer = useContext(ContextProvider);
    const { viewBetsData } = contextConsumer;

    const { team1Abbreviation, team2Abbreviation, id: matchId, seenBy = {} } = matchDetails;
    const [betsData, setBetsData] = useState([]);
    const [openUserIdx, setOpenUserIdx] = useState(-1);

    const closeDialog = () => {
        handleClose && handleClose();
    }

    const viewBets = async() => {
        const data = await viewBetsData(matchId);
        setBetsData(data);
    }

    useEffect(() => {
        viewBets();
    },[]);

    const getFormattedTime = (time) => {
        if(!time)   return "NA";

        time = moment(time*1000).toISOString();

        const date = (time instanceof Date) ? time : new Date(time);
        const formatter = new Intl.RelativeTimeFormat('en');
        const ranges = {
            years: { offset: 3600 * 24 * 365, shortname: "y" },
            months: { offset: 3600 * 24 * 30, shortname: "mo" },
            weeks: { offset: 3600 * 24 * 7, shortname: "w" },
            days: { offset: 3600 * 24, shortname: "d" },
            hours: { offset: 3600, shortname: "h" },
            minutes: { offset: 60, shortname: "m" },
            seconds: { offset: 1, shortname: "s" }
        };
        const secondsElapsed = (date.getTime() - Date.now()) / 1000;
        
        for (let key in ranges) {
            if (ranges[key]["offset"] < Math.abs(secondsElapsed)) {
                const delta = secondsElapsed / ranges[key]["offset"];
                const res = formatter.format(Math.round(delta), key).split(" ");
                return res[0]+ranges[key]["shortname"];
            }
        }

        return "Just now";
    }

    const getColor = (bet) => {
        const props = TEAM_PROPS[bet.teamName];
        
        return props ? props.color : "red";
    }

    const getFormattedEditTime = (time) => {
        if(!time)   return "NA";

        return moment(time*1000).format("hh:mm A on Do");
    }

    const getViewBetsTable = () => {   
        return (
            <TableContainer component={Paper} className="tw-rounded-bl-[30px] tw-rounded-br-[30px] tw-overflow-scroll">
                <Table aria-label="caption table">
                    <caption className="tw-p-2">
                        <Typography variant="overline" className="tw-font-noto">
                            Sorted By Points {`- Seen by (${Object.keys(seenBy).join(", ")})`}
                        </Typography>
                    </caption>
                    <TableHead>
                        <TableRow className="tw-bg-black">
                            <TableCell className="tw-text-white tw-p-3 tw-font-noto" variant="head">PLAYER</TableCell>
                            <TableCell className="tw-text-white tw-p-3 tw-font-noto" align="center" variant="head">TEAM</TableCell>
                            <TableCell className="tw-text-white tw-p-3 tw-font-noto" align="center" variant="head">POINTS</TableCell>
                            <TableCell className="tw-text-white tw-p-3 tw-font-noto" align="center" variant="head">TIME</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {betsData.map((eachBet,i) => (
                            <>
                                <TableRow onClick={() => setOpenUserIdx(prev => prev === i ? -1 : i)} key={eachBet.username} className="tw-bg-[aliceblue] tw-cursor-pointer">
                                    <TableCell className={`tw-p-3 tw-flex tw-gap-1 tw-font-noto ${eachBet.isHighest ? "tw-text-[#188b60] tw-font-bold" : ""}`} scope="row">
                                        {eachBet.username}
                                        {eachBet?.isAllIn === true ? <Tag color={"green-inverse"} className="tw-rounded-3xl tw-font-noto">ALL IN</Tag> : null}
                                    </TableCell>
                                    <TableCell className="tw-p-3 tw-font-noto" align="center"><Tag className="tw-rounded-3xl" color={getColor(eachBet)}>{eachBet.betTeam}</Tag></TableCell>
                                    <TableCell className="tw-p-3 tw-font-noto" align="center">{eachBet.betPoints}</TableCell>
                                    <TableCell className="tw-p-3 tw-font-noto" align="center">{getFormattedTime(eachBet.betTime.seconds)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={i === openUserIdx} timeout="auto" unmountOnExit>
                                            <Typography variant="h6" gutterBottom component="div">
                                                History
                                            </Typography>
                                            <Table size="small" aria-label="purchases">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell classes={{ head: "tw-p-0 tw-font-bold" }} align="left">TEAM</TableCell>
                                                        <TableCell classes={{ head: "tw-p-0 tw-font-bold" }} align="left">BET</TableCell>
                                                        <TableCell classes={{ head: "tw-p-0 tw-font-bold" }} align="center">TIME</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {eachBet?.editHistory?.map((historyRow) => (
                                                        <TableRow>
                                                            <TableCell component="th" scope="row" align="left">
                                                                <Tag className="tw-rounded-3xl" color={TEAM_PROPS[historyRow.selectedTeam].color}>{TEAM_PROPS[historyRow.selectedTeam].abbr}</Tag>
                                                            </TableCell>
                                                            <TableCell align="left" classes={{ body: "tw-p-0" }}>{historyRow.selectedPoints}</TableCell>
                                                            <TableCell align="center">{getFormattedEditTime(historyRow.editedAt.seconds)}</TableCell>
                                                        </TableRow>
                                                    )) || <div className="tw-font-medium tw-mt-2"> No historical record </div>}
                                                </TableBody>
                                            </Table>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    return (
        <Dialog open={open} onClose={closeDialog} maxWidth="xl">
            <DialogTitle className="tw-p-2" style={{ borderRadius: "40px 40px 0px 0px", background: "linear-gradient(353deg, black, #0c4371)" }}>
                <Typography style={{fontSize: 14 }} className="tw-flex tw-font-noto tw-justify-between tw-text-white">
                    <b>#{team1Abbreviation}vs{team2Abbreviation}</b>
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={closeDialog}
                        className="tw-p-0"
                    >
                        <Close className="tw-text-white" />
                    </IconButton>
                </Typography>
            </DialogTitle>
            <Divider className="tw-m-0 tw-bg-white tw-h-[1px]" />
            <DialogContent style={{ borderRadius: "0px", background: "transparent", padding: 0}}>
                <DialogContentText id="alert-dialog-description">
                    { getViewBetsTable() }
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

export default ViewBetsDialog;
