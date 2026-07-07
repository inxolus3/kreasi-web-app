import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { LoginPage } from './pages/admin/LoginPage';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardPage } from './pages/admin/DashboardPage';
import { BillboardsPage } from './pages/admin/BillboardsPage';
import { BlogPage } from './pages/admin/BlogPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { UsersPage } from './pages/admin/UsersPage';
import { PagesPage } from './pages/admin/PagesPage';
import { PageBuilder } from './pages/admin/PageBuilder';

export const AppRouter: React.FC = () => {
  return (
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
  );
};

export default AppRouter;
