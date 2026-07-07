import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Image as ImageIcon,
  FileText,
  Settings as SettingsIcon,
  Users as UsersIcon,
  LogOut,
  Menu,
  X,
  User,
  ExternalLink,
  Layers
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Pages',
      path: '/admin/pages',
      icon: Layers,
    },
    {
      name: 'Billboards',
      path: '/admin/billboards',
      icon: ImageIcon,
    },
    {
      name: 'Blog Posts',
      path: '/admin/blog',
      icon: FileText,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: SettingsIcon,
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: UsersIcon,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div id="admin-root" className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans">
      {/* Sidebar for Desktop */}
      <aside
        id="desktop-sidebar"
        className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 shrink-0 sticky top-0 h-screen justify-between"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-zinc-950 font-bold text-xl shadow-lg shadow-amber-500/20">
              K
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">Kreasi CMS</h1>
              <p className="text-xs text-amber-500 font-medium tracking-wider uppercase">Console</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  id={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-amber-500 text-zinc-950 font-semibold shadow-md shadow-amber-500/10'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <IconComp className={`w-5 h-5 ${active ? 'text-zinc-950' : 'text-zinc-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-zinc-800/50 rounded-lg">
            <div className="w-9 h-9 bg-zinc-700 rounded-full flex items-center justify-center text-amber-500">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-zinc-500 capitalize truncate">{user?.role || 'admin'}</p>
            </div>
          </div>

          <button
            id="btn-sidebar-logout"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:text-white hover:bg-rose-950/40 border border-transparent hover:border-rose-900/50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <div
        id="mobile-sidebar-overlay"
        className={`fixed inset-0 bg-zinc-950/80 z-40 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        id="mobile-sidebar"
        className={`fixed top-0 bottom-0 left-0 w-64 bg-zinc-900 border-r border-zinc-800 z-50 flex flex-col justify-between transition-transform duration-300 transform md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center text-zinc-950 font-bold text-lg">
                K
              </div>
              <div>
                <h1 className="font-bold text-base text-white">Kreasi CMS</h1>
                <p className="text-[10px] text-amber-500 font-medium uppercase">Console</p>
              </div>
            </div>
            <button
              id="btn-close-mobile-sidebar"
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  id={`mobile-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-amber-500 text-zinc-950 font-semibold shadow-md shadow-amber-500/10'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-zinc-800/50 rounded-lg">
            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-amber-500">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-zinc-500 capitalize truncate">{user?.role || 'admin'}</p>
            </div>
          </div>

          <button
            id="btn-mobile-logout"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:text-white hover:bg-rose-950/40 border border-transparent hover:border-rose-900/50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div id="main-layout-area" className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header
          id="admin-header"
          className="h-16 bg-zinc-900/50 backdrop-blur border-b border-zinc-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30"
        >
          <div className="flex items-center gap-4">
            <button
              id="btn-toggle-sidebar"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:block">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Welcome back</p>
              <p className="text-sm font-medium text-zinc-300">{user?.name || 'Administrator'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              id="btn-visit-site"
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-colors border border-zinc-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Visit Website
            </a>
          </div>
        </header>

        {/* Content Body */}
        <main id="admin-main-content" className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
