import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Alert } from '@material-ui/lab';
import { Typography } from '@material-ui/core';

import { ContextProvider } from '../../../global/Context';

import BetTimeDistChart from './BetTimeDistChart';
import StatsTable from '../../../components/common/StatsTable';
import PointsTimelineCompare from './PointsTimelineCompare';
import { getPointsTimeLineComparison } from '../../../apis/mystats/myStatsController';

const MyStats = () => {
    const contextConsumer = useContext(ContextProvider);
    const { getTeamWiseStats, loggedInUserDetails } = contextConsumer;
    const { bets = [] } = loggedInUserDetails;
    const [timelineLoading, setTimelineLoading] = useState(false);
    const [isTeamWiseDataLoading, setIsTeamWiseDataLoading] = useState(false);
    const [usersPointsTimelineData, setUsersPointsTimelineData] = useState([]);
    const [usersBetTimelineData, setUsersBetTimelineData] = useState([]);
    const [teamWisePtsData, setTeamWisePtsData] = useState({});

    const [betTimeDist, setBetTimeDist] = useState([]);
    const [betTimePtsDist, setBetTimePtsDist] = useState([]);

    useEffect(() => {
        getTimeLineDetails();
        getTeamWisePtsData();
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

    const getTimeLineDetails = async () => {
        setTimelineLoading(true);
        try {
            const { timelineComparision, betsComparision } = await getPointsTimeLineComparison();
            setUsersPointsTimelineData(timelineComparision);
            setUsersBetTimelineData(betsComparision);
        } catch (e) {
            console.log(e);
        }
        setTimelineLoading(false);
    }

    const getPointsTimeLineData = () => {
        let points = 3500, match = 0, eveningFiveToSeven = 0, eveningSevenToTwelve = 0, morningTwelveToSeven = 0, 
            morningSevenToFive = 0, ptsBetInEveningFiveToSeven = 0, ptsBetInEveningSevenToTwelve = 0, 
            ptsBetInMorningTwelveToSeven = 0, ptsBetInMorningSevenToFive = 0;
        const userJourney = [{ match, points }];

        bets.map(bet => {
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

    return (
		<div className="tw-flex tw-flex-col">
            { timelineLoading ?  <Alert severity="info" variant="filled" className="tw-mt-2 tw-rounded-[40px] tw-w-full tw-flex tw-justify-center">
                    <Typography variant="body">
                        <b>Loading graph details.</b>
                    </Typography>
                </Alert> : 
                <PointsTimelineCompare nodeId={"ptsTimelineCompare"} xLabel={"Matches"} yLabel={"Score"} title={"Points vs Matches"} usersPointsTimeline={usersPointsTimelineData} /> 
            }
            { timelineLoading ?  <Alert severity="info" variant="filled" className="tw-mt-2 tw-rounded-[40px] tw-w-full tw-flex tw-justify-center">
                    <Typography variant="body">
                        <b>Loading graph details.</b>
                    </Typography>
                </Alert> : 
                <PointsTimelineCompare nodeId={"betsTimelineCompare"} xLabel={"Matches"} yLabel={"Bet score"} title={"Bets vs Matches"} usersPointsTimeline={usersBetTimelineData} /> 
            }
            {/* <BetTimeDistChart betTimeDist={betTimeDist} betTimePtsDist={betTimePtsDist} username={username} /> */}
            {isTeamWiseDataLoading ? <div>Loading table, please wait...</div> :
                <StatsTable
                    fullWidth={true}
                    tableDetails={{ ...teamWisePtsData, title: "Team Wise Betting Trends" }}
                    rankPalette={false} 
                />
            }
        </div>
	);
}

export default MyStats;
