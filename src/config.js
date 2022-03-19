import firebase from 'firebase';
import moment from 'moment';

import kkrLogo from './images/kkr.png';
import rcbLogo from './images/rcb.png';
import srhLogo from './images/srh.png';
import cskLogo from './images/csk.png';
import dcLogo from './images/dc.png';
import rrLogo from './images/rr.png';
import miLogo from './images/mi.png';
import pkLogo from './images/pk.png';

const firebaseConfig = {
    apiKey: "AIzaSyBFK-Ls496ycWWk5LCbxsN_CrEc234uJWc",
    authDomain: "cric-funn.firebaseapp.com",
    projectId: "cric-funn",
    storageBucket: "cric-funn.appspot.com",
    messagingSenderId: "54598212608",
    appId: "1:54598212608:web:0d61ca8fc4d6e511b1cce5",
    measurementId: "G-TCZ62L5GHP"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// const iplMatches = [{
//     "date": "2021-04-03T00:00:00.000Z",
//     "dateTimeGMT": "2021-04-03T04:15:00.000Z",
//     "matchStarted": true,
//     squad: false,
//     team1Abbreviation: "SLASC",
//     team2Abbreviation: "SLAFSC",
//     "team-1": "Sri Lanka Army Sports Club",
//     "team-2": "Sri Lanka Air Force Sports Club",
//     toss_winner_team: "Sri Lanka Army Sports Club",
//     type: "ODI",
//     unique_id: 1256145
// }];

const themeColor = "#4B0082";
const loaderHeight = 100;
const loaderWidth = 250;

function getTeamLogo(teamAbbreviation) {
    if(teamAbbreviation == "SRH") return srhLogo;
    else if(teamAbbreviation == "KKR") return kkrLogo;
    else if(teamAbbreviation == "DC") return dcLogo;
    else if(teamAbbreviation == "CSK") return cskLogo;
    else if(teamAbbreviation == "MI") return miLogo;
    else if(teamAbbreviation == "PBKS") return pkLogo;
    else if(teamAbbreviation == "RCB") return rcbLogo;
    else return rrLogo;
}

const fontVariant = "button";
const matchHeadingFontSize = 20;

function getFormattedTimeISOString(date) {
    return moment(date).format("lll");
}

function getMsgForUpcomingBets(startTime, endTime) {
    return (`Betting for this match will be OPENED from - ${startTime.format("LLL")} TO ${endTime.format("LLL")}`);
}

function getMsgForOpenBets(endTime) {
    return (`Betting is OPENED TILL - ${endTime.format("LLL")}.`);
}

function getMsgForInProgressBets(points) {
    return (`You've bet ${points} POINTS on this match.`);
}

function getMsgForNoResultBets(points) {
    return (`Betting is CLOSED. Match ended in NO RESULT. You've recieved ${points} POINTS on this match.`);
}

function getMsgForClosedBets() {
    return (`Betting for this match is CLOSED. You DID NOT bet.`);
}

function getMsgForWonBets(points) {
    return (`Betting CLOSED. You WON ${points} POINTS on this match.`);
}

function getMsgForLostBets(points) {
    return (`Betting CLOSED. You LOST ${points} POINTS on this match.`);
}

const iplMatches = JSON.parse(`[{"unique_id":1254058,"date":"2021-04-09T00:00:00.000Z","dateTimeGMT":"2021-04-09T14:00:00.000Z","team-1":"Mumbai Indians","team-2":"Royal Challengers Bangalore","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"MI","team2Abbreviation":"RCB"},{"unique_id":1254059,"date":"2021-04-10T00:00:00.000Z","dateTimeGMT":"2021-04-10T14:00:00.000Z","team-1":"Chennai Super Kings","team-2":"Delhi Capitals","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"CSK","team2Abbreviation":"DC"},{"unique_id":1254060,"date":"2021-04-11T00:00:00.000Z","dateTimeGMT":"2021-04-11T14:00:00.000Z","team-1":"Sunrisers Hyderabad","team-2":"Kolkata Knight Riders","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"SRH","team2Abbreviation":"KKR"},{"unique_id":1254061,"date":"2021-04-12T00:00:00.000Z","dateTimeGMT":"2021-04-12T14:00:00.000Z","team-1":"Rajasthan Royals","team-2":"Punjab Kings","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"RR","team2Abbreviation":"PBKS"},{"unique_id":1254062,"date":"2021-04-13T00:00:00.000Z","dateTimeGMT":"2021-04-13T14:00:00.000Z","team-1":"Kolkata Knight Riders","team-2":"Mumbai Indians","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"KKR","team2Abbreviation":"MI"},{"unique_id":1254063,"date":"2021-04-14T00:00:00.000Z","dateTimeGMT":"2021-04-14T14:00:00.000Z","team-1":"Sunrisers Hyderabad","team-2":"Royal Challengers Bangalore","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"SRH","team2Abbreviation":"RCB"},{"unique_id":1254064,"date":"2021-04-15T00:00:00.000Z","dateTimeGMT":"2021-04-15T14:00:00.000Z","team-1":"Rajasthan Royals","team-2":"Delhi Capitals","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"RR","team2Abbreviation":"DC"},{"unique_id":1254065,"date":"2021-04-16T00:00:00.000Z","dateTimeGMT":"2021-04-16T14:00:00.000Z","team-1":"Punjab Kings","team-2":"Chennai Super Kings","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"PBKS","team2Abbreviation":"CSK"},{"unique_id":1254066,"date":"2021-04-17T00:00:00.000Z","dateTimeGMT":"2021-04-17T14:00:00.000Z","team-1":"Mumbai Indians","team-2":"Sunrisers Hyderabad","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"MI","team2Abbreviation":"SRH"},{"unique_id":1254068,"date":"2021-04-18T00:00:00.000Z","dateTimeGMT":"2021-04-18T14:00:00.000Z","team-1":"Delhi Capitals","team-2":"Punjab Kings","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"DC","team2Abbreviation":"PBKS"},{"unique_id":1254067,"date":"2021-04-18T00:00:00.000Z","dateTimeGMT":"2021-04-18T10:00:00.000Z","team-1":"Royal Challengers Bangalore","team-2":"Kolkata Knight Riders","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"RCB","team2Abbreviation":"KKR"},{"unique_id":1254069,"date":"2021-04-19T00:00:00.000Z","dateTimeGMT":"2021-04-19T14:00:00.000Z","team-1":"Chennai Super Kings","team-2":"Rajasthan Royals","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"CSK","team2Abbreviation":"RR"},{"unique_id":1254070,"date":"2021-04-20T00:00:00.000Z","dateTimeGMT":"2021-04-20T14:00:00.000Z","team-1":"Delhi Capitals","team-2":"Mumbai Indians","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"DC","team2Abbreviation":"MI"},{"unique_id":1254072,"date":"2021-04-21T00:00:00.000Z","dateTimeGMT":"2021-04-21T14:00:00.000Z","team-1":"Kolkata Knight Riders","team-2":"Chennai Super Kings","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"KKR","team2Abbreviation":"CSK"},{"unique_id":1254071,"date":"2021-04-21T00:00:00.000Z","dateTimeGMT":"2021-04-21T10:00:00.000Z","team-1":"Punjab Kings","team-2":"Sunrisers Hyderabad","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"PBKS","team2Abbreviation":"SRH"},{"unique_id":1254073,"date":"2021-04-22T00:00:00.000Z","dateTimeGMT":"2021-04-22T14:00:00.000Z","team-1":"Royal Challengers Bangalore","team-2":"Rajasthan Royals","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"RCB","team2Abbreviation":"RR"},{"unique_id":1254074,"date":"2021-04-23T00:00:00.000Z","dateTimeGMT":"2021-04-23T14:00:00.000Z","team-1":"Punjab Kings","team-2":"Mumbai Indians","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"PBKS","team2Abbreviation":"MI"},{"unique_id":1254075,"date":"2021-04-24T00:00:00.000Z","dateTimeGMT":"2021-04-24T14:00:00.000Z","team-1":"Rajasthan Royals","team-2":"Kolkata Knight Riders","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"RR","team2Abbreviation":"KKR"},{"unique_id":1254077,"date":"2021-04-25T00:00:00.000Z","dateTimeGMT":"2021-04-25T14:00:00.000Z","team-1":"Sunrisers Hyderabad","team-2":"Delhi Capitals","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"SRH","team2Abbreviation":"DC"},{"unique_id":1254076,"date":"2021-04-25T00:00:00.000Z","dateTimeGMT":"2021-04-25T10:00:00.000Z","team-1":"Chennai Super Kings","team-2":"Royal Challengers Bangalore","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"CSK","team2Abbreviation":"RCB"},{"unique_id":1254078,"date":"2021-04-26T00:00:00.000Z","dateTimeGMT":"2021-04-26T14:00:00.000Z","team-1":"Punjab Kings","team-2":"Kolkata Knight Riders","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"PBKS","team2Abbreviation":"KKR"},{"unique_id":1254079,"date":"2021-04-27T00:00:00.000Z","dateTimeGMT":"2021-04-27T14:00:00.000Z","team-1":"Delhi Capitals","team-2":"Royal Challengers Bangalore","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"DC","team2Abbreviation":"RCB"},{"unique_id":1254080,"date":"2021-04-28T00:00:00.000Z","dateTimeGMT":"2021-04-28T14:00:00.000Z","team-1":"Chennai Super Kings","team-2":"Sunrisers Hyderabad","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"CSK","team2Abbreviation":"SRH"},{"unique_id":1254082,"date":"2021-04-29T00:00:00.000Z","dateTimeGMT":"2021-04-29T14:00:00.000Z","team-1":"Delhi Capitals","team-2":"Kolkata Knight Riders","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"DC","team2Abbreviation":"KKR"},{"unique_id":1254081,"date":"2021-04-29T00:00:00.000Z","dateTimeGMT":"2021-04-29T10:00:00.000Z","team-1":"Mumbai Indians","team-2":"Rajasthan Royals","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"MI","team2Abbreviation":"RR"},{"unique_id":1254083,"date":"2021-04-30T00:00:00.000Z","dateTimeGMT":"2021-04-30T14:00:00.000Z","team-1":"Punjab Kings","team-2":"Royal Challengers Bangalore","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"PBKS","team2Abbreviation":"RCB"},{"unique_id":1254084,"date":"2021-05-01T00:00:00.000Z","dateTimeGMT":"2021-05-01T14:00:00.000Z","team-1":"Mumbai Indians","team-2":"Chennai Super Kings","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"MI","team2Abbreviation":"CSK"},{"unique_id":1254086,"date":"2021-05-02T00:00:00.000Z","dateTimeGMT":"2021-05-02T14:00:00.000Z","team-1":"Punjab Kings","team-2":"Delhi Capitals","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"PBKS","team2Abbreviation":"DC"},{"unique_id":1254085,"date":"2021-05-02T00:00:00.000Z","dateTimeGMT":"2021-05-02T10:00:00.000Z","team-1":"Rajasthan Royals","team-2":"Sunrisers Hyderabad","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"RR","team2Abbreviation":"SRH"},{"unique_id":1254087,"date":"2021-05-03T00:00:00.000Z","dateTimeGMT":"2021-05-03T14:00:00.000Z","team-1":"Kolkata Knight Riders","team-2":"Royal Challengers Bangalore","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"KKR","team2Abbreviation":"RCB"},{"unique_id":1254088,"date":"2021-05-04T00:00:00.000Z","dateTimeGMT":"2021-05-04T14:00:00.000Z","team-1":"Sunrisers Hyderabad","team-2":"Mumbai Indians","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"SRH","team2Abbreviation":"MI"},{"unique_id":1254089,"date":"2021-05-05T00:00:00.000Z","dateTimeGMT":"2021-05-05T14:00:00.000Z","team-1":"Rajasthan Royals","team-2":"Chennai Super Kings","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"RR","team2Abbreviation":"CSK"},{"unique_id":1254090,"date":"2021-05-06T00:00:00.000Z","dateTimeGMT":"2021-05-06T14:00:00.000Z","team-1":"Royal Challengers Bangalore","team-2":"Punjab Kings","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"RCB","team2Abbreviation":"PBKS"},{"unique_id":1254091,"date":"2021-05-07T00:00:00.000Z","dateTimeGMT":"2021-05-07T14:00:00.000Z","team-1":"Sunrisers Hyderabad","team-2":"Chennai Super Kings","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"SRH","team2Abbreviation":"CSK"},{"unique_id":1254093,"date":"2021-05-08T00:00:00.000Z","dateTimeGMT":"2021-05-08T14:00:00.000Z","team-1":"Rajasthan Royals","team-2":"Mumbai Indians","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"RR","team2Abbreviation":"MI"},{"unique_id":1254092,"date":"2021-05-08T00:00:00.000Z","dateTimeGMT":"2021-05-08T10:00:00.000Z","team-1":"Kolkata Knight Riders","team-2":"Delhi Capitals","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"KKR","team2Abbreviation":"DC"},{"unique_id":1254095,"date":"2021-05-09T00:00:00.000Z","dateTimeGMT":"2021-05-09T14:00:00.000Z","team-1":"Royal Challengers Bangalore","team-2":"Sunrisers Hyderabad","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"RCB","team2Abbreviation":"SRH"},{"unique_id":1254094,"date":"2021-05-09T00:00:00.000Z","dateTimeGMT":"2021-05-09T10:00:00.000Z","team-1":"Chennai Super Kings","team-2":"Punjab Kings","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"CSK","team2Abbreviation":"PBKS"},{"unique_id":1254096,"date":"2021-05-10T00:00:00.000Z","dateTimeGMT":"2021-05-10T14:00:00.000Z","team-1":"Mumbai Indians","team-2":"Kolkata Knight Riders","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"MI","team2Abbreviation":"KKR"},{"unique_id":1254097,"date":"2021-05-11T00:00:00.000Z","dateTimeGMT":"2021-05-11T14:00:00.000Z","team-1":"Delhi Capitals","team-2":"Rajasthan Royals","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"DC","team2Abbreviation":"RR"},{"unique_id":1254098,"date":"2021-05-12T00:00:00.000Z","dateTimeGMT":"2021-05-12T14:00:00.000Z","team-1":"Chennai Super Kings","team-2":"Kolkata Knight Riders","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"CSK","team2Abbreviation":"KKR"},{"unique_id":1254100,"date":"2021-05-13T00:00:00.000Z","dateTimeGMT":"2021-05-13T14:00:00.000Z","team-1":"Sunrisers Hyderabad","team-2":"Rajasthan Royals","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"SRH","team2Abbreviation":"RR"},{"unique_id":1254099,"date":"2021-05-13T00:00:00.000Z","dateTimeGMT":"2021-05-13T10:00:00.000Z","team-1":"Mumbai Indians","team-2":"Punjab Kings","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"MI","team2Abbreviation":"PBKS"},{"unique_id":1254101,"date":"2021-05-14T00:00:00.000Z","dateTimeGMT":"2021-05-14T14:00:00.000Z","team-1":"Royal Challengers Bangalore","team-2":"Delhi Capitals","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"RCB","team2Abbreviation":"DC"},{"unique_id":1254102,"date":"2021-05-15T00:00:00.000Z","dateTimeGMT":"2021-05-15T14:00:00.000Z","team-1":"Kolkata Knight Riders","team-2":"Punjab Kings","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"KKR","team2Abbreviation":"PBKS"},{"unique_id":1254104,"date":"2021-05-16T00:00:00.000Z","dateTimeGMT":"2021-05-16T14:00:00.000Z","team-1":"Chennai Super Kings","team-2":"Mumbai Indians","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"CSK","team2Abbreviation":"MI"},{"unique_id":1254103,"date":"2021-05-16T00:00:00.000Z","dateTimeGMT":"2021-05-16T10:00:00.000Z","team-1":"Rajasthan Royals","team-2":"Royal Challengers Bangalore","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"RR","team2Abbreviation":"RCB"},{"unique_id":1254105,"date":"2021-05-17T00:00:00.000Z","dateTimeGMT":"2021-05-17T14:00:00.000Z","team-1":"Delhi Capitals","team-2":"Sunrisers Hyderabad","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"DC","team2Abbreviation":"SRH"},{"unique_id":1254106,"date":"2021-05-18T00:00:00.000Z","dateTimeGMT":"2021-05-18T14:00:00.000Z","team-1":"Kolkata Knight Riders","team-2":"Rajasthan Royals","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"KKR","team2Abbreviation":"RR"},{"unique_id":1254107,"date":"2021-05-19T00:00:00.000Z","dateTimeGMT":"2021-05-19T14:00:00.000Z","team-1":"Sunrisers Hyderabad","team-2":"Punjab Kings","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"SRH","team2Abbreviation":"PBKS"},{"unique_id":1254108,"date":"2021-05-20T00:00:00.000Z","dateTimeGMT":"2021-05-20T14:00:00.000Z","team-1":"Royal Challengers Bangalore","team-2":"Mumbai Indians","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"RCB","team2Abbreviation":"MI"},{"unique_id":1254110,"date":"2021-05-21T00:00:00.000Z","dateTimeGMT":"2021-05-21T14:00:00.000Z","team-1":"Delhi Capitals","team-2":"Chennai Super Kings","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"DC","team2Abbreviation":"CSK"},{"unique_id":1254109,"date":"2021-05-21T00:00:00.000Z","dateTimeGMT":"2021-05-21T10:00:00.000Z","team-1":"Kolkata Knight Riders","team-2":"Sunrisers Hyderabad","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"KKR","team2Abbreviation":"SRH"},{"unique_id":1254111,"date":"2021-05-22T00:00:00.000Z","dateTimeGMT":"2021-05-22T14:00:00.000Z","team-1":"Punjab Kings","team-2":"Rajasthan Royals","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"PBKS","team2Abbreviation":"RR"},{"unique_id":1254113,"date":"2021-05-23T00:00:00.000Z","dateTimeGMT":"2021-05-23T14:00:00.000Z","team-1":"Royal Challengers Bangalore","team-2":"Chennai Super Kings","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"RCB","team2Abbreviation":"CSK"},{"unique_id":1254112,"date":"2021-05-23T00:00:00.000Z","dateTimeGMT":"2021-05-23T10:00:00.000Z","team-1":"Mumbai Indians","team-2":"Delhi Capitals","squad":true,"matchStarted":false,"type":"","team1Abbreviation":"MI","team2Abbreviation":"DC"}]`)

export { 
    db, 
    auth,
    storage,
    iplMatches,
    themeColor,
    loaderHeight,
    loaderWidth,
    matchHeadingFontSize,
    fontVariant,

    getTeamLogo,
    getFormattedTimeISOString,
    getMsgForUpcomingBets,
    getMsgForLostBets, 
    getMsgForWonBets, 
    getMsgForClosedBets, 
    getMsgForNoResultBets, 
    getMsgForInProgressBets, 
    getMsgForOpenBets
}