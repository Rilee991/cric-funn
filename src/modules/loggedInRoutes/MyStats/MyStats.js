import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';

import LoadingComponent from '../../../components/common/LoadingComponent';
import { ContextProvider } from '../../../Global/Context';
import PointsTimeline from './PointsTimeline';

const MyStats = () => {
    const contextConsumer = useContext(ContextProvider);
    const { getAllUsersData, loggedInUserDetails } = contextConsumer;
    const { username, bets = [] } = loggedInUserDetails;
    const [pointsTimelineData, setPointsTimelineData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
		setLoading(true);
        getPointsTimeLineData();
		const allUsersData = await getAllUsersData();
		// setPointsTimelineData(allUsersData.timeSeriesPts);
        console.log(allUsersData.timeSeriesPts);
		
		setLoading(false);
	}, []);

    const getPointsTimeLineData = () => {
        let points = 3500, match = 0, firstQuad = 0, secondQuad = 0, thirdQuad = 3, fourthQuad = 0;
        const userJourney = [{ match, points }];

        bets.map(bet => {
            if(bet.betWon) {
                if(bet.isNoResult) {
                    points += parseInt(bet.selectedPoints);
                    match += 1; 
                } else {
                    points += parseInt(Math.ceil(bet.selectedPoints*bet.odds[bet.selectedTeam]));
                    match += 1;
                }
            } else {
                points -= parseInt(bet.selectedPoints);
                match += 1;
            }

            userJourney.push({ points, match });

            const hours = moment.unix(bet.betTime).hours();
            if(hours < 6)   firstQuad++;
            else if(hours < 12) secondQuad++;
            else if(hours < 18) thirdQuad++;
            else    fourthQuad++;
        });

        setPointsTimelineData(userJourney);
    }

    return ( loading ? ( <LoadingComponent /> ) : (
		<div className="tw-flex tw-flex-col">
            <PointsTimeline data={pointsTimelineData} username={username} />
            <br/>
            {/* <PointsTimelineComparision data={pointsTimelineData} username={username} /> */}
            <div>
                Bet time dist. pie chart
            </div>
            <div>
                Points betting on each team table
            </div>
        </div>
	));
}

export default MyStats;
