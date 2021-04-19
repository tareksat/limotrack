module.exports = (data) => {
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
    const tk303_data = encodeDataFrame(dataFrame);
    return {
        imei: tk303_data.imei,
        request: "tracking",
        data: tk303_data,
    };
    console.log(tk303_data);
};

function encodeDataFrame(dataFrame) {
    const imei = dataFrame[0];
    const keyword = dataFrame[1];
    const timeDate = dataFrame[2];
    const phone = dataFrame[3];
    const gpsSignal = dataFrame[4];
    const GMTTime = dataFrame[5];
    const GPSStatus = dataFrame[6];
    const latitude = dataFrame[7];
    const latitude_level = dataFrame[8];
    const longitude = dataFrame[9];
    const logitude_level = dataFrame[10];
    const speed = dataFrame[11];
    const direction = dataFrame[12];
    const altitude = dataFrame[13];
    const acc_state = dataFrame[14];
    const door_state = dataFrame[15];
    const fuel_1 = dataFrame[16];
    const fuel_2 = dataFrame[17];
    const temperature = dataFrame[18];

    return {
        imei,
        keyword,
        timeDate,
        phone,
        gpsSignal,
        GMTTime,
        GPSStatus,
        latitude,
        latitude_level,
        longitude,
        logitude_level,
        speed,
        direction,
        altitude,
        acc_state,
        door_state,
        fuel_1,
        fuel_2,
        temperature,
    };
}