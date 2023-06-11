import React, { useState, useEffect, useContext } from 'react';
import { Typography } from '@material-ui/core';
import { isEmpty } from 'lodash';
import { Alert } from '@material-ui/lab';

import { ContextProvider } from '../../../global/Context';
import TopperCard from './TopperCard';
import TableCard from './TableCard';
import LoaderV2 from '../../../components/common/LoaderV2';

export default function PointsTable() {
    const contextConsumer = useContext(ContextProvider);
    const { getPointsTableData } = contextConsumer;
    const [tableData, setTableData] = useState({});
	const [loading, setLoading] = useState(false);

	useEffect(async () => {
		setLoading(true);
		const tableData = await getPointsTableData();
		setTableData(tableData);
		
		tableData.data.map((user,idx) => {
			user.color = getColor(idx+1, user.isOut);
			user.badgeColor = getBadgeColor(idx+1);
		});
		setLoading(false);
	}, []);

	function getBadgeColor(rank) {
		if(rank == 2) return "secondary";
		else if(rank == 1)  return "primary";
		else return "error";
	}

	function getColor(rank, isOut) {
		if(isOut) return "linear-gradient(1deg, rgb(245 26 26), rgb(0 0 0))";
		if(rank == 2) return "linear-gradient(1deg, rgb(79 32 173), rgb(45 17 17))";
		else if(rank == 1)  return "linear-gradient(1deg, #6f9501, #e0b800)";
		else if(rank%2 == 0) return "#447d3d";
		else return "#386832";
	}

	return ( loading ? ( <LoaderV2 tip="Loading Points table..." /> ) : (
		<>
			{!isEmpty(tableData) ?
				<>
					<TopperCard topperDetails={tableData?.data?.[0]} />
					<TableCard tableData={tableData} />
				</> :
				<Alert style={{ alignItems: "center" }} severity={"info"} variant="filled" className="tw-rounded-[40px]">
					<Typography gutterBottom variant="button" style={{fontSize: 15, lineHeight: "28px", }} component="p">
						<b>Points table details doesn't exists.</b>
					</Typography>
				</Alert> 
			}
		</>
	));
}
