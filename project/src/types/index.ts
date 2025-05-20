export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  createdAt: string;
  updatedAt: string;
  duration: number; // in seconds
  timeoutAt?: string; // ISO string for when the task will timeout
}

export enum TaskCategory {
  TODO = "To Do",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
  TIMEOUT = "Timeout"
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}