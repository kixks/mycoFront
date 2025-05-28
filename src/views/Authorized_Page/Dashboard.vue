<template>
  <!-- Your main dashboard content goes here -->
  <Navbar />
  <Sidebar />
  <div class="body-content">
    <h1>Dashboard Area</h1>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>

<style scoped>
.body-content {
  display: flex;
  justify-content: center; /* horizontal centering */
  align-items: center; /* vertical centering */
  height: 100vh;
}
</style>
