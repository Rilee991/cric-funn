import React, { useContext, useEffect, useState } from 'react';
import { startCase } from 'lodash';

import StatsTable from '../../../components/common/StatsTable';
import { ContextProvider } from '../../../global/Context';
import PageLoader from '../../../components/common/PageLoader';
import { updateConfig } from '../../../apis/configurationsController';

const GlobalStats = () => {
    const contextConsumer = useContext(ContextProvider);
    const { getAllUsersData, loggedInUserDetails: { username }, configurations = {}, setConfigurations } = contextConsumer;
    const [globalStats, setGlobalStats] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        getGlobalStats();
        updateConfig(configurations, username, "GlobalStats", setConfigurations);
    },[]);

    const getGlobalStats = async () => {
        setLoading(true);
        const allStats = await getAllUsersData();
        setGlobalStats(allStats.globalStats);
        setLoading(false);
    }

    return (
        <>
            {loading ? <PageLoader tip="Loading please wait" color="black" /> : 
                Object.keys(globalStats).map((statName) => (
                    <StatsTable key={statName}
                        tableDetails={{ ...globalStats[statName], title: startCase(statName) }}
                    />
                ))
            }
        </>
    );
}

export default GlobalStats;
