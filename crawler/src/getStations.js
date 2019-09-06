require("dotenv").config();
const { compose, find, get } = require("lodash/fp");
const axios = require("axios");
const { Pool } = require("pg");
const { getRain, getTemperature } = require("./getStation");

const pool = new Pool({});

(async () => {
  const client = await pool.connect();
  try {
    const { rows: stations } = await client.query("select * from stations");
    for (let i = 0; i < stations.length; i++) {
      const station = stations[i];
      console.log(station.name);
      const rain = await getRain(station.id);
      if (rain) {
        await client.query(
          "insert into weathers (station_id, date_time, rain) values ($1, $2, $3) on conflict (station_id, date_time) do update set rain = $3",
          [station.id, rain.dateTime, rain.rain]
        );
      }
      const temperature = await getTemperature(station.id);
      if (temperature) {
        await client.query(
          "insert into temperatures (station_id, date_time, temperature) values ($1, $2, $3) on conflict (station_id, date_time) do update set temperature = $3",
          [station.id, temperature.dateTime, temperature.temperature]
        );
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
})();
