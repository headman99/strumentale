import axios from '../lib/axios'
import { ROUTES } from './routes'

//IN case we want to pass the token dinamically we must add this object as a parameter to every request
//const config = {headers:{'Authorization': 'Bearer ' + secureLocalStorage.getItem("token")}}

export async function ciao() {
    return axios.get(ROUTES.USER.CIAO /*config*/)
}

export async function save_survey(data) {
    return axios.post(ROUTES.USER.SAVE_SURVEY, data)
}

export async function get_survey(id) {
    const url = id ? ROUTES.USER.GET_SURVEY + `/${id}` : ROUTES.USER.GET_SURVEY
    return axios.get(url)
}

export async function delete_survey(data) {
    return axios.post(ROUTES.USER.DEL_SURVEY, data)
}

export async function update_survey(data) {
    return axios.post(ROUTES.USER.UPDATE_SURVEY, data)
}

export async function save_item(data) {
    return axios.post(ROUTES.USER.SAVE_ITEM, data)
}

export async function get_item(id) {
    const url = id ? ROUTES.USER.GET_ITEM + `/${id}` : ROUTES.USER.GET_ITEM
    return axios.get(url)
}

export async function delete_item(data) {
    return axios.post(ROUTES.USER.DEL_ITEM, data)
}

export async function save_result(data) {
    return axios.post(ROUTES.USER.SAVE_RESULT, data)
}

export async function get_result(data, id) {
    const url = id ? ROUTES.USER.GET_RESULT + `/${id}` : ROUTES.USER.GET_RESULT
    return axios.post(url, data)
}

export async function delete_result(data) {
    return axios.post(ROUTES.USER.DEL_RESULT, data)
}
