import type { Priority, Task } from '../types';

export type StatusFilter = 'all' | 'active' | 'completed';

export interface Filters {
  status: StatusFilter;
  projectId: string; // 'all' or a project id
  search: string;
}

export interface TasksState {
  tasks: Task[];
  filters: Filters;
}

export interface TaskChanges {
  assigneeId?: string | null;
  priority?: Priority;
}

export type TaskAction =
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'TOGGLE_TASK'; id: string }
  | { type: 'UPDATE_TASK'; id: string; changes: TaskChanges }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'SET_FILTER'; filter: Partial<Filters> };

export const initialFilters: Filters = { status: 'all', projectId: 'all', search: '' };

export function tasksReducer(state: TasksState, action: TaskAction): TasksState {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.task] };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t)),
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, ...action.changes } : t)),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.filter } };
    default: {
      const unhandled: never = action;
      return unhandled;
    }
  }
}
