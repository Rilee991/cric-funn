import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Alert } from '@material-ui/lab';
import { makeStyles, Typography } from '@material-ui/core';

import MatchCard from './MatchCard';
import PageLoader from '../../../components/common/PageLoader';
import { ContextProvider } from '../../../global/Context';

const useStyles = makeStyles((theme) => ({
    infoAlertSettings: {
        background: "linear-gradient(60deg, #6c0c0c, #8f3e01)"
    },
    contentColorSettings: {
        color: "aliceblue !important"
    }
}))

const Home = ({ handleSelectedNav }) => {
	const contextConsumer = useContext(ContextProvider);
	const { matches = [], loggedInUserDetails: { username } } = contextConsumer;
	const [relevantMatches, setRelevantMatches] = useState([]);
	const [loading, setLoading] = useState(false);

	const classes = useStyles();

	useEffect(() => {
		setLoading(true);
		handleSelectedNav && handleSelectedNav();
		const relevantMatches = matches.filter(match => 
			moment(match.dateTimeGMT) >= moment().subtract(2, "days")
		);

		setRelevantMatches(relevantMatches.splice(0,8));
		setLoading(false);
	}, [matches.length]);

	const hour = new Date().getHours();
	const greeting = hour >= 0 && hour < 5 ? `Sleep you fucking dumbass!` : (hour >= 5 && hour < 12 ? `Good Morning, ${username}!` 
		: (hour >= 12 && hour < 17 ? `Good Afternoon, Master ${username}!` : (`Good Evening, Sir ${username}!`)));

	return (
		<div className="tw-w-full">
			<div className={`tw-flex tw-items-center tw-text-black-app tw-font-noto tw-italic ${window.innerWidth > 460 ? "tw-text-4xl" : "tw-text-2xl"}`}>
				{greeting}
			</div>
			{ loading ? (<PageLoader tip="Loading matches..." />) : 
				(relevantMatches.length ? (relevantMatches.map((match, index) => (
					<MatchCard key={index} match={match}/>
				)) )
				: (<Alert classes={{ standardSuccess: classes.infoAlertSettings, icon: classes.contentColorSettings, message: classes.contentColorSettings }} className="tw-rounded-[40px] tw-mt-2 tw-flex tw-justify-center lg:tw-w-[70%] tw-items-center tw-text-[aliceblue]">
					<Typography variant={"button"} style={{fontSize: 15}} component="p">
						<b>No matches found</b>
					</Typography>
				</Alert>))
			}
		</div>
	);
}

export default Home;
