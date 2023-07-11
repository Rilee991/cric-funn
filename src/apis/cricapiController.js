import { formatMatch } from "../global/adhocUtils";
import { clearTable, createMatch, getMatchById } from "./matchController";

const API_KEY = "e62a5cb2-1135-40ee-9a7b-99d14472d7ee";
const SERIES_ID = "951e7413-7d28-4c91-8822-4a5135091aab";
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
            formatMatch(match);
            matchesPromise.push(createMatch(match.id, match));
        }

        await Promise.all(matchesPromise);
    } catch (error) {
        throw new Error(error);
    }
}

export const syncDbWithNewMatches = async () => {
    try {
        const url = `https://api.cricapi.com/v1/series_info?apikey=${API_KEY}&offset=0&id=${SERIES_ID}`;
        const resp = await fetch(url);
        const data = await resp.json();
        const matchList = data.data.matchList;
        const matchesPromise = [];

        for(const match of matchList) {
            const dbMatch = await getMatchById(match.id);
            if(!dbMatch.exists) {
                formatMatch(match);
                matchesPromise.push(createMatch(match.id, match));
            }
        }

        await Promise.all(matchesPromise);
    } catch (error) {
        throw new Error(error);
    }
}
