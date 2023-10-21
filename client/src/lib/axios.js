import { NODE_BACKEND } from '@/utils/backend'
import Axios from 'axios'
import secureLocalStorage from 'react-secure-storage'

const token = secureLocalStorage.getItem('token')
let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Credentials': 'True',
    Accept: 'application/json',
    'Cache-Control': 'private'
}

if (token) headers = { ...headers, Authorization: 'Bearer ' + token }

let axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: headers,
    withCredentials: true
})

export let axiosInstance_node = Axios.create({
    baseURL: NODE_BACKEND,
    headers: headers
})

axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token')
    config.headers['Authorization'] = `Bearer ${token}`

    return config
})

export default axios
