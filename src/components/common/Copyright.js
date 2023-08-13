import React from 'react';
import { Grid, Typography, Link } from '@material-ui/core';

const Copyright = (props) => {
    const { textColor = "black" } = props;

    return (
        <Grid container className="tw-flex tw-flex-col tw-items-center tw-justify-center">
            <Grid item>
                <Typography className="tw-font-noto" style={{ color: textColor }} variant="overline" color="textPrimary" align="center">
                    {'Copyright © '}
                    <Link color="inherit" href="" variant="overline">
                        Cric-Funn
                    </Link>{' '}
                    {`2021-${new Date().getFullYear()}`}
                </Typography>
            </Grid>
            <Grid item>
                <Typography className="tw-font-noto" style={{ color: textColor }} variant="overline" color="textSecondary" align="center">
                    {'Designed and Created by - Cypher33'}
                </Typography>
            </Grid>
        </Grid>
    );
}

export default Copyright;