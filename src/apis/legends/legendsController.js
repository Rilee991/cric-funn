import { db } from "../../config";
import { LEGEND_COLLECTION } from "../../global/enums";

export const createLegend = async (params) => {
    try {
        await db.collection(LEGEND_COLLECTION).doc(date).set(params);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}
