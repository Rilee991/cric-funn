import React, { useContext, useEffect, useState } from 'react';
import { startCase } from 'lodash';

import StatsTable from '../../../components/common/StatsTable';
import { ContextProvider } from '../../../global/Context';
import PageLoader from '../../../components/common/PageLoader';

const GlobalStats = () => {
    const contextConsumer = useContext(ContextProvider);
    const { getAllUsersData } = contextConsumer;
    const [globalStats, setGlobalStats] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        getGlobalStats();
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
                    statName ?
                        <StatsTable
                            tableDetails={{ ...globalStats[statName], title: startCase(statName) }}
                        />
                    : null
                ))
            }
        </>
    );
}

export default GlobalStats;
