import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axiosPlugin from './plugins/axios'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
app.component('apexchart', VueApexCharts)

app.use(axiosPlugin)
app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
