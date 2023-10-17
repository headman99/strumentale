/**
 * Clean the data, namely, remove non-desired characters from the price.
 * @param {*} data
 */
export function cleanPrice(price) {
    price = price.replace(/[^0-9.]/g, '') // Remove all non-numerical characters except dots

    return parseFloat(price) // Return the modified data
}

/**
 * Clean the data, namely, remove non-desired characters from the price.
 * @param {*} data
 */
export function changeFormat(price) {
    price = price.replace(/[^0-9,]/g, '') // Remove all non-numerical characters except commas
    price = price.replace(',', '.') // Replace , for . (5000,34 => 5000.34)

    return parseFloat(price) // Return parsed data
}

/**
 * Clean the data, namely, remove non-desired characters from the price.
 * @param {*} data
 */
export function cleanRange(price) {
    price = price.split('a')[0] // Remove the range separator and take only the first price
    price = price.replace(/[^0-9,]/g, '') // Remove all non-numerical characters except commans
    price = price.replace(',', '.') // Replace , for . (5000,34 => 5000.34)

    // Return the modified data
    return parseFloat(price)
}

/**
 * Clean the name of the instrument by lowercasing and removing special characters
 * The "cleaned name" is basically the string without spaces and lowercased, I.E:
 * Electric Guitar Yamaha => electricguitaryamaha
 * @param {*} str - name of the instrument that we want to clean
 * @returns the cleaned string
 */
function cleanName(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Compute the median of a list of values
 * @param {*} list - values on which the median will be computed
 * @returns the median of the list fixed to two decimals
 */
function compute_median(list) {
    // Sort prices
    list.sort((a, b) => a - b)

    let median = -1
    if (list.length % 2 === 1) {
        median = list[Math.floor(list.length / 2)]
    } else {
        median = (list[list.length / 2] + list[list.length / 2 - 1]) / 2
    }

    return parseFloat(median.toFixed(2))
}

/**
 * Remove the items from the list which have a distance of 0.6 from the median of the prices
 * @param {*} data - data to clean outliers
 */
export function cleanOutliers(data) {
    let prices = []

    // Retrieve prices
    data.item_list.map(entry => {
        prices.push(entry.price)
    })

    const median = compute_median(prices)
    const sigma = parseFloat((0.6 * median).toFixed(2))

    data.item_list = data.item_list.filter(
        item => item.price < median + sigma && item.price > median - sigma
    )
}

/**
 * Score the similarity of query and document strings by LCS (longest common substring)
 * The score is normalized by the length of the document.
 * @param {*} query - string representing the query
 * @param {*} document - string representing the document
 * @returns the score of similarity between query and document strings
 */
function lcs_score(query, document) {
    // Clean name of instruments
    query = cleanName(query)
    document = cleanName(document)

    // Initialize a 2D array to store the length of common substrings
    const dp = Array(query.length + 1)
        .fill(0)
        .map(() => Array(document.length + 1).fill(0))

    let maxLength = 0 // Length of the longest common substring

    // Build the DP table
    for (let i = 1; i <= query.length; i++) {
        for (let j = 1; j <= document.length; j++) {
            if (query[i - 1] === document[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1
                if (dp[i][j] > maxLength) {
                    maxLength = dp[i][j]
                }
            } else {
                dp[i][j] = 0
            }
        }
    }

    const K = 1.35 // Importance of the length (Exponential makes it more important the longer it is)
    const score = K ** maxLength / document.length

    // Rounding gives more importance to the price when comparing similar scores
    return score.toFixed(1)
}

export function sortRelevance(query, data) {
    data.item_list.sort((a, b) => {
        // Compute relevance score for each item
        const a_relevance = lcs_score(query, a.name)
        const b_relevance = lcs_score(query, b.name)

        // Sort by relevance to the query, in case of draw sort by price
        if (a_relevance > b_relevance) {
            return -1
        } else if (a_relevance < b_relevance) {
            return 1
        } else {
            return a.price - b.price
        }
    })
}
