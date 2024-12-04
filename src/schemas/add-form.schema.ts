import { z } from 'zod'
export const addSchema = z.object({
    title: z.string().min(1, 'Task is required'),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    deadline: z.union([z.string().transform((value) => new Date(value)), z.date()]),
    status: z.string().min(1, 'Status is required'),
  })