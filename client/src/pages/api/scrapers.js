import { By, until, Key } from 'selenium-webdriver'
import puppeteer from 'puppeteer'

const ITEMS_PER_SITE = 5
const ELEMENT_LOAD_TIMEOUT = 5000 // miliseconds

/**
 * General scraping process
 * @param {*} driver
 * @param {*} req
 * @param {Array} page.selectors - CSS selectors for the DOM elements to be used
 * @param {Array} data - data to be returned
 */
/*export async function scrapePage(driver, req, page, data) {
    try {
        // RETRIEVE SEARCHBAR
        const input = driver.findElement(By.css(page.selectors.searchBar))
        await input.sendKeys(
            decodeURIComponent(req.query.instrument),
            Key.RETURN
        )
        

        // APPLY POSSIBLE SPECIFIC FILTERS IF ACTIVATED
        const filtersConfig = JSON.parse(req.query.filters)
        for (let filter in filtersConfig) {
            if (filtersConfig[filter].activated && page.filters[filter]) {
                console.log('Specific filter found, applying...')
                await page.filters[filter](
                    driver,
                    filtersConfig[filter].parameters,
                    page.filterSelectors[filter]
                )
            } else {
                console.log(
                    'There is no specific filter defined for this page or the filter is desactivated'
                )
            }
        }


        // GET RESULTS LIST
        await driver.wait(
            until.elementLocated(By.css(page.selectors.productsList)),
            ELEMENT_LOAD_TIMEOUT
        ) // Wait for element to be loaded
        const list = await driver.findElement(
            By.css(page.selectors.productsList)
        ) // Get the element
        await driver.wait(
            until.elementIsVisible(list),
            ELEMENT_LOAD_TIMEOUT
        ) // Wait for the element to become visible

        // GET ITEMS FROM LIST
        let items = await list.findElements(By.css(page.selectors.product))
        items = items.slice(0, ITEMS_PER_SITE)
        
        
        // GET DATA ITERATING OVER ITEMS
        for (const item of items) {
            let item_data = {}
            try {
                // Wait for items to be loaded
                await driver.wait(
                    until.elementLocated(By.css(page.selectors.productContent)),
                    ELEMENT_LOAD_TIMEOUT
                )
                await driver.executeScript(
                    'arguments[0].scrollIntoView()',
                    item
                )

                // DATA FROM ITEM
                item_data.img = await item
                    .findElement(By.css(page.selectors.image))
                    .getAttribute('src')
                item_data.name = await item
                    .findElement(By.css(page.selectors.name))
                    .getText()
                item_data.url = await item
                    .findElement(By.css(page.selectors.url))
                    .getAttribute('href')
                if (page.rateRetriever) {
                    item_data.rate = await page.rateRetriever(item)
                }
                if (page.shipmentRetriever) {
                    item_data.freeShipment = await page.shipmentRetriever(item)
                }

                // RETRIEVE DESCRIPTION (If there is an error, it might be difficult to retrieve the description)
                try {
                    item_data.description = page.selectors.description
                        ? await item
                              .findElement(By.css(page.selectors.description))
                              .getText()
                        : ''
                } catch (error) {
                    console.log(
                        'ATTRIBUTE ERROR: Impossible to retrieve description'
                    )
                }

                // RETRIEVE PRICE (If there is en error, might happend the price is discounted)
                try {
                    item_data.price = await item
                        .findElement(By.css(page.selectors.price))
                        .getText()
                } catch (error) {
                    item_data.price = await item
                        .findElement(By.css(page.selectors.discountedPrice))
                        .getText()
                } finally {
                    // In any case, postprocess the price.
                    item_data.price = page.postProcess(item_data.price)
                }

                // If one of the fields is empty, skip item. (Exception will be catch)
                if (
                    item_data.name == '' ||
                    item_data.price == null ||
                    item_data.url == ''
                ) {
                    throw new Error('Field not found')
                }
                // TODO: DEBUGGING (Show item_data)
                //console.log(item_data);
                item_data.siteName = page.siteName
                data.item_list.push(item_data)
            } catch (error) {
                // PER-ITEM EXCEPTION CONTROL (Skip item)
                console.log('PER-ITEM ERROR: ' + error)
            }
        }
    } catch (error) {
        // EXTERNAL EXCEPTION CONTROL (Error with the page. Skip it.)
        console.log('GENERAL ERROR: ' + error)
    }
}*/

