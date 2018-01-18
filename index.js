const osmosis = require("osmosis");
const schedule = require("node-schedule");

const url =
  "https://kam.lt/lt/aktuali_informacija_apie_privalomaja_karine_tarnyba/new_2716.html";

let result = [];

let rule = new schedule.RecurrenceRule();
rule.second = 5;

console.log("\x1b[32m", "✅ ", "Starting data collection from " + url);
const job = schedule
  .scheduleJob(rule, () => {
    osmosis
      .get(url)
      .find("table tr td strong")
      .set("data")
      .data(data => {
        result = [...result, data.data];
      });

    setTimeout(() => {
      const data = {
        timeLogged: new Date().getTime(),
        statedWishForDuty: result[15],
        statedWishForDutyProcedures: result[16],
        pledgedPriorityForDuty: result[17],
        pledgedPriorityForDutyProcedures: result[18],
        compulsoryAppropriateForDuty: result[19],
        preliminaryTotal:
          parseInt(result[16]) +
          parseInt(result[18]) +
          parseInt(result[19])
      };
      console.log("\x1b[37m", "\x1b[4m", "Data from: " + new Date());
      console.log("\x1b[37m", "\x1b[0m", data);
    }, 10000);
  }); 
