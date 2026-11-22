import { memo, useState } from 'react';
import type { Member, Task } from '../types';
import type { TaskChanges } from '../state/tasksReducer';
import { formatDate, isOverdue } from '../utils/date';
import { PRIORITIES, isPriority } from '../utils/priority';

interface TaskItemProps {
  task: Task;
  projectName: string;
  assigneeName: string;
  members: Member[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, changes: TaskChanges) => void;
  onDelete: (id: string) => void;
}

function TaskItemComponent({ task, projectName, assigneeName, members, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [confirming, setConfirming] = useState(false);
  const overdue = isOverdue(task.dueDate, task.completed);

  return (
    <li className={`task${task.completed ? ' task--done' : ''}`}>
      <div className="task__head">
        <label className="task__check">
          <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />
          <span className="task__title">{task.title}</span>
        </label>
        {overdue && <span className="badge badge--overdue">Overdue</span>}
      </div>

      <dl className="task__meta">
        <div><dt>Project</dt><dd>{projectName}</dd></div>
        <div><dt>Assignee</dt><dd>{assigneeName}</dd></div>
        <div><dt>Priority</dt><dd className={`prio prio--${task.priority}`}>{task.priority}</dd></div>
        <div><dt>Due</dt><dd>{formatDate(task.dueDate)}</dd></div>
      </dl>

      <div className="task__controls">
        <label>
          Assignee
          <select
            value={task.assigneeId ?? ''}
            onChange={(e) => onUpdate(task.id, { assigneeId: e.target.value === '' ? null : e.target.value })}
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </label>
        <label>
          Priority
          <select
            value={task.priority}
            onChange={(e) => {
              if (isPriority(e.target.value)) onUpdate(task.id, { priority: e.target.value });
            }}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>

        {confirming ? (
          <span className="confirm" role="group" aria-label={`Confirm deleting ${task.title}`}>
            <span>Delete this task?</span>
            <button type="button" className="btn btn--danger" onClick={() => onDelete(task.id)}>Yes, delete</button>
            <button type="button" className="btn" onClick={() => setConfirming(false)}>Cancel</button>
          </span>
        ) : (
          <button type="button" className="btn" onClick={() => setConfirming(true)}>Delete</button>
        )}
      </div>
    </li>
  );
}

export const TaskItem = memo(TaskItemComponent);
