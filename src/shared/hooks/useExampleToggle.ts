import { useEffect, useState } from 'react';

/**
 * Example custom hook pattern.
 *
 * TODO: Replace with real hooks as features are built (e.g. useDebouncedSearch).
 * Custom hooks encapsulate reusable stateful logic — similar to composables in Vue.
 */
export function useExampleToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // Placeholder effect — demonstrates hook structure only.
  }, [value]);

  const toggle = () => setValue((current) => !current);

  return { value, toggle, setValue };
}
