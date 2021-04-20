const DeviceService = require("../services/device.service");
const TK303Service = require('../services/tk303.service');
const saveData = require('../services/data.service');

module.exports = class TK303Adapter {
    static async adapterController(data, server, port, ip) {
        const _imei = TK303Adapter.getImei(data);
        saveData({imei: _imei, data});
        // decode data
        const dataFrame = TK303Adapter.decode(data);
        //console.log(dataFrame);
        if (!dataFrame) return;

        // check that device is registred and has a valid subscription
        const isValid = await TK303Adapter.validateDevice(dataFrame.imei);

        // if not discard data
        if (!isValid) return;

        // if loging message send 'LOAD'
        if (dataFrame.request === "login") return server.send("LOAD", port, ip);
        // if heartbeat message send 'ON'
        else if (dataFrame.request === "heartbeat")
            return server.send("ON", port, ip);

        TK303Adapter.analyzeAndSaveData(dataFrame);
        // if OK save data and calculate fuel & distance??
        // if device has gps signal make calculations
        // if alert, fuel loss or refuel send push notification for that alert

        server.send("ON", port, ip);
    }

    static getImei(data){
        const rePattern = new RegExp(/^\d{15}(,\d{15})*$/);
        if (rePattern.test(data)) return data;

        const temp = data.split(":")[1];
        const dataFrame = temp.split(",");
        const imei = dataFrame[0];
        return imei
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
            const time = TK303Adapter.convertGpsDate(dataFrame[2]);
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
                latitude,
                latitude_level,
                longitude,
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

    static validateDevice(imei) {
        return DeviceService.doesDeviceExists(imei);
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

    static convertGpsDate(dateStr) {
        const date = new Date();
        const rePattern = new RegExp(/^\d{12}(,\d{12})*$/);
        if (rePattern.test(dateStr)) return date;

        date.setFullYear(parseInt('20' + dateStr.slice(0, 2)));
        date.setMonth(parseInt(dateStr.slice(2, 4)) - 1);
        date.setDate(parseInt(dateStr.slice(4, 6)));
        date.setUTCHours(parseInt(dateStr.slice(6, 8)));
        date.setMinutes(parseInt(dateStr.slice(8, 10)))
        date.setSeconds(parseInt(dateStr.slice(10, 12)));
        return date
    }

    static convert_coordinates = (str) => {
        if (!str) {
            return "";
        }
        try {
            let lat = parseFloat(str);
            let deg = Math.floor(lat / 100);
            let min = Math.floor(lat - deg * 100);
            let sec = lat % 1;
            min = (min + sec);//.toFixed(4);
            return (deg + min / 60 + sec / 3600);//.toFixed(7);

            // return value;
        } catch (err) {
            return "";
        }
    };


};