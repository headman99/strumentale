import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useRef, useState } from 'react'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import TransitionAlerts from '@/components/TransitionAlerts'
import { useRouter } from 'next/router'
import axios, { axiosInstance_node } from '../lib/axios'


//import DashBar from '@/components/DashBar';

const DashBar = dynamic(() => import('@/components/DashBar'), { ssr: false })

const Dashboard = () => {
    const [data, setData] = useState({ item_list: [] })
    const dataRef = useRef(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false) // Wether the data is loadingù
    const [transitionAlertOptions, setTransitionAlertOptions] = useState(null)
    const abortController = useRef(null)


    /**
     * Fetcher of the application
     * @param {string} url - string containing the url to the webcrawler
     * @param {Object} query - query with the parameters for the search
     */
    const fetcher = async (url, query) => {
        // Turn the query entries into one string
        const query_str = Object.entries(query)
            .map(
                ([key, value]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join('&')

        // Join the url of the API with the query parameters (if there are)
        const urlQuery = query_str ? `${url}?${query_str}` : url

        // Fetch data
        try {
            let controller = new AbortController()
            abortController.current = controller
            const res = await axiosInstance_node.get(urlQuery)
            setData(res.data)
            dataRef.current = res.data
            setError(null)
        } catch (err) {
            setError(err)
            abortController.current.abort()
        } finally {
            abortController.current = null
        }

        // When finished, set IsLoading to false
        setIsLoading(false)
    }

    const fetchData = (searchParam, filters) => {
        // Set loading state to true
        setIsLoading(true)
        // Define the query object
        console.log(filters)
        const query = {
            instrument: searchParam,
            filters: filters ? JSON.stringify(filters) : filters
        }

        // Fetch data
        fetcher('/api/scraper/scrape_pages', query)
    }

    /**
     * Configure the fetcher with the SWR library
     */
    const { res, err } = useSWR('/api/scrape/scrape_pages', fetcher, {
        dedupingInterval: Infinity, // Keep last version of data always in caché
        refreshWhenOffline: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })   

    return (
        <AppLayout>
            <Head>
                <title>Strumentale</title>
            </Head>
            <TransitionAlerts
                options={transitionAlertOptions}
                style={{ position: 'absolute', padding: 2 }}
            />
            <DashBar
                isLoading={isLoading}
                data={data}
                fetchData={fetchData}
                error={error}
                transition_alert={setTransitionAlertOptions}
            />
        </AppLayout>
    )
}

export default Dashboard
