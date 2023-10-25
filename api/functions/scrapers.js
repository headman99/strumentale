const pt = require("puppeteer-extra");
const pages = require("../functions/pages");
const utils = require("../functions/utils");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

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
  pt.use(StealthPlugin())

  pt.use(AdblockerPlugin({ blockTrackers: true }))

  // Create an instance of the browser
  const browser = await pt.launch({
    headless: 'new',
    defaultViewport: null,
    timeout:0,
    args: ["--no-sandbox",'--disable-setuid-sandbox'],
  });

  
//**Slower version but more server friendly. It open sequential blocks of at most 4 tabs each per request  */
  /*function splitArrayIntoGroups(arr, groupSize) {
    return arr.reduce((result, element, index) => {
      if (index % groupSize === 0) {
        result.push(arr.slice(index, index + groupSize));
      }
      return result;
    }, []);
  }

  const groupOfPages = splitArrayIntoGroups(pages, 4);
  
  async function processGroup(pages) {
    const scrapePromises = pages.map(async (page) => await scrapePage(browser, instrument, page, timeout));
    return Promise.all(scrapePromises);
  }
  const allGroupPromises = [];
  
  for (const group of groupOfPages) {
    const groupPromise = await processGroup(group)
    allGroupPromises.push(...groupPromise);
  }
*/

  
  //GET PAGES WITH HEADLESS TO TRUE

  const scrapePromises = pages.map(
    async (page) => await scrapePage(browser, instrument, page, timeout)
  );

  // Return the promise of resolving all the promises
  return new Promise((resolve, reject) => {
    Promise.all(
      scrapePromises
      //allGroupPromises
      )
      .then((promisesData) => {
       console.log("prmisesData=", promisesData)
        let data = { item_list: [] };

        // Merge the data from each promise
        for (const pageData of promisesData) {
          data.item_list = data.item_list.concat(pageData?.item_list);
        }

        // All scraping tasks have completed
        utils.sortRelevance(instrument, data);
        utils.cleanOutliers(data);

        // APPLY GENERAL FILTERS AS POSTPROCESSING
        if (filters && filters!=='undefined') {
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
        }

        resolve(data);
      })
      .catch((error) => {
        // Handle any errors that occurred during scraping
        console.error("Error during scraping:", error);
        reject(error);
      })
      .finally(async () => {
        browser.close();
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
  await driver.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36');
  if(timeout)
    driver.setDefaultNavigationTimeout(timeout*1000);
  try {
    //await driver.setCacheEnabled(false);
    await driver.setViewport({ width: 1000, height: 800 });
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
      waitUntil: ['domcontentloaded']
    });
    await driver.waitForTimeout(250)  // Delay to avoid problems when typing

    await input.type(instrument);
    await input.press("Enter");

    // GET RESULTS LIST
    await driver.waitForTimeout(1000) // Delay to force at least one second to load the products list
    const list = await driver.waitForSelector(page.selectors.productsList, {
      waitUntil: ["domcontentloaded"],
      timeout: ELEMENT_LOAD_TIMEOUT,
    });

    // WAIT FOR AT LEAST ONE ELEMENT OF THE THE LIST TO BE LOADED
    await list.waitForSelector(page.selectors.product, {
      timeout: ELEMENT_LOAD_TIMEOUT
    })

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
