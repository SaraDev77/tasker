import type { UserRole } from './user-role.enum'

export type DecodedToken = {
  role: UserRole
  exp: number
  iat: number
}
