import * as React from "react";
import {
  AppBar, Toolbar, Typography, Container, IconButton,
  Tooltip, CircularProgress, Snackbar, Alert, Button,
  Paper, Stack, Card, CardContent, Box,
  Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskRequest, TaskDto, UpdateTaskRequest } from "./types";
import { createTask, updateTask, deleteTask } from "./api/tasks";
import TaskFormDialog from "./components/TaskFormDialog";
import ConfirmDialog from "./components/ConfirmDialog";
import { useTaskList } from "./hooks/useTaskList";
import { TaskStatus } from "./status";
import { TaskStatusMap } from "./status";

// mapeia status para as colunas
const columns = Object.values(TaskStatus).map((status) => TaskStatusMap[status]);

export default function App() {
  const { data, isLoading, isError, refetch, error } = useTaskList({});
  const qc = useQueryClient();

  // dialogs & toasts
  const [openForm, setOpenForm] = React.useState(false);
  const [editing, setEditing] = React.useState<TaskDto | null>(null);
  const [openDelete, setOpenDelete] = React.useState<null | TaskDto>(null);
  const [toast, setToast] = React.useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [defaultStatus, setDefaultStatus] = React.useState<TaskStatus | null>(null);

  const createMut = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      setToast({ type: "success", msg: "Tarefa criada!" });
      setOpenForm(false);
    },
    onError: () => setToast({ type: "error", msg: "Erro ao criar" }),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTaskRequest }) => updateTask(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      setToast({ type: "success", msg: "Tarefa atualizada!" });
      setEditing(null);
      setOpenForm(false);
    },
    onError: () => setToast({ type: "error", msg: "Erro ao atualizar" }),
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

  function handleUpdateStatus(task: TaskDto, newStatus: TaskStatus) {
    const payload: UpdateTaskRequest = { status: newStatus };
    updateMut.mutate({ id: task.id, payload });
  }  

  // agrupar tarefas por status
  const groupedTasks: Record<string, TaskDto[]> = {};
  columns.forEach((col) => (groupedTasks[col.key] = []));
  tasks.forEach((t) => {
    const col = TaskStatusMap[t.status as TaskStatus];
    if (col) groupedTasks[col.key].push(t);
  });

  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const taskId = parseInt(draggableId);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newColumnKey = destination.droppableId;
    const newStatusEntry = Object.entries(TaskStatusMap).find(
      ([, value]) => value.key === newColumnKey
    );
    if (!newStatusEntry) return;

    const newStatus = Number(newStatusEntry[0]) as TaskStatus;
    handleUpdateStatus(task, newStatus);
  }  

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#edf1fc !important" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#323338", fontWeight: "700" }}>
            ToDo
          </Typography>

          <Tooltip title="Recarregar">
            <IconButton sx={{ color: "#323338" }} onClick={() => refetch()}>
              <ReplayIcon />
            </IconButton>
          </Tooltip>

          <Button
            sx={{
              color: "#323338",
              fontWeight: 700,
              textTransform: "none", 
              fontSize: "16px" 
            }}
            startIcon={<AddIcon />}
            onClick={() => { setEditing(null); setOpenForm(true); }}
          >
            Adicionar tarefa
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ padding: "30px 0 !important" }}>
        {isLoading ? (
          <Stack alignItems="center" py={6}><CircularProgress /></Stack>
        ) : isError ? (
          <Alert severity="error">
            Falha ao carregar tarefas. {typeof error === "object" && error !== null && "message" in error ? String((error as { message?: string }).message) : ""}
          </Alert>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Stack
              direction="row"
              spacing={3}
              sx={{
                height: "calc(100vh - 64px - 60px)",
                px: 2,
              }}
            >
              {columns.map((col) => (
                <Droppable droppableId={col.key} key={col.key}>
                  {(provided, snapshot) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      elevation={3}
                      sx={{
                        minWidth: 278,
                        bgcolor: snapshot.isDraggingOver ? "#e0f7fa" : "#f9f9f9",
                        borderRadius: "5px",
                        boxShadow: 0,
                        border: "1px solid #d0d4e4",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        height: "100%",
                        position: "relative",
                        "&:hover .add-task-btn": {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box 
                        display={"flex"}
                        justifyContent={"space-between"}
                        sx={{
                          bgcolor: col.color,
                          borderRadius: "5px 5px 0 0",
                          padding: "8px",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "16px",
                            fontWeight: "700",
                            lineHeight: "inherit"
                          }}
                        >
                          {col.label} {groupedTasks[col.key]?.length > 0 && `${groupedTasks[col.key].length}`}
                        </Typography>
                        <IconButton
                          size="small"
                          className="add-task-btn"
                          sx={{
                            p: 0,
                            width: 25,
                            height: 25,
                            borderRadius: "5px",
                            opacity: 0,
                            transition: "opacity 0.3s",
                            color: "#fff",
                          }}
                          onClick={() => {
                            setEditing(null);
                            setDefaultStatus(Number(Object.keys(TaskStatusMap).find(key => TaskStatusMap[Number(key) as TaskStatus].key === col.key)) as TaskStatus);
                            setOpenForm(true);
                          }}
                        >
                          <AddIcon fontSize="small" sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>

                      <Stack spacing={2} sx={{ flexGrow: 1, p: 1, overflowY: "auto" }}>
                        {groupedTasks[col.key]?.map((t, index) => (
                          <Draggable key={t.id} draggableId={t.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  opacity: snapshot.isDragging ? 0.6 : 1,
                                  borderRadius: "5px",
                                  m: 0,
                                  boxShadow: 0,
                                  border: "1px solid #d0d4e4",
                                  position: "relative",
                                  "&:hover .card-actions": {
                                    opacity: 1,
                                  },
                                }}
                              >
                                <CardContent sx={{ padding: "8px !important" }}>
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                      {t.title}
                                    </Typography>

                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{
                                        overflow: "hidden",
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 2,
                                      }}
                                    >
                                      {t.description}
                                    </Typography>

                                    {/* Status como chip */}
                                    {/* <Chip
                                      label={TaskStatusMap[t.status].label}
                                      size="small"
                                      sx={{
                                        mt: 1,
                                        bgcolor: TaskStatusMap[t.status].color,
                                        color: "#fff",
                                        fontWeight: 600,
                                      }}
                                    /> */}
                                    <Box display={"inline-flex"} gap={"5px"} sx={{ bgcolor: "#f0f0f1", borderRadius: "5px", mt: "10px" }}>
                                      <Box sx={{ bgcolor: TaskStatusMap[t.status].color, borderRadius: "5px 0 0 5px", height: "25px", width: "5px"}}/>
                                      <Typography sx={{ color: "#323338", fontWeight: 500, fontSize: "12px", padding: "3px 6px 3px 0" }}>{TaskStatusMap[t.status].label}</Typography>
                                    </Box>
                                  </Box>

                                  {/* Botões de ação */}
                                  <Box
                                    className="card-actions"
                                    sx={{
                                      display: "flex",
                                      position: "absolute",
                                      top: 8,
                                      right: 8,
                                      opacity: 0,
                                      transition: "opacity 0.3s",
                                      border: "1px solid #d0d4e4",
                                      borderRadius: "5px"
                                    }}
                                  >
                                    <Tooltip title="Editar">
                                      <IconButton size="small"
                                        sx={{
                                          p: 0,
                                          width: 25,
                                          height: 25,
                                          borderRadius: "5px 0 0 5px"
                                        }}
                                        onClick={() => { setEditing(t); setOpenForm(true); }}>
                                        <EditIcon fontSize="small" sx={{ fontSize: 18 }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                      <IconButton
                                        size="small"
                                        sx={{
                                          p: 0,
                                          width: 25,
                                          height: 25,
                                          borderRadius: "0 5px 5px 0"
                                        }}
                                        onClick={() => setOpenDelete(t)}>
                                        <DeleteIcon fontSize="small" sx={{ fontSize: 18 }} />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </CardContent>
                             </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {/* Botão "+ Adicionar tarefa" */}
                        <Button
                          className="add-task-btn"
                          sx={{
                            color: "#323338",
                            fontWeight: 700,
                            textTransform: "none",
                            fontSize: "12px",
                            opacity: 0,
                            transition: "opacity 0.3s",
                          }}
                          onClick={() => {
                            setEditing(null);
                            setDefaultStatus(Number(Object.keys(TaskStatusMap).find(key => TaskStatusMap[Number(key) as TaskStatus].key === col.key)) as TaskStatus);
                            setOpenForm(true);
                          }}
                        >
                          Adicionar tarefa
                        </Button>
                      </Stack>
                    </Paper>
                  )}
                </Droppable>
              ))}
            </Stack>
          </DragDropContext>
        )}
      </Container>

      {/* Dialog Criar/Editar */}
      <TaskFormDialog
        open={openForm}
        initial={editing ?? { status: defaultStatus ?? TaskStatus.NotStarted }}
        onClose={() => { setOpenForm(false); setEditing(null); setDefaultStatus(null); }}
        onSubmit={(payload) => {
          if (editing) {
            updateMut.mutate({ id: editing.id, payload: payload as UpdateTaskRequest });
          } else {
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