import { db } from "../config";
import { USER_COLLECTION } from "../global/enums";

export const getUserByUsername = async (username) => {
    const user = await db.collection(USER_COLLECTION).doc(username).get();

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
