import { describe, expect, it } from 'vitest';
import { sampleTasks } from '../data/sampleTasks';
import type { Task } from '../types';
import { isTaskArray, parseStoredState } from './storage';
import { initialFilters } from './tasksReducer';

const task: Task = { id: 'x', title: 'Stored task', projectId: 'p1', assigneeId: null, priority: 'low', dueDate: '2030-05-01', completed: false };

describe('storage validation', () => {
  it('accepts valid stored data', () => {
    const filters = { status: 'active', projectId: 'p1', search: 'hi' };
    const state = parseStoredState(JSON.stringify({ tasks: [task], filters }));
    expect(state.tasks).toEqual([task]);
    expect(state.filters).toEqual(filters);
  });

  it('falls back to sample tasks when nothing is stored', () => {
    expect(parseStoredState(null)).toEqual({ tasks: sampleTasks, filters: initialFilters });
  });

  it('falls back on invalid JSON without throwing', () => {
    expect(parseStoredState('{not json')).toEqual({ tasks: sampleTasks, filters: initialFilters });
  });

  it('falls back on the wrong shape', () => {
    const wrongShapes = ['null', '42', '[]', '{"tasks":"nope"}', JSON.stringify({ tasks: [{ ...task, priority: 'urgent' }] }), JSON.stringify({ tasks: [{ id: 1 }] })];
    for (const raw of wrongShapes) {
      expect(parseStoredState(raw).tasks).toEqual(sampleTasks);
    }
  });

  it('isTaskArray rejects bad dates and non-arrays', () => {
    expect(isTaskArray([{ ...task, dueDate: '01/05/2030' }])).toBe(false);
    expect(isTaskArray({})).toBe(false);
    expect(isTaskArray([task])).toBe(true);
  });
});
