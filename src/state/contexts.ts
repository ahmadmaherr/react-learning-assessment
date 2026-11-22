import { createContext } from 'react';
import type { NewTask } from '../types';
import type { Filters, TaskChanges, TasksState } from './tasksReducer';

export interface TaskActions {
  addTask: (task: NewTask) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, changes: TaskChanges) => void;
  deleteTask: (id: string) => void;
  setFilter: (filter: Partial<Filters>) => void;
}

export const TaskStateContext = createContext<TasksState | null>(null);
export const TaskActionsContext = createContext<TaskActions | null>(null);
