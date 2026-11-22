import { useTaskActions, useTaskState } from '../state/hooks';
import type { StatusFilter } from '../state/tasksReducer';
import type { Project } from '../types';

const STATUSES: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export function Filters({ projects }: { projects: Project[] }) {
  const { filters } = useTaskState();
  const { setFilter } = useTaskActions();

  return (
    <section className="filters" aria-label="Filters">
      <label>
        Search titles
        <input type="search" value={filters.search} onChange={(e) => setFilter({ search: e.target.value })} />
      </label>
      <label>
        Status
        <select
          value={filters.status}
          onChange={(e) => {
            const match = STATUSES.find((s) => s.value === e.target.value);
            if (match) setFilter({ status: match.value });
          }}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </label>
      <label>
        Project
        <select value={filters.projectId} onChange={(e) => setFilter({ projectId: e.target.value })}>
          <option value="all">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </label>
    </section>
  );
}
