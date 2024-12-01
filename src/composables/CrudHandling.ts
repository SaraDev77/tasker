import { ref } from 'vue'
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'

type ApiResponse<T> = T

export function useApi(baseURL: string) {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const api: AxiosInstance = axios.create({
    baseURL,
  })

  const get = async <T>(): Promise<ApiResponse<T>> => {
    loading.value = true
    error.value = null
    try {
      const response: AxiosResponse<T> = await api.get(baseURL)
      return response.data
    } catch (err) {
      console.log('An error occurred')
      throw err
    } finally {
      loading.value = false
    }
  }

  const post = async <T, Task>(data: Task): Promise<ApiResponse<T>> => {
    loading.value = true
    error.value = null
    try {
      const response: AxiosResponse<T> = await api.post(baseURL, data)
      return response.data
    } catch (err: unknown) {
      throw err
    } finally {
      loading.value = false
    }
  }

  const patch = async <T, U>(data: U): Promise<ApiResponse<T>> => {
    loading.value = true
    error.value = null
    try {
      const response: AxiosResponse<T> = await api.patch(baseURL, data)
      return response.data
    } catch (err) {
      console.log('An error occurred')
      throw err
    } finally {
      loading.value = false
    }
  }

  const del = async <T>(): Promise<ApiResponse<T>> => {
    loading.value = true
    error.value = null
    try {
      const response: AxiosResponse<T> = await api.delete(baseURL)
      return response.data
    } catch (err) {
      console.log('An error occurred')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    get,
    post,
    patch,
    del,
    loading,
    error,
  }
}
