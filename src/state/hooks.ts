import { useContext } from 'react';
import { TaskActionsContext, TaskStateContext } from './contexts';
import type { TaskActions } from './contexts';
import type { TasksState } from './tasksReducer';

export function useTaskState(): TasksState {
  const value = useContext(TaskStateContext);
  if (value === null) throw new Error('useTaskState must be used inside a <TaskProvider>.');
  return value;
}

export function useTaskActions(): TaskActions {
  const value = useContext(TaskActionsContext);
  if (value === null) throw new Error('useTaskActions must be used inside a <TaskProvider>.');
  return value;
}
