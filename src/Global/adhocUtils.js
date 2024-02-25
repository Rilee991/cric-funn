import { ceil } from "lodash";
import moment from "moment";

import { matchPostersMapping } from "../configs/matchConfigs";
import { DEFAULT_TEAM_LOGO, TEAM_PROPS } from "../configs/teamConfigs";

const firebase = require("firebase");

export const getToppgerBgImage = (isChampion = false) => {
    if(isChampion)   return "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/afabd1f2-46f0-4ff5-985f-0c15429d2afd/ddy5spv-d50991c3-895f-4852-8721-3594963be481.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2FmYWJkMWYyLTQ2ZjAtNGZmNS05ODVmLTBjMTU0MjlkMmFmZFwvZGR5NXNwdi1kNTA5OTFjMy04OTVmLTQ4NTItODcyMS0zNTk0OTYzYmU0ODEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.JrvlnKfo-CIDI_WMWOjT1LVhjYP0xXG4LVHEgclWTPg";
    return "https://www.freepnglogos.com/uploads/1-number-png/number-1-rankings-georgia-tech-40.png";
}

export const getFirebaseCurrentTime = () => {
    return firebase.default.firestore.Timestamp.fromDate(new Date());
}

export const getFormattedTimeISOString = (date) => {
    return moment(date).format("lll");
}

export function getMsgForUpcomingBets(startTime, endTime) {
    return (`Betting for this match will be OPENED from - ${startTime.format("LLL")} TO ${endTime.format("LLL")}`);
}

export function getMsgForOpenBets(endTime) {
    return (`Betting is OPENED TILL - ${endTime.format("LLL")}.`);
}

export function getMsgForInProgressBets(points, team) {
    return (`You've bet ${points} POINTS on this match. Betting Team: ${team}`);
}

export function getMsgForNoResultBets(points, team) {
    return (`Betting is CLOSED. Match ended in NO RESULT. You've recieved ${points} POINTS on this match. Betting Team: ${team}`);
}

export function getMsgForClosedBets() {
    return (`Betting for this match is CLOSED. You DID NOT bet.`);
}

export function getMsgForWonBets(points, team) {
    return (`Betting CLOSED. You WON ${points} POINTS on this match. Betting Team: ${team}`);
}

export function getMsgForLostBets(points, team) {
    return (`Betting CLOSED. You LOST ${points} POINTS on this match. Betting Team: ${team}`);
}

export const getWinningAmount = (amount, odds = 1) => {
    amount = parseInt(amount);
    odds = parseFloat(odds);

    return ceil((1+odds)*amount);
}

export const getBetStartTime = (matchTime) => {
    return moment(matchTime).subtract(24, "hours");
}

export const getBetEndTime = (matchTime) => {
    return moment(matchTime).subtract(30, "minutes");
}

export const getWinnerEtaParams = (matchType = "t20") => {
    if(matchType == "odi")  return { value: 6, unit: "hours" };
    else if(matchType == "test")    return { value: 3, unit: "days" };
    return { value: 3, unit: "hours" };
}

export const getPerc = (score1, score2) => {
    score1 = parseFloat(score1);
    score2 = parseFloat(score2);
    return ((score1/(score1 + score2))*100).toFixed(0);
}

export const getDefaultMatchOdds = (team1, team2) => {
    return [{ name: team1, price: 1 }, { name: team2, price: 1 }];
}

export const getTeamAbbr = (name) => {
    const words = name.split(" ");

    if(words.length > 1)    return words.map(word => word[0]).join("").toUpperCase();
    return words[0].slice(0,3).toUpperCase();
}

export const formatMatch = (match) => {
    let names = match.name.split(" vs");
    const team1 = names[0];
    const team2 = names[1].split(", ")[0].slice(1);

    if(match.teamInfo) {
        if(match.teamInfo[0].name != team1) {
            const temp = match.teamInfo[0];
            match.teamInfo[0] = match.teamInfo[1];
            match.teamInfo[1] = temp;
        }
    } else {
        match.teamInfo = [{
            name: team1, shortname: TEAM_PROPS[team1]?.abbr || getTeamAbbr(team1), img: TEAM_PROPS[team1]?.logo || DEFAULT_TEAM_LOGO
        }, {
            name: team2, shortname: TEAM_PROPS[team2]?.abbr || getTeamAbbr(team2), img: TEAM_PROPS[team2]?.logo || DEFAULT_TEAM_LOGO
        }];
    }

    if(match?.teamInfo[0]?.img?.includes("?w=")) {
        match.teamInfo[0].img = match.teamInfo[0].img.replace(/(\?|&)w=\d+/, '$1w=500');
    }

    if(match?.teamInfo[1]?.img?.includes("?w=")) {
        match.teamInfo[1].img = match.teamInfo[1].img.replace(/(\?|&)w=\d+/, '$1w=500');
    }

    if(match.teams && match.teams[0] != team1) {
        const temp = match.teams[0];
        match.teams[0] = match.teams[1];
        match.teams[1] = temp;
    }

    match.team1 = team1;
    match.team2 = team2;
    match.team1Abbreviation = match.teamInfo[0].shortname;
    match.team2Abbreviation = match.teamInfo[1].shortname;
    match.poster = matchPostersMapping[`${match.team1Abbreviation}-${match.team2Abbreviation}`] || matchPostersMapping[`${match.team2Abbreviation}-${match.team1Abbreviation}`] || "";
    match.dateTimeGMT = match.dateTimeGMT + "Z";

    delete match["bbbEnabled"];
    delete match["fantasyEnabled"];
    delete match["hasSquad"];
}

