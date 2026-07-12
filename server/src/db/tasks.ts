import { query } from './index';

export interface Task {
  id: number;
  user_id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

export async function getTasksByUser(userId: number): Promise<Task[]> {
  const result = await query<Task>(
    'SELECT id, user_id, title, completed, created_at FROM tasks WHERE user_id = $1 ORDER BY created_at',
    [userId]
  );
  return result.rows;
}

export async function getTaskById(taskId: number): Promise<Task | undefined> {
  const result = await query<Task>(
    'SELECT id, user_id, title, completed, created_at FROM tasks WHERE id = $1',
    [taskId]
  );
  return result.rows[0];
}

export async function createTask(userId: number, title: string): Promise<Task> {
  const result = await query<Task>(
    'INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING id, user_id, title, completed, created_at',
    [userId, title]
  );
  return result.rows[0];
}

export async function setTaskCompleted(taskId: number, completed: boolean): Promise<Task> {
  const result = await query<Task>(
    'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING id, user_id, title, completed, created_at',
    [completed, taskId]
  );
  return result.rows[0];
}

export async function deleteTask(taskId: number): Promise<void> {
  await query('DELETE FROM tasks WHERE id = $1', [taskId]);
}
