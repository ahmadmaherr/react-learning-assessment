import { useMemo } from 'react';
import { useTaskState } from '../state/hooks';
import type { Task } from '../types';
import { useDebouncedValue } from './useDebouncedValue';

export function useVisibleTasks(): Task[] {
  const { tasks, filters } = useTaskState();
  const search = useDebouncedValue(filters.search, 300);
  const { status, projectId } = filters;

  return useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks
      .filter((t) => status === 'all' || (status === 'completed' ? t.completed : !t.completed))
      .filter((t) => projectId === 'all' || t.projectId === projectId)
      .filter((t) => query === '' || t.title.toLowerCase().includes(query))
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [tasks, status, projectId, search]);
}
