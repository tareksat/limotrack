const GPSUtils = require('../utils/gpsUtils');
const TK303Service = require('../services/tk303.service');

module.exports = class TK303Adapter {

    static async adapterController(data, server, port, ip) {
        console.log('TK303');
        // decode data
        const dataFrame = TK303Adapter.decode(data);
        //console.log(dataFrame);
        if (!dataFrame) return;

        // if loging message send 'LOAD'
        if (dataFrame.request === "login") return server.send("LOAD", port, ip);

        // if heartbeat message send 'ON'
        else if (dataFrame.request === "heartbeat")
            return server.send("ON", port, ip);

        TK303Adapter.analyzeAndSaveData(dataFrame);

        server.send("ON", port, ip);
    }

    static decode(data) {
        try {
            // to check for heartbeat packets
            const rePattern = new RegExp(/^\d{15}(,\d{15})*$/);
            if (rePattern.test(data)) return {imei: data, request: "heartbeat"};

            const temp = data.split(":")[1];
            const dataFrame = temp.split(",");
            if (dataFrame.length === 2) {
                const imei = dataFrame[0];
                if (dataFrame[1] === "A;") {
                    return {
                        imei,
                        request: "login",
                        data: {},
                    };
                }
            }
            const imei = dataFrame[0];
            const keyword = dataFrame[1];
            const time = GPSUtils.convertGpsDate(dataFrame[2]);
            const phone = dataFrame[3];
            const gps_signal = dataFrame[4];
            const gmt_time = dataFrame[5];
            const gps_status = dataFrame[6];
            const latitude = dataFrame[7];
            const latitude_level = dataFrame[8];
            const longitude = dataFrame[9];
            const longitude_level = dataFrame[10];
            const speed = dataFrame[11] ? dataFrame[11] : 0;
            const direction = dataFrame[12];
            const altitude = dataFrame[13];
            const acc_state = dataFrame[14];
            const door_state = dataFrame[15];
            const fuel_level = dataFrame[16].split('%')[0];
            const fuel_2 = dataFrame[17];
            const temperature = dataFrame[18].split(';')[0];
            const decodedData = {
                imei,
                keyword,
                time,
                phone,
                gps_signal,
                gmt_time,
                gps_status,
                latitude: GPSUtils.convertCoordinates(latitude),
                latitude_level,
                longitude: GPSUtils.convertCoordinates(longitude),
                longitude_level,
                speed: speed ? speed : 0,
                direction: direction ? direction : '0',
                altitude: altitude ? altitude : '',
                acc_state: acc_state ? acc_state : 0,
                door_state: door_state ? door_state : 0,
                fuel_level: fuel_level ? fuel_level : 0,
                fuel_2: fuel_2 ? fuel_2 : 0,
                temperature: temperature ? temperature : '',
            };

            return {
                imei: decodedData.imei,
                request: decodedData.keyword,
                data: decodedData,
            };
        } catch (err) {
            return null;
        }
    }

    static async analyzeAndSaveData({data}) {
        if (data.acc_state === '0' || !data.acc_state) {
            console.log('Car Engine OFF no fuel data')
            data.distance = 0;
            data.fuel_consumption = 0;
            return await TK303Service.saveRecord(data);
        }
        const lastRecord = await TK303Service.getlastRecordByImei(data.imei);
        if (!lastRecord) { // in case this is the first record to be saved
            console.log('First record for the car')
            data.distance = 0;
            data.fuel_consumption = 0;
            return await TK303Service.saveRecord(data);
        }
        const fuel_diff = lastRecord.fuel_level - parseFloat(data.fuel_level);
        if (fuel_diff < -1) {
            // refuel
            console.log('refuel: ', fuel_diff)
        } else if (fuel_diff > 1) {
            // fuel leakage
            console.log('Fuel leakage', fuel_diff)
        }
        data.fuel_consumption = fuel_diff;
        return await TK303Service.saveRecord(data);
    }

};