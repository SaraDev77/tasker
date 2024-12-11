import { UserRole } from '../../models/user-role.enum'

export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW_COMPLETED='view_completed'
}

export enum Resource {
  TODOS = 'TODOS',
}

export type Permission = {
  action: Action
  resource: Resource
}

export const ROLES_DICTIONARY: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    { action: Action.CREATE, resource: Resource.TODOS },
    { action: Action.READ, resource: Resource.TODOS },
    { action: Action.UPDATE, resource: Resource.TODOS },
    { action: Action.DELETE, resource: Resource.TODOS },
    { action: Action.VIEW_COMPLETED, resource: Resource.TODOS },

  ],
  [UserRole.ADMIN]: [
    { action: Action.CREATE, resource: Resource.TODOS },
    { action: Action.READ, resource: Resource.TODOS },
    { action: Action.UPDATE, resource: Resource.TODOS },
  ],
}
