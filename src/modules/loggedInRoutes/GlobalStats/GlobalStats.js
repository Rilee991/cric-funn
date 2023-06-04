import React, { useContext, useEffect, useState } from 'react';
import { startCase } from 'lodash';

import LoadingComponent from '../../../components/common/LoadingComponent';
import StatsTable from '../../../components/common/StatsTable';
import { ContextProvider } from '../../../Global/Context';

const GlobalStats = () => {
    const contextConsumer = useContext(ContextProvider);
    const { getAllUsersData, mobileView } = contextConsumer;
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
            {loading ? <LoadingComponent /> : 
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
