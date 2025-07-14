<template>
  <PageLayout>
    <div class="body-content">
      <!-- Floating alert -->
      <div class="floating-alert" v-if="userType == 'Farmer'">
        <v-alert
          v-if="showAlert"
          :type="alertType"
          :title="alertTitle"
          class="custom-alert"
          closable
        >
          <template #prepend>
            <i :class="iconClass" class="mt-1" style="font-size: 20px; color: inherit" />
          </template>
          <template #close>
            <i
              class="pi pi-times mt-1 mr-2"
              style="cursor: pointer; font-size: 18px"
              @click.stop="showAlert = false"
            />
          </template>
        </v-alert>
      </div>

      <!-- Top Row (Total count + Chart) -->
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="5">
            <v-container class="rounded-xl elevation-3" style="height: 39vh">
              <h2 class="title text-center">TOTAL REPORTED NUMBER OF DETECTED CHICKENS</h2>
              <h1 v-if="userType === 'Farmer'" class="text-center detected-chicken-count">
                {{ filteredTotalCount }}
              </h1>

              <h1 v-else class="text-center detected-chicken-count">
                {{ totalCount }}
              </h1>
            </v-container>
          </v-col>

          <v-col cols="12" md="7" v-if="userType === 'Farmer'">
            <v-container class="rounded-xl elevation-3 pa-5">
              <div class="toolbar mb-3">
                <button
                  v-for="option in ['week', 'month', 'year']"
                  :key="option"
                  :class="{ active: selection === option }"
                  @click="updateData(option)"
                >
                  {{ option.toUpperCase() }}
                </button>

                <!-- Dropdown for year selection -->
                <select
                  v-if="selection === 'year'"
                  v-model="selectedYear"
                  @change="filterBySelectedYear"
                >
                  <option disabled value="">Select Year</option>
                  <option v-for="year in availableYears" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
              </div>
              <apexchart
                type="area"
                height="250"
                :options="chartOptions"
                :series="series"
                ref="chartRef"
            /></v-container>
            <div class="chart-section"></div>
          </v-col>
          <v-col cols="12" md="7" v-else>
            <v-container class="rounded-xl elevation-3 pa-5">
              <h2 class="title text-center">DETECTED SYMPTOMATIC CHICKEN PER USER</h2>
              <apexchart type="bar" height="250" :options="barChartOptions" :series="barSeries"
            /></v-container>
            <div class="chart-section"></div>
          </v-col>
        </v-row>
      </v-container>

      <!-- Table below chart -->
      <v-container fluid class="rounded-xl elevation-3 mt-4 table-wrapper">
        <div v-if="userType == 'Farmer'">
          <v-table height="400px" fixed-header class="custom-table">
            <thead>
              <tr>
                <th class="text-left">TIMESTAMP</th>
                <th class="text-left">DETECTION ACCURACY</th>
                <th class="text-left">SNAPSHOTS</th>
                <th class="text-left">CURRENT STATUS</th>
              </tr>
            </thead>
            <tbody v-if="filteredDetectedArray.length">
              <tr
                v-for="(item, index) in filteredDetectedArray"
                :key="index"
                style="cursor: default"
              >
                <td>{{ formatDate(item.CreatedAt) }}</td>
                <td>{{ item.ConfidenceScore }}%</td>
                <td
                  style="color: #cd5656; font-weight: bold; cursor: pointer"
                  @click.stop="
                    () => {
                      selectedSnapshot = item.SnapshotUrl
                      showDialog = true
                    }
                  "
                >
                  View
                </td>
                <td>
                  <select
                    v-model="item.Status"
                    @change="handleStatusChange(item)"
                    :class="['status-dropdown', statusColorClass(item.Status)]"
                  >
                    <option disabled value="">Set Status</option>
                    <option value="Unresolved">Unresolved</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Quarantine">Quarantine</option>
                  </select>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="3" class="text-center">No records found for {{ selectedYear }}</td>
              </tr>
            </tbody>
          </v-table>
        </div>

        <div v-else>
          <v-table height="400px" fixed-header class="custom-table">
            <thead>
              <tr>
                <th class="text-left">#</th>
                <th class="text-left">FULL NAME</th>
                <th class="text-left">ADDRESS</th>
                <th class="text-left">MOBILE NUMBER</th>
                <th class="text-left"># SYMPTOMATIC DETECTED</th>
                <th class="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in AllUserArray" :key="user.Id">
                <td>{{ index + 1 }}</td>
                <td>{{ user.Name }}</td>
                <td>{{ user.Address }}</td>
                <td>{{ user.MobileNumber }}</td>
                <td>{{ symptomaticMap[user.Id] || 0 }}</td>
                <td>
                  <span
                    style="color: #cd5656; font-weight: bold; cursor: pointer"
                    @click="handleSendMessage(user.Name)"
                  >
                    Message
                  </span>
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>

        <!-- Snapshot Dialog -->
        <v-dialog v-model="showDialog" max-width="600">
          <v-card>
            <v-card-title class="font-weight-bold text-h5 pt-4">Snapshot Preview</v-card-title>
            <v-card-text>
              <img :src="selectedSnapshot" alt="Snapshot" style="width: 100%" />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" class="font-weight-bold text-h6" @click="showDialog = false">
                CLOSE
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/PageLayout.vue'
import { useFarmerStore } from '@/stores/FarmerStore'
import { ref, onMounted, watch } from 'vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const farmerStore = useFarmerStore()
const router = useRouter()

