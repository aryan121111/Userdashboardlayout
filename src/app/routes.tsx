import { createBrowserRouter } from 'react-router';
import { IAMOverview } from './components/IAMOverview';
import { UserDetail } from './components/UserDetail';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <IAMOverview />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <IAMOverview />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user/:userId',
    element: (
      <ProtectedRoute>
        <UserDetail />
      </ProtectedRoute>
    ),
  },
]);