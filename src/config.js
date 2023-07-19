import firebase from 'firebase';
import moment from 'moment';

const firebaseConfig = {
    apiKey: "AIzaSyBFK-Ls496ycWWk5LCbxsN_CrEc234uJWc",
    authDomain: "cric-funn.firebaseapp.com",
    projectId: "cric-funn",
    storageBucket: "cric-funn.appspot.com",
    messagingSenderId: "54598212608",
    appId: "1:54598212608:web:0d61ca8fc4d6e511b1cce5",
    measurementId: "G-TCZ62L5GHP"
};

let app;
if(firebase.apps.length) {
    app = firebase.app();
} else {
    app = firebase.initializeApp(firebaseConfig);
}

const firebaseNotifs = firebase.messaging(app);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const logger = firebase.analytics(app);
logger.setAnalyticsCollectionEnabled(true);

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

const iplMatches = JSON.parse('[{"id":"ebd0d24d-8726-44d3-afdb-40021ce99982","name":"Gujarat Titans vs Chennai Super Kings, Qualifier 1","matchType":"t20","team1Abbreviation": "GT","team2Abbreviation": "CSK","team1":"Gujarat Titans","team2":"Chennai Super Kings","status":"Match not started","venue":"MA Chidambaram Stadium, Chennai","date":"2023-05-23","dateTimeGMT":"2023-05-23T14:00:00Z","teams":["Gujarat Titans","Chennai Super Kings"],"fantasyEnabled":false,"bbbEnabled":false,"hasSquad":false,"matchStarted":false,"matchEnded":false}]');

