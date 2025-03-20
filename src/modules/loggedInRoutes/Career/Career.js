import React, { useContext, useEffect, useState } from 'react';
import { ContextProvider } from '../../../global/Context';
import StatsTable from '../../../components/common/StatsTable';

const Career = () => {
	const contextConsumer = useContext(ContextProvider);
	const { loggedInUserDetails, getCareerData } = contextConsumer;
    const [tableData, setTableData] = useState({});

    useEffect(async () => {
        if(loggedInUserDetails?.username) {
            const tableData = await getCareerData(loggedInUserDetails.username);
            setTableData(tableData);
        }
    }, [loggedInUserDetails?.username]);

    return (
        <div>
            <StatsTable
                fullWidth={true}
                tableDetails={{ ...tableData, title: "Year on Year Stats" }}
                rankPalette={false}
            />
        </div>
    );
}

export default Career;
