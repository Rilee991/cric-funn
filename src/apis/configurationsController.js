import { get } from "lodash";
import moment from "moment";

import { db } from "../config";
import { getFirebaseCurrentTime } from "../global/adhocUtils";
import { CONFIGURATION_COLLECTION, CONFIGURATION_DOCS } from "../global/enums";

export const getConfigurations = async () => {
    const resp = await db.collection(CONFIGURATION_COLLECTION).get();
    const configs = {};
    const date = moment().format("DD-MM-YYYY");

    resp.docs.forEach(doc => {
        let data = doc.data();
        if(doc.id == CONFIGURATION_DOCS.CREDITS) {
            data = get(data, `${date.slice(3)}.${date.slice(0,2)}.data`, {});
        }
        configs[doc.id] = data;
    });

    return configs;
}

export const updateConfigurations = async (id, username, data, setConfigurations) => {
    const ref = db.collection(CONFIGURATION_COLLECTION).doc(id);
    const date = moment().format("DD-MM-YYYY");
    const firebaseDate = getFirebaseCurrentTime();
    if(id == CONFIGURATION_DOCS.CREDITS) {
        await ref.update({
            [`${date.slice(3)}.${date.slice(0,2)}.data.${username}`]: data,
            [`${date.slice(3)}.${date.slice(0,2)}.updatedAt`]: firebaseDate,
            [`${date.slice(3)}.${date.slice(0,2)}.updatedBy`]: username
        });
        setConfigurations(prev => {
            prev[CONFIGURATION_DOCS.CREDITS][`${username}`] = data;
            return  prev;
        });
    }
}
