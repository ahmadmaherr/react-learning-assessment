import { useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { TaskActionsContext, TaskStateContext } from './contexts';
import type { TaskActions } from './contexts';
import { loadInitialState, saveState } from './storage';
import { tasksReducer } from './tasksReducer';

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tasksReducer, undefined, loadInitialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const actions = useMemo<TaskActions>(
    () => ({
      // Ids are created here, outside the reducer, so the reducer stays pure.
      addTask: (task) =>
        dispatch({ type: 'ADD_TASK', task: { ...task, id: crypto.randomUUID(), completed: false } }),
      toggleTask: (id) => dispatch({ type: 'TOGGLE_TASK', id }),
      updateTask: (id, changes) => dispatch({ type: 'UPDATE_TASK', id, changes }),
      deleteTask: (id) => dispatch({ type: 'DELETE_TASK', id }),
      setFilter: (filter) => dispatch({ type: 'SET_FILTER', filter }),
    }),
    [],
  );

  return (
    <TaskStateContext.Provider value={state}>
      <TaskActionsContext.Provider value={actions}>{children}</TaskActionsContext.Provider>
    </TaskStateContext.Provider>
  );
}
