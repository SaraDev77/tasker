import type { Task } from '../models/task.type'
import apiClient from '../interceptors/client'

export const taskService = {
  async fetchTasks(): Promise<Task[]> {
    try {
      const { data } = await apiClient.get('/api/todos', {
        params: { page: 0, perPage: 100 },
      })
      return data.todos
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw error
    }
  },

  async fetchSingleTask(id: string): Promise<Task> {
    try {
      const { data } = await apiClient.get(`/api/todos/${id}`)
      if (!data?.todo) throw new Error('Task data is missing')
      return data.todo
    } catch (error) {
      console.error('Error fetching single task:', error)
      throw new Error('Failed to fetch task')
    }
  },

  async createTask(newTask: Partial<Task>): Promise<void> {
    try {
      await apiClient.post<Task>('/api/todos', newTask)
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  },

  async updateTask(updatedTask: Partial<Task>, id?: string): Promise<void> {
    try {
      await apiClient.put<Task>(`/api/todos/${id}`, updatedTask)
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/todos/${id}`)
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  },

  async startTask(id: string): Promise<void> {
    try {
      await apiClient.post<Task>(`/api/todos/${id}/start`)
    } catch (error) {
      console.error('Error starting task:', error)
      throw error
    }
  },

  async completeTask(id: string): Promise<void> {
    try {
      await apiClient.post<Task>(`/api/todos/${id}/complete`)
    } catch (error) {
      console.error('Error completing task:', error)
      throw error
    }
  },
}
