const TK303 = require("../models/tk303");

module.exports = class TK303Service {
    static async saveRecord(data) {
        const tk303 = await TK303.create(data);
        return tk303;
    }
    static async getlastRecordByImei(imei) {
        const res = await TK303.findAll({
            where: {
                imei,
                acc_state: '1'
            },
            order: [["time", "DESC"]],
            limit: 1
        });
        if(res)
            return res[0];
        return null
    }
};