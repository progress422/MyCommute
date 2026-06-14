import { AppProviders } from './app/providers/AppProviders';
import { AppRouter } from './app/router/AppRouter';

/**
 * Root application component.
 * Keeps providers and routing separate for clarity — similar to App.vue wrapping
 * router-view and global plugins in a Vue app.
 */
export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
