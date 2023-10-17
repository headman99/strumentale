import * as postProcessors from './utils.js'
import { scrape } from './scrapers.js'
import pages from './pages.js'
import * as filters from './filters'
import puppeteer from 'puppeteer'

const MAX_ITEMS = 10

const GENERAL_FILTERS = {
    price: filters.generalPriceFilter,
    rate: filters.generalRateFilter,
    shipment: filters.generalShippingFilter
}

/**
 * Scrape the pages imported from the "pages.js" file
 * @param {*} req
 * @param {*} res
 * @param {*} data
 */
async function scrape_pages(req, res) {
    // Response dictionary
    let data = { item_list: [] }

    const browser = await puppeteer.launch({headless: 'new'})
    // Array of promises
    const scrapePromises = pages.map(page => scrapePage(browser, page, req, data))

    // Execute all promises
    Promise.all(scrapePromises)
        .then(() => {
            // All scraping tasks have completed
            postProcessors.sortRelevance(
                decodeURIComponent(req.query.instrument),
                data
            )
            postProcessors.cleanOutliers(data)
            console.log(data)

            // APPLY GENERAL FILTERS AS POSTPROCESSING
            const filtersConfig = JSON.parse(req.query.filters)
            for (let filter in filtersConfig) {
                if (filtersConfig[filter].activated) {
                    //console.log(filtersConfig)
                    data.item_list = GENERAL_FILTERS[filter](
                        data.item_list,
                        filtersConfig[filter].parameters
                    )
                }
            }

            // Slice item list
            //data.item_list = data.item_list.slice(0, MAX_ITEMS);
        })
        .catch(error => {
            // Handle any errors that occurred during scraping
            console.error('Error during scraping:', error)
        })
        .finally(async () => {
            res.status(200).json(data)
            browser.close()
        })
}
/**
 * Function to scrape a single page
 * @param {*} page
 * @param {*} req
 * @param {*} data
 */
async function scrapePage(browser, page, req, data) {
    const driver = await browser.newPage()
    try {
        await driver.goto(page['url']) // Navigate to the page
        await scrape(driver, req, page, data) // Call the scraper for each page
    } catch (err) {
        // Handle errors for this specific page
        console.log(`ERROR on ${page['url']}: ${err}`)
    }
}
/**
 * Sync handler function that calls the async scraper
 * This is just a wrapper
 * @param {*} req
 * @param {*} res
 */
export default function handler(req, res) {
    scrape_pages(req, res)
}