<template>
  <PageLayout>
    <div class="body-content">
      <!-- Floating Alert -->
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

      <!-- Page Content -->
      <v-container>
        <!-- Title Row OUTSIDE the container -->
        <v-row class="px-10 py-4 mt-3">
          <v-col cols="12" class="text-h4 title">UPDATE CREDENTIALS</v-col>
        </v-row>

        <!-- Form Container -->
        <div class="form-wrapper">
          <v-container fluid class="elevation-3 rounded-xl pa-15 container-design">
            <v-form>
              <v-row>
                <v-col cols="6">
                  <span class="field-label">Name</span>
                  <v-text-field
                    v-model="name"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    required
                  />
                </v-col>

                <v-col cols="6">
                  <span class="field-label">Address</span>
                  <v-text-field
                    v-model="address"
                    variant="outlined"
                    clearable
                    density="comfortable"
                    required
                  />
                </v-col>

                <v-col cols="6">
                  <span class="field-label">Phone Number</span>
                  <v-text-field
                    v-model="phone"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    required
                  />
                </v-col>

                <v-col cols="6">
                  <span class="field-label">Email Address</span>
                  <v-text-field
                    v-model="email"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    required
                  />
                </v-col>

                <v-divider class="my-5"></v-divider>

                <v-col cols="6">
                  <span class="field-label">Reset Password</span>
                  <v-text-field
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    :append-inner-icon="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    :error-messages="passwordError"
                  />
                </v-col>

                <v-col cols="6">
                  <span class="field-label">Confirm Password</span>
                  <v-text-field
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    :append-inner-icon="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                    :error-messages="passwordError"
                  />
                </v-col>
              </v-row>
              <div class="py-5 mt-10">
                <v-btn width="100%" color="#169976" size="large" @click="updateSettings">
                  Update
                </v-btn>
              </div>
            </v-form>
          </v-container>
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
  if (!name.value.trim() || !email.value.trim() || !address.value.trim() || !phone.value.trim()) {
    alertType.value = 'error'
    alertTitle.value = 'Name, Email, Address, and Phone Number are required.'
    showAlert.value = true
    return
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    alertType.value = 'error'
    alertTitle.value = 'Please enter a valid email address.'
    showAlert.value = true
    return
  }

  // Phone number validation
  if (phone.value.length < 11) {
    alertType.value = 'error'
    alertTitle.value = 'Phone number must be at least 11 digits.'
    showAlert.value = true
    return
  }

  // Optional password validation
  const isPasswordProvided =
    password.value.trim().length > 0 || confirmPassword.value.trim().length > 0

  if (isPasswordProvided) {
    if (password.value.length < 6) {
      passwordError.value = 'Password must be at least 6 characters.'
      alertType.value = 'error'
      alertTitle.value = 'Password must be at least 6 characters.'
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
  }

  passwordError.value = ''

  const payload = {
    id: userId.value,
    name: name.value,
    email: email.value,
    address: address.value,
    mobileNumber: phone.value,
    password: isPasswordProvided ? password.value : null,
  }

  try {
    await farmerStore.updateUser(payload)
    await farmerStore.getCurrentUser(userId.value)
    alertType.value = 'success'
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
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
}
.title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
}
.floating-alert {
  position: fixed;
  top: 10px;
  left: 55%;
  transform: translateX(-50%);
  z-index: 9999;
  width: fit-content;
}
.field-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 4px;
  display: inline-block;
}
.custom-alert {
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
}
.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  padding: 2rem;
  overflow-y: auto;
}
.container-design {
  width: 85%;
}
</style>
