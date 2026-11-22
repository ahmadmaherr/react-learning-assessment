import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTaskActions } from '../state/hooks';
import type { Member, Project } from '../types';
import { todayISO } from '../utils/date';
import { PRIORITIES, isPriority } from '../utils/priority';

interface Props {
  members: Member[];
  projects: Project[];
}

interface Values {
  title: string;
  projectId: string;
  assigneeId: string;
  priority: string;
  dueDate: string;
}

type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = { title: '', projectId: '', assigneeId: '', priority: '', dueDate: '' };

function validate(v: Values): Errors {
  const errors: Errors = {};
  const title = v.title.trim();
  if (title.length < 3 || title.length > 80) errors.title = 'Title must be 3 to 80 characters.';
  if (v.projectId === '') errors.projectId = 'Choose a project.';
  if (!isPriority(v.priority)) errors.priority = 'Choose a priority.';
  if (v.dueDate === '') errors.dueDate = 'Pick a due date.';
  else if (v.dueDate < todayISO()) errors.dueDate = 'Due date cannot be in the past.';
  return errors;
}

export function TaskForm({ members, projects }: Props) {
  const { addTask } = useTaskActions();
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});

  const errors = validate(values);
  const valid = Object.keys(errors).length === 0;

  const set = (field: Field, value: string) => setValues((prev) => ({ ...prev, [field]: value }));
  const blur = (field: Field) => setTouched((prev) => ({ ...prev, [field]: true }));
  const showError = (field: Field) => (touched[field] ? errors[field] : undefined);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid || !isPriority(values.priority)) return;
    addTask({
      title: values.title.trim(),
      projectId: values.projectId,
      assigneeId: values.assigneeId === '' ? null : values.assigneeId,
      priority: values.priority,
      dueDate: values.dueDate,
    });
    setValues(EMPTY);
    setTouched({});
  };

  const error = (field: Field) => {
    const message = showError(field);
    return message ? <span id={`${field}-error`} className="field__error" role="alert">{message}</span> : null;
  };
  const describe = (field: Field) => (showError(field) ? `${field}-error` : undefined);

  return (
    <form className="form" onSubmit={handleSubmit} noValidate aria-label="Add a task">
      <label className="field field--wide">
        Title
        <input
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
          onBlur={() => blur('title')}
          aria-invalid={showError('title') ? true : undefined}
          aria-describedby={describe('title')}
        />
        {error('title')}
      </label>
      <label className="field">
        Project
        <select
          value={values.projectId}
          onChange={(e) => set('projectId', e.target.value)}
          onBlur={() => blur('projectId')}
          aria-describedby={describe('projectId')}
        >
          <option value="">Select a project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {error('projectId')}
      </label>
      <label className="field">
        Assignee (optional)
        <select value={values.assigneeId} onChange={(e) => set('assigneeId', e.target.value)}>
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </label>
      <label className="field">
        Priority
        <select
          value={values.priority}
          onChange={(e) => set('priority', e.target.value)}
          onBlur={() => blur('priority')}
          aria-describedby={describe('priority')}
        >
          <option value="">Select a priority</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {error('priority')}
      </label>
      <label className="field">
        Due date
        <input
          type="date"
          value={values.dueDate}
          min={todayISO()}
          onChange={(e) => set('dueDate', e.target.value)}
          onBlur={() => blur('dueDate')}
          aria-describedby={describe('dueDate')}
        />
        {error('dueDate')}
      </label>
      <button type="submit" className="btn btn--primary" disabled={!valid}>Add task</button>
    </form>
  );
}
