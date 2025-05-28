import { defineStore } from 'pinia'

export const useFarmerStore = defineStore('farmer', {
  state: () => ({
    name: '',
    isLoggedIn: false,
  }),
  actions: {
    async login(payload) {},
  },
})
