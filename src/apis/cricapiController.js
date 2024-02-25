import { get } from "lodash";

import { formatMatch, formatWcMatch } from "../global/adhocUtils";
import { clearTable, createMatch, getMatchById, updateMatchById } from "./matchController";
import moment from "moment";

const API_KEY = "e62a5cb2-1135-40ee-9a7b-99d14472d7ee";
const SERIES_ID = "71a7c7dc-3929-408c-9641-1da6d96f8894"; //76ae85e2-88e5-4e99-83e4-5f352108aebc";

export const getMatchDetailsById = async (id) => {
    try {
        const now = moment();
        const url = `https://api.cricapi.com/v1/match_info?apikey=${API_KEY}&offset=0&id=${id}`;
        const resp = await fetch(url);
        const data = await resp.json();
        const matchDetails = data.data;
        const currentHits = get(data, "info.hitsToday", 0);

        return { matchDetails, configDocId: now.format("YYYY-MM-DD"), currentHits };
    } catch (error) {
        throw new Error(error);
    }
}

export const saveMatchesToDb = async () => {
    try {
        await clearTable();
        const now = moment();
        const url = `https://api.cricapi.com/v1/series_info?apikey=${API_KEY}&offset=0&id=${SERIES_ID}`;
        const resp = await fetch(url);
        const data = await resp.json();
        const matchList = data.data.matchList;
        const currentHits = get(data, "info.hitsToday",0);

        const matchesPromise = [];

        for(const match of matchList) {
            formatMatch(match);
            // formatWcMatch(match); //Only for WC
            matchesPromise.push(createMatch(match.id, match));
        }

        await Promise.all(matchesPromise);

        return { configDocId: now.format("YYYY-MM-DD"), currentHits };
    } catch (error) {
        throw new Error(error);
    }
}

export const syncDbWithNewMatches = async () => {
    try {
        const now = moment();
        const url = `https://api.cricapi.com/v1/series_info?apikey=${API_KEY}&offset=0&id=${SERIES_ID}`;
        const resp = await fetch(url);
        const data = await resp.json();
        const matchList = data.data.matchList;
        const currentHits = get(data, "info.hitsToday",0);
        const matchesPromise = [];

        for(const match of matchList) {
            const dbMatch = await getMatchById(match.id);
            const matchData = dbMatch.data();
            if(!dbMatch.exists) {
                // formatMatch(match);
                formatWcMatch(match);
                matchesPromise.push(createMatch(match.id, match));
            } else if(dbMatch.exists && matchData.name.length != match.name.length) {
                // formatMatch(match);
                formatWcMatch(match);
                matchesPromise.push(updateMatchById(match.id, match));
            }
        }

        await Promise.all(matchesPromise);

        return { configDocId: now.format("YYYY-MM-DD"), currentHits};
    } catch (error) {
        throw new Error(error);
    }
}
