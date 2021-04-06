import React from 'react';
import { Grid } from '@material-ui/core';
import Loader from 'react-loader-spinner';

import { loaderHeight, loaderWidth, themeColor } from '../../config';

import Copyright from './Copyright';

function LoadingComponent() {
    return (
        <Grid container justify="center" alignContent="center" direction="column">
            <Grid item justify="center">
                <Loader type="Puff" color={themeColor} height={loaderHeight} width={loaderWidth} timeout={5000} />
            </Grid>

            <Grid item>
                <Copyright />
            </Grid>
        </Grid>
    )
}

export default LoadingComponent;