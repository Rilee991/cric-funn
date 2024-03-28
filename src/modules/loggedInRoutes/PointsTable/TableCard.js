import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Badge, Card, 
    CardActionArea, CardContent, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

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

    return (
        <Card style={{ boxShadow: "5px 5px 20px" }} className="tw-mt-2 tw-mb-10 xl:tw-w-[70%] md:tw-w-[90%] tw-rounded-[40px]">
            <CardActionArea >
                <CardContent style={{ "background": "linear-gradient(2deg, black, #10007e)"}} className="tw-flex tw-flex-col tw-items-center tw-p-2">
                    <Typography className="tw-flex tw-font-noto tw-items-center tw-gap-2 tw-text-white tw-italic" variant={"button"} style={{fontSize: 20}} component="p">
                        <b>{title || "No title"}</b>
                    </Typography>
                </CardContent>
                <Divider />
                <TableContainer component={Paper}>
					<Table style={{ minWidth: "100%" }} aria-label="customized table caption">
						<caption style={{ background: "linear-gradient(2deg, black, #10007e)", color: "aliceblue" }}>
                            <Typography variant="overline" className="tw-font-noto">{caption || "Enjoy your life dumbass!"}</Typography>
                        </caption>
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
                                        <Typography className="tw-font-bold tw-font-noto">
                                            <Badge badgeContent={idx+1} color={eachRow.badgeColor} component="animate" anchorOrigin={{vertical: 'top',horizontal: 'left'}}>
                                                {eachRow.player}
                                            </Badge>
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="center" className="tw-font-noto">{eachRow.bets}</StyledTableCell>
                                    <StyledTableCell align="center" className="tw-font-noto tw-w-full tw-p-0">{eachRow["w-l-i"]}</StyledTableCell>
                                    <StyledTableLastCell align="center" className="tw-font-noto">{eachRow.points}</StyledTableLastCell>
                                </StyledTableRow>
                            )) : <div className="tw-font-noto">No players present.</div>}
						</TableBody>
					</Table>
				</TableContainer>
            </CardActionArea>
        </Card>
    );
}

export default TableCard;
