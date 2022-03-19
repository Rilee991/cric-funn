import { find, get, sortBy } from "lodash";
import { db } from '../config';

const API_KEY = "e5dc35f0-1ff0-422f-b494-9999047708de";

export const getMatches = async () => {
    const url = `https://api.cricapi.com/v1/matches?apikey=${API_KEY}&offset=75 `;

    try {
        let response = await fetch(url);
        response = await response.json();
        const matches = get(response,'data',[]);
        const sortedMatches = sortBy(matches, ['dateTimeGMT']);

        return sortedMatches;
    } catch (err) {
        console.log("Error in API getMatches:", err);
    }
}

export const getMatchDetailsForId = async (id) => {
    const url = `https://cricapi.com/api/matches/${API_KEY}`;

    const resp = await fetch(url);
    const data = await resp.json();
    const matches = data.matches;
    const matchDetails = find(matches, {"unique_id": id}) || {};
    return matchDetails;
}

export const getMatchDetails = async (id) => {
    const url = `https://api.cricapi.com/v1/match_info?apikey=${API_KEY}&offset=0&id=${id}`;

    try {
        const data = await fetch(url);
        const matchDetails = await data.json();
        const details = get(matchDetails,'data',{});

        return details;
    } catch(err) {
        console.log("Error in API getMatchDetails:", err);
    }
}

export const updateUsername = async(username, newUsername) => {
    try {
        let userData = await db.collection("users").doc(username).get();
        userData = await userData.data();

        await db.collection("users").doc(newUsername).set(userData);
        console.log(userData);
    } catch(err) {
        console.log(err);
    }
}