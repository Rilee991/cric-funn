import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Paper, Box, Grid, makeStyles } from '@material-ui/core';

import Signin from './Signin';
import Signup from './Signup';
import Credits from '../../../components/common/Credits';
import ForgotPassword from './ForgotPassword';

const useStyles = makeStyles((theme) => ({
	image: {
		backgroundImage: 'url(https://source.unsplash.com/collection/9344848)',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'contain',
		backgroundPosition: 'center',
	},
	paper: {
		margin: theme.spacing(0, 3, 0, 3),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: "center",
		height: "100%"
	}
}));

const LandingPage = () => {
    const classes = useStyles();
    const [toggleLogin, setToggleLogin] = useState("login");

    function handleToggle(page) {
        setToggleLogin(page);
    }

    return (
        <Grid container component="main" className="tw-h-screen tw-bg-black">
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7}>
				<div className="tw-hidden sm:tw-flex tw-w-full tw-h-full">
					{ window.screen.width > 960 ? 
						<img src="https://source.unsplash.com/collection/9344848" className="tw-w-full tw-h-screen" /> 
						: <div className=" tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-full tw-w-full">
							<img className="tw-w-40 tw-h-40" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9c3773cb-5629-4145-b044-4ef6f9090376/dezxlwr-349fb8f9-71a0-47e7-b996-bb1a03692db8.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzljMzc3M2NiLTU2MjktNDE0NS1iMDQ0LTRlZjZmOTA5MDM3NlwvZGV6eGx3ci0zNDlmYjhmOS03MWEwLTQ3ZTctYjk5Ni1iYjFhMDM2OTJkYjgucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0._ziF5bSfs7G3OLfBlrgo06MSroKXlQQyHO9xH0Ef7WU" />
							<br /><br />
							<p className="tw-font-noto tw-text-white tw-text-3xl tw-font-bold">
								Happening <div className="tw-flex tw-justify-center tw-items-center tw-text-lime-500">now!</div>
							</p>
							<p className="tw-font-noto tw-text-white tw-text-3xl">
								Join fast.
							</p>
						</div>
					}
				</div>
			</Grid>
			<Grid className="tw-text-black tw-bg-inherit" item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					{ toggleLogin === "login" ? 
						<Signin handleToggle={handleToggle}/> 
					: (toggleLogin === "signup" ?
						<Signup handleToggle={handleToggle}/> 
					: <ForgotPassword handleToggle={handleToggle} /> )
					}
					<Box className="tw-mt-6 sm:tw-mt-10">
						<Credits />
					</Box>
				</div>
			</Grid>
        </Grid>
    );
}

export default LandingPage;
