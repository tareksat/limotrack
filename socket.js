const udp = require("dgram");
const TK303Adapter = require("./adapters/tk303.adapter");

const server = udp.createSocket("udp4");

module.exports = () => {
    server.on("error", (error) => {
        throw new Error(error);
    });

    server.on("message", async(message, info) => {
        try {
            console.log(message.toString());
            await TK303Adapter.adapterController(
                message.toString(),
                server,
                info.port,
                info.message
            );
            // const data = encode(message.toString());
            // console.log(await DeviceService.doesDeviceExists(data.imei));
        } catch (err) {
            console.log(err);
        }
        // console.log("message", message.toString(), info.address, info.port);
    });

    server.on("listening", () => {
        console.log(`Server is running on port: 3001`);
    });

    server.bind(3001);

    return server;
};