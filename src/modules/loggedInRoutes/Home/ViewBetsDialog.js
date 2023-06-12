import React, { useState, useContext, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core';
import moment from 'moment';
import { Divider, Modal, Tag } from 'antd';

import { ContextProvider } from '../../../global/Context';
import { teamProps } from '../../../config';

const ViewBetsDialog = (props) => {
    const { matchDetails, open, handleClose, isAdmin } = props;
    const contextConsumer = useContext(ContextProvider);
    const { viewBetsData } = contextConsumer;

    const { team1Abbreviation, team2Abbreviation, id: matchId, seenBy = {} } = matchDetails;
    const [betsData, setBetsData] = useState([]);

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
            years: 3600 * 24 * 365,
            months: 3600 * 24 * 30,
            weeks: 3600 * 24 * 7,
            days: 3600 * 24,
            hours: 3600,
            minutes: 60,
            seconds: 1
        };
        const secondsElapsed = (date.getTime() - Date.now()) / 1000;
        
        for (let key in ranges) {
            if (ranges[key] < Math.abs(secondsElapsed)) {
                const delta = secondsElapsed / ranges[key];
                const res = formatter.format(Math.round(delta), key).split(" ");
                return res[0]+res[1][0]+res[1][1];
            }
        }

        return "Just now";
    }

    const getColor = (bet) => {
        console.log(bet);
        const props = teamProps[bet.teamName];
        
        return props ? props.color : "red";
    }

    const getBetRow = () => {   
        return (
            <TableContainer component={Paper} className="tw-rounded-[30px] tw-mt-2 tw-overflow-hidden">
                <Table aria-label="caption table">
                    <caption className="tw-p-2">
                        <Typography variant="overline">
                            Sorted By Points {isAdmin ? `- Seen By (${Object.keys(seenBy)})` : ""}
                        </Typography>
                    </caption>
                    <TableHead>
                        <TableRow className="tw-bg-black">
                            <TableCell className="tw-text-white tw-p-3" variant="head">PLAYER</TableCell>
                            <TableCell className="tw-text-white tw-p-3" align="center" variant="head">TEAM</TableCell>
                            <TableCell className="tw-text-white tw-p-3" align="center" variant="head">POINTS</TableCell>
                            <TableCell className="tw-text-white tw-p-3" align="center" variant="head">TIME</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {betsData.map((eachBet) => (
                            <TableRow key={eachBet.username} className="tw-bg-[aliceblue]">
                                <TableCell className="tw-p-3" component="th" scope="row">{eachBet.username}</TableCell>
                                <TableCell className="tw-p-3" align="center"><Tag className="tw-rounded-3xl" color={getColor(eachBet)}>{eachBet.betTeam}</Tag></TableCell>
                                <TableCell className="tw-p-3" align="center">{eachBet.betPoints}</TableCell>
                                <TableCell className="tw-p-3" align="center">{getFormattedTime(eachBet.betTime.seconds)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    return (
        <Modal style={{ top: 20 }} open={open} title={`${team1Abbreviation} v/s ${team2Abbreviation}`} onCancel={() => closeDialog()} centered footer={null}>
            <Divider className="tw-m-0 tw-bg-black tw-h-[1px]" />
            {getBetRow()}
        </Modal>
    );
}

export default ViewBetsDialog;
