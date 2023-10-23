const router = require("express").Router();
const pt = require("puppeteer");

/* They'll be nedeed when scheduleCrawler and /cancelCrawler are activated*/ 
const { scrapingFunction } = require("../functions/scrapers");
const { axiosInstance } = require("../functions/axios");
//const nodeCron = require("node-cron")
//const schedule = require("node-schedule"); replaced with node-cron


const CRONEX = "*/30 * * * * *"; // Every 30''


/*Basic function to trigger the scraper based on filters*/
router.get("/scrape_pages", async (req, res) => {
  process.setMaxListeners(15);
  const instrument = req.query.instrument;
  const filters = req.query?.filters?req.query?.filters:null;
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

router.get("/",async (req,res)=>{
  res.status(200).json({message:'The scraper server is working normally'});
})

/* API TO TEST THAT PARALLEL CRAWLERS ARE EXECUTED CORRECTLY. YOU CAN TRY IT ON POSTMAN*/
/*It sends a request to the PHP api to get the surveys, then it executes parallel instances of the crawler and return the result to the php backend*/

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
    const survs = await axiosInstance.get("/node/get_surveys");
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

router.get("/try_scrape", async (req,res) => {
  const browser = await pt.launch({
    headless: "true",
    defaultViewport: null,
    args: ["--no-sandbox"],
  });
  
  const driver = await browser.newPage();
  await driver.setViewport({ width: 1000, height: 500 });
  await driver.goto("https://google.com", {waitUntil:'load'})
  const title = await driver.title();
  res.status(200).json(title);
});


/** SCHEDULE CRAWLER API FUNCTIONS**/
/** They are disabled by default. They allow the user to automatically schedule a survey crawler based on the CRONEX string or diable it.**/
/* 
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
    nodeCron.schedule(CRONEX, async () => {
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
    }, {
      scheduled:true,
      timezone:'Europe/Rome'
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
*/

module.exports = router;
