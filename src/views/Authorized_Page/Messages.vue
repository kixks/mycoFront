<template>
  <PageLayout>
    <div class="body-content">
      <v-container fluid class="elevation-3 pa-10 ma-12">
        <div class="col">
          <div class="text-h4 title">Chat With Vet</div>
          <v-divider class="my-2"></v-divider>
          <v-container>
            <v-row>
              <v-col cols="12" md="3">
                <div class="text-subtitle">Detected Symptomatics</div>
                <v-select
                  v-model="selectedVet"
                  :items="['Vet 1', 'Vet 2', 'Vet 3']"
                  density="comfortable"
                  class="ma-2 light-green-select"
                  variant="solo-filled"
                  clearable
                  label="Select Image"
                ></v-select>
              </v-col>
              <!-- Hide vertical divider on mobile -->
              <v-divider vertical class="d-none d-md-block"></v-divider>
              <v-col cols="12" md="9">
                <v-row>
                  <v-col cols="12" md="10">
                    <v-textarea rows="1" auto-grow hide-details class="ma-0"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-btn color="#169976" size="large" block>Send</v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-container>
    </div>
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/PageLayout.vue'
import { ref } from 'vue'

const selectedVet = ref(null)
</script>

<style scoped>
.body-content {
  font-family: 'Poppins', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #dae9e5;
}
.title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}
.light-green-select :deep(.v-field) {
  background-color: #90d1ca !important;
}
.light-green-select :deep(.v-icon) {
  color: #c3ebe0 !important;
}
</style>
