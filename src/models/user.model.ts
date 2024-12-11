import type { UserRole } from './user-role.enum'

export type User = {
  email: string
  token: string
  role: UserRole
}
