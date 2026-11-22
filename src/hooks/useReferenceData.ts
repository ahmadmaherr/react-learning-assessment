import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMembers, fetchProjects } from '../api/mockApi';
import type { Member, Project } from '../types';

export type ReferenceState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; members: Member[]; projects: Project[] };

export function useReferenceData(): { state: ReferenceState; retry: () => void } {
  const [state, setState] = useState<ReferenceState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const inFlight = useRef(false);

  useEffect(() => {
    let ignore = false; // flipped by cleanup: unmount or a newer attempt
    inFlight.current = true;

    Promise.all([fetchMembers(), fetchProjects()])
      .then(([members, projects]) => {
        if (ignore) return;
        inFlight.current = false;
        setState({ status: 'ready', members, projects });
      })
      .catch((err: unknown) => {
        if (ignore) return;
        inFlight.current = false;
        setState({ status: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' });
      });

    return () => {
      ignore = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    if (inFlight.current) return;
    inFlight.current = true;
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  return { state, retry };
}
