import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Card, CardActionArea, 
    CardContent, Divider 
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
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
    const { tableDetails = {}, rankPalette = true, fullWidth = false } = props;
    const { title, cols = [], data = [], caption, hyphendCols = [] } = tableDetails;

    function getColor(rank, isOut) {
        if(rankPalette) {
            if(isOut) return "linear-gradient(1deg, rgb(245 26 26), rgb(0 0 0))";
            if(rank === 2) return "linear-gradient(1deg, rgb(213 206 0), rgb(85 13 121))";
            else if(rank === 1)  return "linear-gradient(1deg, rgb(3 255 255), rgb(20 6 128))";
            else if(rank%2 === 0) return "rgb(84 98 133)";
            else return "rgb(104 121 164)";
        } else {
            if(rank%2 === 0) return "rgb(5 61 58)";
            else return "rgb(4 90 86)";
        }
	}

    const getColName = (colName, idx) => {
        if(hyphendCols.includes(idx))
            return upperCase(colName).split(" ").join("-");
        return upperCase(colName);
    }

    return (
        <Card style={{ boxShadow: "5px 5px 20px" }} className={`tw-mt-2 tw-mb-10 ${fullWidth ? "tw-w-full" : "xl:tw-w-[70%] md:tw-w-[90%]"} tw-rounded-[40px]`}>
            <CardActionArea>
                <CardContent style={{ "background": "linear-gradient(1deg, black, #075904)"}} className="tw-flex tw-flex-col tw-items-center tw-p-2">
                    <Typography className="tw-flex tw-items-center tw-font-noto tw-gap-2 tw-text-white tw-italic" variant={"button"} style={{fontSize: 20}} component="p">
                        <b>{title || "No title"}</b>
                    </Typography>
                </CardContent>
                <Divider />
                <TableContainer component={Paper}>
					<Table style={{ minWidth: "100%" }} aria-label="customized table caption">
						<caption><Typography className="tw-font-noto" variant="overline">{caption || "Enjoy your life dumbass!"}</Typography></caption>
						<TableHead>
							<TableRow>
                                {cols && cols.length ? cols.map((colName, idx) =>
                                    <> { idx !== cols.length-1 ? 
                                        <StyledTableCell align="center"><Typography variant="button" className="tw-font-noto">{getColName(colName, idx)}</Typography></StyledTableCell>
                                        : <StyledTableLastCell align="center"><Typography variant="button" className="tw-font-noto">{getColName(colName, idx)}</Typography></StyledTableLastCell>}
                                    </>
                                ) : null }
							</TableRow>
						</TableHead>

						{data && data.length ? <TableBody>
                            {data.map((eachRow,idx) => (
                                <StyledTableRow key={eachRow.player} style={{ background: getColor(idx+1) }}>
                                    {cols.map((colName,jdx) => (
                                        <> { jdx !== cols.length-1 ? 
                                            <StyledTableCell align="center"><Typography variant="button">{eachRow[colName]}</Typography></StyledTableCell>
                                            : <StyledTableLastCell align="center"><Typography variant="button">{eachRow[colName]}</Typography></StyledTableLastCell>}
                                        </>
                                    ))}
                                </StyledTableRow>
                            ))}
						</TableBody> : 
                            <Alert severity="error" variant="filled" className="tw-rounded-[40px] tw-w-full tw-flex tw-justify-center">
                                <Typography variant="body">
                                    <b>No players present.</b>
                                </Typography>
                            </Alert>
                        }
					</Table>
				</TableContainer>
            </CardActionArea>
        </Card>
    );
}

export default StatsTable;
