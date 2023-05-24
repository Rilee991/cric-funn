import React from 'react';
import { Card, CardActionArea, CardContent, SwipeableDrawer, Typography } from '@material-ui/core';

const Notifications = (props) => {
    const { isNotificationsOpen, setIsNotificationsOpen } = props;
    const notifications = [];

    const getNotifications = () => {
        return (
            <>
                <Typography variant={"button"} style={{fontSize: 18}}>
                    <b>Notifications</b>
                </Typography>
                <div> {
                notifications.length ? notifications.map(notification => {
                    return (
                    <Card style={{width: '100%', marginBottom: "20px", backgroundColor:"lightgray", color: notification.isNoResult ? "purple" : (notification.betWon ? "green" : "red")}}>
                        <CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant={"overline"} style={{fontSize: 20}} component="h2">
                            <b>{notification.title}</b>
                            </Typography>
                            <Typography variant={"caption"} style={{fontSize: 13}} color="textSecondary" component="p">
                            <b>{notification.body}</b>
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </Card>
                    )
                }) : 
                <Typography gutterBottom variant={"button"} style={{fontSize: 13}} component="h2">
                    <b>{"No New Notifications."}</b>
                </Typography>
                } </div>
            </>
        );
    }

    return (
        <div>
            <SwipeableDrawer onBackdropClick={() => setIsNotificationsOpen(false)} anchor="bottom" open={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)}>
                <div className="tw-p-2 tw-flex tw-flex-col tw-items-center">{getNotifications()}</div>
            </SwipeableDrawer>
        </div>
    );
}

export default Notifications;
