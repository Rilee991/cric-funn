import React from 'react';
import { Typography, Card, CardActionArea, CardContent, Divider, Button, CardActions } from '@material-ui/core';

import { syncDbWithNewMatches, saveMatchesToDb } from '../../../apis/cricapiController';
import { dumpUsers } from '../../../apis/userController';
import { updateCredits } from '../../../apis/configurationsController';

const Shortcuts = (props) => {
    const { setLoading, setMessage, setTip, setSeverity, loggedInUserDetails, configurations, setConfigurations } = props;

    const syncMatches = async () => {
        setTip("Syncing new matches...");
        setLoading(true);
        try {
            const { configDocId, currentHits } = await syncDbWithNewMatches(loggedInUserDetails.username);
            await updateCredits(configDocId, loggedInUserDetails.username, currentHits, configurations, setConfigurations);
            setMessage("Synced matches successfully!");
            setSeverity("success");
        } catch (e) {
            setSeverity("error");
            setMessage(e.message);
        }
        setLoading(false);
    }

    const dumpAndReset = async () => {
        setTip("Dumping users...");
        setLoading(true);
        try {
            await dumpUsers();
            setTip("Resetting users...");
            setMessage("Users dumped successfully!");
            setSeverity("success");
        } catch (e) {
            setSeverity("error");
            setMessage(e.message);
        }
        setLoading(false);
    }

    const cascadeNewSeries = async () => {
        setTip("Cascading new matches...");
        setLoading(true);
        try {
            const { configDocId, currentHits } = await saveMatchesToDb();
            await updateCredits(configDocId, loggedInUserDetails.username, currentHits, configurations, setConfigurations);
            setMessage("Matches cascaded successfully!");
            setSeverity("success");
        } catch (e) {
            setSeverity("error");
            setMessage(e.message);
        }
        setLoading(false);
    }

    return (
        <Card style={{ boxShadow: "5px 5px 20px" }} className="tw-mt-2 tw-mb-10 xl:tw-w-[70%] md:tw-w-[90%] tw-rounded-[40px]">
            <CardActionArea style={{ background: "linear-gradient(44deg, rgb(37, 12, 81), rgb(96, 83, 23))" }}>
                <CardContent style={{ "background": "linear-gradient(44deg, #250c51, #605317)"}} className="tw-rounded-[40px] tw-flex tw-flex-col tw-items-center tw-p-2">
                    <Typography className="tw-flex tw-items-center tw-gap-2 tw-text-white tw-font-mono tw-italic" variant={"button"} style={{fontSize: 20}} component="p">
                        <b>{`Shortcut Buttons`}</b>
                    </Typography>
                    <Divider className="tw-bg-white tw-w-4/5" />
                </CardContent>
                <CardActions className="tw-flex tw-flex-col sm:tw-flex-row tw-justify-center tw-gap-2">
                    <Button variant="contained" color="primary" onClick={syncMatches}>Sync new matches</Button>
                    <Button variant="contained" className="tw-bg-cyan-700 tw-text-white" onClick={cascadeNewSeries}>Cascade new series</Button>
                    <Button variant="contained" className="tw-bg-orange-700 tw-text-white" onClick={dumpAndReset}>Dump and reset users</Button>
                </CardActions>
            </CardActionArea>
        </Card>
    );
}

export default Shortcuts;