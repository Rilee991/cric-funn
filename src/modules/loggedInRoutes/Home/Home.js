import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Alert } from '@material-ui/lab';
import { makeStyles, Typography } from '@material-ui/core';

import MatchCard from './MatchCard';
import LoaderV2 from '../../../components/common/LoaderV2';
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
	const { matches = [] } = contextConsumer;
	const [relevantMatches, setRelevantMatches] = useState([]);
	const [loading, setLoading] = useState(false);

	const classes = useStyles();

	useEffect(() => {
		setLoading(true);
		handleSelectedNav && handleSelectedNav();
		const relevantMatches = matches.filter(match => 
			moment(match.dateTimeGMT) >= moment().subtract(2, "days")
		);

		setRelevantMatches(relevantMatches);
		setLoading(false);
	}, [matches.length])

	return (
		<div className="tw-w-full">
			{ loading ? <LoaderV2 tip="Loading matches..." />: 
				relevantMatches.length ? relevantMatches.map((match, index) => (
					<MatchCard key={index} match={match}/>
				)) 
				: <Alert classes={{ standardSuccess: classes.infoAlertSettings, icon: classes.contentColorSettings, message: classes.contentColorSettings }} className="tw-rounded-[40px] tw-mt-2 tw-flex tw-justify-center xl:tw-w-[70%] tw-items-center tw-text-[aliceblue]">
					<Typography variant={"button"} style={{fontSize: 15}} component="p">
						<b>No matches found</b>
					</Typography>
				</Alert>
			}
		</div>
	);
}

export default Home;
