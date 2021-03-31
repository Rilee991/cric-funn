import React, { useState, useEffect, useContext } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

import { ContextProvider } from '../Global/Context';
import wmLogo from '../images/wm.png';

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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function PointsTable() {
    const contextConsumer = useContext(ContextProvider);
    const { getPointsTableData } = contextConsumer;
    const classes = useStyles();
    const [mobileView, setMobileView] = useState(true);
    const [tableData, setTableData] = useState([]);
    const container = {
        width: "100%", 
        padding: mobileView ? "70px 0px" : "70px 200px"
    };

    useEffect(async () => {
        const setResponsiveness = () => {
        return window.innerWidth < 900
            ? setMobileView(true)
            : setMobileView(false)
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());
    
    const data = await getPointsTableData();
    setTableData(data);
  }, []);

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
                    {tableData.map((row, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">{row.username}</StyledTableCell>
                            <StyledTableCell align="center">{row.totalBets}</StyledTableCell>
                            <StyledTableCell align="center">{row.won}</StyledTableCell>
                            <StyledTableCell align="center">{row.lost}</StyledTableCell>
                            <StyledTableCell align="center">{row.inprogress}</StyledTableCell>
                            <StyledTableCell align="center">{row.points}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
  );
}