const user = JSON.parse(localStorage.getItem('user'))
const userId = user.Id
const userType = user.UserType
const showAlert = ref(false)
const alertType = ref('success')
const alertTitle = ref('')

const showDialog = ref(false)
const selectedSnapshot = ref('')

const detectedArray = ref([])
const AllUserArray = ref([])
const symptomaticMap = ref({})
const totalCount = ref(0)

const chartRef = ref(null)
const selection = ref('one_year')

const selectedYear = ref('')
const availableYears = ref([])

console.log('im the currentfarmerid', userId)

onMounted(async () => {
  getDetectedSymptomatic(userId)

  if (userType === 'Vet') {
    await farmerStore.getAllUser()
    AllUserArray.value = farmerStore.allUserArray.filter((u) => u.UserType === 'Farmer')
    await fetchSymptomaticCountsForAll()
  }
  series.value[0].data = groupByDateCountWithZeros(detectedArray.value)

  setTimeout(() => {
    updateData('weak')
  }, 500)
})

watch(detectedArray, () => {
  const years = new Set(detectedArray.value.map((item) => new Date(item.CreatedAt).getFullYear()))
  availableYears.value = Array.from(years).sort((a, b) => b - a)
})

watch(detectedArray, () => {
  const groupedData = groupByDateCountWithZeros(detectedArray.value)
  series.value[0].data = groupedData
})
const fetchSymptomaticCountsForAll = async () => {
  const counts = {}

  // Fetch data for all farmers
  await Promise.all(
    AllUserArray.value.map(async (user) => {
      await farmerStore.fetchSymptomatic(user.Id)
      console.log('IM THE RESPONSE PER FARMER', farmerStore.detectedChickenArray)
      counts[user.Id] = farmerStore.detectedChickenArray?.length || 0
    }),
  )

  // Save to reactive state
  symptomaticMap.value = counts

  // ✅ Call chart builder to populate Apex bar chart
  buildBarChart()
}
const buildBarChart = () => {
  const labels = AllUserArray.value.map((user) => user.Name)
  const data = AllUserArray.value.map((user) => symptomaticMap.value[user.Id] || 0)

  console.log('IM THE LABELS', labels)
  console.log('IM THE DATA', data)

  barChartOptions.value.xaxis.categories = labels
  barSeries.value[0].data = data

  totalCount.value = data.reduce((sum, val) => sum + val, 0)
}
const filterBySelectedYear = () => {
  if (!selectedYear.value) return

  const fromDate = new Date(selectedYear.value, 0, 1)
  const toDate = new Date(selectedYear.value, 11, 31)

  const groupedData = groupByDateCountWithZeros(detectedArray.value, fromDate, toDate)
  series.value[0].data = groupedData

  const chart = chartRef.value?.chart
  if (chart) chart.zoomX(fromDate.getTime(), toDate.getTime())
}

const filteredDetectedArray = computed(() => {
  if (!selectedYear.value || selection.value !== 'year') {
    return detectedArray.value
  }

  return detectedArray.value.filter((item) => {
    const year = new Date(item.CreatedAt).getFullYear()
    return year === Number(selectedYear.value)
  })
})
const filteredTotalCount = computed(() => {
  if (userType === 'Farmer') {
    if (selection.value === 'year' && selectedYear.value) {
      return filteredDetectedArray.value.length
    }
    return detectedArray.value.length
  } else {
    return totalCount.value // for Vet, this is already handled
  }
})

const handleStatusChange = async (snapshotItem) => {
  try {
    await farmerStore.updateSnapshotStatus(snapshotItem.Id, snapshotItem.Status)
    alertTitle.value = `Status updated to ${snapshotItem.Status}`
    alertType.value = 'success'
    showAlert.value = true
  } catch (error) {
    alertTitle.value = 'Failed to update status'
    alertType.value = 'error'
    showAlert.value = true
  }
}

const getDetectedSymptomatic = async (userId) => {
  await farmerStore.fetchSymptomatic(userId)

  if (
    !Array.isArray(farmerStore.detectedChickenArray) ||
    farmerStore.detectedChickenArray.length < 1
  ) {
    alertType.value = 'success'
    alertTitle.value = 'Yay! 0 symptomatic detected!'
    showAlert.value = true
    return
  }
  detectedArray.value = farmerStore.detectedChickenArray
  console.log(detectedArray.value)
}

