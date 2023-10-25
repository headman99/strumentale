const nodeCron = require("node-cron");
const { scrapingFunction } = require("../scrapers");
const { axiosInstance } = require("../axios");

const CRONEX = "0 1 * * *"; // Every day at 1a.m minutes
const timeout = 50; //  secondi di timeout per lo scraping con cron job

function processBatch(params) {
  const promises = params.map((param) => {
    console.log(param)
    const {price_range_favorite,free_shipping_favorite,rating_favorite,text} = param;
    const filters = {
      price: {
        activated: price_range_favorite?true:false,
        parameters: { 
          minPrice: price_range_favorite?price_range_favorite.split('-')[0]:'', 
          maxPrice: price_range_favorite?price_range_favorite.split('-')[1]:''
        },
      },
      rate: {
        activated: rating_favorite?true:false,
        parameters: { threshold: rating_favorite},
      },
      shipment: {
        activated: free_shipping_favorite?true:false,
        parameters: { freeShipment: free_shipping_favorite==1},
      },
    };
    return scrapingFunction(text, filters, timeout).then((result) => {
      // Append the "survey" field to the object before returning it
      const firstItem = result.item_list[0];
      firstItem.survey = param.id;
      return firstItem;
    });
  });
  return Promise.all(promises);
}

nodeCron.schedule(
  CRONEX,
  async () => {
    try {
      console.log("------EXECUTION OF CRONJOB SCRAPER--------");
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
        .then(async () => {
          const response = await axiosInstance.post("/node/save_scrape_result",{data:results});
          if(response.data.status)
            console.log("All tasks are done");
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    } catch (error) {
      console.log("ERRORE", error);
    }
  },
  {
    scheduled: true,
    timezone: "Europe/Rome",
  }
);
