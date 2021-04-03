import React, { useState, useEffect, useContext } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Typography, Button } from '@material-ui/core';

import { ContextProvider } from '../Global/Context';
import wmLogo from '../images/wm.png';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

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

export default function Admin() {
    const contextConsumer = useContext(ContextProvider);
    const { getPointsTableData, clearUsernameBetsData } = contextConsumer;
    const classes = useStyles();
    const [mobileView, setMobileView] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [open, setOpen] = useState(false);
    
    const container = {
        width: "100%", 
        padding: mobileView ? "70px 0px" : "70px 200px"
    };
    const [isClear, setIsClear] = useState(true);

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

    const onClickClear = async (username) => {
        setIsClear(false);
        setOpen(true);
        await clearUsernameBetsData(username);
        setOpen(false);
        setIsClear(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

  return (
    <div style={container}>
        <Typography variant="overline" style={{fontSize: 20}}>ADMIN DASHBOARD</Typography>
        <hr/>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table caption">
                {/* <caption><Typography variant="overline">Sorted By Points - Swipe left to see more</Typography></caption> */}
                <TableHead>
                    <TableRow>
                        <StyledTableCell ><Typography variant="overline">Username</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant="overline">Action</Typography></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.length ? tableData.map((row, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">{row.username}</StyledTableCell>
                            <StyledTableCell align="center"><Button variant="contained" onClick={() => onClickClear(row.username)} color="secondary">Reset Bets</Button></StyledTableCell>
                        </StyledTableRow>
                    )) : <div style={{justifyContent: "center", alignContent: "center"}}><Typography variant="overline" style={{fontSize: 15}}>Loading Data Please wait...</Typography></div>}
                </TableBody>
            </Table>
        </TableContainer>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
                Data is Cleared.
            </Alert>
        </Snackbar>
    </div>
  );
}
