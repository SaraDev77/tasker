import { UserRole } from '../../models/user-role.enum'

export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type Permission = {
  action: Action
}

export const ROLES_DICTIONARY: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    { action: Action.CREATE },
    { action: Action.DELETE },
    { action: Action.READ },
    { action: Action.UPDATE },
  ],
  [UserRole.ADMIN]: [
    { action: Action.CREATE },
    { action: Action.READ },
    { action: Action.UPDATE },

  ],
}
