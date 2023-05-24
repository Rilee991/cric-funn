import React, { useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Grid, Typography, Snackbar, InputAdornment, IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import { isEmpty } from 'lodash';
import Loader from 'react-loader-spinner';

import { ContextProvider } from '../../../Global/Context';
import { loaderHeight, loaderWidth, themeColor } from '../../../config';

import iplLogo from '../../../images/logo.png';

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
    loader: {
        display: 'flex',
        '& > * + *': {
        marginLeft: theme.spacing(2),
        }
    }
}));

const ForgotPassword = (props) => {
    const classes = useStyles();
    const { handleToggle } = props;
    const contextConsumer = useContext(ContextProvider) || {};
    const { sendResetPasswordEmail, errorMessage, loading } = contextConsumer;

    const [inputs, setInputs] = useState({
        email: ''
    });
    const [open, setOpen] = useState(false);

    function toggleSignin() {
        handleToggle && handleToggle("login");
    }

    const handleInputs = (event) => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value
        });
    }

    const saveResetPasswordEmail = (event) => {
        event.preventDefault();
        sendResetPasswordEmail(inputs);
        setInputs({
            email: ''
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
    }

    return (
        loading ? 
            <Loader type="Puff" color="#0008ff" height={loaderHeight} width={loaderWidth} timeout={5000} /> : 
        <>
            <img src={iplLogo} style={{width: 150}}/>
            <Typography variant="overline" style={{ fontSize: 20, fontWeight: 500}}>
                Forgot Password
            </Typography>
            <form className={classes.form} onSubmit={saveResetPasswordEmail}>
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

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    style={{ backgroundColor: themeColor, color: "white" }}
                    className={classes.submit}
                >
                    <Typography variant="overline" style={{ fontSize: 13, fontWeight: 500}}>
                        Send Mail
                    </Typography>
                </Button>
                <Grid container spacing={2}>
                    <Grid item xs>
                        <Button variant="text" onClick={toggleSignin}>
                            <Typography variant="overline" style={{ fontSize: 12, fontWeight: 500}}>
                                {"Back to Login"}
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
            </form>
            
            <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                <MuiAlert onClose={handleClose} severity="error">
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
        </>
    );
}

export default ForgotPassword;
