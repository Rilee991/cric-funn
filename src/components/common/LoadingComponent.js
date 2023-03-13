import React from 'react';
import { Grid } from '@material-ui/core';
import { GridLoader } from 'react-spinners';

import { themeColor } from '../../config';

import Copyright from './Copyright';

const LoadingComponent = () => {
    return (
        <Grid container justify="center" alignContent="center" direction="column">
            <br/><br/><br/><br/><br/><br/>
            <Grid item>
                <GridLoader color={themeColor} size={30} speedMultiplier={0.7}/>
            </Grid>
            <Grid item>
                <Copyright />
            </Grid>
        </Grid>
    )
}

export default LoadingComponent;