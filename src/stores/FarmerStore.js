import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'

export const useFarmerStore = defineStore('farmer', {
  state: () => ({
    userArray: [],
    allUserArray: [],
    updateUserArray: [],
    detectedChickenArray: [],
    notifyFarmerSMSArray: [],
    authToken: localStorage.getItem('authToken') || null,
    isLoggedIn: false,
    errorLogin: '',
    datasetImages: [],
    totalImages: 0,
    imagePage: 1,
    imageLimit: 10,
  }),
  actions: {
    setAuthFromGoogle(payload) {
      this.authToken = payload.AccessToken
      this.userArray = payload.User
      this.isLoggedIn = true
      localStorage.setItem('authToken', payload.AccessToken)
      localStorage.setItem('refreshToken', payload.RefreshToken)
      localStorage.setItem('user', JSON.stringify(payload.User))
    },
    setToken(token) {
      this.authToken = token
      this.isLoggedIn = true
      localStorage.setItem('authToken', token)
    },
    clearAuth() {
      this.authToken = null
      this.isLoggedIn = false
      localStorage.removeItem('authToken')
    },

    async getAllUser() {
      try {
        let res = await api.get(`/User`)
        this.allUserArray = res.data
        console.log(this.allUserArray)
      } catch (error) {
        console.error('Fetching all user failed', error)
      }
    },

    async getCurrentUser(id) {
      try {
        let res = await api.get(`/User/${id}`)
        this.userArray = res.data
        console.log(this.userArray)
        localStorage.setItem('user', JSON.stringify(res.data))
      } catch (error) {
        console.error('Fetching specific user failed', error)
      }
    },

    async login(payload) {
      try {
        let res = await api.post('/Auth/login', payload)
        this.userArray = res.data.User
        localStorage.setItem('user', JSON.stringify(res.data.User))
        localStorage.setItem('authToken', res.data.AccessToken)
        localStorage.setItem('refreshToken', res.data.RefreshToken)
        this.setToken(res.data.AccessToken)
        this.isLoggedIn = true
        console.log('User Details', this.userArray)
      } catch (error) {
        this.isLoggedIn = false
        this.errorLogin = error.response?.data || 'Unknown login error'
        this.clearAuth()
      }
    },

    async register(payload) {
      try {
        let res = await api.post('/Auth/register', payload)
        this.userArray = res.data
        console.log('User Details', this.userArray)
      } catch (error) {
        console.error('Register failed', error)
      }
    },

    async updateUser(payload) {
      try {
        let res = await api.put('/User', payload)
        this.updateUserArray = res.data
      } catch (error) {
        console.log('Something went wrong updating the user', error)
      }
    },

    async refreshToken(payload) {
      try {
        let res = await api.post('/Auth/refresh-token', payload)
        this.isLoggedIn = true
        return res
      } catch (error) {
        return 'Unable to refreshToken', error
      }
    },

    async fetchSymptomatic(id) {
      try {
        let res = await api.get(`/Detection/${id}`)
        this.detectedChickenArray = res.data
      } catch (error) {
        console.log('Something went wrong in fetching symptomatic chicken', error)
      }
    },

    async notifyFarmerSMS(payload) {
      try {
        let res = await api.post('/Messages', payload)
        this.notifyFarmerSMSArray = res.data
      } catch (error) {
        console.error('Something went wrong in sending sms', error)
      }
    },

    async fetchDatasetImages(page = 1, limit = 40) {
      try {
        const offset = (page - 1) * limit

        const response = await api.get(`/User/dataset-images?limit=${limit}&offset=${offset}`)

        const json = response.data

        this.datasetImages = json.data
        this.totalImages = json.total
        this.imagePage = page
        this.imageLimit = limit

        console.log('Fetched images:', json.data)
      } catch (error) {
        console.error('Failed to fetch dataset images:', error)
      }
    },
    async updateSnapshotStatus(snapshotId, status) {
      try {
        const payload = {
          snapshotId,
          status,
        }

        const res = await api.post('/Detection/update-snapshot-status', payload)
        console.log('Snapshot status updated:', res.data)
        return res.data
      } catch (error) {
        console.error('Failed to update snapshot status', error)
        throw error
      }
    },

    async logout() {
      try {
        // Make API call to logout
        await api.post(
          '/Auth/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          },
        )

        this.authToken = null
        this.isLoggedIn = false
        this.userArray = []
        localStorage.clear()
      } catch (error) {
        console.error('Logout failed', error)
      }
    },
  },
})
