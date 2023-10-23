import React from 'react'
import { save_survey } from '@/lib/api'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Results from './Results'
import Accordion from 'react-bootstrap/Accordion'
import { FaAngleDown } from 'react-icons/fa'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaBalanceScaleLeft } from 'react-icons/fa'
import CompareTable from './CompareTable'
import { HiViewList } from 'react-icons/hi'
import { ToggleButton } from 'react-bootstrap'
import schedule from 'node-schedule'

const DashBar = ({
    fetchData,
    data,
    error,
    isLoading,
    transition_alert,
    abortController
}) => {
    const [searchParam, setSearchParam] = useState('')
    const [compareData, setCompareData] = useState([])
    const [switchView, setSwitchView] = useState(false)
    const [minMax, setMinMax] = useState({
        min: '',
        max: ''
    })
    const [rating, setRating] = useState('')
    const [freeShipping, setFreeShipping] = useState(false)
    const router = useRouter()

    function buildFilters() {
        return {
            price: {
                activated: minMax?.min && minMax?.max ? true : false,
                parameters: { minPrice: minMax?.min, maxPrice: minMax?.max }
            },
            rate: {
                activated: rating !== '' && rating !== undefined,
                parameters: { threshold: rating ? rating : '' }
            },
            shipment: {
                activated: freeShipping,
                parameters: { freeShipment: freeShipping }
            }
        }
    }

    useEffect(() => {
        // Check if there is query (means we came from /searches)
        if (router.query.q) {
            const { price, shipping, rating, q } = router.query

            setSearchParam(q)
            setMinMax({
                min: price ? price.split('-')[0] : '',
                max: price ? price.split('-')[1] : ''
            })
            setFreeShipping(shipping == 1)
            setRating(parseFloat(rating))
        }
    }, [router.asPath])

    const handleSearch = e => {
        e.preventDefault()
        if (!searchParam) return null
        const filters = buildFilters()
        fetchData(searchParam, filters)
    }

    const handleSave = () => {
        if (!searchParam) return null
        const filters = buildFilters()
        // Request format to take the data from the DB
        let request = {
            title: `${searchParam}`,
            text: searchParam,
            free_shipping_favorite: filters.shipment.parameters.freeShipment,
            rating_favorite: filters.rate.parameters.threshold
        }

        if (filters.price.activated)
            request = {
                ...request,
                price_range_favorite: `${filters.price.parameters.minPrice}-${filters.price.parameters.maxPrice}`
            }

        // Make request to the DB
        save_survey(request)
            .then(res => {
                if (res.status == 204) {
                    transition_alert({
                        severity: 'success',
                        title: 'Successo',
                        text: 'Ricerca salvata'
                    })
                }
            })
            .catch(err => {
                console.log(err.response.status)
                if (err?.response?.status == 401)
                    transition_alert({
                        severity: 'warning',
                        title: 'Errore',
                        text: 'Errore nel salvataggio della ricerca. Effettua il Login per continuare.'
                    })
                else
                    transition_alert({
                        severity: 'warning',
                        title: 'Errore',
                        text:
                            'Errore nel salvataggio della ricerca.' +
                            err?.response?.data?.exception
                    })
            })

        // Schedule the execution of the webcrawler based on the crono expresion defined
        // The first argument is the name used to identify the job
        // TODO: Instead of calling here the scheduling, I should make a request to my API asking for it to do it
        /*schedule.scheduleJob(`${searchParam}`, cronex, () => {
            fetchData(searchParam, filters)
        })*/
    }

    const handleKeyDown = event => {
        if (event.keyCode == 13) {
            event.preventDefault()
            handleSearch(event)
        }
    }

    const handleOnBlur = () => {
        let min = minMax?.min
        let max = minMax?.max

        if (max !== '' && min !== '' && min > max) max = min
        setMinMax({
            min: min ? parseInt(min) : min,
            max: max ? parseInt(max) : max
        })
    }

    const handleChangeShipping = value => {
        setFreeShipping(value)
    }

    /**
     * Transform and reshape the data array to display to a format that is affine to CompareTable component
     * @param {Object} data - data of items
     */
    function comparisonData(data) {
        if (data.item_list.length == 0) return data.item_list

        let reshapedData = []
        let setOfSitesName = [...new Set(data.item_list.map(e => e.siteName))]
        setOfSitesName.forEach(siteName => {
            const all = data.item_list.filter(el => el.siteName == siteName)
            if (all.length === 0) {
                return null // Return null if the array is empty
            }

            reshapedData.push(
                all.reduce(
                    (max, current) =>
                        current.normalizedRelevance > max.normalizedRelevance
                            ? current
                            : max,
                    all[0]
                )
            )
        })
        return reshapedData
    }

    useEffect(() => {
        setCompareData(comparisonData(data))
    }, [data])

    return (
        <div className="main_container">
            <div className="s009">
                <form>
                    <div className="inner-form">
                        <div className="basic-search">
                            <div className="input-field">
                                <input
                                    id="search"
                                    type="text"
                                    placeholder="Cosa stai cercando?"
                                    value={searchParam}
                                    onChange={e =>
                                        setSearchParam(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                />
                                <div className="icon-wrap">
                                    <svg
                                        className="svg-inline--fa fa-search fa-w-16"
                                        fill="#ccc"
                                        aria-hidden="true"
                                        data-prefix="fas"
                                        data-icon="search"
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512">
                                        <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <Accordion
                            suppressHydrationWarning
                            className="accordion">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header
                                    className="accordion header"
                                    style={{
                                        backgroundColor: '#fff',
                                        textAlign: 'center'
                                    }}>
                                    <button
                                        onClick={e => e.preventDefault()}
                                        style={{ color: '#555', padding: 5 }}>
                                        <FaAngleDown size={25} />
                                    </button>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="advance-search">
                                        <div style={{ textAlign: 'center' }}>
                                            <span className="desc">
                                                Ricerca Avanzata
                                            </span>
                                        </div>
                                        <div className="row">
                                            <div
                                                className="input-field"
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent:
                                                        'space-around'
                                                }}>
                                                <div className="input-select">
                                                    <input
                                                        className="number"
                                                        placeholder="Min"
                                                        type={'number'}
                                                        value={minMax?.min}
                                                        onChange={e =>
                                                            setMinMax({
                                                                ...minMax,
                                                                min: e.target
                                                                    .value
                                                            })
                                                        }
                                                        onBlur={handleOnBlur}
                                                        style={{
                                                            paddingLeft: 5
                                                        }}
                                                    />
                                                </div>
                                                <div className="input-select">
                                                    <input
                                                        className="number"
                                                        placeholder="Max"
                                                        type={'number'}
                                                        value={minMax?.max}
                                                        onChange={e =>
                                                            setMinMax({
                                                                ...minMax,
                                                                max: e.target
                                                                    .value
                                                            })
                                                        }
                                                        onBlur={handleOnBlur}
                                                        style={{
                                                            paddingLeft: 5
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-field">
                                                <div className="input-select">
                                                    <input
                                                        style={{ padding: 10 }}
                                                        className="number"
                                                        type={'number'}
                                                        max={5}
                                                        onBlur={() => {
                                                            let new_value =
                                                                rating < 5
                                                                    ? rating
                                                                    : 5
                                                            setRating(
                                                                Math.round(
                                                                    new_value *
                                                                        2
                                                                ) / 2
                                                            )
                                                        }}
                                                        placeholder="Recensione"
                                                        value={rating}
                                                        onChange={e => {
                                                            setRating(
                                                                e.target.value
                                                            )
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-field">
                                                <div className="input-select">
                                                    <Dropdown>
                                                        <Dropdown.Toggle
                                                            className="dropdown toggle btn-outline"
                                                            id="dropdown-basic">
                                                            {freeShipping
                                                                ? 'Spedizione gratuita'
                                                                : 'Spedizione'}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item
                                                                className="dropdown item"
                                                                href="#/action-2"
                                                                onClick={e =>
                                                                    handleChangeShipping(
                                                                        false
                                                                    )
                                                                }>
                                                                -
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                className="dropdown item"
                                                                onClick={e =>
                                                                    handleChangeShipping(
                                                                        true
                                                                    )
                                                                }
                                                                href="#/action-3">
                                                                Spedizione
                                                                gratuita
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        <div className="row third">
                            <div className="toggle-filter" />
                            <div className="result-count">
                                {data && (
                                    <div>{data.item_list.length} results</div>
                                )}
                            </div>
                            <div className="input-field">
                                <div className="group-btn">
                                    <button
                                        style={{
                                            marginLeft: 10,
                                            marginRight: 10
                                        }}
                                        className="btn-search"
                                        id="delete"
                                        disabled={isLoading}
                                        onClick={e => {
                                            e.preventDefault()
                                            handleSave()
                                        }}>
                                        Salva
                                    </button>
                                    <button
                                        disabled={
                                            isLoading ||
                                            searchParam?.length === 0 ||
                                            searchParam === ''
                                        }
                                        className="btn-search"
                                        onClick={e => handleSearch(e)}>
                                        Cerca
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="results_container">
                    <div className="button_container">
                        <ToggleButton
                            className="btn-outline"
                            type="button"
                            title="Modifica Ricerca"
                            checked={!switchView}
                            onClick={() => setSwitchView(false)}>
                            <HiViewList size={20} />
                        </ToggleButton>
                        <ToggleButton
                            className="btn-outline"
                            type="button"
                            title="Modifica Ricerca"
                            checked={switchView}
                            onClick={() => setSwitchView(true)}>
                            <FaBalanceScaleLeft size={20} />
                        </ToggleButton>
                    </div>
                    {!switchView ? (
                        <Results
                            data={data}
                            isLoading={isLoading}
                            error={error}
                            transition_alert={transition_alert}
                        />
                    ) : (
                        <CompareTable data={compareData} />
                    )}
                </div>
            </div>
            {/*<script src="js/extention/choices.js"></script>*/}
        </div>
    )
}

export default DashBar
