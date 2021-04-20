const Data = require('../models/data');

module.exports = save = async(frame) => {
    Data.create({imei: frame.imei, data: frame.data });
}