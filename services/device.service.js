const { Op } = require("sequelize");
const Device = require("../models/device");

module.exports = class DeviceService {
    static async doesDeviceExists(imei) {
        // return true if device already registred and has a valid subscription and false if not
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        const result = await Device.findOne({
            where: {
                imei,
                subscription: {
                    [Op.gte]: date,
                },
            },
        });
        if(result) return result;
        return null;
    }
};