import type { UserRole } from './userRole.enum'

export type DecodedToken = {
  role: UserRole
  exp: number
  iat: number
}
