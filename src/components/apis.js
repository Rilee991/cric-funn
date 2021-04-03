import { find } from "lodash";

const API_KEY = "9mXZLYQYaVcA6KoInNpffahSTbC2";

export const getMatches = () => {
    const url = `https://cricapi.com/api/matches/${API_KEY}`;

    return fetch(url)
    .then(resp => resp.json())
    .catch(err => console.log(err))
}

export const getMatchDetailsForId = async (id) => {
    const url = `https://cricapi.com/api/matches/${API_KEY}`;

    const resp = await fetch(url);
    const data = await resp.json();
    const matches = data.matches;
    const matchDetails = find(matches, {"unique_id": id}) || {};
    return matchDetails;
}

export const getMatchDetails = (id) => {
    const url = `https://cricapi.com/api/cricketScore?apikey=${API_KEY}&unique_id=${id}`;

    return fetch(url)
    .then(resp => resp.json())
    .catch(err => console.log(err))
}