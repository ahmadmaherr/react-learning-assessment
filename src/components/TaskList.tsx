import { useMemo } from 'react';
import { useVisibleTasks } from '../hooks/useVisibleTasks';
import { useTaskActions } from '../state/hooks';
import type { Member, Project } from '../types';
import { TaskItem } from './TaskItem';

interface Props {
  members: Member[];
  projects: Project[];
}

export function TaskList({ members, projects }: Props) {
  const tasks = useVisibleTasks();
  const { toggleTask, updateTask, deleteTask } = useTaskActions();

  const memberNames = useMemo(() => new Map(members.map((m) => [m.id, m.name])), [members]);
  const projectNames = useMemo(() => new Map(projects.map((p) => [p.id, p.name])), [projects]);

  if (tasks.length === 0) {
    return <p className="empty">No tasks match these filters. Add one above or clear the filters.</p>;
  }

  return (
    <ul className="tasks">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          projectName={projectNames.get(task.projectId) ?? 'Unknown project'}
          assigneeName={task.assigneeId === null ? 'Unassigned' : (memberNames.get(task.assigneeId) ?? 'Unknown member')}
          members={members}
          onToggle={toggleTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      ))}
    </ul>
  );
}
