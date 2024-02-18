import React, { useState, useContext } from 'react'
import { Button, TextField, Typography, Snackbar, InputAdornment, IconButton, makeStyles, withStyles } from '@material-ui/core';
import { SportsBaseball, Visibility, VisibilityOff } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import { isEmpty } from 'lodash';
import { Tag } from 'antd';

import iplLogo from '../../../res/images/logo.png';

import PageLoader from '../../../components/common/PageLoader';
import { ContextProvider } from '../../../global/Context';

const useStyles = makeStyles((theme) => ({
    form: {
      width: '100%', // Fix IE 11 issue.
    }
}));

const CustomTextField = withStyles({
    root: {
        '& fieldset': {
            borderWidth: 2,
            borderRadius: "40px",
            borderColor: "grey",
            fontFamily: "Noto Sans",
        }, 
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
        },
        '& .MuiFormLabel-root': {
            '&.Mui-focused': {
              color: 'white',
            },
        },
        '& label': {
            fontFamily: "Noto Sans",
            color: "grey"
        },
        '& div': {
            color: "white",
            fontFamily: "Noto Sans"
        },
    },
})(TextField);

const Signup = (props) => {
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
        loading ? <PageLoader tip="Creating your account..." color="white" /> 
        : <>
            <img src={iplLogo} style={{width: 150}}/>
            <Typography className="tw-font-noto tw-uppercase tw-text-white" style={{ fontSize: 20, fontWeight: 500 }}>
                Sign Up
            </Typography>
            <br/>
            <form className="tw-w-full tw-font-noto" onSubmit={signUpUser}>
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
                    className="tw-mt-3 tw-mb-2"
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
                                    {showPassword ? <Visibility className="tw-text-white" /> : <VisibilityOff className="tw-text-white" />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    style={{ background: "#f5f7ff", color: "black" }}
                    className={"tw-rounded-[40px] tw-my-1 tw-bg-white-app tw-text-black-app"}
                >
                    <Typography className="tw-font-noto tw-py-2 tw-font-bold tw-flex tw-items-center tw-justify-center" style={{ fontSize: "medium" }}>
                        Sign Up <SportsBaseball className="tw-text-2xl tw-ml-2 tw-text-black-app" />
                    </Typography>
                </Button>
                <div className="tw-flex tw-justify-center tw-mt-2">
                    <div onClick={toggleSignup} className="tw-cursor-pointer">
                        <Tag className="tw-rounded-3xl tw-font-noto tw-font-semibold" color="blue-inverse">Sign Into Existing Account</Tag>
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
