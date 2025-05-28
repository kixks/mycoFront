<template>
  <h1>AKO ANG LANDING PAGE</h1>
  <h2>sadgecake</h2>
  <button type="button" @click="goToLogin">login</button>
  <button type="button" @click="goToRegister">register</button>
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
