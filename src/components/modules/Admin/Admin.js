import React, { useState, useEffect, useContext } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import { ContextProvider } from '../../../Global/Context';

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
    const { getPointsTableData, clearUsernameBetsData, mobileView, syncUsernameBetsData, loggedInUserDetails } = contextConsumer;
    const classes = useStyles();
    const [tableData, setTableData] = useState([]);
    const [open, setOpen] = useState(false);
    
    const container = {
        width: "100%", 
        padding: mobileView ? "70px 0px" : "70px 200px"
    };
    const [isClear, setIsClear] = useState(true);
    const [isSynced, setIsSynced] = useState(true);

    useEffect(async () => {
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

    const onClickSync = async (username) => {
      await syncUsernameBetsData(username);
    }

    const handleClose = () => {
        setOpen(false);
    }

    if(loggedInUserDetails?.username != "Cypher33") {
      return (
        <div style={container}>
          You don't have permissions to view this page bhosdike!
        </div>
      )
    }

  return (
    <div style={container}>
        <Typography variant="overline" style={{fontSize: 20}}>ADMIN DASHBOARD</Typography>
        <hr/>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table caption">
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
                            <StyledTableCell align="center">
                              <Button variant="contained" disabled={true} onClick={() => onClickClear(row.username)} color="secondary">Reset Bets</Button>
                              {" "}
                              <Button variant="contained" onClick={() => onClickSync(row.username)} color="secondary">Sync Bets</Button>
                            </StyledTableCell>
                        </StyledTableRow>
                    )) : <div style={{justifyContent: "center", alignContent: "center"}}><Typography variant="overline" style={{fontSize: 15}}>Loading Data Please wait...</Typography></div>}
                </TableBody>
            </Table>
        </TableContainer>
        {isClear ? "" : (
          <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
                Data is Cleared.
            </Alert>
          </Snackbar>
        )}
    </div>
  );
}
