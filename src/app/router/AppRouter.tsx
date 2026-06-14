import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { NotificationsPage } from '../../features/notifications/components/NotificationsPage';
import { SettingsPage } from '../../features/settings/components/SettingsPage';
import { TransportPage } from '../../features/transport/components/TransportPage';

/**
 * Application route configuration.
 * Each route maps to a page component inside its feature folder.
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <TransportPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
