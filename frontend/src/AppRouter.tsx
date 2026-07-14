/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { LoginPage } from './pages/admin/LoginPage';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Named imports — sesuai export di masing-masing file
import { DashboardPage } from './pages/admin/DashboardPage';
import { BillboardsPage } from './pages/admin/BillboardsPage';
import { BlogPage } from './pages/admin/BlogPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { UsersPage } from './pages/admin/UsersPage';
import { PagesPage } from './pages/admin/PagesPage';
import { PageBuilder } from './pages/admin/PageBuilder';

// Error Boundary (tetap pakai untuk safety)
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class PageErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[Page Error] ${error.message}`);
    if (import.meta.env.DEV && errorInfo.componentStack) {
      console.error(errorInfo.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
          <div className="max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Gagal Memuat Halaman</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {this.state.error?.message || 'Terjadi kesalahan'}
            </p>
            <pre className="text-left text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4 overflow-auto max-h-40">
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Client Site */}
      <Route path="/" element={<App />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Page Builder */}
      <Route
        path="/admin/pages/:id/builder"
        element={
          <ProtectedRoute>
            <PageErrorBoundary>
              <PageBuilder />
            </PageErrorBoundary>
          </ProtectedRoute>
        }
      />

      {/* Protected Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={
          <PageErrorBoundary><DashboardPage /></PageErrorBoundary>
        } />
        <Route path="pages" element={
          <PageErrorBoundary><PagesPage /></PageErrorBoundary>
        } />
        <Route path="billboards" element={
          <PageErrorBoundary><BillboardsPage /></PageErrorBoundary>
        } />
        <Route path="blog" element={
          <PageErrorBoundary><BlogPage /></PageErrorBoundary>
        } />
        <Route path="settings" element={
          <PageErrorBoundary><SettingsPage /></PageErrorBoundary>
        } />
        <Route path="users" element={
          <PageErrorBoundary><UsersPage /></PageErrorBoundary>
        } />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;