const router = require("express").Router();
const pt = require("puppeteer");
const { Builder, Browser, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const utils = require("../functions/utils");
const { scrapingFunction } = require("../functions/scrapers");
const pages = require("../functions/pages");
const schedule = require("node-schedule");
const { axiosInstance } = require("../functions/axios");


const CRONEX = "*/30 * * * * *"; // Every 30''

//TRIAL
router.get("/save_scrape_result", async (req, res) => {
  // Function to process a batch of parameters concurrently
  function processBatch(params) {
    const promises = params.map((param) => {
      return scrapingFunction(param.text, null).then((result) => {
        // Append the "survey" field to the object before returning it
        const firstItem = result.item_list[0];
        firstItem.survey = param.id;
        return firstItem;
      });
    });
    return Promise.all(promises);
  }

  try {
    const survs = await axiosInstance.get("/get_surveys");
    const concurrencyLimit = 3;

    // Split the array of parameters into batches of size 'concurrencyLimit'
    const parameterBatches = [];
    for (let i = 0; i < survs.data.length; i += concurrencyLimit) {
      parameterBatches.push(survs.data.slice(i, i + concurrencyLimit));
    }
    const results = [];
    // Execute each batch of parameters sequentially
    parameterBatches
      .reduce((prevPromise, batch) => {
        return prevPromise
          .then(() => processBatch(batch))
          .then((batchResults) => {
            // Add the batch results to the overall results array
            results.push(...batchResults);
          });
      }, Promise.resolve())
      .then(() => {
        console.log("All tasks are done");
        console.log("Results:", results);
        res.status(200).json(results)
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  } catch (error) {
    console.log("ERRORE", error);
  }
});

router.get("/scrape_pages", async (req, res) => {
  const instrument = req.query.instrument;
  const filters = req.query?.filters;
  const first = req.query?.first;

  // TODO: Make the function return only the data and send a response from here
  scrapingFunction(instrument, filters)
    .then((data) => {
      const response = first ? data.item_list[0] : data;
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/scheduleCrawler", async (req, res) => {

  function processBatch(params) {
    const promises = params.map((param) => {
      return scrapingFunction(param.text, null).then((result) => {
        // Append the "survey" field to the object before returning it
        const firstItem = result.item_list[0];
        firstItem.survey = param.id;
        return firstItem;
      });
    });
    return Promise.all(promises);
  }

  // TODO: Once the data is gotten, take the first element of the list
  try {
    schedule.scheduleJob(req.query.title, CRONEX, async () => {
       try {
    const survs = await axiosInstance.get("/get_surveys");
    const concurrencyLimit = 3;

    // Split the array of parameters into batches of size 'concurrencyLimit'
    const parameterBatches = [];
    for (let i = 0; i < survs.data.length; i += concurrencyLimit) {
      parameterBatches.push(survs.data.slice(i, i + concurrencyLimit));
    }
    const results = [];
    // Execute each batch of parameters sequentially
    parameterBatches
      .reduce((prevPromise, batch) => {
        return prevPromise
          .then(() => processBatch(batch))
          .then((batchResults) => {
            // Add the batch results to the overall results array
            results.push(...batchResults);
          });
      }, Promise.resolve())
      .then(() => {
        console.log("All tasks are done");
        console.log("Results:", results);
        res.status(200).json(results)
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  } catch (error) {
    console.log("ERRORE", error);
  }
    });
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

router.get("/cancelCrawler", async (req, res) => {
  try {
    schedule.cancelJob(req.query.title);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
