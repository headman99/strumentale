const SIGMA_FACTOR = 0.75 // MULTIPLY BY MEDIAN TO GET THE SIGMA FOR OUTLIERS FILTRING
const RELEVANCE_TH = 0.5

// ---------------------------------------------------------------------
//                            PRICE CLEANERS
// ---------------------------------------------------------------------
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
// ---------------------------------------------------------------------
//                            SCORE FUNCTION
// ---------------------------------------------------------------------
function relevance_score(query, document) {
    const query_vec = query.toLowerCase().split(' ')
    const doc_vec = document.toLowerCase().split(' ')

    // Initialize a 2D array to store the length of common subsequences
    const dp = Array(query_vec.length + 1)
        .fill(0)
        .map(() => Array(doc_vec.length + 1).fill(0))

    let maxLength = 0 // Length of the longest common subsequence

    // Build the DP table
    for (let i = 1; i <= query_vec.length; i++) {
        for (let j = 1; j <= doc_vec.length; j++) {
            if (query_vec[i - 1] === doc_vec[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1
                if (dp[i][j] > maxLength) {
                    maxLength = dp[i][j]
                }
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
            }
        }
    }

    const score = maxLength + 1 / (doc_vec.length - maxLength + 1)

    return score
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

    //const score = (maxLength - 1 > 0)? (LCS_IMPORTANCE**maxLength) / (document.length) : 0;
    const score = maxLength + 1 / (document.length - maxLength + 1)

    // TODO: DEBUGGING (Display score)
    //console.log("SCORE FUNCTION OF " + query + " AND " + document + ": " + score);
    //console.log("THE SCORE IS THE RESULT OF maxLength = " + maxLength + " AND document.length = " + document.length);

    // Rounding gives more importance to the price when comparing similar scores

    return parseFloat(score.toFixed(4))
}
/**
 *
 * @param {*} query
 * @param {*} data
 */

/*export function sortRelevance(query, data) {

  const filteredItems = data.item_list.filter(item => {
    const relevance = lcs_score(query, item.name);
    return relevance >= RELEVANCE_TH;
  });

  filteredItems.sort((a, b) => {
    // Compute relevance score for each item
    const a_relevance = relevance_score(query, a.name);
    const b_relevance = relevance_score(query, b.name);

        // TODO: DEBUGGING (Display scores)
        console.log("SCORE OF " + query + " AND " + a.name + ": " + a_relevance);
        console.log("SCORE OF " + query + " AND " + b.name + ": " + b_relevance);

    // Sort by relevance to the query, in case of draw sort by price
    if (a_relevance > b_relevance) {
        return -1;
    } else if (a_relevance < b_relevance) {
        return 1;
    } else {
        return a.price - b.price;
    }
  });

  data.item_list = filteredItems;
}*/

export function sortRelevance(query, data) {
    const items = data.item_list

    // Calculate relevance scores for all items
    const maxRelevanceScore = items.reduce((maxScore, item) => {
        const relevance = lcs_score(query, item.name)
        item.normalizedRelevance = relevance // Store normalized relevance
        return Math.max(maxScore, relevance)
    }, 0)

    // Normalize relevance scores and filter items based on the threshold
    const filteredAndSortedItems = items
        .filter(item => {
            item.normalizedRelevance /= maxRelevanceScore // Normalize relevance
            return item.normalizedRelevance >= RELEVANCE_TH
        })
        .sort((a, b) => {
            // TODO: DEBUGGING (Display scores)
            //console.log("SCORE OF " + query + " AND " + a.name + ": " + a.normalizedRelevance);
            //console.log("SCORE OF " + query + " AND " + b.name + ": " + b.normalizedRelevance);

            // Sort by normalized relevance, in case of draw sort by price
            if (a.normalizedRelevance > b.normalizedRelevance) {
                return -1
            } else if (a.normalizedRelevance < b.normalizedRelevance) {
                return 1
            } else {
                return a.price - b.price
            }
        })

    data.item_list = filteredAndSortedItems
}
// ---------------------------------------------------------------------
//                            MISC FUNCTIONS
// ---------------------------------------------------------------------
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

    //const median = compute_median(prices);
    const topPrice = prices[0]
    const sigma = parseFloat((SIGMA_FACTOR * topPrice).toFixed(2))

    data.item_list = data.item_list.filter(
        item => item.price < topPrice + sigma && item.price > topPrice - sigma
    )
}
/**
 * Sort items by price
 * @param {*} data
 * @returns
 */
export function sortPrice(data) {
    const dataCopy = Object.assign([], data)
    dataCopy.sort((a, b) => {
        return a.price - b.price
    })
    return dataCopy
}