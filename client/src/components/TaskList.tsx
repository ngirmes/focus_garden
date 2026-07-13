import { useState } from "react";
import type { FormEvent } from "react";
import type { TaskEntry } from "../api/tasks";
import styles from "./TaskList.module.css";

interface TaskListProps {
  tasks: TaskEntry[];
  onAdd: (title: string) => void;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskList({ tasks, onAdd, onToggle, onDelete }: TaskListProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
  };

  return (
    <section className={styles.panel}>
      <h2 className={styles.heading}>Tasks</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task…"
          maxLength={200}
        />
        <button className={`${styles.addBtn} btn-primary`} type="submit" disabled={!title.trim()}>
          Add
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className={styles.empty}>No tasks yet — add one to get started.</p>
      ) : (
        <ul className={styles.list}>
          {tasks.map((task) => (
            <li key={task.id} className={styles.item}>
              <label className={styles.label}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => onToggle(task.id, e.target.checked)}
                />
                <span className={`${styles.title} ${task.completed ? styles.completed : ""}`}>
                  {task.title}
                </span>
              </label>
              <button
                className={styles.deleteBtn}
                onClick={() => onDelete(task.id)}
                aria-label={`Delete ${task.title}`}
                type="button"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
