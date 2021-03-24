import React, { useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { isEmpty } from 'lodash';
import Loader from 'react-loader-spinner';

import { ContextProvider } from '../Global/Context';

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
            <Loader type="Puff" color="#00BFFF" height={100} width={200} timeout={5000} /> : 
        <>
            <Avatar className={classes.avatar}></Avatar>
            <Typography component="h1" variant="h5">
                Sign Up
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
                    name="username"
                    label="Username"
                    id="username"
                    autoComplete="username"
                    value={inputs.username}
                    onChange={handleInputs}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
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
                    Sign Up
                </Button>
                <Grid container>
                    <Grid item>
                        <Button onClick={toggleSignup}>
                            {"Already have an account?  Log in!"}
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
