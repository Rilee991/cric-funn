import { get } from "lodash";
import moment from "moment";

import { db } from "../config";

const createUserInDb = (userCredentials) => {
    const username = get(userCredentials, "username", "");

    db.collection("users").doc(username).set(userCredentials);
}

const getFormattedTimeFromSeconds = (seconds) => {
    return moment.unix(seconds).format("DD MMM YY, HH:mm A");
}

const getIsMobileView = () => {
    return window.innerWidth < 1200;
}

const getUserFromKey = async (keyName, keyValue) => {
    let userSnapshot = [];
    if(keyValue === "all") {
        userSnapshot = await db.collection("users").get();
    } else {
        userSnapshot = await db.collection("users").where(keyName, "==", keyValue).get();
    }
    
    return userSnapshot;
}

const updateUserDetailsByUsername = async (username, userDetails) => {
    await db.collection("users").doc(username).update({ ...userDetails });
}

export {
    createUserInDb,
    getFormattedTimeFromSeconds,
    getIsMobileView,
    getUserFromKey,
    updateUserDetailsByUsername
};
