import React, { useState, useEffect, useContext } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Row, Col, Container } from 'reactstrap';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Badge, Avatar, Grid, Card, CardActionArea, CardContent, GridList, Collapse } from '@material-ui/core';

import { ContextProvider } from '../../../Global/Context';

import LoadingComponent from '../../common/LoadingComponent';
import { themeColor } from '../../../config';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    borderRightWidth: 1,
    borderRightColor: theme.palette.grey[300],
    borderRightStyle: "solid",
  },
  body: {
    fontSize: 14,
    borderRightWidth: 1,
    borderRightColor: theme.palette.grey[300],
    borderRightStyle: "solid"
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function TeamStatsTable() {
    const contextConsumer = useContext(ContextProvider);
    const { getTeamStatsData, mobileView, loading, loggedInUserDetails } = contextConsumer;
    const { image } = loggedInUserDetails;
    const classes = useStyles();
    const [tableData, setTableData] = useState([]);
    const container = {
        width: "100%", 
        padding: mobileView ? "70px 0px" : "70px 200px"
    };

  useEffect(async () => {
    const data = await getTeamStatsData();
    setTableData(data);

  }, []);

  function getColor(rank, isOut) {
    if(isOut) return "#E77414";
    if(rank == 2) return "#A5F209";
    else if(rank == 1)  return "#FFCC66";
    else return "#E2EEC8";
  }

  function getUsernameRow(username, rank) {
    return (
       <Badge badgeContent={rank} color={rank == 1 ? "primary" : (rank == 2 ? "secondary" : "error")} component="p" anchorOrigin={{vertical: 'top',horizontal: 'left'}}>
         <Typography><b>{username}</b></Typography>
       </Badge>
      );
  }

  function getPointsTable() {
    return (
      <div style={container}>
        <Typography variant="overline" style={{fontSize: 20}}>TEAM STATS TABLE</Typography>
        <hr/>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table caption">
                <caption><Typography variant="overline">Sorted By Team - Swipe left to see more</Typography></caption>
                <TableHead>
                    <TableRow>
                        <StyledTableCell ><Typography variant="overline">Team Name</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant="overline">Bets Done</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant="overline">Bets Won</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant="overline">Bets Lost</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant="overline">Bets In-Progress</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant="overline">Points Bet</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant="overline">Points Won</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant="overline">Points Lost</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant="overline">Points In-Progress</Typography></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.length ? tableData.map((row, index) => (
                        <StyledTableRow key={row.teamName} style={{backgroundColor: getColor(index+3, row.isOut)}}>
                            <StyledTableCell component="th" scope="row">{row.teamName}</StyledTableCell>
                            <StyledTableCell align="center">{row.betsDone}</StyledTableCell>
                            <StyledTableCell align="center">{row.betsWon}</StyledTableCell>
                            <StyledTableCell align="center">{row.betsLost}</StyledTableCell>
                            <StyledTableCell align="center">{row.betsInProgress}</StyledTableCell>
                            <StyledTableCell align="center">{row.totalPts}</StyledTableCell>
                            <StyledTableCell align="center">{row.wonPts}</StyledTableCell>
                            <StyledTableCell align="center">{row.lostPts}</StyledTableCell>
                            <StyledTableCell align="center">{row.inprogressPts}</StyledTableCell>
                        </StyledTableRow>
                    )) : <div style={{justifyContent: "center", alignContent: "center"}}><Typography variant="overline" style={{fontSize: 15}}>Loading Data Please wait...</Typography></div>}
                </TableBody>
            </Table>
        </TableContainer>
      </div>
    );
  }

  const root = {
    marginBottom: "30px"
  }

  const getContent = (data, rank) => {

    return (
      <div style={{ flexGrow: 1}}>
        <Grid container spacing={1}>
          <Grid item xs={1}>
            <div style={{ fontSize: rank == 1 ? "5vh" : (rank == 2 ? "5vh" : "5vh") }}>{rank}.</div>
          </Grid>
          <Grid item xs>
            <Grid container spacing={1} direction="column">
              <Grid item xs={12}>
                <div style={{ fontSize: "4vh", fontStyle: "italic", fontFamily: "monospace" }}>{data.username}({data.points} PTS.)</div>
              </Grid>
              <Grid item xs={12}>
                <div style={{ fontSize: "2vh", fontStyle: "italic", fontFamily: "monospace" }}>
                  Played: {data.totalBets} | Won: {data.won} | Lost: {data.lost} | In progress: {data.inprogress} | Win%: {data.win/data.totalBets}
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }

  const getAltPtsTable = () => {
    return(
      tableData && tableData.length ?
      tableData.map((data, idx) => {
        return (
          <Card style={root} key={idx}>
            <CardActionArea>
              <CardContent>
                {getContent(data, idx+1)}
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })
      : null
    );
  }

  return (
    loading ? (
      <LoadingComponent />
    ) :
    (
      getPointsTable()
      // <div style={{ width: "100%", padding: mobileView ? "70px 0px" : "70px 200px"}}>
      //   {getAltPtsTable()}
      // </div>
    )
  );
}
