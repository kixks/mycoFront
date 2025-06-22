<template>
  <PageLayout>
    <div class="body-content">
      <div class="floating-alert">
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
      <v-container fluid class="elevation-3 pa-15 ma-12 w-75">
        <div class="col">
          <div class="text-h4 title mb-4">Update Credentials</div>
          <v-divider class="my-5"></v-divider>
          <v-form>
            <v-row>
              <v-col cols="6" class="mb-4">
                <span class="field-label">Name</span>
                <v-text-field
                  v-model="name"
                  label="Enter name"
                  variant="solo-filled"
                  density="comfortable"
                  required
                />
              </v-col>

              <v-col cols="6" class="mb-4">
                <span class="field-label">Address</span>
                <v-text-field
                  v-model="address"
                  label="Enter address"
                  variant="solo-filled"
                  density="comfortable"
                  required
                />
              </v-col>

              <v-col cols="6" class="mb-4">
                <span class="field-label">Phone Number</span>
                <v-text-field
                  v-model="phone"
                  label="Enter number"
                  variant="solo-filled"
                  density="comfortable"
                  required
                />
              </v-col>

              <v-col cols="6" class="mb-4">
                <span class="field-label">Email Address</span>
                <v-text-field
                  v-model="email"
                  label="Enter email"
                  variant="solo-filled"
                  density="comfortable"
                  required
                />
              </v-col>

              <v-divider class="my-5"></v-divider>

              <v-col cols="6" class="mb-4">
                <span class="field-label">Reset Password</span>
                <v-text-field
                  v-model="password"
                  label="Enter password"
                  :type="showPassword ? 'text' : 'password'"
                  variant="solo-filled"
                  density="comfortable"
                  required
                  :append-inner-icon="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  :error-messages="passwordError"
                />
              </v-col>

              <v-col cols="6" class="mb-4">
                <span class="field-label">Confirm Password</span>
                <v-text-field
                  v-model="confirmPassword"
                  label="Enter password"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  variant="solo-filled"
                  density="comfortable"
                  required
                  :append-inner-icon="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  :error-messages="passwordError"
                />
              </v-col>
            </v-row>

            <v-row justify="center">
              <v-col cols="auto">
                <v-btn width="700px" color="#169976" size="large" @click="updateSettings">
                  Update
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </div>
      </v-container>
    </div>
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/PageLayout.vue'
import { onMounted, ref, watch, computed } from 'vue'
import { useFarmerStore } from '@/stores/FarmerStore'

const farmerStore = useFarmerStore()
const userId = ref(null)
const name = ref('')
const address = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const showAlert = ref(false)
const alertType = ref('success')
const alertTitle = ref('')

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

onMounted(async () => {
  const localUser = JSON.parse(localStorage.getItem('user'))
  console.log(localUser)
  if (localUser) {
    userId.value = localUser.Id
    name.value = localUser.Name || ''
    address.value = localUser.Address || ''
    phone.value = localUser.MobileNumber || ''
    email.value = localUser.Email || ''
  }
})
watch([password, confirmPassword], () => {
  if (password.value === confirmPassword.value) {
    passwordError.value = ''
  }
})

const updateSettings = async () => {
  if (
    !name.value.trim() ||
    !email.value.trim() ||
    !address.value.trim() ||
    !phone.value.trim() ||
    !password.value ||
    !confirmPassword.value
  ) {
    alertType.value = 'error'
    alertTitle.value = 'All fields are required.'
    showAlert.value = true
    return
  }

  // Email format validation (basic)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    alertType.value = 'error'
    alertTitle.value = 'Please enter a valid email address.'
    showAlert.value = true
    return
  }

  // Phone number validation (optional - you can adjust for your region)
  if (phone.value.length < 11) {
    alertType.value = 'error'
    alertTitle.value = 'Phone number must be at least 10 digits.'
    showAlert.value = true
    return
  }
  if (password.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match.'
    alertType.value = 'error'
    alertTitle.value = 'Passwords do not match.'
    showAlert.value = true
    return
  }
  if (password.value.length < 6) {
    alertType.value = 'error'
    alertTitle.value = 'Password must be at least 6 characters.'
    showAlert.value = true
    return
  }

  passwordError.value = ''

  const payload = {
    id: userId.value,
    name: name.value,
    email: email.value,
    address: address.value,
    mobileNumber: phone.value,
    password: password.value,
  }
  console.log(payload)
  try {
    await farmerStore.updateUser(payload)
    await farmerStore.getCurrentUser(userId.value)
    alertTitle.value = 'Credentials successfully updated!'
    showAlert.value = true
    setTimeout(() => location.reload(), 1500)
  } catch (error) {
    alertType.value = 'error'
    alertTitle.value = 'Failed to update. Please try again.'
    showAlert.value = true
    console.error(error)
  }
}
</script>

<style scoped>
.body-content {
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
.floating-alert {
  position: fixed;
  top: 10px;
  left: 55%;
  transform: translateX(-50%);
  z-index: 9999;
  width: fit-content;
}

.custom-alert {
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
}
</style>
