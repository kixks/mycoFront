<template>
  <div class="landing-page">
    <div class="fill-height">
      <v-row no-gutters class="fill-height">
        <!-- Left Side (Centered Content) -->
        <v-col cols="12" md="7" class="d-flex align-center justify-center mb-15 pb-15">
          <transition name="fade-up" appear>
            <div class="text-center">
              <div class="welcome-text">WELCOME.</div>
              <div class="caption-text mb-15">"Real-Time Detection. Real Peace of Mind."</div>

              <v-row justify="center">
                <v-btn
                  size="x-large"
                  rounded="lg"
                  elevation="4"
                  class="ma-3"
                  color="teal-darken-2"
                  @click="goToLogin"
                  style="z-index: 10"
                >
                  <div class="about-text">LOG IN</div>
                </v-btn>
                <v-btn
                  size="x-large"
                  rounded="lg"
                  elevation="4"
                  class="ma-3"
                  color="teal-lighten-4"
                  @click="goToRegister"
                  style="z-index: 10"
                >
                  <div class="reg-text">REGISTER</div>
                </v-btn>
              </v-row>
            </div>
          </transition>
        </v-col>
      </v-row>
      <!-- Top-right ABOUT -->
      <div class="position-absolute top-0 right-0 pa-4 mt-5" style="z-index: 10">
        <v-row>
          <div>
            <img src="/src/assets/images/mainlogo.png" alt="" height="50" width="50" />
          </div>
          <v-btn size="auto" variant="text" class="about-text pa-2 mr-10">ABOUT US</v-btn>
        </v-row>
      </div>

      <!-- Bottom-right AM I S -->
      <div class="position-absolute bottom-0 right-0">
        <div>
          <img src="/src/assets/images/Manok (1).png" alt="Chicken" class="manok-picture" />
        </div>
      </div>
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
.reg-text {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(1.2rem, 2vw, 1.2rem);
  font-weight: 600;
  color: rgb(0, 32, 0);
}
.about-text {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(1.2rem, 2vw, 1.2rem);
  font-weight: 700;
  color: white;
}
.welcome-text {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(5.1rem, 9vw, 8rem);
  font-weight: 700;
  color: whitesmoke;
}
.caption-text {
  font-family: 'Roboto Mono', monospace;
  font-size: clamp(1.1rem, 2vw, 1.7rem);
  font-weight: 200;
  opacity: 0.8;
  color: whitesmoke;
}
.landing-page {
  background-image: url('@/assets/images/3161025.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  overflow: hidden;
}
.manok-picture {
  width: 100%;
  height: auto;
  max-width: 700px;
  max-height: 900px;
  transition: opacity 0.3s ease;
  display: block;
}
@media (max-width: 960px) {
  .manok-picture {
    opacity: 0.23; /* Very faint */
  }
}
.fade-up-enter-active {
  transition: all 0.8s ease;
}
.fade-up-leave-active {
  transition: all 0.8s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
