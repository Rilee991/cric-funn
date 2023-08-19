import React, { useState, useContext } from 'react'
import { Button, TextField, Typography, Snackbar, InputAdornment, IconButton, makeStyles, withStyles, Grid } from '@material-ui/core';
import { Visibility, VisibilityOff, Loop } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import MuiAlert from '@material-ui/lab/Alert';
import { isEmpty } from 'lodash';
import { Tag } from 'antd';

import iplLogo from '../../../res/images/logo.png';

import PageLoader from '../../../components/common/PageLoader';
import { ContextProvider } from '../../../global/Context';
import Credits from '../../../components/common/Credits';

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },
    submit: {
        margin: theme.spacing(1, 0, 1),
        borderRadius: "40px"
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

const ResetPassword = () => {
    const classes = useStyles();
    const contextConsumer = useContext(ContextProvider) || {};
    const { resetPassword } = contextConsumer;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [severity, setSeverity] = useState("error");
    const [inputs, setInputs] = useState({ password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [secs, setSecs] = useState(10);

    const history = useHistory();

    const handleInputs = (event) => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value
        });
    }

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const resetPasswordAndSave = async (event) => {
        setLoading(true);
        try {
            event.preventDefault();
            const params = new URLSearchParams(window.location.search);
            const actionCode = params.get("oobCode");
            const resetInfo = { password: inputs.password, actionCode };
            await resetPassword(resetInfo);
            setInputs({ password: '' });
            setError("Your password has been reset successfully.");
            setSeverity("success");
            startRedirectionTimer();
        } catch (e) {
            console.log("Errs:", e);
            setError(e.message);
            setSeverity("error");
        }
        setLoading(false);
    }

    const startRedirectionTimer = () => {
        for(let i=10;i>0;i--) {
            setTimeout(() => {
                setSecs(i);
            },(10-i)*1000);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setError("");
    }

    if(secs <= 1) {
        history.push("/");
    }

    return (
        loading ? <PageLoader tip="Loading..." color="white" /> 
        : <div className="tw-bg-black tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-screen">
            <div className="tw-w-full tw-mx-5 tw-flex tw-flex-col tw-items-center tw-justify-center">
                <img src={iplLogo} style={{width: 150}} />
                <Typography className="tw-font-noto tw-uppercase tw-text-white" style={{ fontSize: 20, fontWeight: 500 }}>
                    Reset Password
                </Typography>
                <br/>
                <form className="tw-w-full tw-font-noto tw-flex tw-items-center tw-justify-center tw-flex-col" onSubmit={resetPasswordAndSave}>
                    <CustomTextField
                        variant="outlined"
                        margin="normal"
                        className="tw-mb-3"
                        required
                        fullWidth
                        id="password"
                        label="New Password"
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
                    {severity !== "success" ?
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            style={{ background: "#f5f7ff", color: "black" }}
                            className={"tw-rounded-[40px] tw-my-1 tw-bg-white-app tw-text-black-app"}
                        >
                            <Typography className="tw-font-noto tw-py-2 tw-font-bold tw-flex tw-items-center tw-justify-center tw-gap-2" style={{ fontSize: "medium" }}>
                                Reset Password <Loop className="tw-text-2xl tw-text-black-app" />
                            </Typography>
                        </Button> :
                        <Tag className="tw-rounded-3xl" color="blue-inverse">
                            <Typography variant="body2" className="tw-flex tw-font-noto tw-items-center tw-justify-center" style={{ fontSize: "medium" }}>
                                Redirecting you to login page in {secs} seconds.
                            </Typography>
                        </Tag>
                    }
                </form>
                <br/>
                <Credits />
                
                <Snackbar open={!isEmpty(error)} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                    <MuiAlert className="tw-rounded-3xl" variant="filled" onClose={handleClose} severity={severity}>
                        {error}
                    </MuiAlert>
                </Snackbar>
            </div>
        </div>
    );
}

export default ResetPassword;
