import axios from 'axios'

const api = axios.create({
  baseURL: 'https://kingfish-wealthy-calf.ngrok-free.app/api',
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
})

export default {
  install: (app) => {
    app.config.globalProperties.$axios = axios
    app.config.globalProperties.$api = api
  },
}

export { axios, api }
