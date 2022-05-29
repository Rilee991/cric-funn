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
    minWidth: "100%",
  },
});

export default function PointsTable() {
    const contextConsumer = useContext(ContextProvider);
    const { getPointsTableData, mobileView, loading, loggedInUserDetails } = contextConsumer;
    const { image } = loggedInUserDetails;
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
                        <StyledTableRow key={row.username} style={{backgroundColor: getColor(index+1, row.isOut)}}>
                            <StyledTableCell component="th" scope="row">{getUsernameRow(row.username,index+1)}</StyledTableCell>
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
