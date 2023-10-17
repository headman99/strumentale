const postProcessors = require("./utils")
const rateRetrievers = require("./rateRetrievers")
const shipmentRetrievers = require("./shipmentRetrievers")


// Pages to be scraped
const pages = [
    {
        id: '001',
        url: 'https://www.strumentimusicali.net',
        siteName: 'strumentimusicali',
        rateRetriever: rateRetrievers.retrieveFigurativeRate,
        shipmentRetriever: shipmentRetrievers.strumentimusicali,
        postProcess: postProcessors.cleanPrice,
        selectors: {
            searchBar: '#desktopSearch',
            productsList: 'html',
            product: '.productListing-even',
            productContent: '.productListing-even',
            image: 'img',
            name: '.listing_prod_name',
            description:
                'td:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)',
            url: '.pdlist',
            price: '.d-block.fontSize14.marginBottom5.bold',
            discountedPrice: '.productSpecialPrice.bold'
        }
    },
    {
        id: '002',
        url: 'https://www.gear4music.it/it',
        siteName: 'gear4music',
        postProcess: postProcessors.changeFormat,
        selectors: {
            searchBar: '#srch-str',
            productsList: '.result-list.instant-search-result-list',
            product: '.restricted-inv-notice-row',
            productContent: '.restricted-inv-notice-row',
            image: 'a > span > img',
            name: 'h3',
            description: '.description',
            url: '.list-row-container',
            price: 'div:nth-child(2) > span:nth-child(1) > span:nth-child(1)'
        }
    },
    {
        id: '003',
        url: 'https://www.thomann.de/it/index.html',
        siteName: 'thomann',
        rateRetriever: rateRetrievers.retrieveStartsFiller,
        postProcess: postProcessors.changeFormat,
        selectors: {
            searchBar: '#fsearch-sw',
            productsList: '.product-listings',
            product: '.fx-product-list-entry',
            productContent: '.product',
            image: 'img',
            name: 'div:nth-child(1) > a:nth-child(2) > div:nth-child(1) > div:nth-child(1)',
            description:
                'div:nth-child(1) > a:nth-child(2) > div:nth-child(1) > div:nth-child(3)',
            url: '.product__content',
            price: '.fx-typography-price-primary.fx-price-group__primary.product__price-primary'
        }
    },
    {
        id: '004',
        url: 'https://www.mercatinomusicale.com',
        siteName: 'mercatinomusicale',
        shipmentRetriever: shipmentRetrievers.mercatinomusicale,
        postProcess: postProcessors.changeFormat,
        selectors: {
            searchBar: '#hdr_searchfield_text_inner > input',
            productsList: '#search_list',
            product: '.item.pro, .item.pri',
            productContent: '.item.pro, .item.pri',
            image: 'img',
            name: 'div:nth-child(2) > h3:nth-child(1)',
            description: 'div:nth-child(2) > p:nth-child(3)',
            url: 'a',
            price: '.prz'
        }
    },
    {
        id: '005',
        url: 'https://reverb.com',
        siteName: 'reverb',
        shipmentRetriever: shipmentRetrievers.reverb,
        postProcess: postProcessors.changeFormat,
        selectors: {
            searchBar: '.site-search__controls__input',
            productsList: 'ol',
            product: 'li',
            productContent: '.rc-listing-card__inner',
            image: 'img',
            name: '.rc-listing-card__header a',
            url: '.rc-listing-card__header a',
            price: '.rc-price-block__price'
        }
    },
    {
        id: '006',
        url: 'https://www.ebay.it',
        siteName: 'ebay',
        rateRetriever: rateRetrievers.retrievePercentageRate,
        shipmentRetriever: shipmentRetrievers.ebay,
        postProcess: postProcessors.cleanRange,
        selectors: {
            searchBar: '#gh-ac',
            productsList: '.srp-results.srp-list.clearfix',
            product: '.s-item.s-item__pl-on-bottom',
            productContent: '.s-item__wrapper.clearfix',
            image: 'img',
            name: '[role=heading]',
            url: '.s-item__link',
            price: '.s-item__price',
            discountedPrice: 'span'
        }
    },
    {
        id: '007',
        url: 'https://www.bellusmusic.com',
        siteName: 'bellusmusic',
        postProcess: postProcessors.changeFormat,
        selectors: {
            searchBar: '#words',
            productsList: '#products',
            product: 'li[data-hook|="products_list_item"]',
            productContent: 'li[data-hook|="products_list_item"]',
            image: 'img',
            name: '.product-name',
            description:
                'div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(3) > span:nth-child(1)',
            url: '.product-name',
            price: '.product-price.price.selling'
        }
    },
    {
        id: '008',
        url: 'https://www.musicalbox.com',
        siteName: 'musicalbox',
        postProcess: postProcessors.changeFormat,
        selectors: {
            searchBar: '.ui-autocomplete-input',
            productsList: '.df-results',
            product: '.df-card',
            productContent: '.df-card__main',
            image: 'img',
            name: '.df-card__title',
            url: '.df-card__main',
            price: '.df-card__price '
        }
    },
    {
        id: '009',
        url: 'https://piazzostrumenti.it',
        siteName: 'piazzostrumenti',
        shipmentRetriever: shipmentRetrievers.piazzostrumenti,
        postProcess: postProcessors.changeFormat,
        selectors: {
            searchBar: '#search_query_top',
            productsList: '.product_list',
            product: '.product-container',
            productContent: '.product-container',
            image: '.img-responsive',
            name: '.name',
            url: '.product-name',
            price: '.price.product-price '
        }
    },
    {
        id: '010',
        url: 'https://shop.scavino.it',
        siteName: 'scavino',
        postProcess: postProcessors.changeFormat,
        imageDatabaseUrl:'https://shop.scavino.it/',
        selectors: {
            searchBar: '.txt_search',
            productsList: '.listProduct',
            product: '.resultBox.prod',
            productContent: '.resultBox.prod',
            image: 'img',
            name: '.title',
            description: '.description',
            url: 'a:not(.imageLink)',
            price: '.mainPriceAmount'
        }
    },
    {
        id: '011',
        url: 'https://www.seicordeshop.it',
        siteName: 'seicordeshop',
        postProcess: postProcessors.changeFormat,
        selectors: {
            searchBar: '.ui-autocomplete-input',
            productsList: '#js-product-list',
            product: '.product-miniature.js-product-miniature',
            productContent: '.product-miniature.js-product-miniature',
            image: 'img',
            name: '.h3.product-title',
            url: '.thumbnail.product-thumbnail',
            price: '.price'
        }
    },
    {
        id: '012',
        url: 'https://www.440hz.it/en',
        siteName: '440hz',
        postProcess: postProcessors.cleanPrice,
        selectors: {
            searchBar: '.search-input',
            productsList: '.products',
            product: 'article',
            productContent: 'article',
            image: 'img',
            name: 'h3',
            url: '.rc--lazyload',
            price: '.discounted-price',
            discountedPrice: '.standard-price'
        }
    }
]

module.exports = pages