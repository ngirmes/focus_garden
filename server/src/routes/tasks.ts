import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { getTasksByUser, createTask } from '../db/tasks';
import { updateTaskCompletion, removeTask } from '../services/tasks';

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await getTasksByUser(req.user!.userId);
    return res.json(tasks);
  } catch (err) {
    next(err);
  }
});

const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'A task title is required').max(200),
});

router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const parseResult = createTaskSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'A task title is required' });
  }

  try {
    const task = await createTask(req.user!.userId, parseResult.data.title);
    return res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

const taskParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const updateTaskSchema = z.object({
  completed: z.boolean(),
});

router.patch('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const paramsResult = taskParamsSchema.safeParse(req.params);
  const bodyResult = updateTaskSchema.safeParse(req.body);
  if (!paramsResult.success || !bodyResult.success) {
    return res.status(400).json({ error: 'Invalid task update' });
  }

  try {
    const task = await updateTaskCompletion(
      req.user!.userId,
      paramsResult.data.id,
      bodyResult.data.completed
    );
    return res.json(task);
  } catch (err) {
    if (err instanceof Error && err.message === 'Task not found') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const parseResult = taskParamsSchema.safeParse(req.params);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid task id' });
  }

  try {
    await removeTask(req.user!.userId, parseResult.data.id);
    return res.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === 'Task not found') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
});

export default router;
