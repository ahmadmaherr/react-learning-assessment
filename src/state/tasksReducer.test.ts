import { describe, expect, it } from 'vitest';
import type { Task } from '../types';
import { initialFilters, tasksReducer } from './tasksReducer';
import type { TasksState } from './tasksReducer';

function deepFreeze<T>(value: T): T {
  if (typeof value === 'object' && value !== null) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

const a: Task = { id: 'a', title: 'Task A', projectId: 'p1', assigneeId: null, priority: 'low', dueDate: '2030-01-01', completed: false };
const b: Task = { id: 'b', title: 'Task B', projectId: 'p2', assigneeId: 'm1', priority: 'high', dueDate: '2030-02-01', completed: true };
const base: TasksState = { tasks: [a, b], filters: initialFilters };

describe('tasksReducer', () => {
  it('ADD_TASK appends the task', () => {
    const c: Task = { ...a, id: 'c' };
    expect(tasksReducer(deepFreeze(structuredClone(base)), { type: 'ADD_TASK', task: c }).tasks.map((t) => t.id)).toEqual(['a', 'b', 'c']);
  });

  it('TOGGLE_TASK flips completed for one task only', () => {
    const next = tasksReducer(deepFreeze(structuredClone(base)), { type: 'TOGGLE_TASK', id: 'a' });
    expect(next.tasks[0].completed).toBe(true);
    expect(next.tasks[1]).toEqual(b);
  });

  it('UPDATE_TASK changes assignee and priority', () => {
    const state = deepFreeze(structuredClone(base));
    const assigned = tasksReducer(state, { type: 'UPDATE_TASK', id: 'a', changes: { assigneeId: 'm2' } });
    expect(assigned.tasks[0].assigneeId).toBe('m2');
    const unassigned = tasksReducer(assigned, { type: 'UPDATE_TASK', id: 'a', changes: { assigneeId: null, priority: 'high' } });
    expect(unassigned.tasks[0]).toMatchObject({ assigneeId: null, priority: 'high' });
  });

  it('DELETE_TASK removes the task', () => {
    const next = tasksReducer(deepFreeze(structuredClone(base)), { type: 'DELETE_TASK', id: 'a' });
    expect(next.tasks).toEqual([b]);
  });

  it('SET_FILTER merges into the filters', () => {
    const next = tasksReducer(deepFreeze(structuredClone(base)), { type: 'SET_FILTER', filter: { status: 'active', search: 'x' } });
    expect(next.filters).toEqual({ status: 'active', projectId: 'all', search: 'x' });
  });

  it('never mutates the previous state and returns new references', () => {
    const state = deepFreeze(structuredClone(base));
    const snapshot = structuredClone(base);
    const actions = [
      { type: 'ADD_TASK', task: { ...a, id: 'z' } },
      { type: 'TOGGLE_TASK', id: 'a' },
      { type: 'UPDATE_TASK', id: 'a', changes: { priority: 'medium' } },
      { type: 'DELETE_TASK', id: 'a' },
      { type: 'SET_FILTER', filter: { search: 'q' } },
    ] as const;
    for (const action of actions) {
      const next = tasksReducer(state, action);
      expect(next).not.toBe(state);
      expect(state).toEqual(snapshot); // frozen state would also throw on mutation
    }
  });
});
