import React, { useState, useContext, useEffect } from 'react';
import { Card, CardActionArea, CardActions, CardContent, Button, Typography } from '@material-ui/core';
import { FlashOnOutlined, VisibilityOutlined } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { find, get, isEmpty, startCase } from 'lodash';
import moment from 'moment';

import { ContextProvider } from '../../../global/Context';

import BettingDialog from './BettingDialog';
import ViewBetsDialog from './ViewBetsDialog';
import MatchPic from '../../../components/common/MatchPic';
import ComparisionBar from '../../../components/common/ComparisionBar';
import { getBetEndTime, getBetStartTime, getFormattedTimeISOString, getMsgForClosedBets, getMsgForInProgressBets, 
	getMsgForLostBets, getMsgForNoResultBets, getMsgForOpenBets, getMsgForUpcomingBets, getMsgForWonBets, getPerc
} from '../../../global/adhocUtils';
import { ALERT_CONFIGS } from '../../../configs/userConfigs';
import { TEAM_PROPS } from '../../../configs/teamConfigs';

const MatchCard = (props) => {
	const contextConsumer = useContext(ContextProvider);
	const { loggedInUserDetails, mobileView, updateSeenBets } = contextConsumer;
	const { bets = [], points, username = "", isAdmin = false } = loggedInUserDetails;
	const { match = {} } = props;

	const { dateTimeGMT: matchTime, id: matchId, name: matchTitle, status, venue, odds = [], poster = "", teamInfo= [], hasCustomHeader = false, customHeaderText = "" } = match;

	const [bettingDoneByUser, setBettingDoneByUser] = useState(false);
	const [openLetsBetDialogBox, setOpenLetsBetDialogBox] = useState(false);
	const [openViewBetsDialogBox, setOpenViewBetsDialogBox] = useState(false);

	const betStartTime = getBetStartTime(matchTime);
	const betEndTime = getBetEndTime(matchTime);
	
	const [bettingOn, setBettingOn] = useState((moment() >= betStartTime && moment() <= betEndTime) && (bettingDoneByUser == false));
	const [canViewBets, setCanViewBets] = useState(moment() > betEndTime);
	const [message, setMessage] = useState(moment() >= betEndTime ? `Betting window is CLOSED.` : `Betting window will be OPENED from ${betStartTime.format("LLL")} to ${betEndTime.format("LLL")}`);
	const [severity, setSeverity] = useState(ALERT_CONFIGS.INFO);

    useEffect(()=> {
		const bet = find(bets, { "matchId": matchId }) || {};
		const { selectedPoints, isNoResult, isSettled, betWon, selectedTeam, odds: betOdds } = bet;
		const bettingDone = isEmpty(bet) ? false : true;

		setBettingDoneByUser(bettingDone);
		setBettingOn(moment() >= betStartTime && moment() <= betEndTime && !bettingDone);
		setCanViewBets(moment() > betEndTime);

		if(moment() < betStartTime) {
			setMessage(getMsgForUpcomingBets(betStartTime,betEndTime));
			setSeverity(ALERT_CONFIGS.INACTIVE);
		} else if(moment() >= betStartTime && moment() <= betEndTime) {
			if(bettingDone) {
				setMessage(getMsgForInProgressBets(selectedPoints, selectedTeam));
				setSeverity(ALERT_CONFIGS.WARNING);
			} else {
				setMessage(getMsgForOpenBets(betEndTime));
				setSeverity(ALERT_CONFIGS.INFO);
			}
		} else if(isNoResult) {
			setMessage(getMsgForNoResultBets(selectedPoints, selectedTeam));
			setSeverity(ALERT_CONFIGS.SUCCESS);
		} else {
			setMessage(getMsgForClosedBets());
			setSeverity(ALERT_CONFIGS.DANGER);
			if(bettingDone) {
				if(isSettled) {
					if(betWon) {
						setMessage(getMsgForWonBets(Math.ceil(selectedPoints*betOdds[selectedTeam]), selectedTeam));
						setSeverity(ALERT_CONFIGS.SUCCESS);
					} else {
						setMessage(getMsgForLostBets(selectedPoints, selectedTeam));
						setSeverity(ALERT_CONFIGS.DANGER);
					}
				} else {
					setMessage(getMsgForInProgressBets(selectedPoints, selectedTeam));
					setSeverity(ALERT_CONFIGS.WARNING);
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

		oddsParams["team1Color"] = TEAM_PROPS[odds[0].name]?.color || "red";
		oddsParams["team1Abbr"] = TEAM_PROPS[odds[0].name]?.abbr || teamInfo[0].shortname;
		oddsParams["team1Perc"] = getPerc(odds[0].price, odds[1].price);
		oddsParams["team1Logo"] = TEAM_PROPS[odds[0].name]?.logo || teamInfo[0].img;
		oddsParams["team2Color"] = TEAM_PROPS[odds[1].name]?.color || "blue";
		oddsParams["team2Abbr"] = TEAM_PROPS[odds[1].name]?.abbr || teamInfo[1].shortname;
		oddsParams["team2Perc"] = getPerc(odds[1].price, odds[0].price);
		oddsParams["team2Logo"] = TEAM_PROPS[odds[1].name]?.logo || teamInfo[1].img;
    }
	// `linear-gradient(130deg, ${oddsParams["team1Color"]}, ${oddsParams["team2Color"]}`

	const buildCustomHeader = () => {
		return (
			<Card style={{ boxShadow: "5px 5px 20px", backgroundRepeat:"no-repeat", backgroundSize: "inherit",height: "auto", backgroundBlendMode: "hard-light" }} className="tw-mt-2 tw-mb-10 tw-rounded-[40px]">
				<CardActionArea>
					<CardContent className="tw-flex tw-bg-indigo-950 tw-flex-col tw-items-center">
						{/* <div style={{ padding: "10px", border: "2px solid white" }} className="tw-bg-indigo-950 tw-h-[5vh] tw-rounded-[20px] tw-flex tw-justify-center tw-items-center tw-text-white"> */}
							<Typography className="tw-flex tw-items-center tw-font-noto tw-gap-2 tw-text-white" variant={"button"} style={{fontSize: 20}} component="p">
								<b>{customHeaderText || "Matches"}</b> 
							</Typography>
						{/* </div> */}
					</CardContent>
				</CardActionArea>
			</Card>
		);
	}

    return (
		<>
			{hasCustomHeader ? buildCustomHeader() : null}
			<Card style={{ boxShadow: "5px 5px 20px" }} className="tw-mt-2 tw-bg-[#340043] tw-mb-10 tw-rounded-[40px]">
				<CardActionArea>
					<CardContent>
						<MatchPic posterSrc={poster ? "poster" : "single"} team1Logo={teamInfo[0].img} team2Logo={teamInfo[1].img} poster={poster} matchTime={matchTime} mobileView={mobileView}/>
						<Typography className="-tw-mt-5 tw-leading-[1.3] tw-text-white tw-font-noto" style={{fontSize: 20}} component="h2">
							<b>{startCase(get(matchTitle.split(","),'[0]','No Title'))}</b>
						</Typography>
						<Typography style={{fontSize: window.innerWidth <= 640 ? "15px" : "18px" }} className="tw-text-[#aeff71] tw-font-noto tw-mt-1" component="p">
							<b>{venue}</b>
						</Typography>
						<Typography style={{fontSize: window.innerWidth <= 640 ? "13px" : "16px" }} className="tw-text-[#15ffe0de] tw-font-noto tw-mt-1" component="p">
							<b>Starts at {getFormattedTimeISOString(matchTime)}</b>
						</Typography>
						<Typography style={{fontSize: window.innerWidth <= 640 ? "15px" : "18px" }} className="tw-text-[#b7e7ff] tw-font-noto tw-mt-1 tw-mb-3" component="p">
							<b>{status}</b>
						</Typography>
						{!isEmpty(odds) ?
							<ComparisionBar
								color1={oddsParams.team1Color}
								width1={`${oddsParams.team1Perc}%`}
								text1={`${mobileView ? oddsParams.team1Abbr : odds[0].name}: ${odds[0].price}`}
								bgImg1={oddsParams.team1Logo}
								fontSize={mobileView ? 18 : 17}
								color2={oddsParams.team2Color}
								width2={`${oddsParams.team2Perc}%`}
								text2={`${mobileView ? oddsParams.team2Abbr : odds[1].name}: ${odds[1].price}`}
								bgImg2={oddsParams.team2Logo}
							/>
							: <div className="tw-bg-indigo-950 tw-h-[5vh] tw-mt-2 tw-rounded-[20px] tw-flex tw-justify-center tw-items-center tw-text-white">
								<Typography style={{fontSize: 13}} component="p" variant={"button"} className="tw-font-noto">
									<b>Odds updation in progress...</b>
								</Typography>
							</div>
						}
					</CardContent>
				</CardActionArea>

				<CardActions className="tw-flex tw-justify-center tw-px-4 tw-pt-0">
					<Button size="small" className="tw-w-1/2 tw-rounded-[40px]" style={{ background: bettingOn ? "linear-gradient(0deg, #1b004a, #50045a)" : 'grey', color: "white" }} variant="contained" disabled={bettingOn ? false : true} onClick={() => handleOnClickLetsBet()}>
						<Typography variant="overline" className="tw-font-noto tw-font-semibold tw-text-base tw-leading-8 tw-flex tw-justify-center tw-items-center tw-gap-1">
							{"Fire Up"} <i className="pi pi-bolt tw-text-xl" />
						</Typography>
					</Button>
					<Button size="small" className="tw-w-1/2 tw-rounded-[40px]" style={{ background: canViewBets ? "linear-gradient(0deg, #1b004a, #50045a)" : 'grey', color: "white" }} variant="contained" disabled={canViewBets ? false : true} onClick={() => handleOnClickViewBets(matchId)}>
						<Typography variant="overline" className="tw-font-noto tw-font-semibold tw-text-base tw-leading-8 tw-flex tw-justify-center tw-items-center tw-gap-1">
							{mobileView ? "View" : "View Bets"} <i className="pi pi-eye tw-text-xl" />
						</Typography>
					</Button>
				</CardActions>

				<Alert style={{ background: severity }} variant="filled" className="tw-rounded-[40px] tw-font-noto">
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
