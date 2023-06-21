import { getUserByKey } from '../userController';
import { DEFAULT_USER_PARAMS } from '../../configs/userConfigs';
import { getWinningAmount } from '../../global/adhocUtils';

export const getPointsTimeLineComparison = async () => {
    try {
        const users = await getUserByKey("isDummyUser", false);
        const docs = users.docs;
        const resp = [];

        for(const userDoc of docs) {
            let points = DEFAULT_USER_PARAMS.STARTING_POINTS, match = 0;
            const userJourney = [{ match, points }];
            const { bets = [], username } = userDoc.data();

            bets.map(bet => {
                if(bet.betWon) {
                    if(bet.isNoResult) {
                        points += parseInt(bet.selectedPoints);
                    } else {
                        points += getWinningAmount(bet.selectedPoints, bet.odds[bet.selectedTeam]);
                    }
                } else {
                    points -= parseInt(bet.selectedPoints);
                }

                match++;
                userJourney.push({ points, match });
            });

            resp.push({ player: username, journey: userJourney });
        };

        return resp;
    } catch (error) {
        throw new Error(error);
    }
}
