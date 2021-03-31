import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { ListItem, ListItemIcon, ListItemText, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Facebook, LinkedIn, Twitter } from '@material-ui/icons';

import Signin from './Signin';
import Signup from './Signup';

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
          <ListItem button style={{justifyContent:"center"}}>
              <Button color="primary" onClick={() => window.open(
                'https://www.facebook.com/StoneCypher33',
                '_blank'
              )}>
                  <Facebook color="primary" fontSize="large" />
              </Button>

              <Button color="primary" onClick={() => window.open(
                'https://www.linkedin.com/in/rohit-kumar-a92418141/',
                '_blank'
              )}>
                  <LinkedIn color="primary" fontSize="large" />
              </Button>

              <Button color="primary" onClick={() => window.open(
                'https://twitter.com/IamRohitKumar22',
                '_blank'
              )}>
                  <Twitter color="primary" fontSize="large" />
              </Button>
          </ListItem>
          
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
            {toggleLogin ? <Signin handleToggle={handleToggle}/> : <Signup handleToggle={handleToggle}/>}
            <Box mt={5}>
                <Copyright />
            </Box>
        </div>
      </Grid>
    </Grid>
  );
}