import React, { useState, useEffect, useContext } from 'react';

import { getMatches } from '../../apis';
import { ContextProvider } from '../../../Global/Context';

import CricketCard from './CricketCard';

export default function Home() {
  const contextConsumer = useContext(ContextProvider);
  const { mobileView } = contextConsumer;
  const container = {
    width: "100%", 
    padding: mobileView ? "70px 0px" : "70px 200px"
  };
  const [matches, setMatches] = useState([]);

  const filterIplMatches = (matches) => {
    const iplTeamAbbreviation = ["RR", "KKR", "CSK", "MI", "RCB", "DC", "KXIP", "SRH"];

    matches = matches.splice(0,60); //TEMP

    const result = matches.filter(match => {
      let { "team-1": team1, "team-2": team2, type = "" } = match;
      if(team1 == "Sunrisers Hyderabad") team1 = "Sun Risers Hyderabad";
      if(team2 == "Sunrisers Hyderabad") team2 = "Sun Risers Hyderabad";
      if(team1 == "Kings XI Punjab") team1 = "Kings X I Punjab";
      if(team2 == "Kings XI Punjab") team2 = "Kings X I Punjab";
      team1 = team1.match(/(\b\S)?/g).join("").toUpperCase();
      team2 = team2.match(/(\b\S)?/g).join("").toUpperCase();

      match.team1Abbreviation = team1; //Temp
      match.team2Abbreviation = team2; //Temp
      if(type)
        return match; //Temp
      else return;

      if(iplTeamAbbreviation.includes(team1) && iplTeamAbbreviation.includes(team2)) {
        match.team1Abbreviation = team1;
        match.team2Abbreviation = team2;
        return match;
      }
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
      ))  : null}
    </div>
  );
}