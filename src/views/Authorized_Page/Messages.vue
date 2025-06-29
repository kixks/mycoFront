<template>
  <PageLayout>
    <div class="body-content">
      <v-container fluid class="elevation-3 pa-10 ma-12">
        <div class="col">
          <div class="text-h4 title" v-if="userType == 'Farmer'">Chat With Veterinarian</div>
          <div class="text-h4 title" v-else>Chat With Farmer</div>
          <v-divider class="my-2"></v-divider>
          <v-container>
            <v-row>
              <v-col cols="12" md="3" v-if="userType == 'Farmer'">
                <div class="text-subtitle">Detected Chickens</div>
                <v-select
                  v-model="selectedImage"
                  :items="farmerStore.detectedChickenArray"
                  item-value="snapshotUrl"
                  item-title="id"
                  label="Select Image"
                  return-object
                  variant="solo-filled"
                >
                  <!-- Customize dropdown items -->
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

                  <!-- Customize selected item display -->
                  <template #selection="{ item }">
                    <span>{{ item?.Id }}</span>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="3" v-else>
                <div class="text-subtitle">Choose Farmer</div>
                <v-select
                  v-model="selectedFarmer"
                  :items="AllUserArray"
                  item-title="Name"
                  item-value="Name"
                  label="Select Farmer"
                  variant="solo-filled"
                  return-object
                  @update:modelValue="onFarmerSelected"
                />
              </v-col>
              <!-- Hide vertical divider on mobile -->
              <v-divider vertical class="d-none d-md-block"></v-divider>
              <v-col cols="12" md="9">
                <div ref="chatBoxRef" class="chat-box">
                  <div
                    v-for="(msg, index) in chatStore.messages"
                    :key="index"
                    class="d-flex mb-2"
                    :class="msg.User === chatStore.user ? 'justify-end' : 'justify-start'"
                  >
                    <v-card
                      :color="msg.User === chatStore.user ? '#4CAF50' : '#90d1ca'"
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
                        placeholder="Type a message"
                        @keyup.enter.exact.prevent="handleSend"
                      />
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-btn color="#169976" size="large" block @click="handleSend">Send</v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-container>
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
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #dae9e5;
}
.title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}
.light-green-select :deep(.v-field) {
  background-color: #90d1ca !important;
}
.light-green-select :deep(.v-icon) {
  color: #c3ebe0 !important;
}
.chat-box {
  min-height: 400px;
  max-height: 450px;
  overflow-y: auto;
  background-color: #dae9e5;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.chat-input {
  position: sticky;
  bottom: 0;
  background-color: #dae9e5; /* match your bg color */
  z-index: 10;
  padding-top: 12px;
  padding-bottom: 12px;
}
.chat-image {
  border-radius: 8px;
  object-fit: cover;
}
.rounded-card {
  border-radius: 16px;
  word-wrap: break-word;
}
.timestamp {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
}

/* Optional: improve behavior on small screens */
@media (max-width: 600px) {
  .chat-box {
    min-height: 300px;
    padding: 8px;
  }
  .chat-input {
    margin-top: 200px;
    padding-left: 8px;
    padding-right: 8px;
  }
}
</style>
