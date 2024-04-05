const SERIES_ID = 2002;
const API_KEY = '5ae7e0e50bmsh0991a6cfa5be038p169aafjsnbb2ada82a3cd';

export const getMatchDetailsByDate = async (date) => {
    try {
        const now = moment();
        const options = {
          method: 'GET',
          url: 'https://cricket-live-data.p.rapidapi.com/fixtures-by-series/2002',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'cricket-live-data.p.rapidapi.com'
          }
        };
        const url = `https://cricket-live-data.p.rapidapi.com/fixtures-by-series/${SERIES_ID}`;
        const resp = await fetch(options);
        const data = await resp.json();
        const matchDetails = data.data;

        

        return { matchDetails, configDocId: now.format("YYYY-MM-DD"), currentHits };
    } catch (error) {
        throw new Error(error);
    }
}
