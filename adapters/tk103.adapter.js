const GPSUtils = require('../utils/gpsUtils');
const TK103Service = require('../services/tk103.service');

module.exports = class TK103Adapter {

    static async adapterController(data, server, port, ip) {
        console.log('TK103');
        // decode data
        const dataFrame = TK103Adapter.decode(data);
        //console.log(dataFrame);
        if (!dataFrame) return;

        // if loging message send 'LOAD'
        if (dataFrame.request === "login") return server.send("LOAD", port, ip);

        // if heartbeat message send 'ON'
        else if (dataFrame.request === "heartbeat")
            return server.send("ON", port, ip);

        TK103Adapter.analyzeAndSaveData(dataFrame);

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
            //imei:864893036579301,tracker,210420200722,,F,200722.00,A,3002.84912,N,03111.73376,E,,;
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
            const fuel_level = dataFrame[12];
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
                fuel_level: fuel_level ? fuel_level : 0,
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
        return await TK103Service.saveRecord(data);
    }

};