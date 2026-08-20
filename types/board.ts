export type TaskCategory = 'AI' | 'ENGLISH' | 'WEB' | 'PYTHON' | 'OTHER'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface TaskChecklistItem {
  id: number
  title: string
  isCompleted: boolean
  topicId?: number | null
  taskId?: number | null
}

export interface TaskItem {
  id: number
  title: string
  description?: string | null
  category: string
  technology?: string | null
  topic?: string | null
  priority?: string
  estimatedMinutes?: number
  actualMinutes?: number
  status: TaskStatus
  order: number
  goalId?: number | null
  checklists?: TaskChecklistItem[]
  createdAt?: string | Date
  updatedAt?: string | Date
}
