import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useRef, useState, useEffect } from 'react'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import TransitionAlerts from '@/components/TransitionAlerts'
import axios, { axiosInstance_node } from '../lib/axios'
import Link from 'next/link'
import secureLocalStorage from 'react-secure-storage'
import { useAuth } from '@/hooks/auth'
//import DashBar from '@/components/DashBar'

//import DashBar from '@/components/DashBar';

const DashBar = dynamic(() => import('@/components/DashBar'), { ssr: false })

const Dashboard = () => {
    const [data, setData] = useState({ item_list: [] })

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false) // Wether the data is loadingù
    const [transitionAlertOptions, setTransitionAlertOptions] = useState(null)
    const abortController = useRef(null)
    const { user, logout } = useAuth()

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
            const res = await axiosInstance_node.get(urlQuery, {
                timeout: 40 * 1000
            })
            setData(res.data)
            if (res.data) secureLocalStorage.setItem('data', res.data)
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
        revalidateOnReconnect: false,
        refreshInterval: 1 * 1000 * 60 //1 minuto
    })

    //Decide wheter to display data present in localstorage
    useEffect(() => {
        const secure_data = secureLocalStorage.getItem('data')
        if (secure_data) setData(secure_data)
    }, [])

    return (
        <AppLayout>
            <Link
                href="/login"
                style={{
                    color: 'white',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    margin: 30,
                    zIndex: 5
                }}
                onClick={e => {
                    if (user) {
                        e.preventDefault()
                        logout()
                    }
                }}
                className="ml-4 text-sm  underline">
                {!user ? 'Accedi' : 'Logout'}
            </Link>

            <div className="background-color">
                <div className="relative flex items-top justify-center  sm:items-center sm:pt-0">
                    <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block " />
                </div>
            </div>
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
                setError={setError}
            />
        </AppLayout>
    )
}

export default Dashboard
