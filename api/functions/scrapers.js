const pt = require("puppeteer");
const pages = require("../functions/pages");
const utils = require("../functions/utils");
const {
  generalPriceFilter,
  generalRateFilter,
  generalShippingFilter,
} = require("./filters");

const ITEMS_PER_SITE = 5;
const ELEMENT_LOAD_TIMEOUT = 8000; // miliseconds

const GENERAL_FILTERS = {
  price: generalPriceFilter,
  rate: generalRateFilter,
  shipment: generalShippingFilter,
};

async function scrapingFunction(instrument, filters,timeout) {

  /*OLD VERSION: 1 TAB FOR EACH PAGE IN THE SAME BROWSER*/
  // Create an instance of the browser
  /*const browser = await pt.launch({
    headless: "new",
    defaultViewport: null,
    args: ["--no-sandbox"],
  });

  // Array of promises
  const scrapePromises = pages.map(
    async (page) => await scrapePage(browser, instrument, page, timeout)
  );*/

  /*NEW VERSION:SPLITTED VERSION -> 3 BROWSER INSTANCES WITH 4 TABS EACH*/
  //Splitting function to split the pages array in groups of 4.
  function splitArrayIntoGroups(arr, groupSize) {
    return arr.reduce((result, element, index) => {
      if (index % groupSize === 0) {
        result.push(arr.slice(index, index + groupSize));
      }
      return result;
    }, []);
  }
  const scrapePromises = [];

  const groupOfPages = splitArrayIntoGroups(pages, 4);

  groupOfPages.forEach(async (group) => {
    // Create an instance of the browser
    
    const browser = await pt.launch({
      headless: "new",
      defaultViewport: null,
      args: ["--no-sandbox"],
    });

    const promises_group = group.map(
      async (page) => await scrapePage(browser, instrument, page, timeout)
    );

    await Promise.all(promises_group);

    await browser.close()
    groupOfPages.push(promises_group);
  });

  // Return the promise of resolving all the promises
  return new Promise((resolve, reject) => {
    Promise.all(scrapePromises)
      .then((promisesData) => {
       
        let data = { item_list: [] };

        // Merge the data from each promise
        for (const pageData of promisesData) {
          data.item_list = data.item_list.concat(pageData?.item_list);
        }

        // All scraping tasks have completed
        utils.sortRelevance(instrument, data);
        utils.cleanOutliers(data);

        // APPLY GENERAL FILTERS AS POSTPROCESSING
        /*if (filters && filters!=='undefined') {
          const filtersConfig = filters;
          for (let filter in filtersConfig) {
            if (filtersConfig[filter].activated) {
              //console.log(filtersConfig)
              data.item_list = GENERAL_FILTERS[filter](
                data.item_list,
                filtersConfig[filter].parameters
              );
            }
          }
        }*/

        resolve(data);
      })
      .catch((error) => {
        // Handle any errors that occurred during scraping
        console.error("Error during scraping:", error);
        reject(error);
      })
      .finally(async () => {
        //ENABLE IN THE OLD VERSION
        //browser.close();
      });
  });
}
/**
 * Function to scrape a single page
 * @param {*} page
 * @param {*} instrument
 * @param {*} data
 */
async function scrapePage(browser, instrument, page,timeout) {
  const driver = await browser.newPage();
  if(timeout)
    driver.setDefaultNavigationTimeout(timeout*1000);
  try {
    await driver.setViewport({ width: 1000, height: 500 });
    await driver.goto(page["url"], {waitUntil:'load'}); // Navigate to the page
    const data = await scrapeContent(driver, instrument, page);
    return data;
  } catch (err) {
    // Handle errors for this specific page
    console.log(`ERROR on ${page["url"]}: ${err}`);
  }
}
/**
 *
 * @param {*} driver
 * @param {*} instrument
 * @param {*} page
 * @param {*} data
 */
async function scrapeContent(driver, instrument, page) {
  let data = { item_list: [] };
  try {
    // RETRIEVE SEARCHBAR
    const input = await driver.waitForSelector(page.selectors.searchBar, {
      timeout: ELEMENT_LOAD_TIMEOUT,
    });

    await input.type(instrument);
    await input.press("Enter");

    // GET RESULTS LIST
    const list = await driver.waitForSelector(page.selectors.productsList, {
      waitUntil: "load",
      timeout: ELEMENT_LOAD_TIMEOUT,
    });

    // GET ITEMS FROM LIST
    let items = await list.$$(page.selectors.product);
    items = items.slice(0, ITEMS_PER_SITE);

    // Scroll to bottom of the page to make lazyload images load
    if (page.selectors.bottom) {
      const bottom = await driver.waitForSelector(page.selectors.bottom, {
        timeout: ELEMENT_LOAD_TIMEOUT,
      });
      await bottom.scrollIntoView();
    }

    // GET DATA ITERATING OVER ITEMS
    for (const item of items) {
      let item_data = {};
      try {
        // Wait for items to be loaded
        await driver.waitForSelector(page.selectors.productContent, {
          timeout: ELEMENT_LOAD_TIMEOUT,
        });
        await driver.evaluate((el) => {
          return el.scrollIntoView();
        }, item);

        // DATA FROM ITEM

        item_data.name = await item.$eval(page.selectors.name, (name) => {
          return name.innerText;
        });
        item_data.url = await item.$eval(page.selectors.url, (url) => {
          return url.getAttribute("href");
        });

        if (!item_data.url.includes("http"))
          item_data.url = `${page?.url}${
            !item_data?.url.startsWith("/") ? "/" : ""
          }${item_data?.url}`;

        if (page.rateRetriever) {
          item_data.rate = await page.rateRetriever(item);
        }
        if (page.shipmentRetriever) {
          item_data.freeShipment = await page.shipmentRetriever(item);
        }

        // RETRIEVE DESCRIPTION (If there is an error, it might be difficult to retrieve the description)
        try {
          if (page.selectors.description) {
            item_data.description = await item.$eval(
              page.selectors.description,
              (desc) => {
                return desc.innerText;
              }
            );
          } else {
            item_data.description = "";
          }
        } catch (error) {
          console.log("ATTRIBUTE ERROR: Impossible to retrieve description");
        }

        // RETRIEVE PRICE (If there is en error, might happend the price is discounted)
        try {
          item_data.price = await item.$eval(page.selectors.price, (price) => {
            return price.innerText;
          });
        } catch (error) {
          item_data.price = await item.$eval(
            page.selectors.discountedPrice,
            (price) => {
              return price.innerText;
            }
          );
        } finally {
          // In any case, postprocess the price.
          item_data.price = page.postProcess(item_data.price);
        }

        // If one of the fields is empty, skip item. (Exception will be catch)
        if (
          item_data.name == "" ||
          item_data.price == null ||
          item_data.url == ""
        ) {
          throw new Error("Field not found");
        }

        const img = await item.$eval(page.selectors.image, (image) => {
          return image.getAttribute("src");
        });

        item_data.img = page?.imageDatabaseUrl
          ? page.imageDatabaseUrl + img
          : img;

        item_data.siteName = page.siteName;

        data.item_list.push(item_data);
      } catch (error) {
        // PER-ITEM EXCEPTION CONTROL (Skip item)
        console.log("PER-ITEM ERROR: " + error);
      }
    }
  } catch (error) {
    // EXTERNAL EXCEPTION CONTROL (Error with the page. Skip it.)
    console.log("GENERAL ERROR: " + error);
  }
  await driver.close();
  return data;
}

module.exports = {
  scrapingFunction,
};
