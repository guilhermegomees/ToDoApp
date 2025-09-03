import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { TaskDto } from "../types";
import { listTasks } from "../api/tasks";

export const taskListKey = () => ["tasks"] as const;

type UseTaskListParams = {
  enabled?: boolean;
  staleTime?: number;
  keepPrevious?: boolean;
};

export function useTaskList({
  enabled = true,
  staleTime = 10_000,
  keepPrevious = true,
}: UseTaskListParams) {
  return useQuery<TaskDto[], Error>({
    queryKey: taskListKey(),
    queryFn: () => listTasks(),
    staleTime,
    enabled,
    placeholderData: keepPrevious ? keepPreviousData : undefined,
  });
}