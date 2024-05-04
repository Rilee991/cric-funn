import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Alert } from '@material-ui/lab';
import { makeStyles, Typography } from '@material-ui/core';

import MatchCard from './MatchCard';
import PageLoader from '../../../components/common/PageLoader';
import { ContextProvider } from '../../../global/Context';
import { updateConfig } from '../../../apis/configurationsController';

const useStyles = makeStyles((theme) => ({
    infoAlertSettings: {
        background: "linear-gradient(60deg, #6c0c0c, #8f3e01)"
    },
    contentColorSettings: {
        color: "aliceblue !important"
    }
}));

const NoMatchesFound = () => (
	<div className="tw-w-full tw-grid tw-place-content-center tw-text-center">
		<img src="https://png.pngtree.com/png-clipart/20221127/ourmid/pngtree-cricket-wickets-ball-png-image_6483453.png" alt="no data found" />
		<Typography className="tw-grid tw-place-content-center" style={{fontSize: 15}} component="p">
			<b>404! No matches found...</b>
			<b>Undisputed Universal Champion: @kelly</b>
		</Typography>
	</div>
);

const Home = ({ handleSelectedNav }) => {
	const contextConsumer = useContext(ContextProvider);
	const { matches = [], loggedInUserDetails: { username }, configurations = {}, setConfigurations } = contextConsumer;
	const [relevantMatches, setRelevantMatches] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		handleSelectedNav && handleSelectedNav();
		const relevantMatches = matches.filter(match => 
			moment(match.dateTimeGMT) >= moment().subtract(2, "days")
		);

		setRelevantMatches(relevantMatches.splice(0,8));
		setLoading(false);
		updateConfig(configurations, username, "Home", setConfigurations);
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
				: (<NoMatchesFound />))
			}
		</div>
	);
}

export default Home;
