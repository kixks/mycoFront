<template>
  <PageLayout>
    <div class="body-content">
      <!-- Title -->
      <div class="text-h4 title py-4">
        {{ userType === 'Farmer' ? 'CHAT WITH VETERINARIAN' : 'CHAT WITH FARMER' }}
      </div>

      <!-- Two-column layout -->
      <div class="chat-layout">
        <!-- Left Panel -->
        <div class="left-panel py-10 px-8 elevation-3 rounded-lg">
          <div class="text-subtitle mb-5">
            {{ userType === 'Farmer' ? 'Send Your Chicken Image' : 'Choose Farmer' }}
          </div>

          <v-select
            v-if="userType === 'Farmer'"
            v-model="selectedImage"
            :items="farmerStore.detectedChickenArray"
            item-value="snapshotUrl"
            item-title="id"
            label="Select Image"
            return-object
            append-inner-icon="pi pi-angle-down"
            variant="outlined"
          >
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                <template #title>
                  <div class="d-flex align-center justify-space-between w-100">
                    <span>Symptomatic {{ item.raw.ConfidenceScore }}</span>
                    <v-icon @click.stop.prevent="previewImage(item.raw.SnapshotUrl, true)"
                      >pi pi-eye</v-icon
                    >
                  </div>
                </template>
              </v-list-item>
            </template>
            <template #selection="{ item }">
              <span>{{ item?.Id }}</span>
            </template>
          </v-select>

          <v-select
            v-else
            v-model="selectedFarmer"
            :items="AllUserArray"
            item-title="Name"
            item-value="Name"
            label="Select Farmer"
            append-inner-icon="pi pi-angle-down"
            variant="outlined"
            return-object
            @update:modelValue="onFarmerSelected"
            class="light-green-select"
          />
        </div>

        <!-- Chat Container -->
        <v-container fluid class="chat-container elevation-3 rounded-xl pa-8">
          <div ref="chatBoxRef" class="chat-box">
            <div
              v-for="(msg, index) in chatStore.messages"
              :key="index"
              class="d-flex mb-2"
              :class="msg.User === chatStore.user ? 'justify-end' : 'justify-start'"
            >
              <v-card
                :color="msg.User === chatStore.user ? '#169976' : '#dae9e5'"
                class="pa-3 rounded-card"
                :max-width="$vuetify.display.smAndDown ? '100%' : '60%'"
                elevation="5"
              >
                <div v-if="msg.Text">{{ msg.Text }}</div>
                <v-img
                  v-if="msg.ImageUrl"
                  :src="msg.ImageUrl"
                  max-height="200"
                  min-width="100%"
                  contain
                  class="mt-2 chat-image"
                  style="cursor: pointer"
                  @click="previewImage(msg.ImageUrl)"
                />
                <div class="text-right timestamp mt-1">{{ formatTime(msg.Timestamp) }}</div>
              </v-card>
            </div>
          </div>

          <div class="chat-input">
            <v-row>
              <v-col cols="12" md="10">
                <v-textarea
                  v-model="newMessage"
                  rows="1"
                  auto-grow
                  hide-details
                  class="ma-0"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Type a message"
                  @keyup.enter.exact.prevent="handleSend"
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-btn color="#169976" size="large" block @click="handleSend">Send</v-btn>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </div>

      <!-- Dialog -->
      <v-dialog v-model="imageDialog" max-width="600">
        <v-card>
          <v-card-title class="font-weight-bold text-h5 pt-4">Snapshot Preview</v-card-title>
          <v-card-text>
            <img :src="previewedImage" alt="Snapshot" style="width: 100%" />
          </v-card-text>
          <v-card-actions class="d-flex justify-space-between">
            <v-btn color="primary" class="font-weight-bold text-h6" @click="imageDialog = false"
              >CLOSE</v-btn
            >
            <v-btn
              v-if="isFromDropdown"
              class="font-weight-bold text-h6"
              color="green darken-1"
              @click="sendImage"
            >
              SEND
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/PageLayout.vue'
import { onMounted, ref, onUnmounted } from 'vue'
import { useChatStore } from '@/stores/ChatStore'
import { useFarmerStore } from '@/stores/FarmerStore'
import { watch, nextTick } from 'vue'

const chatStore = useChatStore()
const farmerStore = useFarmerStore()

