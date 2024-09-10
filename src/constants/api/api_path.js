
// export const CONFIGURATIONS = {
//     DEV: {
//         ENC_KEY: 'WFsQ1JN',
//         COOKIE_KEY: 'REm@7BER',
//         TokenKey:"to@k@ey",
//         GUESTTOKEN:"gu@!3%5#",
//         CURRENCY:"c@##$%343fks",
//         cancelkey : "U2FsdGVkX19Q+6rlk7YJYkHghU0k5nv3+HXwDzFVG0s=",
//         successKey : "U2FsdGVkX19hN52LqMmtxsF5Wg/ORrMj8AbXOMAp6b8="
//     },

//     LIVE: {
//         ENC_KEY: 'WFsQ1JN',
//         COOKIE_KEY: 'REm@7BER',
//         TokenKey:"to@k@ey",
//         GUESTTOKEN:"gu@!3%5#",
//         CURRENCY:"c@##$%343fks",
//         cancelkey : "U2FsdGVkX19Q+6rlk7YJYkHghU0k5nv3+HXwDzFVG0s=",
//         successKey : "U2FsdGVkX19hN52LqMmtxsF5Wg/ORrMj8AbXOMAp6b8="
//     }
// }

// export const SETTINGS = process.env.REACT_APP_ENV === "production" ? CONFIGURATIONS['LIVE']: CONFIGURATIONS['DEV'];


export const CONFIGURATIONS = {
        AUTHTOKEN: "wr564w6et54sdf3q",
        AUTHUSER: "ku24147e688akufas",
        AUTH: "ksgriwug",
        ENC_KEY: 'WFsQ1JN',
        COOKIE_KEY: 'REm@7BER',
        TOKENKEY: "to@k@ey",
        GUESTTOKEN: "gu@!3%5#",
        CURRENCY: "c@##$%343fks",
        cancelkey: "U2FsdGVkX19Q+6rlk7YJYkHghU0k5nv3+HXwDzFVG0s=",
        successKey: "U2FsdGVkX19hN52LqMmtxsF5Wg",
        processKey: "U2FsdGVkX1j+wfgkt==",
        NOTIFICATION_KEY: "xGaWeiKRF",
        SAVEDCARDS: "jkfukgwrvam",
        LOGIN_TIME: "ujgfsbqwrygj",
        NEWSERVICEID: "ad54a4d2adfd5sdsd",
        SERVER_TIME: "jhgs#%28n",
        SERVER_INSTALL_ARRAY: "as4#$@sdf#%5",
        GOOGLE_MAPS_API_KEY: "AIzaSyBrTytaElT6X1tbXayYj7huzedGcXr_1Zg",
        BILLING_MODAL: "dSf7fs8fw$%KsW#",
        BILLINGMODAL_TRUE: "4d8v8yXEQGU2",
        BILLINGMODAL_FALSE: "547VYRF575G4WQ4"
}

export const SETTINGS = CONFIGURATIONS;

export const DateFormat = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
}

export const TimeFormat = {
        hour: 'numeric',
        minute: 'numeric',
}

//short code of those countries which data is not available in phone input and flag is not available in country list
export const noCountryData = ["aq", "bv", "tp", "xa", "tf", "hm", "xj", "xm", "an", "pn", "xg", "gs", "um", "yu", "xu"]
export const RedNumbers = [1, 5, 9, , 7, 11, 14, 16, 18, 19, 21, 25, 23,27, 30, 34, 32, 36]
export const BlackNumbers = [2, 6,  10, 4, 8, 12, 13, 31, 35, 29, 33, 28, 24, 20, 22, 26, 13, 17, 15]