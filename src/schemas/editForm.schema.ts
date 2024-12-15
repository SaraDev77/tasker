import { z } from 'zod'

export const editSchema = z.object({
  title: z.string().min(1, 'Task is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  status: z.string().min(1, 'Status is required'),
})
