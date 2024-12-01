import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Task } from '../models/task.type';
import axios from 'axios';

export const useTasksStore = defineStore('tasks', () => {
  // State: Reactive list of tasks
  const tasks = ref<Task[]>([]);

  // API client configuration
  const apiClient = axios.create({
    baseURL: 'http://localhost:5000',
  });

  // Fetch tasks from the API and update the store
  const fetchTasks = async (): Promise<void> => {
    try {
      const { data } = await apiClient.get<Task[]>('/api/todos',{
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_URL}`,
        },
      });
      tasks.value = data; // Update the reactive state
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  };

  // Add a new task to the API and update the store
  const createTask = async (newTask: Omit<Task, '_id'>): Promise<void> => {
    try {
      const { data } = await apiClient.post<Task>('/api/todos', newTask);
      tasks.value.push(data); // Add the new task to the state
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  // Update an existing task in the API and the store
  const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
    try {
      const { data } = await apiClient.put<Task>(`/api/todos/${id}`, updates);
      const index = tasks.value.findIndex((task) => task._id === id);
      if (index !== -1) {
        tasks.value[index] = { ...tasks.value[index], ...data }; // Update task in the state
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  // Delete a task from the API and remove it from the store
  const deleteTask = async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/todos/${id}`);
      tasks.value = tasks.value.filter((task) => task._id !== id); // Remove the task from the state
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  return {
    tasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
});
