import React, { useState, useContext } from 'react'
import { Button, TextField, Typography, Snackbar, InputAdornment, IconButton, makeStyles, withStyles } from '@material-ui/core';
import { LockOpen, Visibility, VisibilityOff } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import { isEmpty } from 'lodash';
import { Tag } from 'antd';

import PageLoader from '../../../components/common/PageLoader';
import { ContextProvider } from '../../../global/Context';
import iplLogo from '../../../images/logo.png';

const useStyles = makeStyles((theme) => ({
    form: {
      width: '100%', // Fix IE 11 issue.
    },
    submit: {
      margin: theme.spacing(1, 0, 1),
      borderRadius: "40px"
    },
}));

const CustomTextField = withStyles({
    root: {
      '& fieldset': {
        borderWidth: 2,
        borderRadius: "40px"
      }
    },
})(TextField);

const Signup = (props) => {
    const classes = useStyles();
    const { handleToggle } = props;
    const contextConsumer = useContext(ContextProvider) || {};
    const { signUp } = contextConsumer;
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [inputs, setInputs] = useState({ username: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const toggleSignup = () => {
        handleToggle && handleToggle("login");
    }

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleInputs = (event) => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value
        });
    }

    const signUpUser = async (event) => {
        setLoading(true);
        try {
            event.preventDefault();
            await signUp(inputs);
            setInputs({ username: '', email: '', password: '' });
            setError("");
        } catch (e) {
            console.log("Errs:", e);
            setError(e.message);
            setLoading(false);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setError("");
    };

    return (
        loading ? <PageLoader tip="Creating your account..." /> 
        : <>
            <img src={iplLogo} style={{width: 150}}/>
            <Typography variant="overline" style={{ fontSize: 20, fontWeight: 500}}>
                Sign up
            </Typography>
            <form className={classes.form} onSubmit={signUpUser}>
                <CustomTextField
                    variant="outlined"
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
                <CustomTextField
                    variant="outlined"
                    className="tw-mt-3"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={inputs.username}
                    onChange={handleInputs}
                />
                <CustomTextField
                    variant="outlined"
                    className="tw-mt-3"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={inputs.password}
                    onChange={handleInputs}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment>
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    style={{ background: "linear-gradient(44deg, #250c51, #605317)", color: "white" }}
                    className={classes.submit}
                >
                    <Typography variant="overline" className="tw-flex tw-items-center tw-justify-center tw-gap-2" style={{ fontSize: "medium" }}>
                        Sign Up <LockOpen className="tw-text-2xl" />
                    </Typography>
                </Button>
                <div className="tw-flex tw-justify-center tw-mt-2">
                    <div onClick={toggleSignup} className="tw-cursor-pointer">
                        <Tag className="tw-rounded-3xl" color="blue-inverse">Sign Into Existing Account</Tag>
                    </div>
                </div>
            </form>
            <Snackbar open={!isEmpty(error)} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <MuiAlert className="tw-rounded-3xl" variant="filled" onClose={handleClose} severity="error">
                    {error}
                </MuiAlert>
            </Snackbar>
        </>
    )
}

export default Signup;