export async function scrape(driver, req, page, data) {
    try {
        // RETRIEVE SEARCHBAR
        const input = await driver.waitForSelector(page.selectors.searchBar, ELEMENT_LOAD_TIMEOUT)
        await input.type(decodeURIComponent(req.query.instrument))
        await input.press('Enter')

        // GET RESULTS LIST
        const list = await driver.waitForSelector(
            page.selectors.productsList,
            {
                waitUntil: 'load',
                timeout: ELEMENT_LOAD_TIMEOUT
            }
        ) // Wait for element to be loaded

        // GET ITEMS FROM LIST
        let items = await list.$$(page.selectors.product)
        items = items.slice(0, ITEMS_PER_SITE)
        
        // GET DATA ITERATING OVER ITEMS
        for (const item of items) {
            let item_data = {}
            try {
                // Wait for items to be loaded
                await driver.waitForSelector(
                    page.selectors.productContent,
                    {timeout: ELEMENT_LOAD_TIMEOUT}
                )
                await driver.evaluate((el) => {
                    return el.scrollIntoView();
                }, item);

                // DATA FROM ITEM
          

                item_data.name = await item.$eval(page.selectors.name, name => {
                    return name.innerText;
                });

                item_data.url = await item.$eval(page.selectors.url, url => {
                    return url.getAttribute('href');
                });

                if(!(item_data?.url.includes(page?.url)))
                    item_data.url = `${page?.url}${item_data.url}`;
                if (page.rateRetriever) {
                    item_data.rate = await page.rateRetriever(item)
                }
                if (page.shipmentRetriever) {
                    item_data.freeShipment = await page.shipmentRetriever(item)
                }

                // RETRIEVE DESCRIPTION (If there is an error, it might be difficult to retrieve the description)
                try {
                    if (page.selectors.description) {
                        item_data.description = await item.$eval(page.selectors.description, desc => {
                            return desc.innerText;
                        });
                    } else {
                        item_data.description = ''
                    }
                } catch (error) {
                    console.log(
                        'ATTRIBUTE ERROR: Impossible to retrieve description'
                    )
                }

                // RETRIEVE PRICE (If there is en error, might happend the price is discounted)
                try {
                    item_data.price = await item.$eval(page.selectors.price, price => {
                        return price.innerText;
                    });
                } catch (error) {
                    item_data.price = await item.$eval(page.selectors.discountedPrice, price => {
                        return price.innerText;
                    });
                } finally {
                    // In any case, postprocess the price.
                    item_data.price = page.postProcess(item_data.price)
                }

                // If one of the fields is empty, skip item. (Exception will be catch)
                if (
                    item_data.name == '' ||
                    item_data.price == null ||
                    item_data.url == ''
                ) {
                    throw new Error('Field not found')
                }

                item_data.img = await item.$eval(page.selectors.image, image => {
                    return image.getAttribute('src');
                });

                if(page?.imageDatabaseUrl)
                    item_data.img = `${page.imageDatabaseUrl}${item_data.img}`
                // TODO: DEBUGGING (Show item_data)
                //console.log(item_data);
                item_data.siteName = page.siteName
                data.item_list.push(item_data)
            } catch (error) {
                // PER-ITEM EXCEPTION CONTROL (Skip item)
                console.log('PER-ITEM ERROR: ' + error)
            }
        }
    } catch (error) {
        // EXTERNAL EXCEPTION CONTROL (Error with the page. Skip it.)
        console.log('GENERAL ERROR: ' + error)
    }
    await driver.close()
}