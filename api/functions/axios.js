const Axios = require("axios")
const {LARAVEL_BACKEND} = require("./backend")

let axiosInstance = Axios.create({
    baseURL:LARAVEL_BACKEND,
})

module.exports = {axiosInstance}