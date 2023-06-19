import React, { useState, useContext, useEffect } from 'react';
import { Card, CardActionArea, CardActions, CardContent, Button, Typography } from '@material-ui/core';
import { FlashOnOutlined, VisibilityOutlined } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { find, get, isEmpty } from 'lodash';
import moment from 'moment';

import { ContextProvider } from '../../../global/Context';
import { fontVariant, getFormattedTimeISOString, getMsgForClosedBets, getMsgForInProgressBets, getMsgForLostBets, 
  getMsgForNoResultBets, getMsgForOpenBets, getMsgForUpcomingBets, getMsgForWonBets, getPerc, getTeamLogo, 
  matchHeadingFontSize, teamProps } from '../../../config';

import BettingDialog from './BettingDialog';
import ViewBetsDialog from './ViewBetsDialog';
import MatchPic from '../../../components/common/MatchPic';
import ComparisionBar from '../../../components/common/ComparisionBar';
import { getBetEndTime, getBetStartTime } from '../../../global/adhocUtils';

// Incoming match object from db
// {
//     "id":"048d4bdf-88de-4981-b330-03ceb18eb6a1",
//     "name":"Punjab Kings vs Rajasthan Royals, 66th Match",
//     "matchType":"t20",
//     "status":"Match not started",
//     "venue":"Himachal Pradesh Cricket Association Stadium, Dharamsala",
//     "date":"2023-05-19",
//     "dateTimeGMT":"2023-05-19T14:00:00Z",
//     "teams":["Punjab Kings","Rajasthan Royals"],
//     "teamInfo":[{
//         "name":"Punjab Kings",
//         "shortname":"PBKS",
//         "img":"https://g.cricapi.com/img/teams/247-637852956959778791.png"
//     },{
//         "name":"Rajasthan Royals",
//         "shortname":"RR",
//         "img":"https://g.cricapi.com/img/teams/251-637852956607161886.png"
//     }],
// 	   "poster": "https://posterlink"
//     "fantasyEnabled":false,
//     "bbbEnabled":false,
//     "hasSquad":true,
//     "matchStarted":false,
//     "matchEnded":false,
// 	   "matchWinner": "Rajasthan Royals"
//     "odds": [{name: "Punjab Kings", price: "1.8"}, {name: "Rajasthan Royals", price: "2"}]
// }

