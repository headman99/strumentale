const { By, until, Key } = require('selenium-webdriver')

// ---------------------------------------------------------------------
//                            RATE RETRIEVERS
// ---------------------------------------------------------------------
/**
 *
 * @param {*} item
 * @returns
 */
async function retrieveFigurativeRate(item) {
    const stars = await item.$$(
        '.icon-star.star-full.icon-star-color-full'
    )
    const halfStars = await item.$$(
        '.icon-star.star-half.icon-star-color-half'
    )

    return parseFloat((stars.length + 0.5 * halfStars.length).toFixed(1))
}
/**
 *
 * @param {*} item
 * @returns
 */
async function retrieveStartsFiller(item) {
    try {

        const fill = await item.$eval('.fx-rating-stars__filler', el => {
            return el.getAttribute('style');
        });
        const regex = /width:\s+(\d+)%/
        const match = fill.match(regex)

        // Extracted percentage value as a string
        const percentageString = match[1]

        // Convert the percentage string to a number
        return parseFloat(((parseInt(percentageString, 10) / 100) * 5).toFixed(1))
    } catch (error) {
        console.log('The item got no rate.')
    }
}
/**
 *
 * @param {*} item
 * @returns
 */
async function retrievePercentageRate(item) {
    try {
        const fill = await item.$eval('.s-item__seller-info-text', el => {
            return el.innerText;
        });
        const regex = /(\d+(?:[,.]\d+)?)%/
        const match = fill.match(regex)

        // Extracted percentage value as a string
        const percentageString = match[1]

        // Convert the percentage string to a number
        return parseFloat(((parseInt(percentageString, 10) / 100) * 5).toFixed(1))
    } catch (error) {
        console.log('The item got no rate.')
    }
}

module.exports = {
    retrieveFigurativeRate,
    retrieveStartsFiller,
    retrievePercentageRate
}
