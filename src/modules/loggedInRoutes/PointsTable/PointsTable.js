import React, { useState, useEffect, useContext } from 'react';
import { Typography } from '@material-ui/core';
import { isEmpty } from 'lodash';
import { Alert } from '@material-ui/lab';

import { ContextProvider } from '../../../global/Context';
import TopperCard from './TopperCard';
import TableCard from './TableCard';
import PageLoader from '../../../components/common/PageLoader';
import { updateConfig } from '../../../apis/configurationsController';

export default function PointsTable() {
    const contextConsumer = useContext(ContextProvider);
    const { getPointsTableData, loggedInUserDetails: { username }, configurations = {}, setConfigurations } = contextConsumer;
    const [tableData, setTableData] = useState({});
	const [loading, setLoading] = useState(false);

	useEffect(async () => {
		setLoading(true);
		const tableData = await getPointsTableData();
		setTableData(tableData);
		
		tableData.data.map((user,idx) => {
			user.color = getColor(idx+1, user.isOut, user.isChampion);
			user.badgeColor = getBadgeColor(idx+1);
		});
		setLoading(false);
		updateConfig(configurations, username, "PointsTable", setConfigurations);
	}, []);

	function getBadgeColor(rank) {
		if(rank == 2) return "secondary";
		else if(rank == 1)  return "primary";
		else return "error";
	}

	function getColor(rank, isOut, isChampion) {
		if(isOut) return "linear-gradient(1deg, rgb(245 26 26), rgb(0 0 0))";
		if(isChampion)	return "radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 45%, transparent 80%), radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%)";
		if(rank == 2) return "linear-gradient(1deg, rgb(79 32 173), rgb(45 17 17))";
		else if(rank == 1)  return "linear-gradient(1deg, #6f9501, #e0b800)";
		else if(rank%2 == 0) return "#447d3d";
		else return "#386832";
	}

	return ( loading ? ( <PageLoader tip="Loading Points table..." /> ) : (
		<>
			{!isEmpty(tableData) ?
				<>
					<TopperCard topperDetails={tableData?.data?.[0]} />
					<TableCard tableData={tableData} />
				</> :
				<Alert style={{ alignItems: "center" }} severity={"info"} variant="filled" className="tw-rounded-[40px] tw-mt-10">
					<Typography className="tw-font-noto" gutterBottom variant="button" style={{fontSize: 15, lineHeight: "28px", }} component="p">
						<b>Points table details doesn't exists.</b>
					</Typography>
				</Alert> 
			}
		</>
	));
}
