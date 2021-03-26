import React, { useContext } from 'react';
import { isEmpty } from 'lodash';
import Loader from 'react-loader-spinner';

import { ContextProvider } from '../Global/Context';
import Home from './Home';
import LoggedOutComponent from './LoggedOutComponent';
import { Grid, Typography, Link } from '@material-ui/core';

function Auth() {
    const contextConsumer = useContext(ContextProvider) || {};
    const { loggedInUserDetails = {}, loading } = contextConsumer;

    return (
        <>
            { loading ? 
            (
                <>
                    <Grid container justify="space-evenly" alignContent="space-around" direction="column">
                        <Grid item>
                            <Loader type="Puff" color="#0008ff" height={100} width={200} timeout={5000} />
                        </Grid>
                        <Grid item>
                            <Typography variant="body2" color="textSecondary" align="center">
                                {'Copyright © '}
                                <Link color="inherit" href="#">
                                    Cric-Funn
                                </Link>{' '}
                                {new Date().getFullYear()}
                                {'.'}
                            </Typography>
                        </Grid>
                        <br/>
                        <Grid item>
                            <Typography variant="body2" color="textSecondary" align="center">
                                {'Author - Cypher33'}
                            </Typography>
                        </Grid>
                    </Grid>
                </>
            )
            : (
                !isEmpty(loggedInUserDetails) ? <Home loggedInUserDetails={loggedInUserDetails}/> : <LoggedOutComponent />
            ) }
        </>
    );
}
export default Auth;
