import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Badge, Avatar, Grid, Card, CardActionArea, CardContent, GridList, Collapse, Divider } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { Filter1Outlined, Filter2Outlined } from '@material-ui/icons';

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#1A120B",
      fontStyle: "italic",
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.common.white,
      borderRightWidth: 2,
      borderRightColor: theme.palette.grey[300],
      borderRightStyle: "solid",
      borderBottom: "2px solid " + theme.palette.grey[300]
    },
    body: {
      fontSize: 14,
      fontStyle: "italic",
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.common.white,
      borderRightWidth: 2,
      borderRightColor: theme.palette.grey[300],
      borderRightStyle: "solid",
      borderBottom: "2px solid " + theme.palette.grey[300]
    }
}))(TableCell);

const StyledTableLastCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#1A120B",
      fontStyle: "italic",
      fontWeight: "bold",
      color: theme.palette.common.white,
      borderRightWidth: 0,
      borderRightColor: theme.palette.grey[300],
      borderRightStyle: "solid",
      borderBottom: "2px solid " + theme.palette.grey[300]
    },
    body: {
      fontSize: 14,
      color: theme.palette.common.white,
      fontStyle: "italic",
      fontWeight: "bold",
      borderRightWidth: 0,
      borderRightColor: theme.palette.grey[300],
      borderRightStyle: "solid",
      borderBottom: "2px solid " + theme.palette.grey[300]
    }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.active
      },
    },
}))(TableRow);
  

const TableCard = (props) => {
    const { tableData = {} } = props;
    const { title, cols = [], data = [], caption } = tableData;

    console.log(tableData);

    return (
        <Card style={{ boxShadow: "5px 5px 20px" }} className="tw-mt-2 tw-mb-10 xl:tw-w-[70%] md:tw-w-[90%] tw-rounded-[40px]">
            <CardActionArea style={{ background: "linear-gradient(44deg, rgb(37, 12, 81), rgb(96, 83, 23))" }}>
                <CardContent style={{ "background": "linear-gradient(44deg, #250c51, #605317)"}} className="tw-rounded-[40px] tw-flex tw-flex-col tw-items-center tw-p-2">
                    <Typography className="tw-flex tw-items-center tw-gap-2 tw-text-white tw-font-mono tw-italic" variant={"button"} style={{fontSize: 20}} component="p">
                        <b>{title || "No title"}</b>
                    </Typography>
                </CardContent>
                <Divider />
                <TableContainer component={Paper}>
					<Table style={{ minWidth: "100%" }} aria-label="customized table caption">
						<caption><Typography variant="overline">{caption || "Enjoy your life dumbass!"}</Typography></caption>
						<TableHead>
							<TableRow>
                                {cols && cols.length ? cols.map((colName, idx) => 
                                    <>
                                        { idx != cols.length-1 ? 
                                            <StyledTableCell align="center"><Typography variant="button">{colName}</Typography></StyledTableCell>
                                        : <StyledTableLastCell align="center"><Typography variant="button">{colName}</Typography></StyledTableLastCell>}
                                    </>
                                ) : null }
							</TableRow>
						</TableHead>

						<TableBody>
                            {data && data.length ? data.map((eachRow,idx) => (
                                <StyledTableRow key={eachRow.player} style={{background: eachRow.color }}>
                                    <StyledTableCell component="th" scope="row">
                                        <Typography variant="button" className="tw-font-bold">
                                            <Badge badgeContent={idx+1} color={eachRow.badgeColor} component="animate" anchorOrigin={{vertical: 'top',horizontal: 'left'}}>
                                                {eachRow.player}
                                            </Badge>
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{eachRow.bets}</StyledTableCell>
                                    <StyledTableCell align="center">{eachRow["w-l-i"]}</StyledTableCell>
                                    <StyledTableLastCell align="center">{eachRow.points}</StyledTableLastCell>
                                </StyledTableRow>
                            )) : "No players present."}
						</TableBody>
					</Table>
				</TableContainer>
            </CardActionArea>
        </Card>
    );
}

export default TableCard;
