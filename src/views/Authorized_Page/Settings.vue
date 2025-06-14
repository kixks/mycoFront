<template>
  <PageLayout>
    <div class="body-content">
      <v-container fluid class="elevation-3 pa-15 ma-12 w-75">
        <div class="col">
          <div class="text-h4 title mb-4">Update Credentials</div>
          <v-divider class="my-5"></v-divider>
          <v-form>
            <v-row>
              <v-col cols="12" class="mb-2">
                <v-text-field
                  v-model="name"
                  label="Name"
                  variant="solo-filled"
                  density="comfortable"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="mb-2">
                <v-text-field
                  v-model="address"
                  label="Address"
                  variant="solo-filled"
                  density="comfortable"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="mb-2">
                <v-text-field
                  v-model="phone"
                  label="Phone Number"
                  variant="solo-filled"
                  density="comfortable"
                  required
                ></v-text-field>
              </v-col>
              <v-divider class="my-5"></v-divider>
              <v-col cols="12" class="mb-2">
                <v-text-field
                  v-model="password"
                  label="Reset Password"
                  type="password"
                  variant="solo-filled"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="mb-6">
                <v-text-field
                  v-model="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  variant="solo-filled"
                  density="comfortable"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-col cols="auto">
                <v-btn color="#169976" size="large" @click="updateSettings">Update</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </div>
      </v-container>
    </div>
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/PageLayout.vue'
import { ref } from 'vue'

const name = ref('')
const address = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')

const updateSettings = () => {
  // Handle update logic here
  alert('Settings updated!')
}
</script>

<style scoped>
.body-content {
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
</style>