const newMessage = ref('')
const selectedImage = ref(null)
const chatBoxRef = ref(null)
const imageDialog = ref(false)
const previewedImage = ref('')
const isFromDropdown = ref(false)
const AllUserArray = ref([])
const selectedFarmer = ref(localStorage.getItem('sendMessageTo') || '')
const userType = JSON.parse(localStorage.getItem('user')).UserType

let sending = false

onMounted(async () => {
  const localUser = JSON.parse(localStorage.getItem('user'))
  chatStore.user = localUser
  const userType = localUser.UserType

  if (userType === 'Farmer') {
    chatStore.selectedRecipient = 'John'
    await chatStore.startConnection(localUser.Name, 'John')
    await farmerStore.fetchSymptomatic(localUser.Id)
  } else if (userType === 'Vet') {
    await farmerStore.getAllUser()
    AllUserArray.value = farmerStore.allUserArray.filter((u) => u.UserType === 'Farmer')

    // Automatically load chat if localStorage already has a farmer
    if (selectedFarmer.value) {
      chatStore.selectedRecipient = selectedFarmer.value
      await chatStore.startConnection(localUser.Name, selectedFarmer.value)
    }
  }
})
onUnmounted(() => {
  chatStore.cleanup()
})
watch(
  () => chatStore.messages,
  (newMessages, oldMessages) => {
    console.log('🟡 chatStore.messages changed!')
    console.log('🔹 New messages array:', newMessages)
    console.log('🔸 Old messages array:', oldMessages)
  },
  { deep: true },
)
watch(
  () => chatStore.messages.length,
  async () => {
    await nextTick()
    if (chatBoxRef.value) {
      chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
    }
  },
)
watch(selectedFarmer, (newVal) => {
  localStorage.setItem('sendMessageTo', newVal)
})

const onFarmerSelected = async (farmer) => {
  if (farmer && farmer.Name) {
    selectedFarmer.value = farmer.Name // update reactive value
    localStorage.setItem('sendMessageTo', farmer.Name) // persist in storage
    // Set the selected farmer as the current chat user
    const localUser = JSON.parse(localStorage.getItem('user'))
    chatStore.user = localUser

    // Fetch messages for selected farmer
    await chatStore.startConnection(localUser.Name, farmer.Name)
  }
}
const previewImage = (imagePath, fromDropdown = false) => {
  previewedImage.value = imagePath
  isFromDropdown.value = fromDropdown
  imageDialog.value = true
}
const sendImage = () => {
  if (sending) return
  sending = true

  chatStore.sendImage(previewedImage.value)

  imageDialog.value = false
  setTimeout(() => {
    sending = false
  }, 500)
}
const handleSend = () => {
  if (newMessage.value.trim()) {
    chatStore.sendMessage(newMessage.value.trim())
    newMessage.value = ''
  }
}
const formatTime = (timestamp) => {
  try {
    const date = new Date(timestamp)
    if (isNaN(date.getTime())) {
      return new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Manila',
      })
    }
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Manila',
    }
    return date.toLocaleTimeString('en-US', options)
  } catch (e) {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Manila',
    })
  }
}
</script>

<style scoped>
.body-content {
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding-top: 3rem;
  overflow: auto;
}

.title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  margin-bottom: 1rem;
}

.chat-layout {
  margin-top: 4rem;
  display: flex;
  gap: 2rem;
  width: 90%;
  justify-content: center;
}

.left-panel {
  width: 25%;
  min-width: 250px;
}

.chat-container {
  flex: 1;
  min-height: 500px;
  max-height: 700px;
  overflow-y: auto;
}

.chat-box {
  min-height: 400px;
  max-height: 450px;
  overflow-y: auto;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.chat-input {
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding-top: 20px;
  padding-bottom: 20px;
}

.chat-image {
  border-radius: 2px;
  object-fit: cover;
}

.rounded-card {
  padding: 1rem !important;
  border-radius: 25px;
  word-wrap: break-word;
  width: 30%;
}

.timestamp {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
}
@media (max-width: 768px) {
  .chat-layout {
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
  }

  .left-panel {
    width: 100%;
    padding: 1rem !important;
  }

  .chat-container {
    width: 100%;
    padding: 1rem !important;
    max-height: none;
    min-height: 400px;
  }

  .chat-box {
    max-height: 300px;
  }

  .rounded-card {
    width: 100% !important;
  }

  .chat-input {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
</style>
