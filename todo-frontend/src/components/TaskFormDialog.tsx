import * as React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack
} from "@mui/material";
import type { CreateTaskRequest, TaskDto, UpdateTaskRequest } from "../types";
import { TaskStatus } from "../status";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskRequest | UpdateTaskRequest) => void;
  initial?: Partial<TaskDto>;
};

export default function TaskFormDialog({ open, initial, onClose, onSubmit }: Props) {
  const isEdit = !!initial;

  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [description, setDescription] = React.useState(initial?.description ?? "");
  const [status, setStatus] = React.useState<TaskStatus>(initial?.status ?? TaskStatus.NotStarted);

  React.useEffect(() => {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setStatus(initial?.status ?? TaskStatus.NotStarted);
  }, [initial, open]);

  function handleSubmit() {
    if (!title.trim()) return;

    if (isEdit) {
      const payload: UpdateTaskRequest = {
        title: title.trim(),
        description: description.trim(),
        status
      };
      onSubmit(payload);
    } else {
      const payload: CreateTaskRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
      };
      onSubmit(payload);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
            fullWidth
          />
          <TextField
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          padding: "0 24px 20px"
        }}
      >
        <Button onClick={onClose} color="inherit" variant="outlined">Cancelar</Button>
        <Button onClick={handleSubmit} color="info" variant="contained">
          {isEdit ? "Salvar" : "Criar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}