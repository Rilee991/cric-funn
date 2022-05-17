import React, { useContext, useEffect, useState } from 'react';

import { ContextProvider } from '../../../Global/Context';
import GenericTable from './GenericTable';

const GlobalStats = () => {
    const contextConsumer = useContext(ContextProvider);
    const { getAllUsersData, mobileView, loading, loggedInUserDetails } = contextConsumer;
    const [globalStats, setGlobalStats] = useState({});

    useEffect(async () => {
        getGlobalStats();
    },[]);

    const getGlobalStats = async () => {
        const globalStats = await getAllUsersData();
        setGlobalStats(globalStats);
    }

    return (
        <>
            {Object.keys(globalStats).map((eachStat) => (
                eachStat ? 
                    <GenericTable 
                        tableData={globalStats[eachStat].data}
                        tableCols={globalStats[eachStat].cols}
                        tableDescription={globalStats[eachStat].description}
                        tableHeading={eachStat}
                        loading={loading}
                        mobileView={mobileView}
                    /> : null
            ))}
        </>
    );
}

export default GlobalStats;
