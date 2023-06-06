import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Badge, Avatar, Grid, Card, CardActionArea, CardContent, GridList, Collapse, Divider } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { Filter1Outlined, Filter2Outlined } from '@material-ui/icons';
import { upperCase } from 'lodash';

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
      borderRightWidth: 1,
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
  

const StatsTable = (props) => {
    const { tableDetails = {}, rankPalette = true } = props;
    const { title, cols = [], data = [], caption, dangerCols = [] } = tableDetails;

    function getColor(rank, isOut) {
        if(rankPalette) {
            if(isOut) return "linear-gradient(1deg, rgb(245 26 26), rgb(0 0 0))";
            if(rank == 2) return "linear-gradient(1deg, rgb(213 206 0), rgb(85 13 121))";
            else if(rank == 1)  return "linear-gradient(1deg, rgb(3 255 255), rgb(20 6 128))";
            else if(rank%2 == 0) return "rgb(84 98 133)";
            else return "rgb(104 121 164)";
        } else {
            if(rank%2 == 0) return "rgb(5 61 58)";
            else return "rgb(4 90 86)";
        }
	}

    return (
        <Card style={{ boxShadow: "5px 5px 20px" }} className="tw-mt-2 tw-mb-10 xl:tw-w-[70%] md:tw-w-[90%] tw-rounded-[40px]">
            <CardActionArea style={{ background: "linear-gradient(179deg, rgb(3 70 77), rgb(85 7 76))" }}>
                <CardContent style={{ "background": "linear-gradient(179deg, rgb(3 70 77), rgb(85 7 76))"}} className="tw-rounded-[40px] tw-flex tw-flex-col tw-items-center tw-p-2">
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
                                    <> { idx != cols.length-1 ? 
                                        <StyledTableCell align="center"><Typography variant="button">{upperCase(colName)}</Typography></StyledTableCell>
                                        : <StyledTableLastCell align="center"><Typography variant="button">{upperCase(colName)}</Typography></StyledTableLastCell>}
                                    </>
                                ) : null }
							</TableRow>
						</TableHead>

						<TableBody>
                            {data && data.length ? data.map((eachRow,idx) => (
                                <StyledTableRow key={eachRow.player} style={{ background: getColor(idx+1) }}>
                                    {cols.map((colName,jdx) => (
                                        <> { jdx != cols.length-1 ? 
                                            <StyledTableCell align="center"><Typography variant="button">{eachRow[colName]}</Typography></StyledTableCell>
                                            : <StyledTableLastCell align="center"><Typography variant="button">{eachRow[colName]}</Typography></StyledTableLastCell>}
                                        </>
                                    ))}
                                </StyledTableRow>
                            )) : "No players present."}
						</TableBody>
					</Table>
				</TableContainer>
            </CardActionArea>
        </Card>
    );
}

export default StatsTable;
