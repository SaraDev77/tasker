import { defineStore } from 'pinia'
import type { Task } from '../models/task.type'
import axios from 'axios'

export const useTasksStore = defineStore('tasks', () => {
  const apiClient = axios.create({
    baseURL: 'http://localhost:5000',
  })

  const fetchTasks = async (): Promise<Task[]> => {
    try {
      const { data } = await apiClient.get('/api/todos', {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
        },
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

  const createTask = async (newTask: Omit<Task, '_id'>): Promise<void> => {
    try {
      await apiClient.post<Task>('/api/todos', newTask, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
        },
      })
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
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

  return {
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  }
})
