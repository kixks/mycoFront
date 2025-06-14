<template>
  <PageLayout>
    <div class="body-content">
      <v-container
        fluid
        class="d-flex flex-column align-center justify-center elevation-3 pa-10 w-75"
      >
        <div class="text-h3 ma-8 title">Detected Symptomatic Chickens</div>
        <v-table height="400px" fixed-header class="w-100 ma-10 custom-table">
          <thead>
            <tr>
              <th class="text-left">TIMESTAMP</th>
              <th class="text-left">DETECTION ACCURACY</th>
              <th class="text-left">SNAPSHOTS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>hotdot</td>
              <td>digididawh</td>
              <td>View</td>
            </tr>
          </tbody>
        </v-table>
      </v-container>
    </div>
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/PageLayout.vue'
</script>

<style scoped>
.body-content {
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center; /* horizontal centering */
  align-items: center; /* vertical centering */
  height: 100vh;
  background-color: #dae9e5;
}
.title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}
.custom-table thead tr th {
  background-color: #169976 !important;
  color: white;
}
.custom-table tbody tr td {
  color: #096b68;
}
.custom-table tbody tr td:hover {
  color: #a0d4d3;
}
</style>