const statusColorClass = (status) => {
  switch (status) {
    case 'Unresolved':
      return 'status-unresolved'
    case 'Quarantine':
      return 'status-quarantine'
    case 'Healthy':
      return 'status-healthy'
    default:
      return ''
  }
}

const handleSendMessage = (recipientName) => {
  localStorage.setItem('sendMessageTo', recipientName)
  router.push('/messages')
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const iconClass = computed(() => {
  switch (alertType.value) {
    case 'success':
      return 'pi pi-check-circle'
    case 'error':
      return 'pi pi-exclamation-circle'
    default:
      return ''
  }
})
const groupByDateCountWithZeros = (arr, fromDate = null, toDate = null) => {
  if (!arr.length) return []

  // Normalize CreatedAt dates to just the day (midnight)
  const counts = new Map()
  arr.forEach((item) => {
    const date = new Date(item.CreatedAt)
    date.setHours(0, 0, 0, 0)
    const time = date.getTime()
    counts.set(time, (counts.get(time) || 0) + 1)
  })

  // Define date range
  const minDate =
    fromDate || new Date(Math.min(...arr.map((item) => new Date(item.CreatedAt).getTime())))
  const maxDate = toDate || new Date()
  minDate.setHours(0, 0, 0, 0)
  maxDate.setHours(0, 0, 0, 0)

  // Fill missing dates with 0
  const result = []
  const current = new Date(minDate)
  while (current <= maxDate) {
    const time = current.getTime()
    result.push([time, counts.get(time) || 0])
    current.setDate(current.getDate() + 1)
  }

  return result
}

const updateData = (range) => {
  selection.value = range
  const now = new Date()
  let fromDate

  switch (range) {
    case 'week':
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      break
    case 'year':
      fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      break
    default:
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }

  // Update series to show even 0-count days
  const groupedData = groupByDateCountWithZeros(detectedArray.value, fromDate, now)
  series.value[0].data = groupedData

  const chart = chartRef.value?.chart
  if (chart) chart.zoomX(fromDate.getTime(), now.getTime())
}

// Apex Chart Config
const series = ref([
  {
    data: [],
  },
])

const chartOptions = ref({
  colors: ['#169976'],
  chart: {
    id: 'area-datetime',
    type: 'area',
    height: 350,
    zoom: { autoScaleYaxis: true },
  },
  dataLabels: { enabled: false },
  markers: { size: 4, style: 'hollow' },
  xaxis: {
    type: 'datetime',
    labels: {
      format: 'dd MMM yyyy', // Show only the date
    },
    tickAmount: 6,
  },
  yaxis: {
    decimalsInFloat: 0, // Round off to whole numbers
    forceNiceScale: true,
    labels: {
      formatter: (val) => Math.floor(val), // Just in case float sneaks in
    },
  },
  tooltip: {
    x: { format: 'dd MMM yyyy' }, // Tooltip shows only date
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 100],
    },
  },
})

const barChartOptions = ref({
  colors: ['#169976'],

  chart: {
    type: 'bar',
    height: 350,
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      borderRadiusApplication: 'end',
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    title: {
      text: '# of Symptomatic Chickens',
    },
  },
  yaxis: {
    categories: [], // ✅ Correct for horizontal bar chart
  },
})

const barSeries = ref([
  {
    name: 'Symptomatic Count',
    data: [], // ← dynamically filled with counts
  },
])
</script>

<style scoped>
.body-content {
  font-family: 'Poppins', sans-serif;
  height: 100vh;
  padding: 2rem;
  overflow: auto;
}
.title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
}

.custom-table thead tr th {
  background-color: #169976 !important;
  color: white;
}
.custom-table tbody tr td {
  color: #096b68;
}
.custom-table tbody tr:hover {
  background-color: #e0f2f1;
}
.custom-table tbody tr td:hover {
  color: #a0d4d3;
}
.floating-alert {
  position: fixed;
  top: 10px;
  left: 57%;
  transform: translateX(-50%);
  z-index: 9999;
  width: fit-content;
}

.custom-alert {
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar button {
  padding: 6px 12px;
  background-color: #169976;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.toolbar button.active {
  background-color: #0f7a59;
}

.table-wrapper {
  margin-top: 40px;
}
.detected-chicken-count {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 10rem;
  padding-top: 1rem;
  color: #169976;
}
.toolbar select {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #169976;
  font-weight: bold;
  color: #169976;
  cursor: pointer;
}
.status-dropdown {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  font-weight: bold;
  color: #169976;
}
.status-unresolved {
  color: rgb(255, 81, 0);
  border-color: rgb(255, 81, 0);
}

.status-quarantine {
  color: #ffcc00; /* Yellow */
  border-color: #ffcc00;
}

.status-healthy {
  color: #169976;
  border-color: #169976;
}
@media (max-width: 600px) {
  .title {
    font-size: 1.2rem !important;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}
</style>
