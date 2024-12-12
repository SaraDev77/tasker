import type { Status } from '../models/status.enum'

export function formatStatus(status: Status) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace('_', ' ')
}
