import React, { useContext, useEffect, useState } from 'react';
import { Alert } from '@material-ui/lab';
import { Typography } from '@material-ui/core';

import { ContextProvider } from '../../../global/Context';

import StatsTable from '../../../components/common/StatsTable';
import PointsTimelineCompare from './PointsTimelineCompare';
import { getPointsTimeLineComparison } from '../../../apis/mystats/myStatsController';
import { getTimeSpentData, updateConfig } from '../../../apis/configurationsController';

const MyStats = () => {
    const contextConsumer = useContext(ContextProvider);
    const { getTeamWiseStats, loggedInUserDetails, configurations = {}, setConfigurations } = contextConsumer;
    const { username } = loggedInUserDetails;
    const [timelineLoading, setTimelineLoading] = useState(false);
    const [isTeamWiseDataLoading, setIsTeamWiseDataLoading] = useState(false);
    const [usersPointsTimelineData, setUsersPointsTimelineData] = useState([]);
    const [usersBetTimelineData, setUsersBetTimelineData] = useState([]);
    const [usersTimeSpentData, setUsersTimeSpentData] = useState([]);
    const [teamWisePtsData, setTeamWisePtsData] = useState({});

    useEffect(() => {
        getTimeLineDetails();
        getTeamWisePtsData();
        getTimeSpentData().then(data => setUsersTimeSpentData(data)).catch(e => console.log(e));
        updateConfig(configurations, username, "MyStats", setConfigurations);
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
            
            {/* { usersTimeSpentData.length === 0 ?  <Alert severity="info" variant="filled" className="tw-mt-2 tw-rounded-[40px] tw-w-full tw-flex tw-justify-center">
                    <Typography variant="body">
                        <b>Loading graph details.</b>
                    </Typography>
                </Alert> : 
                <PointsTimelineCompare nodeId={"usersTimeSpentData"} xLabel={"Day"} yLabel={"Time Spent"} title={"Time vs Day"} usersPointsTimeline={usersTimeSpentData} valueYField={"timeSpent"} valueXField={"day"} /> 
            } */}
            
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
