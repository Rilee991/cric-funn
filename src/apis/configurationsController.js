import { get } from "lodash";
import moment from "moment";

import { db } from "../config";
import { getFirebaseCurrentTime } from "../global/adhocUtils";
import { CONFIGURATION_COLLECTION } from "../global/enums";

export const getConfigurations = async () => {
    const now = moment();
    const resp = await db.collection(CONFIGURATION_COLLECTION).doc(`${now.format("YYYY-MM-DD")}`).get();
    const defaultConfigsObj = {
        createdAt: getFirebaseCurrentTime(),
        createdBy: "getConfigurations",
        updatedAt: getFirebaseCurrentTime(),
        updatedBy: "getConfigurations",
        creditsData: {},
        appData: {},
        totalHits: 0
    };

    if(!resp.exists) {
        await db.collection(CONFIGURATION_COLLECTION).doc(`${now.format("YYYY-MM-DD")}`).set(defaultConfigsObj);

        return defaultConfigsObj;
    }
    
    const configs = resp.data();

    configs["creditsData"] = configs["creditsData"] || {};
    configs["appData"] = configs["appData"] || {};
    configs["totalHits"] = configs["totalHits"] || 0;

    return configs;
}

export const updateCredits = async (docId, username, totalHits, configurations, setConfigurations) => {
    const creditsData = configurations["creditsData"];
    creditsData[username] = creditsData[username] ? creditsData[username]+1 : 1;

    setConfigurations(config => ({ ...config, creditsData, totalHits }));

    await db.collection(CONFIGURATION_COLLECTION).doc(docId).update({
        updatedAt: getFirebaseCurrentTime(),
        updatedBy: `updateCredits_${username}`,
        creditsData,
        totalHits
    });
}

export const updateAppData = async (docId, username, appDataObj, setConfigurations) => {
    setConfigurations(config => ({ ...config, appData: appDataObj }));

    await db.collection(CONFIGURATION_COLLECTION).doc(docId).update({
        updatedAt: getFirebaseCurrentTime(),
        updatedBy: `updateCredits_${username}`,
        appData: appDataObj
    });
}

export const updateConfig = async (configurations, username, pageName, setConfigurations) => {
    const docId = moment().format("YYYY-MM-DD");
    const appDataObj = configurations["appData"];

    if(appDataObj[username]) {
        const pageVisits = appDataObj[username]["pageVisits"] || [];
        pageVisits.push({ page: pageName, time: moment().add(330, "minutes").format("YYYY-MM-DD HH:mm:ss") });

        appDataObj[username] = {
            ...appDataObj[username],
            pageVisits
        };

        await updateAppData(docId, username, appDataObj, setConfigurations);
    }
}

export const getTimeSpentData = async () => {
    const resp = await db.collection(CONFIGURATION_COLLECTION).get();
    const configs = resp.docs.filter(doc => doc.id >= moment("2024-03-22").format("YYYY-MM-DD") && doc.id <= moment().format("YYYY-MM-DD")).map(doc => ({ ...doc.data(), id: doc.id }));
    const timeSpentByPlayer = [];
    const players = ["ashu", "desmond", "kelly", "SD", "Broly", "Himanshu sahu", "Cypher33"];

    for(const player of players) {
        let day = 0, timeSpent = 0;
        const timeJourney = [{ day, timeSpent }];

        for(const config of configs) {
            const playerConfig = config["appData"][player];

            const dayTimeSpent = parseInt(get(playerConfig, 'timeSpent', 0));
            day++;
            timeSpent += dayTimeSpent;

            timeJourney.push({ day, timeSpent: dayTimeSpent });
        }

        timeSpentByPlayer.push({ player, journey: timeJourney });
    }

    return timeSpentByPlayer;
}
