const osmosis = require("osmosis");

let result = [];

osmosis
  .get(
    "https://kam.lt/lt/aktuali_informacija_apie_privalomaja_karine_tarnyba/new_2716.html"
  )
  .find("table tr td strong")
  .set("data")
  .data(function(data) {
    result = [...result, data];
  });

setTimeout(() => {
  const data = {
    statedWishForDuty: result[15].data,
    statedWishForDutyProcedures: result[16].data,
    pledgedPriorityForDuty: result[17].data,
    pledgedPriorityForDutyProcedures: result[18].data,
    compulsoryAppropriateForDuty: result[19].data,
    preliminaryTotal:
      parseInt(result[16].data) +
      parseInt(result[18].data) +
      parseInt(result[19].data)
  };
  console.log(data);
}, 5000);
