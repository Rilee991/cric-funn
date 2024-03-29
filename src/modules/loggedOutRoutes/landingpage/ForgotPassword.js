import React, { useState, useContext } from 'react'
import { Button, TextField, Typography, Snackbar, makeStyles, withStyles } from '@material-ui/core';
import { LabelImportant } from '@material-ui/icons';
import { isEmpty } from 'lodash';
import MuiAlert from '@material-ui/lab/Alert';
import { Tag } from 'antd';

import iplLogo from '../../../res/images/logo.png';

import PageLoader from '../../../components/common/PageLoader';
import { ContextProvider } from '../../../global/Context';

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
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

const ForgotPassword = (props) => {
    const classes = useStyles();
    const { handleToggle } = props;
    const contextConsumer = useContext(ContextProvider) || {};
    const { sendResetPasswordEmail } = contextConsumer;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [severity, setSeverity] = useState("error");
    const [inputs, setInputs] = useState({ email: '' });

    const toggleSignin = () => {
        handleToggle && handleToggle("login");
    }

    const handleInputs = (event) => {
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value
        });
    }

    const saveResetPasswordEmail = async (event) => {
        setLoading(true);
        try {
            event.preventDefault();
            await sendResetPasswordEmail(inputs);
            setInputs({ email: '' });
            setError("Reset password link has been sent to your mail. Please check.");
            setSeverity("success");
        } catch (e) {
            console.log("Errs:", e);
            setError(e.message);
            setSeverity("error");
        }
        setLoading(false);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setError("");
    }

    return (
        loading ? <PageLoader tip="Loading..." /> 
        : <>
            <img src={iplLogo} style={{width: 150}} />
            <Typography className="tw-font-noto tw-uppercase tw-text-white" style={{ fontSize: 20, fontWeight: 500 }}>
                Password Change
            </Typography>
            <br />
            <form className="tw-w-full tw-font-noto" onSubmit={saveResetPasswordEmail}>
                <CustomTextField
                    variant="outlined"
                    className={"tw-mb-0 sm:tw-mb-3"}
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
                    className={"tw-rounded-[40px] tw-my-1 tw-bg-white-app tw-text-black-app"}
                >
                    <Typography className="tw-font-noto tw-py-2 tw-font-bold tw-flex tw-items-center tw-justify-center" style={{ fontSize: "medium" }}>
                        Send Mail <LabelImportant className="tw-text-2xl tw-ml-2 tw-text-black-app" />
                    </Typography>
                </Button>
                <div className="tw-flex tw-justify-center tw-mt-2">
                    <div onClick={toggleSignin} className="tw-cursor-pointer">
                        <Tag className="tw-rounded-3xl tw-font-noto tw-font-semibold" color="blue-inverse">Sign Into Existing Account</Tag>
                    </div>
                </div>
            </form>
            
            <Snackbar open={!isEmpty(error)} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <MuiAlert className="tw-rounded-3xl" variant="filled" onClose={handleClose} severity={severity}>
                    {error}
                </MuiAlert>
            </Snackbar>
        </>
    );
}

export default ForgotPassword;
