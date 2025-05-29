<template>
  <div class="landing-page">
    <v-container>
      <v-row justify="end">
        <v-col cols="12" md="2" class="text-center ma-7"> ABOUT US </v-col>
      </v-row>
    </v-container>
    <div class="fill-height">
      <v-row no-gutters class="fill-height">
        <!-- Left Side (Centered Content) -->
        <v-col cols="12" md="6" class="d-flex align-center justify-center">
          <div class="text-center ma">
            <div class="text-h3 font-weight-bold mb-2">WELCOME</div>
            <div class="text-subtitle-1 mb-6">"Real-Time Detection. Real Peace of Mind"</div>

            <v-row justify="center">
              <v-btn size="x-large" rounded="lg" outlined class="ma-3" color="teal-darken-2">
                LOG IN
              </v-btn>
              <v-btn size="x-large" rounded="lg" outlined class="ma-3" color="teal-lighten-4">
                REGISTERSSSS
              </v-btn>
            </v-row>
          </div>
        </v-col>

        <!-- Right Side -->
        <v-col cols="12" md="6" class="d-flex align-center justify-center text-center">
          <div>AM I S</div>
        </v-col>
      </v-row>
    </div>
  </div>

  <!-- <button type="button" @click="goToLogin">login</button>
  <button type="button" @click="goToRegister">register</button> -->
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}
const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.landing-page {
  background-image: url('@/assets/images/3161025.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  overflow: hidden;
}
</style>
