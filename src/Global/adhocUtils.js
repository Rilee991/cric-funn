import { ceil } from "lodash";
import moment from "moment";

import { matchPostersMapping } from "../configs/matchConfigs";

const firebase = require("firebase");

export const getToppgerBgImage = (isChampion = false) => {
    if(isChampion)   return "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/afabd1f2-46f0-4ff5-985f-0c15429d2afd/ddy5spv-d50991c3-895f-4852-8721-3594963be481.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2FmYWJkMWYyLTQ2ZjAtNGZmNS05ODVmLTBjMTU0MjlkMmFmZFwvZGR5NXNwdi1kNTA5OTFjMy04OTVmLTQ4NTItODcyMS0zNTk0OTYzYmU0ODEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.JrvlnKfo-CIDI_WMWOjT1LVhjYP0xXG4LVHEgclWTPg";
    return "https://www.freepnglogos.com/uploads/1-number-png/number-1-rankings-georgia-tech-40.png";
}

export const getFirebaseCurrentTime = () => {
    return firebase.default.firestore.Timestamp.fromDate(new Date());
}

export const getWinningAmount = (amount, odds = 1) => {
    amount = parseInt(amount);
    odds = parseFloat(odds);

    return ceil((1+odds)*amount);
}

export const getBetStartTime = (matchTime) => {
    return moment(matchTime).subtract(29, "hours");
}

export const getBetEndTime = (matchTime) => {
    return moment(matchTime).subtract(30, "minutes");
}

export const getWinnerEtaParams = (matchType = "t20") => {
    if(matchType == "odi")  return { value: 6, unit: "hours" };
    else if(matchType == "test")    return { value: 3, unit: "days" };
    return { value: 3, unit: "hours" };
}

export const getDefaultMatchOdds = (team1, team2) => {
    return [{ name: team1, price: 1 }, { name: team2, price: 1 }];
}

export const formatMatch = (match) => {
    let names = match.name.split(" vs");
    const team1 = names[0];
    const team2 = names[1].split(", ")[0].slice(1); 

    if(match.teamInfo && match.teamInfo[0].name != team1) {
        const temp = match.teamInfo[0];
        match.teamInfo[0] = match.teamInfo[1];
        match.teamInfo[1] = temp;
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
