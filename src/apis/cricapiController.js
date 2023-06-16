import { clearTable, createMatch } from "./matchController";
import { matchPostersMapping } from '../configs/matchConfigs';

const API_KEY = "e62a5cb2-1135-40ee-9a7b-99d14472d7ee";
const SERIES_ID = "c75f8952-74d4-416f-b7b4-7da4b4e3ae6e";

export const getMatchDetailsById = async (id) => {
    try {
        const url = `https://api.cricapi.com/v1/match_info?apikey=${API_KEY}&offset=0&id=${id}`;
        const resp = await fetch(url);
        const data = await resp.json();
        const matchDetails = data.data;

        return matchDetails;
    } catch (error) {
        throw new Error(error);
    }
}

export const saveMatchesToDb = async () => {
    try {
        await clearTable();
        const url = `https://api.cricapi.com/v1/series_info?apikey=${API_KEY}&offset=0&id=${SERIES_ID}`;
        const resp = await fetch(url);
        const data = await resp.json();
        const matchList = data.data.matchList;
        const matchesPromise = [];

        for(const match of matchList) {
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
            match.poster = matchPostersMapping[`${match.team1Abbreviation}-${match.team2Abbreviation}`] || matchPostersMapping[`${match.team2Abbreviation}-${match.team1Abbreviation}`];

            delete match["bbbEnabled"];
            delete match["fantasyEnabled"];
            delete match["hasSquad"];

            matchesPromise.push(createMatch(match.id, match));
        }

        await Promise.all(matchesPromise);
    } catch (error) {
        throw new Error(error);
    }
}
