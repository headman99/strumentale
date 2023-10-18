const router = require('express').Router()
const pt = require('puppeteer')
const { Builder, Browser, By, Key, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const utils = require('../functions/utils')
const { scrapingFunction } = require('../functions/scrapers')
const pages = require("../functions/pages")
const schedule = require('node-schedule');

const CRONEX = '*/30 * * * * *' // Every 30''

//TRIAL
router.get('/', async (req, res) => {
    res.status(200).json('questa è la pagina di scraping')
})

router.get('/scrape_pages', async (req, res) => {

    const instrument = req.query.instrument
    const filters = req.query.filters

    // TODO: Make the function return only the data and send a response from here
    process.setMaxListeners(20)
    scrapingFunction(instrument, filters)
    .then(data => {
        res.status(200).json(data?data:[])
    })
    .catch(error => {
        console.log(error)
    })
})

router.get('/scheduleCrawler', async (req, res) => {

    const instrument = req.query.instrument
    const filters = req.query.filters
    
    // TODO: Once the data is gotten, take the first element of the list
    try {
        schedule.scheduleJob(req.query.title, CRONEX, () => {
            scrapingFunction(instrument, filters)
            .then(data => {
                result = data.item_list[0]
                res.status(200)
            })
        })
        res.sendStatus(200)
    } catch {
        res.sendStatus(500)
    }
    
})

router.get('/cancelCrawler', async (req, res) => {

    try {
        schedule.cancelJob(req.query.title)
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

module.exports = router