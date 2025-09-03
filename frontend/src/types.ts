import type { TaskStatus } from "./status";

export interface TaskDto {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
}

export interface CreateTaskRequest {
  title: string;
  description?: string | null;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
}