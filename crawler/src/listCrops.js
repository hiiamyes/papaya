require("dotenv").config();
const puppeteer = require("puppeteer");
const { Pool } = require("pg");

const pool = new Pool({
  user: "yes",
  host: "db",
  database: "pangolin",
  password: "yes",
  port: 5432
});

(async () => {
  const client = await pool.connect();
  try {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto("https://e-service.cwb.gov.tw/wdps/obs/state.htm");
    const rows = await page.$$("table tr:nth-child(n+3)");
    for (row of rows) {
      const id = await row.$eval("td:nth-child(1)", node => node.innerText);
      const name = await row.$eval("td:nth-child(2)", node => node.innerText);
      const lat = await row.$eval("td:nth-child(4)", node => node.innerText);
      const lng = await row.$eval("td:nth-child(5)", node => node.innerText);
      await client.query(
        "insert into stations (id, name) values ($1, $2) on conflict (id) do update set name = $2, lat = $3, lng = $4",
        [id, name, lat, lng]
      );
      console.log(name);
      if (id === "C1Z240") break;
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
})();
