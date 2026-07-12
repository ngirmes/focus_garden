import { getTaskById, setTaskCompleted, deleteTask, Task } from '../db/tasks';

// A task's own row doesn't distinguish "not found" from "belongs to someone
// else" — both cases throw the same error so ownership isn't leaked to the client.
async function assertOwnership(userId: number, taskId: number): Promise<Task> {
  const task = await getTaskById(taskId);
  if (!task || task.user_id !== userId) throw new Error('Task not found');
  return task;
}

export async function updateTaskCompletion(
  userId: number,
  taskId: number,
  completed: boolean
): Promise<Task> {
  await assertOwnership(userId, taskId);
  return setTaskCompleted(taskId, completed);
}

export async function removeTask(userId: number, taskId: number): Promise<void> {
  await assertOwnership(userId, taskId);
  await deleteTask(taskId);
}
