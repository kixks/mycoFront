<template>
  <PageLayout>
    <div class="body-content">
      <div class="floating-alert" v-if="userType == 'Farmer'">
        <v-alert
          v-if="showAlert"
          :type="alertType"
          :title="alertTitle"
          class="custom-alert"
          closable
        >
          <template #prepend>
            <i :class="iconClass" class="mt-1" style="font-size: 20px; color: inherit"></i>
          </template>
          <template #close>
            <i
              class="pi pi-times mt-1 mr-2"
              style="cursor: pointer; font-size: 18px"
              @click.stop="showAlert = false"
            ></i>
          </template>
        </v-alert>
      </div>
      <v-container
        fluid
        class="d-flex flex-column align-center justify-center elevation-3 pa-10 w-75"
      >
        <div v-if="userType == 'Farmer'" class="table-wrapper">
          <div class="text-h3 ma-8 title text-center">Detected Symptomatic Chickens</div>
          <v-table height="400px" fixed-header class="w-90 ma-10 custom-table">
            <thead>
              <tr>
                <th class="text-left">TIMESTAMP</th>
                <th class="text-left">DETECTION ACCURACY</th>
                <th class="text-left">SNAPSHOTS</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in detectedArray"
                :key="index"
                @click="
                  () => {
                    selectedSnapshot = item.SnapshotUrl
                    showDialog = true
                  }
                "
                style="cursor: pointer"
              >
                <td>{{ formatDate(item.CreatedAt) }}</td>
                <td>{{ item.ConfidenceScore }}%</td>
                <td style="color: #cd5656; font-weight: bold">View</td>
              </tr>
            </tbody>
          </v-table>
        </div>
        <div v-else class="table-wrapper">
          <div class="text-h3 ma-8 title text-center">Farmers Overview</div>
          <v-table height="400px" fixed-header class="w-90 ma-10 custom-table">
            <thead>
              <tr>
                <th class="text-left">FULL NAME</th>
                <th class="text-left">ADDRESS</th>
                <th class="text-left"># SYMPTOMATIC DETECTED</th>
                <th class="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in AllUserArray" :key="user.Id">
                <td>{{ user.Name }}</td>
                <td>{{ user.Address }}</td>
                <td>
                  {{ symptomaticMap[user.Id] || 0 }}
                </td>
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

        <v-dialog v-model="showDialog" max-width="600">
          <v-card>
            <v-card-title class="font-weight-bold text-h5 pt-4">Snapshot Preview</v-card-title>
            <v-card-text>
              <img :src="selectedSnapshot" alt="Snapshot" style="width: 100%" />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" class="font-weight-bold text-h6" @click="showDialog = false"
                >CLOSE</v-btn
              >
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
import { ref, onMounted } from 'vue'
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

console.log('im the currentfarmerid', userId)

onMounted(async () => {
  getDetectedSymptomatic(userId)

  if (userType === 'Vet') {
    await farmerStore.getAllUser()
    AllUserArray.value = farmerStore.allUserArray.filter((u) => u.UserType === 'Farmer')
    await fetchSymptomaticCountsForAll()
  }
})

const fetchSymptomaticCountsForAll = async () => {
  const counts = {}

  const promises = AllUserArray.value.map(async (user) => {
    await farmerStore.fetchSymptomatic(user.Id)
    console.log('IM THE RESPONSE PER FARMER', farmerStore.detectedChickenArray)
    counts[user.Id] = farmerStore.detectedChickenArray?.length || 0
  })
  await Promise.all(promises)

  symptomaticMap.value = counts
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
</script>

<style scoped>
.body-content {
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center; /* horizontal centering */
  align-items: center; /* vertical centering */
  height: 100vh;
  background-color: #dae9e5;
}
.title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
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
.table-wrapper {
  width: 100%;
  overflow-x: hidden;
}

.custom-alert {
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
}
</style>
