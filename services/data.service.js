const Data = require('../models/data');

module.exports = save = async(data) => {
    Data.create(data);
}