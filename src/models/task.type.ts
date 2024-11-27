import type { Status } from './status.enum'

export type Task = {
  id: number
  title: string
  status: Status
  deadline: string
}

export type TaskRequest = Omit<Task, 'id'>
