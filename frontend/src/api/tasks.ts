import { api } from "./client";
import type { TaskDto, CreateTaskRequest, UpdateTaskRequest } from "../types";

export async function listTasks(): Promise<TaskDto[]> {
  const params: Record<string, boolean> = {};
  const { data } = await api.get<TaskDto[]>("/api/Tasks", { params });
  return data;
}

export async function getTask(id: number): Promise<TaskDto> {
  const { data } = await api.get<TaskDto>(`/api/Tasks/${id}`);
  return data;
}

export async function createTask(req: CreateTaskRequest): Promise<TaskDto> {
  const { data } = await api.post<TaskDto>("/api/Tasks", req);
  return data;
}

export async function updateTask(id: number, req: UpdateTaskRequest): Promise<TaskDto> {
  const { data } = await api.put<TaskDto>(`/api/Tasks/${id}`, req);
  return data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/api/Tasks/${id}`);
}