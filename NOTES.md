# Notes
**1. useReducer and ids.** The task list and the filters change together through a handful of named actions (add, toggle, update, delete, set filter). A reducer keeps all of those transitions in one pure function that I can test without React. Ids come from `crypto.randomUUID()` in the provider's `addTask`, not in the reducer, because a reducer must return the same output for the same input. A random id inside it would break that, and React may call reducers twice in Strict Mode and produce two different ids.

**2. Separate contexts.** State changes on almost every action; the action functions never change. With two contexts, components that only dispatch (like the task form) read the actions context and do not re-render when tasks change. If both lived in one context value, every consumer would re-render on every state change, even those that only needed `addTask`.

**3. useReferenceData.** An `inFlight` ref makes `retry` do nothing while a request is running, so repeated clicks cannot start a second one. Each effect run has an `ignore` flag that its cleanup sets to true. If the component unmounts, or a newer attempt starts, the older promise result is dropped instead of calling `setState`.

**4. With more time.** I would add component tests for Retry and delete confirmation, and make due dates and the "today" check use one shared clock so overdue state refreshes after midnight.
