import React, { useState, useContext, useEffect } from 'react';
import { Card, CardActionArea, CardActions, CardContent, Button, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { find, isEmpty } from 'lodash';
import moment from 'moment';

import { ContextProvider } from '../../../Global/Context';
import { getMatchDetails } from '../../apis';
import { fontVariant, getFormattedTimeISOString, getMsgForClosedBets, getMsgForInProgressBets, getMsgForLostBets, getMsgForNoResultBets, getMsgForOpenBets, getMsgForUpcomingBets, getMsgForWonBets, getTeamLogo, matchHeadingFontSize } from '../../../config';

import MatchDetails from './MatchDetails';
import BettingDialog from './BettingDialog';
import ViewBetsDialog from './ViewBetsDialog';
import MatchPic from '../../common/MatchPic';

function CricketCard(props) {
  
  const contextConsumer = useContext(ContextProvider);  
  const  { match = {} } = props;
  const { loggedInUserDetails, mobileView } = contextConsumer;
  
  const { bets = [], points } = loggedInUserDetails;
  const { dateTimeGMT: matchTime, toss_winner_team: tossWinnerTeam, winner_team: winnerTeam, team1Abbreviation, team2Abbreviation, "team-1": team1, "team-2": team2, unique_id } = match;
  
  const [bettingDoneByUser, setBettingDoneByUser] = useState(false);
  const [matchDetails, setMatchDetails] = useState({});
  
  const [openMatchDetailsDialogBox, setOpenMatchDetailsDialogBox] = useState(false);
  const [openLetsBetDialogBox, setOpenLetsBetDialogBox] = useState(false);
  const [openViewBetsDialogBox, setOpenViewBetsDialogBox] = useState(false);
  
  const betStartTime = moment(matchTime).subtract(24.5,"hours");
  const betEndTime = moment(matchTime).subtract(30,"minutes");
  const team1Logo = getTeamLogo(team1Abbreviation);
  const team2Logo = getTeamLogo(team2Abbreviation);
  
  const [bettingOn, setBettingOn] = useState((moment() >= betStartTime && moment() <= betEndTime) && (bettingDoneByUser == false));
  
  const [canViewBets, setCanViewBets] = useState(moment() > betEndTime);
  
  const [message, setMessage] = useState(moment() >= betEndTime ? `Betting for this match is CLOSED.` : `Betting for this match will be OPENED from ${betStartTime.format("LLL")} to ${betEndTime.format("LLL")}`);
  const [severity, setSeverity] = useState("info");
  
  const [isMatchDetailsLoading, setIsMatchDetailsLoading] = useState(false);

  const root = {
      width: mobileView ? '100%' : '70%',
      marginBottom: "50px"
  };

    useEffect(()=> {
      const bet = find(bets, {"unique_id": unique_id}) || {};
      const { selectedPoints, isNoResult, isSettled, betWon } = bet;
      const bettingDone = isEmpty(bet) ? false : true;

      setBettingDoneByUser(bettingDone);
      setBettingOn(moment() >= betStartTime && moment() <= betEndTime && !bettingDone);
      setCanViewBets(moment() > betEndTime);

      if(moment() < betStartTime) {
        setMessage(getMsgForUpcomingBets(betStartTime,betEndTime));
        setSeverity("info");
      } else if(moment() >= betStartTime && moment() <= betEndTime) {
        setMessage(getMsgForOpenBets(betEndTime));
        setSeverity("success");
        if(bettingDone) {
          setMessage(getMsgForInProgressBets(selectedPoints));
          setSeverity("warning");
        }
      } else if(isNoResult) {
        setMessage(getMsgForNoResultBets(selectedPoints));
        setSeverity("success");
      } else {
        setMessage(getMsgForClosedBets());
        setSeverity("error");
        if(bettingDone) {
          if(isSettled) {
            if(betWon) {
              setMessage(getMsgForWonBets(selectedPoints));
              setSeverity("success");
            } else {
              setMessage(getMsgForLostBets(selectedPoints));
              setSeverity("error");
            }
          } else {
            setMessage(getMsgForInProgressBets(selectedPoints));
            setSeverity("warning");
          }
        }
      }
      
    },[bets]);

    const handleCloseMatchDetails = () => {
      setOpenMatchDetailsDialogBox(false);
    }

    const handleCloseBetting = () => {
      setOpenLetsBetDialogBox(false);
    }

    const handleCloseViewBets = () => {
      setOpenViewBetsDialogBox(false);
    }

    const handleOnClickMatchDetails = async (id) => {
      setOpenMatchDetailsDialogBox(true);
      setIsMatchDetailsLoading(true);
      
      const matchDetails = await getMatchDetails(id);
      setMatchDetails(matchDetails);
      setIsMatchDetailsLoading(false);
    }

    const handleOnClickLetsBet = () => {
      setOpenLetsBetDialogBox(true);
    }

    const handleOnClickViewBets = () => {
      setOpenViewBetsDialogBox(true);
    }

    return (
      <>
        <Card style={root}>
          <CardActionArea>
            <CardContent>
              <MatchPic team1Logo={team1Logo} team2Logo={team2Logo} mobileView={mobileView}/>
              <Typography gutterBottom variant={fontVariant} style={{fontSize: matchHeadingFontSize}} component="h2">
                <b>{team1} VS. {team2}</b>
              </Typography>
              <Typography variant={fontVariant} style={{fontSize: 13}} color="textSecondary" component="p">
                <b>Start Time: {getFormattedTimeISOString(matchTime)}</b>
              </Typography>
            </CardContent>
          </CardActionArea>

          <CardActions>
            <Button size="small" color="primary" variant="contained" onClick={() => handleOnClickMatchDetails(unique_id)}>
              <Typography variant="overline">
                {"Match Details"}
              </Typography>
            </Button>
            <Button size="small" color="primary" variant="contained" disabled={bettingOn ? false : true} onClick={() => handleOnClickLetsBet()}>
              <Typography variant="overline">
                {"Let's Bet"}
              </Typography>
            </Button>
            <Button size="small" color="primary" variant="contained" disabled={canViewBets ? false : true} onClick={() => handleOnClickViewBets(unique_id)}>
              <Typography variant="overline">
                {"View Bets"}
              </Typography>
            </Button>
          </CardActions>

          <Alert severity={severity} variant="standard">
            <b>{message}</b>
          </Alert>
        </Card>

        <MatchDetails 
          isMatchDetailsLoading={isMatchDetailsLoading} 
          matchDetails={matchDetails} 
          toss={tossWinnerTeam} 
          winnerTeam={winnerTeam} 
          open={openMatchDetailsDialogBox} 
          handleClose={handleCloseMatchDetails} 
          team1Abbreviation={team1Abbreviation} 
          team2Abbreviation={team2Abbreviation}
        />

        <BettingDialog
          matchDetails={match} 
          open={openLetsBetDialogBox} 
          betEndTime={betEndTime} 
          points={points}
          handleClose={handleCloseBetting}
        />

        <ViewBetsDialog
          matchDetails={match}
          open={openViewBetsDialogBox} 
          handleClose={handleCloseViewBets}
        />
      </>
    );
}

export default CricketCard;
