<template>
  <div class="landing-page">
    <v-container fluid fill-height>
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="4">
          <div class="login-card">
            <div class="login-header">
              <img src="@/assets/images/mainlogo.png" alt="Logo" class="login-logo" />
              <h5 class="login-title">REGISTER</h5>
            </div>

            <v-text-field
              v-model="Fullname"
              label="Fullname"
              outlined
              dense
              class="input-field"
              hide-details
            />

            <v-text-field
              v-model="Email"
              label="Email"
              outlined
              dense
              class="input-field"
              hide-details
            />
            <v-text-field
              v-model="Address"
              label="Address"
              outlined
              dense
              class="input-field"
              hide-details
            />
            <v-text-field
              v-model="Mobile"
              label="Mobile Number"
              outlined
              dense
              type="tel"
              class="input-field"
              hide-details
              @input="Mobile = Mobile.replace(/[^0-9]/g, '')"
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
            <v-text-field
              v-model="Repeated"
              label="Repeat password"
              outlined
              dense
              type="password"
              class="input-field"
              hide-details
              :error="Repeated && password !== Repeated"
              :error-messages="Repeated && password !== Repeated ? ['Passwords do not match'] : []"
            />

            <v-btn
              variant="elevated"
              size="large"
              rounded="x-large"
              :width="200"
              class="login-button"
              color="teal darken-2"
              dark
              width="20"
            >
              REGISTER
            </v-btn>
            <div>
              Already have an account?
              <span class="sign-text" @click="goToRegister">Sign In</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

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
</style>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const Fullname = ref('')
const Email = ref('')
const Address = ref('')
const Mobile = ref('')
const password = ref('')
const Repeated = ref('')

const router = useRouter()

const goToRegister = () => {
  router.push('/login')
}
</script>
