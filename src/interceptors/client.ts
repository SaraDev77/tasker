import axios from 'axios'
import router from '../router'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  },
)

export default apiClient
