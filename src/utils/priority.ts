import type { Priority } from '../types';

export const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high'];

export function isPriority(value: string): value is Priority {
  return PRIORITIES.some((p) => p === value);
}
