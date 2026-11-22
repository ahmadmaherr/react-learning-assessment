import { useMemo } from 'react';
import { useTaskState } from '../state/hooks';
import { isOverdue } from '../utils/date';

export function TaskSummary() {
  const { tasks } = useTaskState();
  const counts = useMemo(
    () => ({
      total: tasks.length,
      completed: tasks.filter((t) => t.completed).length,
      overdue: tasks.filter((t) => isOverdue(t.dueDate, t.completed)).length,
    }),
    [tasks],
  );

  return (
    <p className="summary" aria-label="Task summary">
      <strong>{counts.total}</strong> total, <strong>{counts.completed}</strong> completed,{' '}
      <strong className={counts.overdue > 0 ? 'summary__overdue' : undefined}>{counts.overdue}</strong> overdue
    </p>
  );
}