export const formatWcMatch = (match) => {
    let names = match.name.split(" vs");
    let team1 = names[0];
    let team2 = names[1].split(", ")[0].slice(1);

    if(match.teamInfo) {
        if(match.teamInfo.length == 2) {
            if(match.teamInfo[0].name != team1) {
                const temp = match.teamInfo[0];
                match.teamInfo[0] = match.teamInfo[1];
                match.teamInfo[1] = temp;
            }
        } else {
            match.teamInfo.push({ name: match.teamInfo[0].name != team1 ? team1 : team2, shortname: match.teamInfo[0].name != team1 ? team1 : team2, img: "https://assets.stickpng.com/images/580b57fcd9996e24bc43c53e.png" });
            if(match.teamInfo[0].name != team1) {
                const temp = match.teamInfo[0];
                match.teamInfo[0] = match.teamInfo[1];
                match.teamInfo[1] = temp;
            }
        }
    } else {
        match.teamInfo = [{
            name: team1, shortname: TEAM_PROPS[team1]?.abbr || getTeamAbbr(team1), img: TEAM_PROPS[team1]?.logo || DEFAULT_TEAM_LOGO
        }, {
            name: team2, shortname: TEAM_PROPS[team2]?.abbr || getTeamAbbr(team2), img: TEAM_PROPS[team2]?.logo || DEFAULT_TEAM_LOGO
        }];
    }

    if(match.teams && match.teams[0] != team1) {
        const temp = match.teams[0];
        match.teams[0] = match.teams[1];
        match.teams[1] = temp;
    }

    // Only for wc...
    const q1Team = "Netherlands", q2Team = "Sri Lanka";

    if(TEAM_PROPS[match.teamInfo[0].name]) {
        match.teamInfo[0].img = TEAM_PROPS[match.teamInfo[0].name].logo;
    } else if(match.teamInfo[0].name == "Q1") {
        match.teamInfo[0].name = team1 = q1Team;
        match.teamInfo[0].shortname = TEAM_PROPS[q1Team].abbr;
        match.teamInfo[0].img = TEAM_PROPS[q1Team].logo;
        match.name = match.name.replace("Q1", q1Team);
    } else if(match.teamInfo[0].name == "Q2") {
        match.teamInfo[0].name = team1 = q2Team;
        match.teamInfo[0].shortname = TEAM_PROPS[q2Team].abbr;
        match.teamInfo[0].img = TEAM_PROPS[q2Team].logo;
        match.name = match.name.replace("Q2", q2Team);
    }

    if(TEAM_PROPS[match.teamInfo[1].name]) {
        match.teamInfo[1].img = TEAM_PROPS[match.teamInfo[1].name].logo;
    } else if(match.teamInfo[1].name == "Q1") {
        match.teamInfo[1].name = team2 = q1Team;
        match.teamInfo[1].shortname = TEAM_PROPS[q1Team].abbr;
        match.teamInfo[1].img = TEAM_PROPS[q1Team].logo;
        match.name = match.name.replace("Q1", q1Team);
    } else if(match.teamInfo[1].name == "Q2") {
        match.teamInfo[1].name = team2 = q2Team;
        match.teamInfo[1].shortname = TEAM_PROPS[q2Team].abbr;
        match.teamInfo[1].img = TEAM_PROPS[q2Team].logo;
        match.name = match.name.replace("Q2", q2Team);
    }

    match.team1 = team1;
    match.team2 = team2;
    match.team1Abbreviation = match.teamInfo[0].shortname;
    match.team2Abbreviation = match.teamInfo[1].shortname;
    match.poster = matchPostersMapping[`${match.team1Abbreviation}-${match.team2Abbreviation}`] || matchPostersMapping[`${match.team2Abbreviation}-${match.team1Abbreviation}`] || "";
    match.dateTimeGMT = match.dateTimeGMT + "Z";
    match.createdAt = getFirebaseCurrentTime();
    match.updatedAt = getFirebaseCurrentTime();

    delete match["bbbEnabled"];
    delete match["fantasyEnabled"];
    delete match["hasSquad"];
}
