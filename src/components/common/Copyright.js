import React from 'react';
import { Grid, Typography, Link } from '@material-ui/core';

function Copyright() {
    return (
        <Grid container justify="space-evenly" alignContent="space-around" direction="column">
            <Grid item>
                <Typography variant="body2" color="textSecondary" align="center">
                    {'Copyright © '}
                    <Link color="inherit" href="#" variant="overline">
                        Cric-Funn
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="overline" color="textSecondary" align="center">
                    {'Designed and Created by - Cypher33'}
                </Typography>
            </Grid>
        </Grid>
    );
}

export default Copyright;