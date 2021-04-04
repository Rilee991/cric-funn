import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Paper, Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Signin from './Signin';
import Signup from './Signup';
import Social from './Social';
import Copyright from './Copyright';

function Footer() {
  return (
    <Grid container justify="space-evenly" alignContent="space-around" direction="column">
      <Grid item>
        <Copyright />
      </Grid>
      <Grid item>
          <Social />
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/collection/10002418)',
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
}));

export default function LoggedOutComponent() {
  const classes = useStyles();
  const [toggleLogin, setToggleLogin] = useState(true);

  function handleToggle() {
      setToggleLogin(!toggleLogin);
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
            { toggleLogin ? 
                <Signin handleToggle={handleToggle}/> 
              : 
                <Signup handleToggle={handleToggle}/>
            }
            <Box mt={5}>
                <Footer />
            </Box>
        </div>
      </Grid>
    </Grid>
  );
}