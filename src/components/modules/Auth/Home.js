import React, { useState, useEffect, useContext } from 'react';

import { getMatches, saveIplMatchesInDb } from '../../apis';
import { ContextProvider } from '../../../Global/Context';

import CricketCard from './CricketCard';
import LoadingComponent from '../../common/LoadingComponent';

// {
//     "id":"048d4bdf-88de-4981-b330-03ceb18eb6a1",
//     "name":"Punjab Kings vs Rajasthan Royals, 66th Match",
//     "matchType":"t20",
//     "status":"Match not started",
//     "venue":"Himachal Pradesh Cricket Association Stadium, Dharamsala",
//     "date":"2023-05-19",
//     "dateTimeGMT":"2023-05-19T14:00:00",
//     "teams":["Punjab Kings","Rajasthan Royals"],
//     "teamInfo":[{
//         "name":"Punjab Kings",
//         "shortname":"PBKS",
//         "img":"https://g.cricapi.com/img/teams/247-637852956959778791.png"
//     },{
//         "name":"Rajasthan Royals",
//         "shortname":"RR",
//         "img":"https://g.cricapi.com/img/teams/251-637852956607161886.png"
//     }],
//     "fantasyEnabled":false,
//     "bbbEnabled":false,
//     "hasSquad":true,
//     "matchStarted":false,
//     "matchEnded":false
// }

const Home = () => {
  const contextConsumer = useContext(ContextProvider);
  const { mobileView, } = contextConsumer;
  const container = {
    width: "100%", 
    // padding: mobileView ? "70px 0px" : "70px 200px"
  };
  const [matches, setMatches] = useState([]);

  const filterIplMatches = (matches) => {
    const iplTeamAbbreviation = ["CSK", "DC", "GT", "KKR", "LSG", "MI", "PBKS", "RCB", "RR", "SRH"];

    const result = matches.filter(match => {
      const { teams } = match;
      let team1 = teams[0], team2 = teams[1];

      if(team1 == "Sunrisers Hyderabad") team1 = "Sun Risers Hyderabad";
      if(team2 == "Sunrisers Hyderabad") team2 = "Sun Risers Hyderabad";
      if(team1 == "Punjab Kings") team1 = "Punja B King S";
      if(team2 == "Punjab Kings") team2 = "Punja B King S";
      
      team1 = team1.match(/(\b\S)?/g).join("").toUpperCase();
      team2 = team2.match(/(\b\S)?/g).join("").toUpperCase();
      
      // if(iplTeamAbbreviation.includes(team1) && iplTeamAbbreviation.includes(team2)) {
        match.team1Abbreviation = team1;
        match.team2Abbreviation = team2;
        return match;
      // }
    });

    return result;
  }

  useEffect(async () => {
    let matches = await getMatches();
    matches = filterIplMatches(matches);
    setMatches(matches);
    // console.log(JSON.stringify(matches));
    // await saveIplMatchesInDb();
  }, []);

  return (
    <div style={container}>
      {matches.length ? matches.map((match, index) => (
        <CricketCard key={index} match={match}/>
      ))  : <LoadingComponent /> }
    </div>
  );
}

export default Home;