const MatchCard = (props) => {
	const contextConsumer = useContext(ContextProvider);
	const { loggedInUserDetails, mobileView, updateSeenBets } = contextConsumer;
	const { bets = [], points, username = "", isAdmin = false } = loggedInUserDetails;
	const { match = {} } = props;

	const { dateTimeGMT: matchTime, id: matchId, name: matchTitle, status, venue, odds = [], poster = "", teamInfo= [] } = match;

	const [bettingDoneByUser, setBettingDoneByUser] = useState(false);
	const [openLetsBetDialogBox, setOpenLetsBetDialogBox] = useState(false);
	const [openViewBetsDialogBox, setOpenViewBetsDialogBox] = useState(false);

	const betStartTime = getBetStartTime(matchTime);
	const betEndTime = getBetEndTime(matchTime);
	
	const [bettingOn, setBettingOn] = useState((moment() >= betStartTime && moment() <= betEndTime) && (bettingDoneByUser == false));
	const [canViewBets, setCanViewBets] = useState(moment() > betEndTime);
	const [message, setMessage] = useState(moment() >= betEndTime ? `Betting for this match is CLOSED.` : `Betting for this match will be OPENED from ${betStartTime.format("LLL")} to ${betEndTime.format("LLL")}`);
	const [severity, setSeverity] = useState("info");

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
			if(bettingDone) {
				setMessage(getMsgForInProgressBets(selectedPoints, selectedTeam));
				setSeverity("warning");
			} else {
				setMessage(getMsgForOpenBets(betEndTime));
				setSeverity("success");
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

    const handleOnClickLetsBet = () => {
      setOpenLetsBetDialogBox(true);
    }

	const handleCloseLetsBet = () => {
		setOpenLetsBetDialogBox(false);
	}

    const handleOnClickViewBets = () => {
      setOpenViewBetsDialogBox(true);
      updateSeenBets(matchId, username);
    }

	const handleCloseViewBets = () => {
		setOpenViewBetsDialogBox(false);
	}

    const oddsParams = {};

    if(!isEmpty(odds)) {
		if(odds[0].name != teamInfo[0].name) {
			[odds[0], odds[1]] = [odds[1], odds[0]];
		}

		oddsParams["team1Color"] = teamProps[odds[0].name]?.color || "red";
		oddsParams["team1Abbr"] = teamProps[odds[0].name]?.abbr || teamInfo[0].shortname;
		oddsParams["team1Perc"] = getPerc(odds[0].price, odds[1].price);
		oddsParams["team1Logo"] = teamProps[odds[0].name]?.logo || teamInfo[0].img;
		oddsParams["team2Color"] = teamProps[odds[1].name]?.color || "blue";
		oddsParams["team2Abbr"] = teamProps[odds[1].name]?.abbr || teamInfo[1].shortname;
		oddsParams["team2Perc"] = getPerc(odds[1].price, odds[0].price);
		oddsParams["team2Logo"] = teamProps[odds[1].name]?.logo || teamInfo[1].img;
    }

    return (
		<>
			<Card style={{ boxShadow: "5px 5px 20px", background: `linear-gradient(130deg, ${oddsParams["team1Color"]}, ${oddsParams["team2Color"]}` }} className="tw-mt-2 tw-mb-10 xl:tw-w-[70%] tw-rounded-[40px]">
				<CardActionArea>
					<CardContent>
						<MatchPic posterSrc={poster ? "poster" : "single"} team1Logo={teamInfo[0].img} team2Logo={teamInfo[1].img} poster={poster} matchTime={matchTime} mobileView={mobileView}/>
						<Typography className="-tw-mt-5 tw-text-white" variant={fontVariant} style={{fontSize: matchHeadingFontSize}} component="h2">
							<b>{get(matchTitle.split(","),'[0]','No Title')}</b>
						</Typography>
						<Typography variant={fontVariant} style={{fontSize: 13}} className="tw-text-[#aeff71]" component="p">
							<b>{venue}</b>
						</Typography>
						<Typography variant={fontVariant} style={{fontSize: 13}} className="tw-text-[#15ffe0de]" component="p">
							<b>	{getFormattedTimeISOString(matchTime)}</b>
						</Typography>
						<Typography variant={fontVariant} style={{fontSize: 13}} className="tw-text-[#b7e7ff]" component="p">
							<b>{status}</b>
						</Typography>
						{!isEmpty(odds) ?
							<ComparisionBar
								color1={oddsParams.team1Color}
								width1={`${oddsParams.team1Perc}%`}
								text1={`${mobileView ? oddsParams.team1Abbr : odds[0].name}: ${odds[0].price}`}
								bgImg1={oddsParams.team1Logo}
								fontSize={mobileView ? 13 : 16}
								color2={oddsParams.team2Color}
								width2={`${oddsParams.team2Perc}%`}
								text2={`${mobileView ? oddsParams.team2Abbr : odds[1].name}: ${odds[1].price}`}
								bgImg2={oddsParams.team2Logo}
							/>
							: <div className="tw-bg-indigo-950 tw-h-[5vh] tw-mt-2 tw-rounded-[20px] tw-flex tw-justify-center tw-items-center tw-text-white">
								<Typography variant={fontVariant} style={{fontSize: 13}} component="p">
									<b>Odds updation in progress...</b>
								</Typography>
							</div>
						}
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
				oddsParams={oddsParams}
				handleClose={handleCloseLetsBet}
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
