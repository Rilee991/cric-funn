import { find } from "lodash";

const API_KEY = "9mXZLYQYaVcA6KoInNpffahSTbC2";

export const getMatches = async () => {
    const url = `https://cricapi.com/api/matches/${API_KEY}`;

    try {
        let data = await fetch(url);
        data = await data.json() || {};
        const { matches = [] } = data;
        return matches;
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
    const url = `https://cricapi.com/api/cricketScore?apikey=${API_KEY}&unique_id=${id}`;

    try {
        const data = await fetch(url);
        const matchDetails = await data.json();
        return matchDetails;
    } catch(err) {
        console.log("Error in API getMatchDetails:", err);
    }
}