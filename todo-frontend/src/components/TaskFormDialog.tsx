import * as React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControlLabel, Checkbox, Stack
} from "@mui/material";
import type { CreateTaskRequest, TaskDto, UpdateTaskRequest } from "../types";

type Props = {
  open: boolean;
  initial?: TaskDto | null;
  onClose: () => void;
  onSubmit: (payload: CreateTaskRequest | UpdateTaskRequest) => void;
};

export default function TaskFormDialog({ open, initial, onClose, onSubmit }: Props) {
  const isEdit = !!initial;

  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [description, setDescription] = React.useState(initial?.description ?? "");
  const [isCompleted, setIsCompleted] = React.useState<boolean>(initial?.isCompleted ?? false);

  React.useEffect(() => {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setIsCompleted(initial?.isCompleted ?? false);
  }, [initial, open]);

  function handleSubmit() {
    if (!title.trim()) return;
    if (isEdit) {
      const payload: UpdateTaskRequest = { title: title.trim(), description: description.trim(), isCompleted };
      onSubmit(payload);
    } else {
      const payload: CreateTaskRequest = { title: title.trim(), description: description.trim() || undefined };
      onSubmit(payload);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Título" value={title} onChange={(e) => setTitle(e.target.value)}
            autoFocus required fullWidth
          />
          <TextField
            label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)}
            fullWidth multiline minRows={3}
          />
          {isEdit && (
            <FormControlLabel
              control={<Checkbox checked={isCompleted} onChange={(e) => setIsCompleted(e.target.checked)} />}
              label="Concluída"
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEdit ? "Salvar" : "Criar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}