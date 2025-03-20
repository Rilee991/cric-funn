import { db } from "../config";
import { USER_COLLECTION, CAREER_COLLECTION } from "../global/enums";
import { DEFAULT_USER_PARAMS } from '../configs/userConfigs';

export const getUserByUsername = async (username) => {
    const user = await db.collection(USER_COLLECTION).doc(username).get();

    return user;
}

export const getCareerByUsername = async (username) => {
    const user = await db.collection(CAREER_COLLECTION).doc(username).get();

    return user;
}

export const getUserByKey = async (key, value) => {
    const user = await db.collection(USER_COLLECTION).where(key, "==", value).get();

    return user;
}

export const createUser = async (username, userDetails) => {
    const resp = await db.collection(USER_COLLECTION).doc(username).set(userDetails);

    return resp;
}

export const updateUserByUsername = async (username, userDetails) => {
    await db.collection(USER_COLLECTION).doc(username).update({ ...userDetails });
}

export const updateUserByEmail = async (email, userDetails) => {
    const docsSnapshot = await db.collection(USER_COLLECTION).where("email", "==", email).get();
    docsSnapshot.docs.forEach(doc => {
        updateUserByUsername(doc.id, userDetails);
    });
}

export const getUsers = async () => {
    const users = await db.collection(USER_COLLECTION).get();

    return users;
}

export const dumpUsers = async () => {
    const users = await db.collection(USER_COLLECTION).get();
    const dumpTableName = `users_${new Date().getFullYear()}_ipl_dump`;

    for(const doc of users.docs) {
        const user = doc.data();

        await db.collection(dumpTableName).doc(user.username).set(user);
        await db.collection(USER_COLLECTION).doc(doc.id).update({ bets: DEFAULT_USER_PARAMS.STARTING_BETS,
            points: DEFAULT_USER_PARAMS.STARTING_POINTS, updatedAt: new Date(), updatedBy: "dumpUsers",
            isOut: false, showWishModal: true, displayName: user.username
        });
    }
}

export const restoreData = async (username) => {
    const resp = await fetch("https://wild-blue-adder-gear.cyclic.app/cfb/dbops/restoreDataForUsername", 
        { method: "post", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username }) }
    );

    console.log("Update successful" + resp);
}
