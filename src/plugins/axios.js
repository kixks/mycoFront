import axios from 'axios'

const api = axios.create({
  baseURL: 'https://localhost:7165/api',
})

export default {
  install: (app) => {
    app.config.globalProperties.$axios = axios
    app.config.globalProperties.$api = api
  },
}

export { axios, api }
