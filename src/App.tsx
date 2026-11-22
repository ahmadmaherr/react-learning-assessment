import { Filters } from './components/Filters';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { TaskSummary } from './components/TaskSummary';
import { useReferenceData } from './hooks/useReferenceData';
import { TaskProvider } from './state/TaskProvider';

export default function App() {
  const { state, retry } = useReferenceData();

  return (
    <TaskProvider>
      <main className="app">
        <h1>Team task board</h1>
        {state.status === 'loading' && <p className="status" role="status">Loading team members and projects…</p>}
        {state.status === 'error' && (
          <div className="status status--error" role="alert">
            <p>{state.message}</p>
            <button type="button" className="btn btn--primary" onClick={retry}>Retry</button>
          </div>
        )}
        {state.status === 'ready' && (
          <>
            <TaskForm members={state.members} projects={state.projects} />
            <TaskSummary />
            <Filters projects={state.projects} />
            <TaskList members={state.members} projects={state.projects} />
          </>
        )}
      </main>
    </TaskProvider>
  );
}
