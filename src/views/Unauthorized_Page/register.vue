<template>
  <div class="landing-page">
    <div class="floating-alert">
      <v-alert v-if="showAlert" :type="alertType" :title="alertTitle" class="custom-alert" closable>
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
    <v-container fluid fill-height>
      <v-container class="login-card py-10 px-10" fluid>
        <div class="login-header text-center mb-4">
          <img src="@/assets/images/mainlogo.png" alt="Logo" class="login-logo" />
          <h5 class="login-title">REGISTER</h5>
        </div>

        <v-form>
          <v-row dense>
            <v-col cols="12" sm="6" class="px-4">
              <span class="field-label">Name</span>
              <v-text-field
                v-model="name"
                label="Enter name"
                variant="solo-filled"
                density="compact"
              />
            </v-col>

            <v-col cols="12" sm="6" class="px-4">
              <span class="field-label">Address</span>
              <v-text-field
                v-model="address"
                label="Enter address"
                variant="solo-filled"
                density="compact"
              />
            </v-col>

            <v-col cols="12" sm="6" class="px-4">
              <span class="field-label">Phone Number</span>
              <v-text-field
                v-model="phone"
                label="Enter number"
                variant="solo-filled"
                density="compact"
              />
            </v-col>

            <v-col cols="12" sm="6" class="px-4">
              <span class="field-label">Email Address</span>
              <v-text-field
                v-model="email"
                label="Enter email"
                variant="solo-filled"
                density="compact"
              />
            </v-col>

            <v-col cols="12">
              <v-divider class="my-4 px-4"></v-divider>
            </v-col>

            <v-col cols="12" sm="6 " class="px-4">
              <span class="field-label">Reset Password</span>
              <v-text-field
                v-model="password"
                label="Enter password"
                :type="showPassword ? 'text' : 'password'"
                variant="solo-filled"
                density="compact"
                :append-inner-icon="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                @click:append-inner="showPassword = !showPassword"
                :error-messages="passwordError"
              />
            </v-col>

            <v-col cols="12" sm="6" class="px-4">
              <span class="field-label">Confirm Password</span>
              <v-text-field
                v-model="confirmPassword"
                label="Enter password"
                :type="showConfirmPassword ? 'text' : 'password'"
                variant="solo-filled"
                density="compact"
                :append-inner-icon="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                :error-messages="passwordError"
              />
            </v-col>

            <v-col cols="12" class="text-center px-4">
              <v-btn color="#169976" size="large" @click="handleRegister" block> Register </v-btn>
            </v-col>
          </v-row>
        </v-form>

        <div class="mt-5 text-center">
          Already have an account?
          <span class="sign-text" @click="goToRegister">Sign In</span>
        </div>
      </v-container>
    </v-container>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFarmerStore } from '@/stores/FarmerStore'

const router = useRouter()
const farmerStore = useFarmerStore()

// Form Fields
const name = ref('')
const email = ref('')
const address = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Alert Feedback
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

// Validate password matching
watch([password, confirmPassword], () => {
  if (password.value === confirmPassword.value) {
    passwordError.value = ''
  }
})

// Actual register handler
const handleRegister = async () => {
  // Basic field validation
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

  const payload = {
    name: name.value,
    email: email.value,
    address: address.value,
    mobileNumber: phone.value,
    password: password.value,
  }

  try {
    await farmerStore.register(payload)
    alertType.value = 'success'
    alertTitle.value = 'Registration successful!'
    showAlert.value = true

    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (error) {
    alertType.value = 'error'
    alertTitle.value = 'Registration failed. Please try again.'
    showAlert.value = true
    console.error(error)
  }
}

// Navigation
const goToRegister = () => {
  router.push('/login')
}
</script>

<style scoped>
.landing-page {
  background-color: #004d4d;
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
.login-logo {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
}

.login-card {
  background-image: url('@/assets/images/login_bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 30px;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.3);
  color: white;
  max-width: 900px;
  margin: auto;
}
.login-header {
  text-align: center;
  width: 100%;
}

.login-title {
  font-weight: bold;
  font-size: 30px;
  margin-bottom: 20px;
}

.input-field {
  width: 80%;
  margin-bottom: 20px;
  background-color: #bdf7ff;
  color: black;
  border-radius: 10px;
}

.login-button {
  margin-top: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
}

.divider {
  color: white;
  margin-bottom: 10px;
  font-size: 16px;
  text-align: center;
}

.google-btn {
  background-color: white;
  color: #444;
  font-weight: 500;
  text-transform: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sign-text {
  color: #bdf7ff;
  font-weight: bold;
  margin-left: 5px;
  text-decoration: underline;
  cursor: pointer;
}
.floating-alert {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: 90%;
  max-width: 400px;
}
</style>
