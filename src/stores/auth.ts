import { jwtDecode } from 'jwt-decode'
import router from '@/router'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RouteMeta } from 'vue-router'
import type { formData } from '../models/auth.model'
import apiClient from '../interceptors/client'
import type { DecodedToken } from '../models/decoded-token'
import { defineAbility, type PureAbility } from '@casl/ability'
import type { UserRole } from '../models/user-role.enum'
import { ROLES_DICTIONARY } from '../lib/roles-and-permissions/roles'

export const useAuthStore = defineStore(
  'auth-store',
  () => {
    const token = ref(localStorage.getItem('token') || '')
    const loggedUser = ref(localStorage.getItem('email') || '')
    const role = computed(() => {
      const decoded: DecodedToken = jwtDecode(token.value)
      return decoded.role
    })

    const ability = ref<PureAbility>()
    const isAuthenticated = computed(() => !!role.value)

    const initializePermissions = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ability.value = defineAbility((_) => {})
      updatePermissions()
    }

    const updatePermissions = () => {
      const userRole = role.value as UserRole
      if (userRole) {
        ability.value?.update(
          ROLES_DICTIONARY[userRole].map(({ action }) => {
            return { action, subject: 'all' }
          }),
        )
      }
    }

    const isRouteAuthorized = (routeMeta: RouteMeta) => {
      return !routeMeta.permission
    }

    const login = async (formData: formData): Promise<void> => {
      try {
        localStorage.setItem('email', formData.email)
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
      loggedUser,
      role,
      login,
      regestier,
      localLogout,
      isRouteAuthorized,
      isAuthenticated,
      initializePermissions,
      ability,
    }
  },
  {
    persist: true,
  },
)
