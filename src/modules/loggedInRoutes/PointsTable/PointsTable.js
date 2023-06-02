import React, { useState, useEffect, useContext } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Row, Col, Container } from 'reactstrap';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Badge, Avatar, Grid, Card, CardActionArea, CardContent, GridList, Collapse } from '@material-ui/core';
import { ContextProvider } from '../../../Global/Context';
import { find, isEmpty } from 'lodash';

import LoadingComponent from '../../../components/common/LoadingComponent';
import { themeColor } from '../../../config';
import backGround from '../../../images/stats.jpg';
import TopperCard from './TopperCard';
import TableCard from './TableCard';
import { Alert } from '@material-ui/lab';

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
		else if(rank%2 == 0) return "#989191";
		else return "#777272";
	}

	return ( loading ? ( <LoadingComponent /> ) : (
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
