import { get, isEmpty, sortBy } from "lodash";
import moment from "moment";
import { db, iplMatches, firebase, matchImgs } from '../config';

const API_KEY = "e62a5cb2-1135-40ee-9a7b-99d14472d7ee";
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
            isDummyUser: isDummyUser,
            updatedBy: "clearBetsData",
            updatedAt: firebase.firestore.Timestamp.fromDate(new Date())
        });
    });
    console.log('Clearing completed');
}

export const getMatches = async () => {
    const url = `https://api.cricapi.com/v1/series_info?apikey=${API_KEY}&offset=0&id=${SERIES_ID}`;
    try {
        // let response = await db.collection("ipl_matches").get();
        // response = {"data.matchList": response.docs.map(doc => {
        //     const data = doc.data();
        //     return data;
        // })}

        let response = await fetch(url);
        response = await response.json();
        const matches = get(response,'data.matchList',[]);
        const sortedMatches = sortBy(matches, ['dateTimeGMT']);
        let stopOddsChecker = false;
        const filteredMatches = [];

        for(const match of sortedMatches) {
            match.dateTimeGMT = match.dateTimeGMT + 'Z';

            const isIncludedMatch = (moment(match.dateTimeGMT).isBetween(moment("2023-04-01"),moment("2023-04-05")))//.add(1 ,'days').isSameOrAfter(moment()));

            if(!isIncludedMatch)  continue;
            
            if(!stopOddsChecker) {
                const matchDb = await db.collection("ipl_matches").doc(match.id).get();
                const data = matchDb.data();
                const odds = get(data, 'odds', []);
                const seenBy = get(data, 'seenBy', {});

                if(isEmpty(odds)) {
                    stopOddsChecker = true;
                } else {
                    match.odds = odds;
                    match.seenBy = seenBy;
                }
            }

            console.log(match.id);
            match.banner = matchImgs[match.id];

            filteredMatches.push(match);
        };

        return filteredMatches;
    } catch (err) {
        console.log("Error in API getMatches:", err);
    }
}

export const getMatchesFromDb = async () => {
    try {
        const rawResp = await db.collection("ipl_matches").orderBy('dateTimeGMT').get();
        const matches = rawResp.docs.map(doc => {
            const data = doc.data();
            return data;
        }) || [];

        const relevantMatches = [];

        for(const match of matches) {
            const isIncludedMatch = (moment(match.dateTimeGMT).isBetween(moment("2023-04-01"),moment("2023-04-05")))//.add(1 ,'days').isSameOrAfter(moment()));

            if(!isIncludedMatch)  continue;

            match.team1Abbreviation = match.teamInfo[0].shortname;
            match.team2Abbreviation = match.teamInfo[1].shortname;
            match.banner = matchImgs[match.id];
            relevantMatches.push(match);
        };

        return relevantMatches;
    } catch (err) {
        console.log("Error in API getMatchesFromDb:", err);
        throw new Error(err);
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

export const saveIplMatchesInDb = async () => {
    for(const eachMatch of iplMatches) {
        await db.collection("ipl_matches").doc(eachMatch.id).set({
            ...eachMatch,
            updatedAt: firebase.firestore.Timestamp.fromDate(new Date())
        });
    }
}

export const getIplMatches = async () => {
    const resp = await db.collection("ipl_matches").where("dateTimeGMT","<=",new Date("04-04-2023").toISOString()).get();
    const matches = resp.docs.map(match => match.data());

    return matches;
}

export const restoreData = async (username) => {
    try {
        const resp = await fetch("https://wild-blue-adder-gear.cyclic.app/cfb/dbops/restoreDataForUsername", 
            { method: "post", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username }) }
        );

        console.log("Update successful" + resp);
    } catch (e) {
        console.log(e);
    }
}
