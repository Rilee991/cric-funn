import { get } from "lodash";

import { formatMatch, formatWcMatch } from "../global/adhocUtils";
import { updateConfigurations } from "./configurationsController";
import { clearTable, createMatch, getMatchById, updateMatchById } from "./matchController";
import { CONFIGURATION_DOCS } from '../global/enums';

const API_KEY = "e62a5cb2-1135-40ee-9a7b-99d14472d7ee";
const SERIES_ID = "bd830e89-3420-4df5-854d-82cfab3e1e04";

export const getMatchDetailsById = async (id, username, setConfigurations) => {
    try {
        const url = `https://api.cricapi.com/v1/match_info?apikey=${API_KEY}&offset=0&id=${id}`;
        const resp = await fetch(url);
        const data = await resp.json();
        const matchDetails = data.data;
        const currentHits = get(data, "info.hitsToday",0);
        if(username && currentHits && setConfigurations) {
            updateConfigurations(CONFIGURATION_DOCS.CREDITS, username, currentHits, setConfigurations);
        }

        return matchDetails;
    } catch (error) {
        throw new Error(error);
    }
}

export const saveMatchesToDb = async (username, setConfigurations) => {
    try {
        await clearTable();
        const url = `https://api.cricapi.com/v1/series_info?apikey=${API_KEY}&offset=0&id=${SERIES_ID}`;
        const resp = await fetch(url);
        const data = await resp.json();
        const matchList = data.data.matchList;
        const currentHits = get(data, "info.hitsToday",0);
        if(username && currentHits && setConfigurations) {
            updateConfigurations(CONFIGURATION_DOCS.CREDITS, username, currentHits, setConfigurations);
        }

        const matchesPromise = [];

        for(const match of matchList) {
            // formatMatch(match);
            formatWcMatch(match); //Only for WC
            matchesPromise.push(createMatch(match.id, match));
        }

        await Promise.all(matchesPromise);
    } catch (error) {
        throw new Error(error);
    }
}

export const syncDbWithNewMatches = async (username, setConfigurations) => {
    try {
        const url = `https://api.cricapi.com/v1/series_info?apikey=${API_KEY}&offset=0&id=${SERIES_ID}`;
        const resp = await fetch(url);
        const data = await resp.json();
        const matchList = data.data.matchList;
        const currentHits = get(data, "info.hitsToday",0);
        const matchesPromise = [];

        if(username && currentHits && setConfigurations) {
            updateConfigurations(CONFIGURATION_DOCS.CREDITS, username, currentHits, setConfigurations);
        }

        for(const match of matchList) {
            const dbMatch = await getMatchById(match.id);
            const matchData = dbMatch.data();
            if(!dbMatch.exists) {
                formatMatch(match);
                matchesPromise.push(createMatch(match.id, match));
            } else if(dbMatch.exists && matchData.name.length != match.name.length) {
                formatMatch(match);
                matchesPromise.push(updateMatchById(match.id, match));
            }
        }

        await Promise.all(matchesPromise);
    } catch (error) {
        throw new Error(error);
    }
}
