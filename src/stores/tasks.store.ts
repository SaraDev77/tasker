import { defineStore } from 'pinia'
import type { Task, TaskRequest } from '../models/task.type'
import apiClient from '../interceptors/client'

export const useTasksStore = defineStore('tasks', () => {
  const fetchTasks = async (): Promise<Task[]> => {
    try {
      const { data } = await apiClient.get('/api/todos', {
        params: {
          page: 0,
          perPage: 100,
        },
      })

      return data.todos
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw error
    }
  }

  const fetchSingleTask = async (id: string): Promise<TaskRequest> => {
    try {
      const { data } = await apiClient.get(`/api/todos/${id}`)

      return { ...data.todo }
    } catch (error) {
      console.error('Error fetching single task:', error)
      throw error
    }
  }
  const createTask = async (newTask: Partial<Task>): Promise<void> => {
    try {
      await apiClient.post<Task>('/api/todos', newTask)
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  const updateTask = async (updates: Partial<Task>, id?: string): Promise<void> => {
    try {
      await apiClient.put<Task>(`/api/todos/${id}`, updates)
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  const deleteTask = async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/todos/${id}`)
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  const startTask = async (id: string): Promise<void> => {
    try {
      await apiClient.post<Task>(`/api/todos/${id}/start`)
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  const completeTask = async (id: string): Promise<void> => {
    try {
      await apiClient.post<Task>(`/api/todos/${id}/complete`)
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  return {
    fetchSingleTask,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
  }
})
