import React, { useState, useContext, useEffect } from 'react';
import { Card, CardActionArea, CardActions, CardContent, Button, Typography, Chip } from '@material-ui/core';
import { FlashOnOutlined, VisibilityOutlined, FaceOutlined } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { find, get, isEmpty } from 'lodash';
import moment from 'moment';

import { ContextProvider } from '../../../Global/Context';
import { getMatchDetails } from '../../../components/apis';
import { fontVariant, getFormattedTimeISOString, getMsgForClosedBets, getMsgForInProgressBets, getMsgForLostBets, getMsgForNoResultBets, getMsgForOpenBets, getMsgForUpcomingBets, getMsgForWonBets, getPerc, getTeamLogo, matchHeadingFontSize, teamProps, themeColor } from '../../../config';

import BettingDialog from './BettingDialog';
import ViewBetsDialog from './ViewBetsDialog';
import MatchPic from '../../../components/common/MatchPic';


const MatchCard = (props) => {
  const contextConsumer = useContext(ContextProvider);  
  const  { match = {} } = props;
  const { loggedInUserDetails, mobileView, updateSeenBets } = contextConsumer;
  
  const { bets = [], points, username = "", isAdmin = false } = loggedInUserDetails;

  const { dateTimeGMT: matchTime, id: matchId, name: matchTitle, team1Abbreviation, teamInfo = [], team2Abbreviation, status, venue, odds = [], banner } = match;
  
  const [bettingDoneByUser, setBettingDoneByUser] = useState(false);
  const [matchDetails, setMatchDetails] = useState({});
  
  const [openMatchDetailsDialogBox, setOpenMatchDetailsDialogBox] = useState(false);
  const [openLetsBetDialogBox, setOpenLetsBetDialogBox] = useState(false);
  const [openViewBetsDialogBox, setOpenViewBetsDialogBox] = useState(false);
  
  const betStartTime = moment(matchTime).subtract(24,"hours");
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
    marginBottom: "40px"
  };

    useEffect(()=> {
      const bet = find(bets, { "matchId": matchId }) || {};
      const { selectedPoints, isNoResult, isSettled, betWon, selectedTeam, odds: betOdds } = bet;
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
          setMessage(getMsgForInProgressBets(selectedPoints, selectedTeam));
          setSeverity("warning");
        }
      } else if(isNoResult) {
        setMessage(getMsgForNoResultBets(selectedPoints, selectedTeam));
        setSeverity("success");
      } else {
        setMessage(getMsgForClosedBets());
        setSeverity("error");
        if(bettingDone) {
          if(isSettled) {
            if(betWon) {
              setMessage(getMsgForWonBets(Math.ceil(selectedPoints*betOdds[selectedTeam]), selectedTeam));
              setSeverity("success");
            } else {
              setMessage(getMsgForLostBets(selectedPoints, selectedTeam));
              setSeverity("error");
            }
          } else {
            setMessage(getMsgForInProgressBets(selectedPoints, selectedTeam));
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
      updateSeenBets(matchId, username);
    }

    const oddsParams = {};

    if(!isEmpty(odds)) {
      oddsParams["team1Color"] = teamProps[odds[0].name].color;
      oddsParams["team1Abbr"] = teamProps[odds[0].name].abbr;
      oddsParams["team1Perc"] = getPerc(odds[0].price, odds[1].price);
      oddsParams["team1Logo"] = teamProps[odds[0].name].logo;
      oddsParams["team2Color"] = teamProps[odds[1].name].color;
      oddsParams["team2Abbr"] = teamProps[odds[1].name].abbr;
      oddsParams["team2Perc"] = getPerc(odds[1].price, odds[0].price);
      oddsParams["team2Logo"] = teamProps[odds[1].name].logo;
      console.log(odds[0].price, odds[1].price);
    }

    return (
      <>
        <Card style={{ boxShadow: "5px 5px 20px"}} className="tw-mt-2 tw-mb-10 xl:tw-w-[70%] tw-rounded-[40px]">
          <CardActionArea>
            <CardContent>
              <MatchPic banner={banner} matchTime={matchTime} team1Logo={team1Logo} team2Logo={team2Logo} mobileView={mobileView}/>
              <Typography className="-tw-mt-5" gutterBottom variant={fontVariant} style={{fontSize: matchHeadingFontSize}} component="h2">
                <b>{get(matchTitle.split(","),'[0]','No Title')}</b>
              </Typography>
              <Typography variant={fontVariant} style={{fontSize: 13}} color="textSecondary" component="p">
                <b>Venue: {venue}</b>
              </Typography>
              <Typography variant={fontVariant} style={{fontSize: 13}} color="textSecondary" component="p">
                <b>Start Time: {getFormattedTimeISOString(matchTime)}</b>
              </Typography>
              <Typography variant={fontVariant} style={{fontSize: 13}} color="textSecondary" component="p">
                <b>{status}</b>
              </Typography>
              {/* <Typography variant={fontVariant} style={{fontSize: 13}} color="primary" component="p">
                <b>{isEmpty(odds) ? `Odds updation in progress...` : `${odds[0].name}: ${odds[0].price}, ${odds[1].name}: ${odds[1].price}`  }</b>
              </Typography> */}
              
              {!isEmpty(odds) ?
                <div style={{ background: oddsParams.team1Color }} className={`tw-h-[5vh] tw-rounded-[30px] tw-mt-2 tw-text-white tw-flex`}>
                  <div style={{ backgroundColor: oddsParams.team1Color, width: oddsParams.team1Perc+"%", backgroundImage: `url(${oddsParams.team1Logo})`, backgroundSize: "cover", backgroundPosition: "center", backgroundBlendMode: "multiply" }} className="tw-rounded-[30px] tw-flex tw-items-center tw-justify-center">
                    <Typography variant={fontVariant} style={{fontSize: mobileView ? 16 : 13, textShadow: "0 0 3px #0e0101, 0 0 5px #e7e7e9"}} component="p">
                      <b>{`${mobileView ? oddsParams.team1Abbr : odds[0].name}: ${odds[0].price}`}</b>
                    </Typography>
                  </div>
                  <div style={{ backgroundColor: oddsParams.team2Color, width: oddsParams.team2Perc+"%", backgroundImage: `url(${oddsParams.team2Logo})`, backgroundSize: "cover", backgroundPosition: "center", backgroundBlendMode: "multiply" }} className="tw-rounded-[30px] tw-flex tw-items-center tw-justify-center">
                    <Typography variant={fontVariant} style={{fontSize: mobileView ? 16 : 13, textShadow: "0 0 3px #0e0101, 0 0 5px #e7e7e9"}} component="p">
                      <b>{`${mobileView ? oddsParams.team2Abbr : odds[1].name}: ${odds[1].price}`}</b>
                    </Typography>
                  </div>
                </div> : <div className="tw-bg-indigo-950 tw-h-[5vh] tw-mt-2 tw-rounded-[20px] tw-flex tw-justify-center tw-items-center tw-text-white">
                  <Typography variant={fontVariant} style={{fontSize: 13}} component="p">
                    <b>Odds updation in progress...</b>
                  </Typography>
                </div>}
            </CardContent>
          </CardActionArea>

          <CardActions className="tw-flex tw-justify-center tw-px-4 tw-pt-0">
            <Button size="small" className="tw-w-1/2 tw-rounded-[40px]" style={{ background: bettingOn ? "linear-gradient(44deg, #250c51, #605317)" : 'grey', color: "white" }} variant="contained" disabled={bettingOn ? false : true} onClick={() => handleOnClickLetsBet()}>
              <Typography variant="overline">
                {"Let's Bet"} <FlashOnOutlined />
              </Typography>
            </Button>
            <Button size="small" className="tw-w-1/2 tw-rounded-[40px]" style={{ background: canViewBets ? "linear-gradient(44deg, #250c51, #605317)" : 'grey', color: "white" }} variant="contained" disabled={canViewBets ? false : true} onClick={() => handleOnClickViewBets(matchId)}>
              <Typography variant="overline">
                {"View Bets"} <VisibilityOutlined />
              </Typography>
            </Button>
          </CardActions>

          <Alert severity={severity} variant="filled" className="tw-rounded-[40px]">
            <b>{message}</b>
          </Alert>
        </Card>

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
          username={username}
          isAdmin={isAdmin}
        />
      </>
    );
}

export default MatchCard;
