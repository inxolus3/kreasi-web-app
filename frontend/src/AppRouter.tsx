import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { LoginPage } from './pages/admin/LoginPage';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const BillboardsPage = lazy(() => import('./pages/admin/BillboardsPage'));
const BlogPage = lazy(() => import('./pages/admin/BlogPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const PagesPage = lazy(() => import('./pages/admin/PagesPage'));
const PageBuilder = lazy(() => import('./pages/admin/PageBuilder'));

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat halaman...</div>}>
      <Routes>
      {/* Public Client Site */}
      <Route path="/" element={<App />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Visual Page Builder View (Full Viewport, Non-Nested inside standard navigation) */}
      <Route
        path="/admin/pages/:id/builder"
        element={
          <ProtectedRoute>
            <PageBuilder />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Workspace */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="pages" element={<PagesPage />} />
        <Route path="billboards" element={<BillboardsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>

      {/* Fallback Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
};

export default AppRouter;
