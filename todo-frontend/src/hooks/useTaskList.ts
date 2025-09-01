import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { TaskDto } from "../types";
import { listTasks } from "../api/tasks";
import { TaskFilter, toIsCompleted } from "../filters";

export const taskListKey = (isCompleted?: boolean) =>
  ["tasks", { isCompleted }] as const;

type UseTaskListParams = {
  filter: TaskFilter;
  enabled?: boolean;
  staleTime?: number;
  keepPrevious?: boolean;
};

export function useTaskList({
  filter,
  enabled = true,
  staleTime = 10_000,
  keepPrevious = true,
}: UseTaskListParams) {
  const isCompleted = toIsCompleted(filter);

  return useQuery<TaskDto[], Error>({
    queryKey: taskListKey(isCompleted),
    queryFn: () => listTasks(isCompleted),
    staleTime,
    enabled,
    placeholderData: keepPrevious ? keepPreviousData : undefined,
  });
}