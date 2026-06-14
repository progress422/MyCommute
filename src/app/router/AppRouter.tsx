import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { FavoritesPage } from '../../features/favorites/components/FavoritesPage';
import { HistoryPage } from '../../features/history/components/HistoryPage';
import { HomePage } from '../../features/routes/components/HomePage';
import { RoutesPage } from '../../features/routes/components/RoutesPage';
import { SettingsPage } from '../../features/settings/components/SettingsPage';

/**
 * Application route configuration.
 * Each route maps to a placeholder page component inside its feature folder.
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'routes', element: <RoutesPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'history', element: <HistoryPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
