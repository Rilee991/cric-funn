import { getUserByKey } from '../userController';
import { DEFAULT_USER_PARAMS } from '../../configs/userConfigs';
import { getWinningAmount } from '../../global/adhocUtils';

export const getPointsTimeLineComparison = async () => {
    try {
        const users = await getUserByKey("isDummyUser", false);
        const docs = users.docs;
        const timelineComparision = [];
        const betsComparision = [];

        for(const userDoc of docs) {
            let points = DEFAULT_USER_PARAMS.STARTING_POINTS, match = 0;
            const userJourney = [{ match, points }];
            const betJourney = [{ match, points: 0 }];
            const { bets = [], username } = userDoc.data();

            bets.forEach(bet => {
                if(bet.isSettled === false) return;

                if(bet.betWon) {
                    if(bet.isNoResult) {
                        points += parseInt(bet.selectedPoints);
                    } else {
                        points += getWinningAmount(bet.selectedPoints, bet.odds[bet.selectedTeam]) - parseInt(bet.selectedPoints);
                    }
                } else {
                    points -= parseInt(bet.selectedPoints);
                }

                match++;
                userJourney.push({ points, match });
                betJourney.push({ points: parseInt(bet.selectedPoints), match });
            });

            timelineComparision.push({ player: username, journey: userJourney });
            betsComparision.push({ player: username, journey: betJourney });
        };

        return { timelineComparision, betsComparision };
    } catch (error) {
        throw new Error(error);
    }
}