const matchImgs = {"c8742d20-c3cb-4423-aea1-b436f3ac65c3":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-29-GT-vs-CSK-768x360.jpg",
"99c2990f-3e53-4cfa-8697-ab3d92b19f35":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-8-KKR-vs-PK-768x360.jpg",
"4608a16f-c556-4f0d-acc3-63dda814fba8":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-15-LSG-vs-DC-768x360.jpg",
"7535d936-2907-4b02-b68a-3e7465595e0a":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-5-SH-vs-RR-768x360.jpg",
"e99467c0-dcbb-498e-8aaa-19b88f3a3029":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-18-RCB-vs-MI-768x360.jpg",
"0bfed52d-36e4-406f-9458-9f3ce533398c":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-7-LSG-vs-CSK-768x360.jpg",
"7aa61b66-0f3c-4a50-8eab-e9e23e7c4fcd":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-10-GT-vs-DC-768x360.jpg",
"91ba8452-eb44-464d-8eae-6a53ed46f00a":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-52-PK-vs-RR-768x360.jpg",
"63179b6c-0560-45cc-a984-9ad0459c7542":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-6-RCB-vs-KKR-768x360.jpg",
"a92711fa-55d1-42a1-8cd7-571a0f9fb614":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-12-SH-vs-LSG-768x360.jpg",
"7f6df32a-e505-495f-9121-c6aca6235306":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-58-RR-vs-DC-768x360.jpg",
"ae24cc6a-8e37-4fd1-bb18-638b56ec4989":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-33-MI-vs-CSK-768x360.jpg",
"9d22f5ad-e9bc-4a66-82d5-03acfc599434":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-35-KKR-vs-GT-768x360.jpg",
"0b8981a3-9ae5-442d-ad1a-baab2efbd9e3":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-70-SH-vs-PK-768x360.jpg",
"a1f790e6-59c9-4c63-8b30-6b629531253d":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-31-LSG-vs-RCB-768x360.jpg",
"cc301267-8a6c-4840-87ff-b7c43ce10bc4":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-2-DC-vs-MI.jpg",
"5c496668-8076-4d58-a72a-105e1aeca978":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-68-RR-vs-CSK-768x360.jpg",
"c4774b4c-c2f8-434f-8ee6-0bf8e2c02a99":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-16-PK-vs-GT-768x360.jpg",
"90118c8b-c48a-4eb1-bf1e-8a2ba119e0ea":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-61-KKR-vs-SH-768x360.jpg",
"f29a4077-8f04-4cba-90e4-e117b8a10f05":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-27-DC-vs-RCB-768x360.jpg",
"0c25b28c-6099-486a-ab6f-704b3415728d":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-42-PK-vs-LSG-768x360.jpg",
"18fd94bb-5218-4845-80c8-bb8400a40c24":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-56-MI-vs-KKR-768x360.jpg",
"f0b02afb-7bab-4fad-8724-bf6735b23d32":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-24-RR-vs-GT-768x360.jpg",
"7630f8ed-d96f-4ac5-adc9-8c3703c059a0":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-49-RCB-vs-CSK-768x360.jpg",
"fce9c228-f766-4018-b7fc-31484106ebce":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-65-MI-vs-SH-768x360.jpg",
"31075544-43d6-47a6-afd9-5467a06c6ca2":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-20-RR-vs-LSG-768x360.jpg",
"10dd76d8-8343-4c72-8447-8bf6e37b609f":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-3-PK-vs-RCB-768x360.jpg",
"aeaac025-dd19-4033-a5db-8b93106f75d4":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-41-DC-vs-KKR-768x360.jpg",
"80efa6af-240d-400c-893b-898152949a4c":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-17-CSK-vs-SH-768x360.jpg",
"c5299187-f030-4727-98e1-0667f4626ae5":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-57-LSG-vs-GT-768x360.jpg",
"b3216931-c54b-482f-94e6-5d803cc3199e":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-23-MI-vs-PK-768x360.jpg",
"aa0bc972-2377-4407-9bc2-75e0c83c225d":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-39-RCB-vs-RR-768x360.jpg",
"018878c0-36df-4634-9cc3-5c5ea02378b2":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-1-CSK-vs-KKR.jpg",
"065089a4-5ba8-4276-9d89-83079af4541c":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-50-DC-vs-SH-768x360.jpg",
"b72aa256-3a2f-4536-bb4f-59cdebf04557":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-51-GT-vs-MI-768x360.jpg",
"9513145b-b401-4e72-a898-a4bd7c688be8":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-6-RCB-vs-KKR-768x360.jpg",
"86a12373-e6e4-4315-8da5-73781ef289e2":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-68-RR-vs-CSK-768x360.jpg",
"043b41db-1968-46c1-997d-4f92833c5a5b":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-42-PK-vs-LSG-768x360.jpg",
"8325cb10-1f7b-48f8-a41f-2f63799f8177":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-35-KKR-vs-GT-768x360.jpg",
"f2b8aa8a-f24c-40b4-99bb-4e6a222a1614":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-50-DC-vs-SH-768x360.jpg",
"97f38e12-a13c-4f3d-876f-89abc5da7fdd":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-11-CSK-vs-PK-768x360.jpg",
"6b9daa07-a9f3-46d2-a26a-cd9fde9dcb35":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-9-MI-vs-RR-768x360",
"40d33ba3-ac37-4d8b-a45c-d738167a8a39":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-31-LSG-vs-RCB-768x360.jpg",
"494e1d55-324c-42ee-850b-8de25f27f547":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-10-GT-vs-DC-768x360.jpg",
"2f9ce8ba-4c85-4e90-8140-d632037d35db":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-23-MI-vs-PK-768x360.jpg",
"08629a55-7d6e-4b82-8157-10c1d1eb4d02":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-7-LSG-vs-CSK-768x360.jpg",
"70b387b7-be48-491b-b58f-12b329867124":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-25-SH-vs-KKR-768x360.jpg",
"e8d137eb-0133-4b8b-92df-c573f3308e7a":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-24-RR-vs-GT-768x360.jpg",
"bd011ee1-febe-454f-a038-46ef7bc66575":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-59-CSK-vs-MI-768x360.jpg",
"114b5c32-f7bd-4486-b638-c513bdf80fc5":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-27-DC-vs-RCB-768x360.jpg",
"3ed57184-bfde-4cd9-9c2e-6214dc12baae":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-4-GT-vs-LSG-768x360.jpg",
"d4100a0f-2edb-49d4-a66f-cb5f6695f295":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-5-SH-vs-RR-768x360.jpg",
"5db8818a-6291-4b65-a5aa-43cfe66da805":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-8-KKR-vs-PK-768x360.jpg",
"26bb0e29-afe8-413f-8a43-53af922e4240":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-18-RCB-vs-MI-768x360.jpg",
"8e3d0b98-0b9b-491b-bbf4-d455303aa020":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-55-CSK-vs-DC-768x360.jpg",
"35198e8a-10d5-45fd-85f6-25c9ed0943f1":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-47-KKR-vs-RR-768x360.jpg",
"6b34ffab-0b70-41aa-a56d-70d4eb607e24":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-51-GT-vs-MI-768x360.jpg",
"d96cb055-6050-44b5-88e0-d52eb0314dce":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-12-SH-vs-LSG-768x360.jpg",
"b5df4a10-5ec6-4ae1-aa4f-812730191195":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-32-DC-vs-PK-768x360.jpg",
"db9dca42-5673-4129-a726-de77b6394437":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-13-RR-vs-RCB-768x360.jpg",
"4fcb6fb2-b3d4-4eb6-889c-02a82c46719e":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-1-CSK-vs-KKR.jpg",
"54425cd2-cf17-4736-9de0-1fec8dd7daf0":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-40-GT-vs-SH-768x360.jpg",
"d0c09198-be2f-4aea-9e9a-9e5a7fb3c532":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-37-LSG-vs-MI-768x360.jpg",
"cdf73c94-909e-40a3-917e-54908b3edb9b":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-64-PK-vs-DC-768x360.jpg",
"a266639f-01f4-4ec0-a09c-cee5dca38e74":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-54-SH-vs-RCB-768x360.jpg",
"048d4bdf-88de-4981-b330-03ceb18eb6a1":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-52-PK-vs-RR-768x360.jpg",
"ab52f012-34b7-4a68-a1af-b95668255a40":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-55-CSK-vs-DC-768x360.jpg",
"034ccab8-50ac-4dc4-affb-38c73cca0a49":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-66-KKR-vs-LSG-768x360.jpg",
"6e853a67-5625-434f-babd-5702dcd846a9":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-65-MI-vs-SH-768x360.jpg",
"9759d12a-14a6-42c2-bbe2-833c6f612ceb":"https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-67-RCB-vs-GT-768x360.jpg",
"ebd0d24d-8726-44d3-afdb-40021ce99982": "https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-29-GT-vs-CSK-768x360.jpg",
"11db4216-28c6-4725-822e-a40f3ea65187": "https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-37-LSG-vs-MI-768x360.jpg",
"63c6436d-3d09-4e9c-b0e1-7f9379eafdd5": "https://cdorg.b-cdn.net/wp-content/uploads/2022/03/IPL-Match-51-GT-vs-MI-768x360.jpg"};


const getPerc = (score1, score2) => {
    score1 = parseFloat(score1);
    score2 = parseFloat(score2);
    return ((score1/(score1 + score2))*100).toFixed(0);
}

export { 
    db, 
    auth,
    storage,
    firebaseNotifs,
    iplMatches,
    logger,
    firebase,
    matchImgs,

    getMsgForUpcomingBets,
    getMsgForLostBets, 
    getMsgForWonBets, 
    getMsgForClosedBets, 
    getMsgForNoResultBets, 
    getMsgForInProgressBets, 
    getMsgForOpenBets,
    getFormattedFirebaseTime,
    getPerc
}