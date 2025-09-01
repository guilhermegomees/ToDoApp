export interface TaskDto {
  id: number;
  title: string;
  description?: string | null;
  isCompleted: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description?: string | null;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string | null;
  isCompleted?: boolean;
}