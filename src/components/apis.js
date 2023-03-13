import { get, sortBy } from "lodash";
import moment from "moment";
import { db } from '../config';

const API_KEY = "e5dc35f0-1ff0-422f-b494-9999047708de";
const SERIES_ID = "c75f8952-74d4-416f-b7b4-7da4b4e3ae6e";

export const userDump = async () => {
    const resp = await db.collection("users").get();
    const usersData = await resp.docs;
    console.log('Dump starting');

    usersData.forEach(async user => {
        const data = user.data();

        await db.collection("users_2022_ipl_dump").doc(data.username).set({
            bets: data.bets || [],
            email: data.email || "",
            image: data.image || "",
            isAdmin: data.isAdmin || false,
            isDummyUser: data.isDummyUser || false,
            password: data.password || "",
            points: data.points || -1,
            username: data.username || ""
        });
    });
    console.log('Dump completed');
}

export const clearBetsData = async () => {
    const resp = await db.collection("users").get();
    const usersData = await resp.docs;
    console.log('Clearing starting');

    usersData.forEach(async user => {
        const data = user.data();
        const isDummyUser = !(["Broly", "Cypher33", "SD", "ashu", "desmond", "kelly"].includes(data.username));
        await db.collection("users").doc(data.username).update({
            bets: [],
            points: 2000,
            isDummyUser: isDummyUser
        });
    });
    console.log('Clearing completed');
}

export const getMatches = async () => {
    const url = `https://api.cricapi.com/v1/series_info?apikey=${API_KEY}&offset=0&id=${SERIES_ID}`;
    try {
        let response = await fetch(url);
        response = await response.json();
        const matches = get(response,'data.matchList',[]);
        const sortedMatches = sortBy(matches, ['dateTimeGMT']);
        const filteredMatches = sortedMatches.filter(match => {
            match.dateTimeGMT = match.dateTimeGMT + 'Z';

            if(moment(match.dateTimeGMT).add(2 ,'days').isSameOrAfter(moment()))   return true;

            return false;
        }) || [];

        return filteredMatches;
    } catch (err) {
        console.log("Error in API getMatches:", err);
    }
}

// "data": {
//     "id": "f560b9f9-9859-47f0-be8c-5d5b80eded8e",
//     "name": "Knights vs Lions, 10th Match",
//     "matchType": "odi",
//     "status": "Knights won by 1 wkt",
//     "venue": "Mangaung Oval, Bloemfontein",
//     "date": "2022-03-16",
//     "dateTimeGMT": "2022-03-16T11:00:00",
//     "teams": [
//       "Knights",
//       "Lions"
//     ],
//     "score": [
//       {
//         "r": 241,
//         "w": 9,
//         "o": 49.5,
//         "inning": "Lions Inning 1"
//       },
//       {
//         "r": 240,
//         "w": 6,
//         "o": 50,
//         "inning": "Knights Inning 1"
//       }
//     ],
//     "tossWinner": "Lions",
//     "tossChoice": "bat",
//     "matchWinner": "Knights",
//     "series_id": "018424f3-890f-4f4d-a9e0-c18f52004edd",
//     "fantasyEnabled": false,
//     "hasSquad": true
//   },
export const getMatchDetailsById = async (id) => {
    const url = `https://api.cricapi.com/v1/match_info?apikey=${API_KEY}&offset=0&id=${id}`;
    const resp = await fetch(url);
    const data = await resp.json();
    const matchDetails = data.data;

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
    } catch(err) {
        console.log(err);
    }
}