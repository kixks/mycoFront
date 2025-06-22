<template>Redirecting</template>
<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFarmerStore } from '@/stores/FarmerStore'

const route = useRoute()
const router = useRouter()
const store = useFarmerStore()

onMounted(() => {
  const base64Data = route.query.data
  console.log('IAM THE BASE64 DATA', base64Data)
  if (base64Data) {
    const jsonString = atob(base64Data)
    const payload = JSON.parse(jsonString)

    console.log('i AM THE PAYLOAD', payload)
    store.setAuthFromGoogle(payload)

    router.push('/dashboard')
  } else {
    store.clearAuth()
    router.push('/login')
  }
})
</script>
