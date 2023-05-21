import React, { useState, useEffect, useContext } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Row, Col, Container } from 'reactstrap';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Badge, Avatar, Grid, Card, CardActionArea, CardContent, GridList, Collapse } from '@material-ui/core';

import { ContextProvider } from '../../../Global/Context';

import LoadingComponent from '../../common/LoadingComponent';
import { dimModePalette, themeColor } from '../../../config';
import { startCase } from 'lodash';

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
    borderRightStyle: "solid",
    // color: dimModePalette.tableBodyTextColor
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

export default function GenericTable(props) {
    const { tableData, tableCols, tableHeading, tableDescription, mobileView, loading } = props;

    const classes = useStyles();
    const container = {
        width: "100%", 
        padding: mobileView ? "70px 0px" : "70px 200px"
    };

    function getColor(rank) {
        if(rank == 2) return "#A5F209";
        else if(rank == 1)  return "#FFCC66";
        else return "#E2EEC8";
    }

    function getStatsTable() {
        return (
        <div style={{...container}}>
            <Typography variant="overline" style={{fontSize: 20, borderRadius: "0.8em 0.3em" }}>{startCase(tableHeading)}</Typography>
            <hr/>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table caption">
                    <caption><Typography variant="overline">{tableDescription}</Typography></caption>
                    <TableHead>
                        <TableRow>
                            { tableCols.map(eachCol => (
                                <StyledTableCell align="center"><Typography variant="overline">{startCase(eachCol)}</Typography></StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.length ? tableData.map((row, index) => (
                            <StyledTableRow key={index} style={{backgroundColor: getColor(index+1)}}>
                                {tableCols.map(eachCol => (
                                    <StyledTableCell align="center">{(row[eachCol])}</StyledTableCell>
                                ))}
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
        ) : ( 
            getStatsTable()
        )
    );
}
