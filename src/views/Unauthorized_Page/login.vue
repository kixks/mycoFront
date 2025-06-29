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
      <v-row justify="center" class="fill-height">
        <v-col cols="12" sm="8" md="4">
          <div class="login-card">
            <div class="login-header">
              <img src="@/assets/images/mainlogo.png" alt="Logo" class="login-logo" />
              <h5 class="login-title">LOG IN</h5>
            </div>

            <v-text-field
              v-model="mobilNumber"
              label="Mobile Number"
              outlined
              dense
              class="input-field"
              hide-details
            />
            <v-text-field
              v-model="password"
              label="Password"
              outlined
              dense
              type="password"
              class="input-field"
              hide-details
            />
            <v-btn
              variant="elevated"
              size="large"
              rounded="x-large"
              :width="300"
              class="login-button"
              color="teal darken-2"
              dark
              @click="loginUser"
            >
              LOGIN
            </v-btn>

            <div>
              Don't have an account?
              <span class="signup-text" @click="goToRegister">Sign up</span>
            </div>

            <div class="fancy-divider"></div>

            <v-btn class="google-btn" @click="googleLogin">
              <img src="@/assets/images/google_logo.png" height="30" width="35 " class="mr-2" />
              Google
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFarmerStore } from '@/stores/FarmerStore'
import { computed } from 'vue'

const router = useRouter()

const mobilNumber = ref('')
const password = ref('')
let userDetails = ref([])

const showAlert = ref(false)
const alertType = ref('success') // can be 'success' or 'error'
const alertTitle = ref('')

const goToRegister = () => {
  router.push('/register')
}

const loginUser = async () => {
  const store = useFarmerStore()

  let payload = {
    mobileNumber: mobilNumber.value,
    password: password.value,
  }

  await store.login(payload)

  if (store.isLoggedIn) {
    userDetails.value = store.userArray
    console.log('Mao ning nafetch na user', userDetails.value)
    alertType.value = 'success'
    alertTitle.value = 'Login Successful'
    showAlert.value = true

    router.push('/dashboard')
  } else {
    console.log(typeof store.errorLogin)
    alertType.value = 'error'
    alertTitle.value = String(store.errorLogin || 'An error occurred.')
    showAlert.value = true
  }
}

const googleLogin = async () => {
  window.location.href = 'https://kingfish-wealthy-calf.ngrok-free.app/api/Auth/signin-google'
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
  background-image: url('@/assets/images/login_bg.png'); /* Replace with your image path */
  border-radius: 30px;
  padding: 30px 20px;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.3);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-size: cover;
  background-repeat: no-repeat;
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
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
}

.google-btn {
  background-color: #bdf7ff;
  color: #444;
  font-weight: 500;
  text-transform: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 155px;
}
.floating-alert {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: 50%;
  max-width: 300px;
}

.custom-alert {
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
}

/* Responsive tweaks */
@media (max-width: 600px) {
  .login-card {
    padding: 20px 15px;
  }

  .login-title {
    font-size: 20px;
  }

  .divider {
    font-size: 14px;
  }
}

.fancy-divider {
  height: 2px;
  width: 100%;
  margin: 20px auto;
  margin-top: 15px;
  background: white;
  border-radius: 2px;
}

.signup-text {
  color: #bdf7ff;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
}
</style>
