export const TaskFilter = {
  All: "all",
  Pending: "pending",
  Done: "done",
} as const;

export type TaskFilter = typeof TaskFilter[keyof typeof TaskFilter];

export const TaskFilterValues = Object.values(TaskFilter) as Array<TaskFilter>;

export const TaskFilterLabel: Record<TaskFilter, string> = {
  [TaskFilter.All]: "Todas",
  [TaskFilter.Pending]: "Pendentes",
  [TaskFilter.Done]: "Concluídas",
};

export function toIsCompleted(filter: TaskFilter): boolean | undefined {
  return filter === TaskFilter.All ? undefined : filter === TaskFilter.Done;
}