import { db } from "../config";
import { MATCH_COLLECTION } from "../global/enums";

export const getMatches = async () => {
    const matches = await db.collection(MATCH_COLLECTION).orderBy("dateTimeGMT").get();

    return matches;
}

export const getMatchById = async (id) => {
    const match = await db.collection(MATCH_COLLECTION).doc(id).get();

    return match;
}

export const updateMatchById = async (id, matchDetails) => {
    await db.collection(MATCH_COLLECTION).doc(id).update({ ...matchDetails });
}

export const createMatch = async (id, matchDetails) => {
    await db.collection(MATCH_COLLECTION).doc(id).set({ ...matchDetails });
}

export const clearTable = async () => {
    const records = await db.collection(MATCH_COLLECTION).get();
    
    for(const rec of records.docs) {
        await rec.ref.delete();
    };
}
