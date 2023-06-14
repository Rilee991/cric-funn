import React from 'react';
import { Grid, Typography, Link } from '@material-ui/core';

const Copyright = (props) => {
    const { textColor = "black" } = props;

    return (
        <Grid container justify="space-evenly" alignContent="space-around" direction="column">
            <Grid item>
                <Typography style={{ color: textColor }} variant="body2" color="textPrimary" align="center">
                    {'Copyright © '}
                    <Link color="inherit" href="" variant="overline">
                        Cric-Funn
                    </Link>{' '}
                    {"2021."}
                </Typography>
            </Grid>
            <Grid item>
                <Typography style={{ color: textColor }} variant="overline" color="textSecondary" align="center">
                    {'Designed and Created by - Cypher33'}
                </Typography>
            </Grid>
        </Grid>
    );
}

export default Copyright;