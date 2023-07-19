import React from 'react';
import { Grid } from '@material-ui/core';
import { ScaleLoader } from 'react-spinners';

import Copyright from './Copyright';

const LoadingComponent = () => {
    return (
        <Grid container justify="center" alignContent="center" direction="column">
            <br/><br/><br/><br/>
            <Grid item className="tw-flex tw-justify-center">
                <ScaleLoader color={"#4B0082"} size={30} speedMultiplier={0.7}/>
            </Grid>
            <br/><br/>
            <Grid item>
                <Copyright />
            </Grid>
        </Grid>
    )
}

export default LoadingComponent;