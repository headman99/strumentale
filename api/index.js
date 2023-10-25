const express = require("express");
const app = express();
//const mongoose = require("mongoose");
const dotenv = require("dotenv");
const scraperRoute = require("./routes/scraper.js")
const cors = require("cors");
const crawler_cronjob = require("./functions/cronjobs/crawler_cronjob");
const delete_results_cronjob = require("./functions/cronjobs/delete_results_cronjob");

dotenv.config();

app.use(
  cors({origin:true})
);

app.use(express.json());


app.use("/api/scraper", scraperRoute);


app.listen(8800, () => {
  console.log("Backend server is running!");
});