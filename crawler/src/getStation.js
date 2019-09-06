require("dotenv").config();
const { compose, find, get } = require("lodash/fp");
const axios = require("axios");

const getRain = async stationId => {
  const {
    data: {
      records: { location }
    }
  } = await axios.request({
    url: "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001",
    headers: {
      Authorization: "CWB-5D4E80FB-5204-4539-B2F8-E4ADF0EDF12C"
    },
    params: {
      stationId
    }
  });
  if (!location.length) return null;
  const [
    {
      time: { obsTime },
      weatherElement
    }
  ] = location;
  const dateTime = new Date(`${obsTime}+0800`).toISOString();
  const rain = compose(
    get("elementValue"),
    find({ elementName: "NOW" })
  )(weatherElement);
  console.log(obsTime, dateTime, rain);
  return { dateTime, rain };
};

const getTemperature = async stationId => {
  const {
    data: {
      records: { location }
    }
  } = await axios.request({
    url: "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001",
    headers: {
      Authorization: "CWB-5D4E80FB-5204-4539-B2F8-E4ADF0EDF12C"
    },
    params: {
      stationId
    }
  });
  if (!location.length) return null;
  const [
    {
      time: { obsTime },
      weatherElement
    }
  ] = location;
  const dateTime = new Date(`${obsTime}+0800`).toISOString();
  const temperature = compose(
    get("elementValue"),
    find({ elementName: "TEMP" })
  )(weatherElement);
  console.log(obsTime, dateTime, temperature);
  return { dateTime, temperature };
};

module.exports = {
  getRain,
  getTemperature
};
