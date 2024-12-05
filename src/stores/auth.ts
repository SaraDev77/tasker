import router from '@/router'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteMeta } from 'vue-router'
import type { formData } from '../models/auth.model'
import apiClient from '../interceptors/client'

export const useAuthStore = defineStore(
  'auth-store',
  () => {
    const token = ref(localStorage.getItem('token') || '')

    const isRouteAuthorized = (routeMeta: RouteMeta) => {
      return !routeMeta.permission
    }

    const login = async (formData: formData): Promise<void> => {
      try {
        const response = await apiClient.post('/api/auth/login', formData)
        router.replace('/')
        token.value = response.data.accessToken
        localStorage.setItem('token', token.value)
      } catch (error) {
        throw error
      }
    }

    const regestier = async (formData: formData): Promise<void> => {
      try {
        const response = await apiClient.post('/api/auth/register', formData)
        router.replace('/login')
        token.value = response.data.accessToken
        localStorage.setItem('token', token.value)
      } catch (error) {
        throw error
      }
    }

    const localLogout = () => {
      token.value = ''
      localStorage.removeItem('token')
      router.replace('/login')
    }

    return {
      token,
      login,
      localLogout,
      isRouteAuthorized,
      regestier
    }
  },
  {
    persist: true,
  },
)
