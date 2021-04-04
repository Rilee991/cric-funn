import React, { useState, useEffect, useContext } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core';

import { ContextProvider } from '../Global/Context';

import LoadingComponent from './LoadingComponent';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function PointsTable() {
    const contextConsumer = useContext(ContextProvider);
    const { getPointsTableData, mobileView, loading } = contextConsumer;
    const classes = useStyles();
    const [tableData, setTableData] = useState([]);
    const container = {
        width: "100%", 
        padding: mobileView ? "70px 0px" : "70px 200px"
    };

  useEffect(async () => {
    const data = await getPointsTableData();
    setTableData(data);
  }, []);

  function getPointsTable() {
    return (
      <div style={container}>
        <Typography variant="overline" style={{fontSize: 20}}>POINTS TABLE</Typography>
        <hr/>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table caption">
                <caption><Typography variant="overline">Sorted By Points - Swipe left to see more</Typography></caption>
                <TableHead>
                    <TableRow>
                        <StyledTableCell ><Typography variant="overline">Username</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant="overline">Bets</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant="overline">Won</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant="overline">Lost</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant="overline">In-Progress</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant="overline">Points</Typography></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.length ? tableData.map((row, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">{row.username}</StyledTableCell>
                            <StyledTableCell align="center">{row.totalBets}</StyledTableCell>
                            <StyledTableCell align="center">{row.won}</StyledTableCell>
                            <StyledTableCell align="center">{row.lost}</StyledTableCell>
                            <StyledTableCell align="center">{row.inprogress}</StyledTableCell>
                            <StyledTableCell align="center">{row.points}</StyledTableCell>
                        </StyledTableRow>
                    )) : <div style={{justifyContent: "center", alignContent: "center"}}><Typography variant="overline" style={{fontSize: 15}}>Loading Data Please wait...</Typography></div>}
                </TableBody>
            </Table>
        </TableContainer>
      </div>
    );
  }

  return (
    loading ? (
      <LoadingComponent />
    ) :
    (
      getPointsTable()
    )
  );
}
