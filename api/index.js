const express = require("express");
const app = express();
//const mongoose = require("mongoose");
const dotenv = require("dotenv");
const scraperRoute = require("./routes/scraper.js")
const cors = require("cors");

dotenv.config();

app.use(
  cors({origin:true})
);

app.use(express.json());


app.use("/api/scraper", scraperRoute);


app.listen(8800, () => {
  console.log("Backend server is running!");
});