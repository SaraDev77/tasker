import { z } from 'zod'

export const addSchema = z.object({
  title: z.string().min(1, 'Provide Task Title Please'),
  description: z
    .string({ required_error: 'Task is required' })
    .min(5, 'Description must be at least 5 characters'),
  deadline: z.date(),
  status: z.string().min(1, 'Status is required'),
})
