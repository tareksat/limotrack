const TK103 = require("../models/tk103");

module.exports = class TK103Service {
    static async saveRecord(data) {
        const tk103 = await TK103.create(data);
        return tk103;
    }
    static async getlastRecordByImei(imei) {
        const res = await TK103.findAll({
            where: {
                imei
            },
            order: [["time", "DESC"]],
            limit: 1
        });
        if(res)
            return res[0];
        return null
    }
};