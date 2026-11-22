import { sampleTasks } from '../data/sampleTasks';
import type { Task } from '../types';
import { isPriority } from '../utils/priority';
import { initialFilters } from './tasksReducer';
import type { Filters, TasksState } from './tasksReducer';

export const STORAGE_KEY = 'team-task-board:v1';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isTask(value: unknown): value is Task {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value && typeof value.id === 'string' &&
    'title' in value && typeof value.title === 'string' &&
    'projectId' in value && typeof value.projectId === 'string' &&
    'assigneeId' in value && (value.assigneeId === null || typeof value.assigneeId === 'string') &&
    'priority' in value && typeof value.priority === 'string' && isPriority(value.priority) &&
    'dueDate' in value && typeof value.dueDate === 'string' && DATE_PATTERN.test(value.dueDate) &&
    'completed' in value && typeof value.completed === 'boolean'
  );
}

export function isTaskArray(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask);
}

export function isFilters(value: unknown): value is Filters {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value && (value.status === 'all' || value.status === 'active' || value.status === 'completed') &&
    'projectId' in value && typeof value.projectId === 'string' &&
    'search' in value && typeof value.search === 'string'
  );
}

function fallbackState(): TasksState {
  return { tasks: sampleTasks, filters: initialFilters };
}

/** Turns a raw localStorage string into a valid state. Never throws. */
export function parseStoredState(raw: string | null): TasksState {
  if (raw === null) return fallbackState();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return fallbackState();
  }
  if (typeof parsed !== 'object' || parsed === null) return fallbackState();
  const tasks = 'tasks' in parsed && isTaskArray(parsed.tasks) ? parsed.tasks : sampleTasks;
  const filters = 'filters' in parsed && isFilters(parsed.filters) ? parsed.filters : initialFilters;
  return { tasks, filters };
}

export function loadInitialState(): TasksState {
  try {
    return parseStoredState(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return fallbackState();
  }
}

export function saveState(state: TasksState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be full or blocked; the app keeps working in memory.
  }
}
