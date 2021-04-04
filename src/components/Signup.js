import React, { useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Grid, Typography, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { isEmpty } from 'lodash';
import Loader from 'react-loader-spinner';

import { ContextProvider } from '../Global/Context';
import { loaderHeight, loaderWidth } from '../config';

import iplLogo from '../images/logo.png';

const useStyles = makeStyles((theme) => ({
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
}));

function Signup(props) {
    const classes = useStyles();
    const { handleToggle } = props;
    const contextConsumer = useContext(ContextProvider) || {};
    const { signUp, errorMessage, loading } = contextConsumer;
    const [inputs, setInputs] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [open, setOpen] = useState(false);

    function toggleSignup() {
        handleToggle && handleToggle();
    }

    const handleInputs = (event) => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value
        });
    }

    const signUpUser = (event) => {
        event.preventDefault();

        signUp(inputs);
        setInputs({
            username: '',
            email: '',
            password: ''
        });

        if(!isEmpty(errorMessage)) {
            setOpen(true);
            return;
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    return (
        loading ? 
            <Loader type="Puff" color="#00BFFF" height={loaderHeight} width={loaderWidth} timeout={5000} /> : 
        <>
            <img src={iplLogo} style={{width: 150}}/>
            <Typography variant="overline" style={{ fontSize: 20, fontWeight: 500}}>
                Sign up
            </Typography>
            <form className={classes.form} onSubmit={signUpUser}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    value={inputs.email}
                    onChange={handleInputs}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={inputs.username}
                    onChange={handleInputs}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={inputs.password}
                    onChange={handleInputs}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    <Typography variant="overline" style={{ fontSize: 13, fontWeight: 500}}>
                        Sign Up
                    </Typography>
                </Button>
                <Grid container>
                    <Grid item>
                        <Button variant="text" onClick={toggleSignup}>
                            <Typography variant="overline" style={{ fontSize: 15, fontWeight: 500}}>
                                {"Already have an account?  Log in!"}
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
                <MuiAlert onClose={handleClose} severity="error">
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
        </>
    )
}

export default Signup;
