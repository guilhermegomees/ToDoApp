export const TaskStatus = {
    NotStarted: 0,
    Stopped: 1,
    InProgress: 2,
    Done: 3,
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

// Mapas para labels e cores (usados no Kanban)
export const TaskStatusMap = {
    [TaskStatus.NotStarted]: { key: "not_started", label: "Não iniciado", color: "#797e93" },
    [TaskStatus.Stopped]: { key: "stopped", label: "Parado", color: "#e8697d" },
    [TaskStatus.InProgress]: { key: "in_progress", label: "Em andamento", color: "#fdbc64" },
    [TaskStatus.Done]: { key: "done", label: "Feito", color: "#33d391" },
} as const;

export const TaskStatusKeys = Object.values(TaskStatus) as TaskStatus[];  