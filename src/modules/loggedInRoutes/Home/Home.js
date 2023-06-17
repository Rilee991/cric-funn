import React, { useContext } from 'react';

import MatchCard from './MatchCard';
import { ContextProvider } from '../../../global/Context';

// Incoming match object from db
// {
//     "id":"048d4bdf-88de-4981-b330-03ceb18eb6a1",
//     "name":"Punjab Kings vs Rajasthan Royals, 66th Match",
//     "matchType":"t20",
//     "status":"Match not started",
//     "venue":"Himachal Pradesh Cricket Association Stadium, Dharamsala",
//     "date":"2023-05-19",
//     "dateTimeGMT":"2023-05-19T14:00:00Z",
//     "teams":["Punjab Kings","Rajasthan Royals"],
//     "teamInfo":[{
//         "name":"Punjab Kings",
//         "shortname":"PBKS",
//         "img":"https://g.cricapi.com/img/teams/247-637852956959778791.png"
//     },{
//         "name":"Rajasthan Royals",
//         "shortname":"RR",
//         "img":"https://g.cricapi.com/img/teams/251-637852956607161886.png"
//     }],
// 	   "poster": "https://posterlink",
//     "matchWinner": "Rajasthan Royals"
//     "matchStarted":false,
//     "matchEnded":false
// }

const Home = () => {
	const contextConsumer = useContext(ContextProvider);
	const { matches = [] } = contextConsumer;

	return (
		<div className="tw-w-full">
			{ matches.length ? matches.map((match, index) => (
				<MatchCard key={index} match={match}/>
			)) : "No active matches..."
			}
		</div>
	);
}

export default Home;
