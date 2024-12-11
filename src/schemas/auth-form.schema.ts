import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Invalid Password'),
})
