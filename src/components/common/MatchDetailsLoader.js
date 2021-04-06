import React from 'react';
import { DialogContent, DialogContentText, Typography } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

function MatchDetailsLoader() {
    return (
        <DialogContent>
            <DialogContentText>
                <Typography>
                    <Skeleton variant="text" />
                </Typography>
                <Typography>
                    <Skeleton variant="text" />
                </Typography>
                <Typography>
                    <Skeleton variant="text" />
                </Typography>
                <Typography>
                    <Skeleton variant="text" />
                </Typography>
            </DialogContentText>
        </DialogContent>
    );
}

export default MatchDetailsLoader;