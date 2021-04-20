require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require("./socket")();
const sequelize = require('./utils/database');
sequelize.sync().then(console.log('sync done'))
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// create application/json parser
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.json());
// to enable file path to render css files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.listen(3000, () => console.log("http server started on port 3004"));

app.get("/", (req, res) => {
    //res.sendFile(path.join(__dirname, "views", "main.html"));
    res.render("simulator", {});
});

app.post("/", urlencodedParser, (req, res) => {
    const data = req.body;
    console.log(data);
    let frame = "";
    frame = "imei:" + data.imei + ",";
    frame += data.Keyword + ",";
    frame += "210411232033" + ",";
    frame += data.phone + ",";
    frame += "F" + ",";
    frame += "055403.000,";
    frame += "A" + ",";
    frame += data.latitude + ",E,";
    frame += data.longitude + ",N,";
    frame += data.speed + ",";
    frame += "30.1,65.43,";
    frame += data.acc + ",";
    frame += data.door + ",";
    frame += data.fuel + "%,";
    frame += data.temperature + ";";
    console.log(frame);
    //res.send("ok");
});