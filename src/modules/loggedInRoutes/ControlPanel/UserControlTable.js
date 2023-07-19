import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Card, 
    CardActionArea, CardContent, Divider 
} from '@material-ui/core';
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
  

const UserControlTable = (props) => {
    const { tableDetails = {}, rankPalette = false, setLoading, setTip, setMessage, setSeverity, resetUserDetails, syncUserDetails } = props;
    const { title, data = [], caption } = tableDetails;

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

    const onClickReset = async (username) => {
        setLoading(true);
        try {
            setTip(`Resetting data for ${username}`);
            await resetUserDetails(username);
            setSeverity("success");
            setMessage("Reset successfull for " + username);
        } catch (e) {
            console.log(e);
            setMessage(e);
            setSeverity("error");
        }
        setLoading(false);
    }

    const onClickUpdateBets = async (username) => {
        setLoading(true);
        try {
            setTip(`Updating bets for ${username}`);
            await syncUserDetails(username);
            setSeverity("success");
            setMessage("Update successfull for " + username);
        } catch (e) {
            console.log(e);
            setMessage(e);
            setSeverity("error");
        }
        setLoading(false);
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
                                <StyledTableCell align="center">
                                    <Typography variant="button">{"User"}</Typography>
                                </StyledTableCell>
                                <StyledTableLastCell align="center">
                                    <Typography variant="button">{"Actions"}</Typography>
                                </StyledTableLastCell>
							</TableRow>
						</TableHead>

						<TableBody>
                            {data && data.length ? data.map((eachRow,idx) => (
                                <StyledTableRow key={eachRow.player} style={{ background: getColor(idx+1) }}>
                                    <StyledTableCell align="center">
                                        <Typography variant="button">{eachRow.player}</Typography>
                                    </StyledTableCell>
                                    <StyledTableLastCell align="center" className="tw-min-w-[300px]">
                                        <Button variant="contained" onClick={() => onClickReset(eachRow.player)} color="secondary">Reset</Button>
                                        {" "}
                                        <Button variant="contained" onClick={() => onClickUpdateBets(eachRow.username)} color="primary">Update Bets</Button>
                                    </StyledTableLastCell>
                                </StyledTableRow>
                            )) : "No players present."}
						</TableBody>
					</Table>
				</TableContainer>
            </CardActionArea>
        </Card>
    );
}

export default UserControlTable;
