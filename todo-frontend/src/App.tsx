import * as React from "react";
import {
  AppBar, Toolbar, Typography, Container, Paper, Stack, Box, Chip, IconButton,
  Tooltip, CircularProgress, Snackbar, Alert, Divider, Button, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText, Checkbox
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskRequest, TaskDto, UpdateTaskRequest } from "./types";
import { TaskFilter, TaskFilterValues, TaskFilterLabel } from "./filters";
import { createTask, updateTask, deleteTask } from "./api/tasks";
import TaskFormDialog from "./components/TaskFormDialog";
import ConfirmDialog from "./components/ConfirmDialog";
import { useTaskList } from "./hooks/useTaskList";

export default function App() {
  const [filter, setFilter] = React.useState<TaskFilter>(TaskFilter.All);
  const { data, isLoading, isError, refetch, error } = useTaskList({ filter });
  const qc = useQueryClient();

  // dialogs & toasts
  const [openForm, setOpenForm] = React.useState(false);
  const [editing, setEditing] = React.useState<TaskDto | null>(null);
  const [openDelete, setOpenDelete] = React.useState<null | TaskDto>(null);
  const [toast, setToast] = React.useState<{ type: "success" | "error"; msg: string } | null>(null);

  const createMut = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      setToast({ type: "success", msg: "Tarefa criada!" });
      setOpenForm(false);
    },
    onError: (err: unknown) => {
      let errorMsg = "Erro ao criar";
      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as { response?: { data?: { error?: string } } }).response;
        if (response?.data?.error) {
          errorMsg = response.data.error;
        }
      }
      setToast({ type: "error", msg: errorMsg });
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTaskRequest }) => updateTask(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      setToast({ type: "success", msg: "Tarefa atualizada!" });
      setEditing(null);
      setOpenForm(false);
    },
    onError: (err: unknown) => {
      let errorMsg = "Erro ao atualizar";
      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as { response?: { data?: { error?: string } } }).response;
        if (response?.data?.error) {
          errorMsg = response.data.error;
        }
      }
      setToast({ type: "error", msg: errorMsg });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      setToast({ type: "success", msg: "Tarefa excluída!" });
      setOpenDelete(null);
    },
    onError: () => setToast({ type: "error", msg: "Erro ao excluir" }),
  });

  const tasks = data ?? [];

  function handleToggleDone(task: TaskDto) {
    const payload: UpdateTaskRequest = {
      isCompleted: !task.isCompleted,
    };
    updateMut.mutate({ id: task.id, payload });
  }

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            To-Do App
          </Typography>

          <FormControl size="small" sx={{ minWidth: 160, mr: 2 }}>
            <InputLabel id="filter-label">Filtro</InputLabel>
            <Select
              labelId="filter-label"
              label="Filtro"
              value={filter}
              onChange={(e) => setFilter(e.target.value as TaskFilter)}
            >
              {TaskFilterValues.map((v) => (
                <MenuItem key={v} value={v}>
                  {TaskFilterLabel[v]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title="Recarregar">
            <IconButton color="inherit" onClick={() => refetch()}>
              <ReplayIcon />
            </IconButton>
          </Tooltip>

          <Button color="inherit" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpenForm(true); }}>
            Nova
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Paper variant="outlined">
          <Box p={2}>
            <Stack direction="row" spacing={1} mb={2} alignItems="center">
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Tarefas
              </Typography>
              <Chip label={`${tasks.length} itens`} />
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {isLoading ? (
              <Stack alignItems="center" py={6}><CircularProgress /></Stack>
            ) : isError ? (
              <Alert severity="error">
                Falha ao carregar tarefas. {typeof error === "object" && error !== null && "message" in error ? String((error as { message?: string }).message) : ""}
              </Alert>
            ) : tasks.length === 0 ? (
              <Alert severity="info">Nenhuma tarefa encontrada.</Alert>
            ) : (
              <List dense>
                {tasks.map((t) => (
                  <ListItem
                    key={t.id}
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Editar">
                          <IconButton edge="end" onClick={() => { setEditing(t); setOpenForm(true); }}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton edge="end" onClick={() => setOpenDelete(t)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                  >
                    <Checkbox
                      edge="start"
                      checked={t.isCompleted}
                      onChange={() => handleToggleDone(t)}
                      tabIndex={-1}
                    />
                    <ListItemText
                      primary={t.title}
                      secondary={t.description}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Dialog Criar/Editar */}
      <TaskFormDialog
        open={openForm}
        initial={editing}
        onClose={() => { setOpenForm(false); setEditing(null); }}
        onSubmit={(payload) => {
          if (editing) {
            updateMut.mutate({ id: editing.id, payload: payload as UpdateTaskRequest });
          } else {
            // create sempre começa como não concluída no backend (ou conforme regra do serviço)
            createMut.mutate(payload as CreateTaskRequest);
          }
        }}
      />

      {/* Dialog Excluir */}
      <ConfirmDialog
        open={!!openDelete}
        title="Excluir tarefa"
        message={`Deseja excluir "${openDelete?.title}"?`}
        confirmText="Excluir"
        onClose={() => setOpenDelete(null)}
        onConfirm={() => openDelete && deleteMut.mutate(openDelete.id)}
      />

      {/* Toasts */}
      <Snackbar
          open={!!toast}
          autoHideDuration={3000}
          onClose={() => setToast(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          {toast ? (
            <Alert severity={toast.type} onClose={() => setToast(null)}>
              {toast.msg}
            </Alert>
          ) : undefined}
        </Snackbar>
    </>
  );
}