import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';

import { ContextProvider } from '../../../global/Context';
import PointsTimeline from './PointsTimeline';
import BetTimeDistChart from './BetTimeDistChart';
import StatsTable from '../../../components/common/StatsTable';
import LoaderV2 from '../../../components/common/LoaderV2';

const MyStats = () => {
    const contextConsumer = useContext(ContextProvider);
    const { getTeamWiseStats, loggedInUserDetails } = contextConsumer;
    const { username, bets = [] } = loggedInUserDetails;
    const [pointsTimelineData, setPointsTimelineData] = useState([]);
    const [betTimeDist, setBetTimeDist] = useState([]);
    const [betTimePtsDist, setBetTimePtsDist] = useState([]);
    const [teamWisePtsData, setTeamWisePtsData] = useState({});
    const [loading, setLoading] = useState(false);
    const [isTeamWiseDataLoading, setIsTeamWiseDataLoading] = useState(false);

    useEffect(async () => {
		setLoading(true);
        getPointsTimeLineData();
        getTeamWisePtsData();
		setLoading(false);
	}, []);

    const getTeamWisePtsData = async () => {
        setIsTeamWiseDataLoading(true);
        try {
            const teamWiseData = await getTeamWiseStats();
            setTeamWisePtsData(teamWiseData);
        } catch (e) {
            console.log(e);
        }
        setIsTeamWiseDataLoading(false);
    }

    const getPointsTimeLineData = () => {
        let points = 3500, match = 0, eveningFiveToSeven = 0, eveningSevenToTwelve = 0, morningTwelveToSeven = 0, 
            morningSevenToFive = 0, ptsBetInEveningFiveToSeven = 0, ptsBetInEveningSevenToTwelve = 0, 
            ptsBetInMorningTwelveToSeven = 0, ptsBetInMorningSevenToFive = 0;
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
            if(0 <= hours && hours < 7) {
                ptsBetInMorningTwelveToSeven += parseInt(bet.selectedPoints);
                morningTwelveToSeven++;
            } else if(7 <= hours && hours < 17) {
                ptsBetInMorningSevenToFive += parseInt(bet.selectedPoints);
                morningSevenToFive++;
            } else if(17 <= hours && hours < 19) {
                ptsBetInEveningFiveToSeven += parseInt(bet.selectedPoints);
                eveningFiveToSeven++;
            } else {
                ptsBetInEveningSevenToTwelve += parseInt(bet.selectedPoints);
                eveningSevenToTwelve++;
            }
        });

        setPointsTimelineData(userJourney);
        setBetTimeDist([{ 
            timePeriod: "5pm-7pm", count: eveningFiveToSeven 
        }, {
            timePeriod: "7pm-12am", count: eveningSevenToTwelve
        }, {
            timePeriod: "12am-7am", count: morningTwelveToSeven
        }, {
            timePeriod: "7am-5pm", count: morningSevenToFive
        }]);
        setBetTimePtsDist([{ 
            timePeriod: "5pm-7pm", pointss: ptsBetInEveningFiveToSeven 
        }, {
            timePeriod: "7pm-12am", pointss: ptsBetInEveningSevenToTwelve
        }, {
            timePeriod: "12am-7am", pointss: ptsBetInMorningTwelveToSeven
        }, {
            timePeriod: "7am-5pm", pointss: ptsBetInMorningSevenToFive
        }]);
    }

    return ( loading && teamWisePtsData ? ( <LoaderV2 tip="Loading Stats..." /> ) : (
		<div className="tw-flex tw-flex-col">
            <PointsTimeline data={pointsTimelineData} username={username} />
            <br/>
            {/* <PointsTimelineComparision data={pointsTimelineData} username={username} /> */}
            {/* <BetTimeDistChart betTimeDist={betTimeDist} betTimePtsDist={betTimePtsDist} username={username} /> */}
            <StatsTable tableDetails={{ ...teamWisePtsData, title: "Team Wise Betting Trends" }} rankPalette={false} />
        </div>
	));
}

export default MyStats;
