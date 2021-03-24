const API_KEY = "9mXZLYQYaVcA6KoInNpffahSTbC2";

export const getMatches = () => {
    const url = `https://cricapi.com/api/matches/${API_KEY}`;

    return fetch(url)
    .then(resp => resp.json())
    .catch(err => console.log(err))
}

export const getMatchDetails = (id) => {
    const url = `https://cricapi.com/api/cricketScore?apikey=${API_KEY}&unique_id=${id}`;

    return fetch(url)
    .then(resp => resp.json())
    .catch(err => console.log(err))
}