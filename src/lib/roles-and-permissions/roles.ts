import { UserRole } from '../../models/userRole.enum'

export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
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
  ],
  [UserRole.ADMIN]: [
    { action: Action.CREATE, resource: Resource.TODOS },
    { action: Action.READ, resource: Resource.TODOS },
    { action: Action.UPDATE, resource: Resource.TODOS },
  ],
}
