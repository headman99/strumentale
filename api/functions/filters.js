/**
 * Filters the given item list by the price parameters.
 * @param {*} itemList - list of items to be filtered
 * @param {*} parameters - parameters of the filter
 * @returns 
 */
export function generalPriceFilter(itemList, parameters) {
    const filteredList = itemList.filter(
        item =>
            item.price >= parameters.minPrice &&
            item.price <= parameters.maxPrice
    )
    return filteredList
}
/**
 * Filters the given item list by the rating parameters
 * @param {*} itemList - list of items to be filtered
 * @param {*} parameters - parameters of the filter
 * @returns 
 */
export function generalRateFilter(itemList, parameters) {
    if (parameters.threshold > 0) {
        const filteredList = itemList.filter(
            item => {
                if (item.rate) {
                    return item.rate >= parameters.threshold
                }
            }
        )
        return filteredList
    } else {
        return itemList
    }
    
}
/**
 * Filters the given item list by the shipping parameters
 * @param {*} itemList - list of items to be filtered
 * @param {*} parameters - parameters of the filter
 * @returns 
 */
export function generalShippingFilter(itemList, parameters) {
    const filteredList = itemList.filter(
        item => {
            if (item.freeShipment) {
                return item.freeShipment == parameters.freeShipment
            }
        }
    )
    return filteredList
}

module.exports = {
    generalPriceFilter,
    generalRateFilter,
    generalShippingFilter
}
