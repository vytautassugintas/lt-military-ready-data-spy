const osmosis = require("osmosis");
const schedule = require("node-schedule");

const url =
  "https://kam.lt/lt/aktuali_informacija_apie_privalomaja_karine_tarnyba/new_2716.html";

let result = [];

console.log("Starting data collection from " + url);
const job = schedule
  .scheduleJob("*/1 * * * *", () => {
    osmosis
      .get(url)
      .find("table tr td strong")
      .set("data")
      .data(data => {
        result = [...result, data.data];
      });

    setTimeout(() => {
      const data = {
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
      console.log(data);
    }, 10000);
  }); 
