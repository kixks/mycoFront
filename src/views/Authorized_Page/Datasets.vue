<template>
  <PageLayout>
    <div class="body-content">
      <v-container>
        <!-- Header -->
        <v-row justify="space-between" class="px-10 py-3 mt-1">
          <v-col align-self="center" cols="9" class="text-h4 title">DATASETS USED</v-col>
          <!-- Label -->
          <v-col cols="1" align-self="center" class="text-caption font-weight-medium text-left">
            IMAGES VALIDATED BY:
          </v-col>

          <!-- Details -->
          <v-col cols="2" align-self="end" class="text-left">
            <div class="validated-name">Mrs. Jacqueline Juaban</div>
            <div class="text-body-2">Doctor of Veterinary Medicine</div>
            <div class="text-body-2">Provincial Veterinary Office</div>
          </v-col>
        </v-row>

        <!-- Image Grid Container -->
        <v-container class="rounded-xl pa-6 mt-5 container-design elevation-3">
          <!-- Image Grid: 10 columns per row, 4 rows -->
          <v-row dense>
            <v-col v-for="(url, i) in images" :key="i" cols="1" class="d-flex child-flex">
              <v-img :src="url" aspect-ratio="1" cover class="ma-1 rounded" :lazy-src="url">
                <template #placeholder>
                  <v-row class="fill-height" justify="center">
                    <v-progress-circular color="grey-lighten-5" indeterminate size="24" />
                  </v-row>
                </template>
              </v-img>
            </v-col>
          </v-row>

          <!-- Pagination (bottom right) -->
          <v-row class="mt-6 px-4">
            <v-col cols="6" class="text-left" align-self="center">
              <span class="text-caption font-weight-bold">TOTAL IMAGES: {{ totalImages }}</span>
            </v-col>

            <v-col cols="6" class="d-flex justify-end align-center">
              <v-btn
                :disabled="farmerStore.imagePage === 1"
                @click="changePage(farmerStore.imagePage - 1)"
                class="mx-1"
                variant="outlined"
                color="#169976"
              >
                Prev
              </v-btn>

              <div class="mx-2 text-caption">
                Page {{ farmerStore.imagePage }} /
                {{ Math.ceil(farmerStore.totalImages / farmerStore.imageLimit) }}
              </div>

              <v-btn
                :disabled="
                  farmerStore.imagePage >=
                  Math.ceil(farmerStore.totalImages / farmerStore.imageLimit)
                "
                @click="changePage(farmerStore.imagePage + 1)"
                class="mx-1"
                variant="flat"
                color="#169976"
              >
                Next
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <div>
          <v-row class="mt-8">
            <v-col cols="12" class="text-caption text-center font-weight-bold font-italic">
              Disclaimer: The images shown are not definitive indicators of chickens affected by
              Mycoplasma. They represent only potential early symptoms and should not be used as the
              sole basis for diagnosis.
            </v-col>
          </v-row>
        </div>
      </v-container>
    </div>
  </PageLayout>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useFarmerStore } from '@/stores/FarmerStore'
import PageLayout from '@/components/PageLayout.vue'

const farmerStore = useFarmerStore()

// Ensure reactivity
const images = computed(() => farmerStore.datasetImages)
const totalImages = computed(() => farmerStore.totalImages)

const changePage = (newPage) => {
  farmerStore.fetchDatasetImages(newPage, farmerStore.imageLimit)
}

onMounted(() => {
  farmerStore.fetchDatasetImages(1, 48)
})
</script>

<style scoped>
.body-content {
  font-family: 'Poppins', sans-serif;
  height: 100vh;
}
.title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
}
.validated-name {
  font-weight: 600;
  text-decoration: underline;
  font-size: 1rem;
  margin-bottom: 4px;
}
.container-design {
  height: 68vh;
  overflow-y: auto;
  position: relative;
  width: 97%;
}
</style>
