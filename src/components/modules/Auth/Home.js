import React, { useState, useEffect, useContext } from 'react';

import { getMatches } from '../../apis';
import { ContextProvider } from '../../../Global/Context';

import CricketCard from './CricketCard';
import LoadingComponent from '../../common/LoadingComponent';

const Home = () => {
  const contextConsumer = useContext(ContextProvider);
  const { mobileView, } = contextConsumer;
  const container = {
    width: "100%", 
    padding: mobileView ? "70px 0px" : "70px 200px"
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
