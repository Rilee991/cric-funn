import React from 'react';
import { Card, CardActionArea, CardContent, Divider, makeStyles, SwipeableDrawer, Typography } from '@material-ui/core';
import { CloseRounded, SentimentSatisfied, SentimentVeryDissatisfied, SentimentVerySatisfied } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    infoAlertSettings: {
        background: "linear-gradient(45deg, #6292ff, #b475fd)"
    },
    contentColorSettings: {
        color: "aliceblue !important"
    }
}))

const Notifications = (props) => {
    const { notifications = [], isNotificationsOpen, setIsNotificationsOpen } = props;
    const classes = useStyles();

    const getNotifications = () => {
        return (
            <>
                <Typography variant={"button"} style={{ fontSize: 18, background: "linear-gradient(45deg, #97c4f5, #002c43)", color: "aliceblue", padding: "4px", borderRadius: "20px" }}>
                    <b>Notifications</b>
                </Typography>
                <div onClick={() => setIsNotificationsOpen(false) } style={{cursor: "pointer", fontSize: 18, position: "absolute", right: 0, marginRight: 10 }}>
                    <CloseRounded />
                </div>
                <Divider className="tw-w-full tw-my-2" />
                <div className="tw-w-full"> {
                    notifications.length ? notifications.map((notification, idx) => (
                        <Card key={idx} className="tw-rounded-[40px]" style={{width: '100%', marginBottom: "20px", background: notification.isNoResult ? "linear-gradient(rgb(123 16 199), black)" : notification.betWon ? "linear-gradient(rgb(73 199 16), black)" : "linear-gradient(180deg, #b21616, black)", color: "aliceblue" }}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography variant={"button"} style={{fontSize: 13, gap: "4px", color: "aliceblue", display: "flex", justifyContent: "center", alignItems: "center"}} component="p">
                                        {notification.isNoResult ? <SentimentSatisfied /> : notification.betWon ? <SentimentVerySatisfied /> : <SentimentVeryDissatisfied />} <b>{notification.body}</b>
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    )) :
                    <Alert classes={{ standardSuccess: classes.infoAlertSettings, icon: classes.contentColorSettings, message: classes.contentColorSettings }} className="tw-rounded-[40px] tw-flex tw-justify-center tw-items-center tw-text-[aliceblue]">
                        <Typography variant={"button"} style={{fontSize: 15}} component="p">
                            <b>No New Notifications</b>
                        </Typography>
                    </Alert>
                } </div>
            </>
        );
    }

    return (
        <div>
            <SwipeableDrawer  onBackdropClick={() => setIsNotificationsOpen(false)} anchor="bottom" open={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)}>
                <div className="tw-p-2 tw-flex tw-flex-col tw-items-center">{getNotifications()}</div>
            </SwipeableDrawer>
        </div>
    );
}

export default Notifications;
