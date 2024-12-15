import type { UserRole } from './userRole.enum'

export type User = {
  email: string
  token: string
  role: UserRole
}
