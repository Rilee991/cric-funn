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
import lsgLogo from './images/lsg.png';
import gtLogo from './images/gt.png';

const firebaseConfig = {
    apiKey: "AIzaSyBFK-Ls496ycWWk5LCbxsN_CrEc234uJWc",
    authDomain: "cric-funn.firebaseapp.com",
    projectId: "cric-funn",
    storageBucket: "cric-funn.appspot.com",
    messagingSenderId: "54598212608",
    appId: "1:54598212608:web:0d61ca8fc4d6e511b1cce5",
    measurementId: "G-TCZ62L5GHP"
};

if(firebase.apps.length) {
    firebase.app();
} else {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

const themeColor = "#4B0082";
const loaderHeight = 100;
const loaderWidth = 250;
const DEFAULT_START_POINTS = 2000;
const DEFAULT_PROFILE_IMAGE = "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/defaultImages%2Fdefault.png?alt=media&token=9ccd045b-3ece-4d06-babf-04c267c38d40";
    

function getTeamLogo(teamAbbreviation) {
    if(teamAbbreviation == "SRH") return srhLogo;
    else if(teamAbbreviation == "KKR") return kkrLogo;
    else if(teamAbbreviation == "DC") return dcLogo;
    else if(teamAbbreviation == "CSK") return cskLogo;
    else if(teamAbbreviation == "MI") return miLogo;
    else if(teamAbbreviation == "PBKS") return pkLogo;
    else if(teamAbbreviation == "RCB") return rcbLogo;
    else if(teamAbbreviation == "LSG") return lsgLogo;
    else if(teamAbbreviation == "GT") return gtLogo;
    else return rrLogo;
}

const TEAM_NAMES = ["Chennai Super Kings", "Delhi Capitals", "Kolkata Knight Riders", "Sunrisers Hyderabad",
    "Mumbai Indians", "Rajasthan Royals", "Gujarat Titans", "Lucknow Super Giants", "Punjab Kings", 
    "Royal Challengers Bangalore", "No Betting Done."
]

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

function getMsgForInProgressBets(points, team) {
    return (`You've bet ${points} POINTS on this match. Betting Team: ${team}`);
}

function getMsgForNoResultBets(points, team) {
    return (`Betting is CLOSED. Match ended in NO RESULT. You've recieved ${points} POINTS on this match. Betting Team: ${team}`);
}

function getMsgForClosedBets() {
    return (`Betting for this match is CLOSED. You DID NOT bet.`);
}

function getMsgForWonBets(points, team) {
    return (`Betting CLOSED. You WON ${points} POINTS on this match. Betting Team: ${team}`);
}

function getMsgForLostBets(points, team) {
    return (`Betting CLOSED. You LOST ${points} POINTS on this match. Betting Team: ${team}`);
}

function getFormattedFirebaseTime(firebaseTime) {
    return firebaseTime ? moment.unix(firebaseTime.seconds).format("LLL") : "NA";
}

const iplMatches = JSON.parse('[{"dateTimeGMT":"2022-04-04T14:00:00Z","id":"e6521e57-95ed-4190-82ba-cfbd390eab57","team1":"Sunrisers Hyderabad","team2":"Lucknow Super Giants","team1Abbreviation":"SRH","team2Abbreviation":"LSG"},{"dateTimeGMT":"2022-04-05T14:00:00Z","id":"e78b0033-2b15-4748-90fc-a74ac5278302","team1":"Rajasthan Royals","team2":"Royal Challengers Bangalore","team1Abbreviation":"RR","team2Abbreviation":"RCB"},{"dateTimeGMT":"2022-04-06T14:00:00Z","id":"ff71cef4-5f5c-4aa2-b2d8-eeba2293037f","team1":"Kolkata Knight Riders","team2":"Mumbai Indians","team1Abbreviation":"KKR","team2Abbreviation":"MI"},{"dateTimeGMT":"2022-04-07T14:00:00Z","id":"79811d57-ee90-4cd6-a260-0e6a3f6925e5","team1":"Lucknow Super Giants","team2":"Delhi Capitals","team1Abbreviation":"LSG","team2Abbreviation":"DC"},{"dateTimeGMT":"2022-04-08T14:00:00Z","id":"e57e0569-29cf-4b21-a43d-b09629c01889","team1":"Punjab Kings","team2":"Gujarat Titans","team1Abbreviation":"PBKS","team2Abbreviation":"GT"},{"dateTimeGMT":"2022-04-09T10:00:00Z","id":"782103bc-fecc-44be-9b3c-5e0e8f8a5c0a","team1":"Chennai Super Kings","team2":"Sunrisers Hyderabad","team1Abbreviation":"CSK","team2Abbreviation":"SRH"},{"dateTimeGMT":"2022-04-09T14:00:00Z","id":"7d5f7012-0a68-42e5-9faa-5e392640a86f","team1":"Royal Challengers Bangalore","team2":"Mumbai Indians","team1Abbreviation":"RCB","team2Abbreviation":"MI"},{"dateTimeGMT":"2022-04-10T10:00:00Z","id":"80509c15-97f2-4749-9496-04b0e0bc37ae","team1":"Kolkata Knight Riders","team2":"Delhi Capitals","team1Abbreviation":"KKR","team2Abbreviation":"DC"},{"dateTimeGMT":"2022-04-10T14:00:00Z","id":"92901329-e98b-4a73-b8c9-20d95b6ac4a0","team1":"Rajasthan Royals","team2":"Lucknow Super Giants","team1Abbreviation":"RR","team2Abbreviation":"LSG"},{"dateTimeGMT":"2022-04-11T14:00:00Z","id":"7e60e80d-9523-4cd9-94f4-8d2d1130b8c6","team1":"Sunrisers Hyderabad","team2":"Gujarat Titans","team1Abbreviation":"SRH","team2Abbreviation":"GT"},{"dateTimeGMT":"2022-04-12T14:00:00Z","id":"0643a72c-4b48-4d7b-a4d2-b2d06e4f9e69","team1":"Chennai Super Kings","team2":"Royal Challengers Bangalore","team1Abbreviation":"CSK","team2Abbreviation":"RCB"},{"dateTimeGMT":"2022-04-13T14:00:00Z","id":"8fe72731-c4d1-420a-b96a-1c9209461bd9","team1":"Mumbai Indians","team2":"Punjab Kings","team1Abbreviation":"MI","team2Abbreviation":"PBKS"},{"dateTimeGMT":"2022-04-14T14:00:00Z","id":"09ce2300-5504-4b5c-ad75-e1e45de16a2f","team1":"Rajasthan Royals","team2":"Gujarat Titans","team1Abbreviation":"RR","team2Abbreviation":"GT"},{"dateTimeGMT":"2022-04-15T14:00:00Z","id":"0b12f428-98ab-4009-831d-493d325bc555","team1":"Sunrisers Hyderabad","team2":"Kolkata Knight Riders","team1Abbreviation":"SRH","team2Abbreviation":"KKR"},{"dateTimeGMT":"2022-04-16T10:00:00Z","id":"45738b37-4fa5-4292-ac69-875817937e3a","team1":"Mumbai Indians","team2":"Lucknow Super Giants","team1Abbreviation":"MI","team2Abbreviation":"LSG"},{"dateTimeGMT":"2022-04-16T14:00:00Z","id":"bc371a97-372a-468f-9041-b77bec746db2","team1":"Delhi Capitals","team2":"Royal Challengers Bangalore","team1Abbreviation":"DC","team2Abbreviation":"RCB"},{"dateTimeGMT":"2022-04-17T10:00:00Z","id":"4df33171-ec17-4102-b3ea-541bd0ec5aca","team1":"Punjab Kings","team2":"Sunrisers Hyderabad","team1Abbreviation":"PBKS","team2Abbreviation":"SRH"},{"dateTimeGMT":"2022-04-17T14:00:00Z","id":"5b12a554-080c-4ee9-a9d8-6ebcd49c6f3c","team1":"Gujarat Titans","team2":"Chennai Super Kings","team1Abbreviation":"GT","team2Abbreviation":"CSK"},{"dateTimeGMT":"2022-04-18T14:00:00Z","id":"3ff901db-f44f-465a-b3e0-2e83eb3ba674","team1":"Rajasthan Royals","team2":"Kolkata Knight Riders","team1Abbreviation":"RR","team2Abbreviation":"KKR"},{"dateTimeGMT":"2022-04-19T14:00:00Z","id":"17949067-10b1-431f-8262-fdaa833e5e74","team1":"Lucknow Super Giants","team2":"Royal Challengers Bangalore","team1Abbreviation":"LSG","team2Abbreviation":"RCB"},{"dateTimeGMT":"2022-04-20T14:00:00Z","id":"2d77efa8-5c19-4b63-ac41-7bb17b923a4e","team1":"Delhi Capitals","team2":"Punjab Kings","team1Abbreviation":"DC","team2Abbreviation":"PBKS"},{"dateTimeGMT":"2022-04-21T14:00:00Z","id":"ba4cd9eb-db78-4d82-9ac8-c837ca2da60f","team1":"Mumbai Indians","team2":"Chennai Super Kings","team1Abbreviation":"MI","team2Abbreviation":"CSK"},{"dateTimeGMT":"2022-04-22T14:00:00Z","id":"c09edc56-4915-4dcc-960f-79652a0c88ea","team1":"Delhi Capitals","team2":"Rajasthan Royals","team1Abbreviation":"DC","team2Abbreviation":"RR"},{"dateTimeGMT":"2022-04-23T10:00:00Z","id":"a6a04a8b-298e-4b57-b9f0-55e57ee5c274","team1":"Kolkata Knight Riders","team2":"Gujarat Titans","team1Abbreviation":"KKR","team2Abbreviation":"GT"},{"dateTimeGMT":"2022-04-23T14:00:00Z","id":"e5189a27-e3b5-493d-801c-5a34c7d90fa2","team1":"Royal Challengers Bangalore","team2":"Sunrisers Hyderabad","team1Abbreviation":"RCB","team2Abbreviation":"SRH"},{"dateTimeGMT":"2022-04-24T14:00:00Z","id":"eb8b4f14-3837-4ab9-9128-aa698afed845","team1":"Lucknow Super Giants","team2":"Mumbai Indians","team1Abbreviation":"LSG","team2Abbreviation":"MI"},{"dateTimeGMT":"2022-04-25T14:00:00Z","id":"f75f07cb-6de8-49c3-9c9b-f9016dd62aa0","team1":"Punjab Kings","team2":"Chennai Super Kings","team1Abbreviation":"PBKS","team2Abbreviation":"CSK"},{"dateTimeGMT":"2022-04-26T14:00:00Z","id":"5a91bc8d-e4cc-4aab-9490-950ed8cbaaee","team1":"Royal Challengers Bangalore","team2":"Rajasthan Royals","team1Abbreviation":"RCB","team2Abbreviation":"RR"},{"dateTimeGMT":"2022-04-27T14:00:00Z","id":"284fdfef-ffee-4745-adad-f164d5b09cbe","team1":"Gujarat Titans","team2":"Sunrisers Hyderabad","team1Abbreviation":"GT","team2Abbreviation":"SRH"},{"dateTimeGMT":"2022-04-28T14:00:00Z","id":"511f208e-9f7a-47af-9aeb-acf065461ea4","team1":"Delhi Capitals","team2":"Kolkata Knight Riders","team1Abbreviation":"DC","team2Abbreviation":"KKR"},{"dateTimeGMT":"2022-04-29T14:00:00Z","id":"851544e0-c134-46c3-aea5-c959806e4ff1","team1":"Punjab Kings","team2":"Lucknow Super Giants","team1Abbreviation":"PBKS","team2Abbreviation":"LSG"},{"dateTimeGMT":"2022-04-30T10:00:00Z","id":"685223e7-9ee7-42af-b9c9-768b9020335b","team1":"Gujarat Titans","team2":"Royal Challengers Bangalore","team1Abbreviation":"GT","team2Abbreviation":"RCB"},{"dateTimeGMT":"2022-04-30T14:00:00Z","id":"cfb836fb-ad7a-4ac5-ab12-89194e0662fa","team1":"Rajasthan Royals","team2":"Mumbai Indians","team1Abbreviation":"RR","team2Abbreviation":"MI"},{"dateTimeGMT":"2022-05-01T10:00:00Z","id":"51466a57-15a2-474f-aca3-026dca4c68c2","team1":"Delhi Capitals","team2":"Lucknow Super Giants","team1Abbreviation":"DC","team2Abbreviation":"LSG"},{"dateTimeGMT":"2022-05-01T14:00:00Z","id":"119f27e8-cb92-4ddf-b275-a2d265cec2dd","team1":"Sunrisers Hyderabad","team2":"Chennai Super Kings","team1Abbreviation":"SRH","team2Abbreviation":"CSK"},{"dateTimeGMT":"2022-05-02T14:00:00Z","id":"fc4a5881-fb19-4d21-933c-45e913dc0d3c","team1":"Kolkata Knight Riders","team2":"Rajasthan Royals","team1Abbreviation":"KKR","team2Abbreviation":"RR"},{"dateTimeGMT":"2022-05-03T14:00:00Z","id":"a8a92912-0aed-4951-a1a7-cd046baeb99b","team1":"Gujarat Titans","team2":"Punjab Kings","team1Abbreviation":"GT","team2Abbreviation":"PBKS"},{"dateTimeGMT":"2022-05-04T14:00:00Z","id":"8e58c432-961b-48a7-8025-38d948eb91c4","team1":"Royal Challengers Bangalore","team2":"Chennai Super Kings","team1Abbreviation":"RCB","team2Abbreviation":"CSK"},{"dateTimeGMT":"2022-05-05T14:00:00Z","id":"dd5dcdcd-f09b-4a44-a50e-12f52d9d3d8c","team1":"Delhi Capitals","team2":"Sunrisers Hyderabad","team1Abbreviation":"DC","team2Abbreviation":"SRH"},{"dateTimeGMT":"2022-05-06T14:00:00Z","id":"908c4652-f9d7-409e-be12-ee6fa53ff133","team1":"Gujarat Titans","team2":"Mumbai Indians","team1Abbreviation":"GT","team2Abbreviation":"MI"},{"dateTimeGMT":"2022-05-07T10:00:00Z","id":"518459e7-4ce9-421b-95bb-0ea6c1ea1c5c","team1":"Punjab Kings","team2":"Rajasthan Royals","team1Abbreviation":"PBKS","team2Abbreviation":"RR"},{"dateTimeGMT":"2022-05-07T14:00:00Z","id":"d453e3b4-831b-49de-be08-f315cc8c65b7","team1":"Lucknow Super Giants","team2":"Kolkata Knight Riders","team1Abbreviation":"LSG","team2Abbreviation":"KKR"},{"dateTimeGMT":"2022-05-08T10:00:00Z","id":"37e265c4-7633-4760-9b03-6674a47d25fd","team1":"Sunrisers Hyderabad","team2":"Royal Challengers Bangalore","team1Abbreviation":"SRH","team2Abbreviation":"RCB"},{"dateTimeGMT":"2022-05-08T14:00:00Z","id":"d299b1eb-179f-433b-9603-fdcdd25564a2","team1":"Chennai Super Kings","team2":"Delhi Capitals","team1Abbreviation":"CSK","team2Abbreviation":"DC"},{"dateTimeGMT":"2022-05-09T14:00:00Z","id":"3f646985-712d-414b-a40f-baca4eea945f","team1":"Mumbai Indians","team2":"Kolkata Knight Riders","team1Abbreviation":"MI","team2Abbreviation":"KKR"},{"dateTimeGMT":"2022-05-10T14:00:00Z","id":"cddd039a-31f3-4c92-bcb9-b1810ad0d6a3","team1":"Lucknow Super Giants","team2":"Gujarat Titans","team1Abbreviation":"LSG","team2Abbreviation":"GT"},{"dateTimeGMT":"2022-05-11T14:00:00Z","id":"3c905b02-eb6d-4dad-bd54-13f1b37cd1d2","team1":"Rajasthan Royals","team2":"Delhi Capitals","team1Abbreviation":"RR","team2Abbreviation":"DC"},{"dateTimeGMT":"2022-05-12T14:00:00Z","id":"51abb5f8-aa77-475a-bb99-2dd6e463c3e0","team1":"Chennai Super Kings","team2":"Mumbai Indians","team1Abbreviation":"CSK","team2Abbreviation":"MI"},{"dateTimeGMT":"2022-05-13T14:00:00Z","id":"415b6db6-ae2e-43ba-b698-9b288c2f8b82","team1":"Royal Challengers Bangalore","team2":"Punjab Kings","team1Abbreviation":"RCB","team2Abbreviation":"PBKS"},{"dateTimeGMT":"2022-05-14T14:00:00Z","id":"f722301d-39aa-4d42-a59e-56481cb24e9e","team1":"Kolkata Knight Riders","team2":"Sunrisers Hyderabad","team1Abbreviation":"KKR","team2Abbreviation":"SRH"},{"dateTimeGMT":"2022-05-15T10:00:00Z","id":"14bf2e76-f40d-41f2-8f6e-9f2a90a3f0c4","team1":"Chennai Super Kings","team2":"Gujarat Titans","team1Abbreviation":"CSK","team2Abbreviation":"GT"},{"dateTimeGMT":"2022-05-15T14:00:00Z","id":"5e3adeac-ff69-4cd8-8669-c815004a0bc2","team1":"Lucknow Super Giants","team2":"Rajasthan Royals","team1Abbreviation":"LSG","team2Abbreviation":"RR"},{"dateTimeGMT":"2022-05-16T14:00:00Z","id":"14fedd78-13ee-486f-ab2a-78d97071b122","team1":"Punjab Kings","team2":"Delhi Capitals","team1Abbreviation":"PBKS","team2Abbreviation":"DC"},{"dateTimeGMT":"2022-05-17T14:00:00Z","id":"0967387f-607c-42ba-bdc3-64191890cb55","team1":"Mumbai Indians","team2":"Sunrisers Hyderabad","team1Abbreviation":"MI","team2Abbreviation":"SRH"},{"dateTimeGMT":"2022-05-18T14:00:00Z","id":"c0c66ea3-8e61-444d-ad04-44c325e6b7ab","team1":"Kolkata Knight Riders","team2":"Lucknow Super Giants","team1Abbreviation":"KKR","team2Abbreviation":"LSG"},{"dateTimeGMT":"2022-05-19T14:00:00Z","id":"b7c74c7d-a453-41f5-b6e1-8a83280cd69c","team1":"Royal Challengers Bangalore","team2":"Gujarat Titans","team1Abbreviation":"RCB","team2Abbreviation":"GT"},{"dateTimeGMT":"2022-05-20T14:00:00Z","id":"ff4f5ad5-4dc5-46c4-938d-ce651a29c19c","team1":"Rajasthan Royals","team2":"Chennai Super Kings","team1Abbreviation":"RR","team2Abbreviation":"CSK"},{"dateTimeGMT":"2022-05-21T14:00:00Z","id":"16a2f8a1-467e-43e9-b31c-ab07bbb6973b","team1":"Mumbai Indians","team2":"Delhi Capitals","team1Abbreviation":"MI","team2Abbreviation":"DC"},{"dateTimeGMT":"2022-05-22T14:00:00Z","id":"fff77b68-78af-45aa-8b3b-773365959fcc","team1":"Sunrisers Hyderabad","team2":"Punjab Kings","team1Abbreviation":"SRH","team2Abbreviation":"PBKS"}]');

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
    TEAM_NAMES,
    DEFAULT_START_POINTS,
    DEFAULT_PROFILE_IMAGE,

    getTeamLogo,
    getFormattedTimeISOString,
    getMsgForUpcomingBets,
    getMsgForLostBets, 
    getMsgForWonBets, 
    getMsgForClosedBets, 
    getMsgForNoResultBets, 
    getMsgForInProgressBets, 
    getMsgForOpenBets,
    getFormattedFirebaseTime
}