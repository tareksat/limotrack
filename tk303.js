function messageDecoding(message, ip, port) {
  let serverMessage = "";
  let alert = "";
  let data = {};
  try {
    // just sync message
    if (!message.includes("imei")) {
      //this.emit("message", "LOAD", ip, port);
      serverMessage = "LOAD";
    }
    // Info message
    else {
      message = message.trim().replace(";", "");
      let messageArray = message.split(":")[1].split(","); // remove imei:
      //console.log(messageArray[17]);
      data = {
        imei: messageArray[0],
        keyword: messageArray[1],
        time: parseInt(messageArray[2]),
        phone: messageArray[3],
        latitude: convert_coordinates(messageArray[7]),
        longitude: convert_coordinates(messageArray[9]),
        speed: parseFloat(messageArray[11]),
        accState: parseInt(messageArray[14]),
        doorState: parseInt(messageArray[15]),
        fuelLevel: parseFloat(messageArray[16]),
        temperature: parseFloat(messageArray[17]),
      };

      // check keyword
      let _keyword = data.keyword.toLowerCase();
      if (_keyword !== "tracking") {
        // send alert with keywrod message
        //   TK303Debug(`Alert: ${data.keyword}`);
        alert = data.keyword;
      }

      serverMessage = "ON";
    }
    return {
      serverMessage,
      data,
      alert,
    };
  } catch (err) {
    console.log(err.message);
    return null;
  }
}

function getImei(data) {
  const d = messageDecoding(data);
  if (d !== null) {
    return {
      imei: d.imei,
      type: "TK303",
    };
  }
  return null; // if not TK303
}

function convert_coordinates(str) {
  if (str === "") {
    return "";
  }
  try {
    let lat = parseFloat(str);
    let deg = parseInt(lat / 100);
    let min = parseInt(lat - deg * 100);
    let sec = lat % 1;
    min = (min + sec).toFixed(4);
    const value = (deg + min / 60 + sec / 3600).toFixed(7);

    return `${deg} ${min}`;
  } catch (err) {
    return "";
  }
}

module.exports = messageDecoding;
