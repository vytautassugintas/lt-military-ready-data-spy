const osmosis = require("osmosis");
const schedule = require("node-schedule");

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

let schemaToSave = mongoose.model("Warrios", {
  timeLogged: String,
  statedWishForDuty: String,
  statedWishForDutyProcedures: String,
  pledgedPriorityForDuty: String,
  pledgedPriorityForDutyProcedures: String,
  compulsoryAppropriateForDuty: String,
  preliminaryTotal: String
});

const url =
  "https://kam.lt/lt/aktuali_informacija_apie_privalomaja_karine_tarnyba/new_2716.html";

let result = [];

let rule = new schedule.RecurrenceRule();
rule.hour = 14;

console.log("\x1b[32m", "✅ ", "Starting data collection from " + url);
const job = schedule.scheduleJob(rule, () => {
  result = [];
  osmosis
    .get(url)
    .find("table tr td strong")
    .set("data")
    .data(data => {
      result = [...result, data.data];
    });

  setTimeout(() => {
    const data = new schemaToSave({
      timeLogged: new Date().getTime(),
      statedWishForDuty: result[15],
      statedWishForDutyProcedures: result[16],
      pledgedPriorityForDuty: result[17],
      pledgedPriorityForDutyProcedures: result[18],
      compulsoryAppropriateForDuty: result[19],
      preliminaryTotal:
        parseInt(result[16]) + parseInt(result[18]) + parseInt(result[19])
    });

    data.save(err => {
      if (err) {
        console.log(err);
      } else {
        console.log("Saved");
      }
    });
    console.log("\x1b[37m", "\x1b[4m", "Data from: " + new Date());
    console.log("\x1b[37m", "\x1b[0m", data);
  }, 10000);
});

mongoose.connect(
  "mongodb://" +
    process.env.dbUser +
    ":" +
    process.env.dbPwd +
    "@ds263137.mlab.com:63137/test-db"
);

app.get("/", (req, res) => res.send(result));

app.listen(port, () => console.log("Listening on port " + port));
