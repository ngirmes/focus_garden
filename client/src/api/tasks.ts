import { request } from "./client";

export interface TaskEntry {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskRow {
  id: number;
  user_id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

function toTaskEntry(row: TaskRow): TaskEntry {
  return { id: String(row.id), title: row.title, completed: row.completed };
}

export async function getTasks(token: string): Promise<TaskEntry[]> {
  const rows = await request<TaskRow[]>("/api/tasks", token);
  return rows.map(toTaskEntry);
}

export async function createTask(token: string, title: string): Promise<TaskEntry> {
  const row = await request<TaskRow>("/api/tasks", token, {
    method: "POST",
    body: JSON.stringify({ title }),
  });
  return toTaskEntry(row);
}

export async function setTaskCompleted(
  token: string,
  taskId: string,
  completed: boolean,
): Promise<TaskEntry> {
  const row = await request<TaskRow>(`/api/tasks/${taskId}`, token, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });
  return toTaskEntry(row);
}

export async function deleteTask(token: string, taskId: string): Promise<void> {
  await request<{ success: boolean }>(`/api/tasks/${taskId}`, token, {
    method: "DELETE",
  });
}
