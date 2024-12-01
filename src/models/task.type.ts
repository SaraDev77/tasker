import type { Status } from './status.enum'

export type Task = {
  _id: string
  title: string
  description: string
  status: Status
  deadline: string
  createdBy: {
    _id: string
    email: string
  }
}

export type TaskRequest = Omit<Task, '_id'>
