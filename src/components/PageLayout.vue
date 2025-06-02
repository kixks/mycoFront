<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        v-model="drawer"
        app
        class="d-flex flex-column"
        :temporary="isMobile"
        width="300"
        color="#169976"
      >
        <!-- Top Section -->
        <div class="d-flex flex-column" style="height: 100%">
          <div>
            <!-- This div contains all non-logout content -->
            <v-list>
              <v-list-item
                prepend-avatar="/src/assets/images/mainlogo.png"
                title="MycoCheck"
                class="custom-list-item"
              >
              </v-list-item>
            </v-list>

            <v-divider thickness="4" color="#222222"></v-divider>

            <v-list nav class="mt-2">
              <v-list-item
                prepend-icon="pi pi-desktop"
                title="DETECTION REPORT"
                value="report"
                lines="two"
                class="sidebar-item"
              >
              </v-list-item>
              <v-list-item
                prepend-icon="pi pi-inbox"
                title="VET-FARMER COMMUNICATION"
                value="messages"
                lines="two"
                class="sidebar-item"
              >
              </v-list-item>
              <v-list-item
                prepend-icon="pi pi-cog"
                title="SETTINGS"
                value="settings"
                lines="two"
                class="sidebar-item"
              >
              </v-list-item>
            </v-list>
          </div>

          <!-- Logout Button at Bottom -->
          <div class="mt-auto pa-4 ma-2">
            <v-btn block prepend-icon="pi pi-sign-out" color="#222222" @click=""> LOGOUT </v-btn>
          </div>
        </div>
      </v-navigation-drawer>

      <v-main style="height: 100vh">
        <v-app-bar v-if="isMobile" app color="#169976" flat>
          <v-btn icon="pi pi-bars" @click="drawer = !drawer"> </v-btn>
          <span class="mobile-title pa-2">MycoCheck</span>
        </v-app-bar>
        <slot></slot>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

const drawer = ref(true)
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)
</script>

<style scoped>
.custom-list-item {
  min-height: 80px; /* Adjust height */
}

.custom-list-item :deep(.v-list-item-title) {
  font-family: 'Poppins', sans-serif;
  font-size: 1.7rem; /* Title font size */
  font-weight: 700;
  color: #222222;
}
.sidebar-item:deep(.v-list-item__prepend) {
  color: #000000;
  font-size: large;
}

.sidebar-item:deep(.v-list-item-title) {
  font-family: 'Poppins', sans-serif;
  font-size: 1rem; /* Item font size */
  font-weight: 500;
  word-break: break-word;
  white-space: normal;
  text-overflow: unset;
  color: #e7f1ef;
}

.mobile-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
}
</style>
