/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiV1Client, blogClient } from '../../api/client';
import {
  LayoutDashboard,
  Image as ImageIcon,
  FileText,
  Users as UsersIcon,
  PlusCircle,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';

interface DashboardStats {
  totalBillboards: number;
  totalPosts: number;
  totalUsers: number;
  totalPages: number;
  totalCategories: number;
  totalTags: number;
}

interface RecentItem {
  id: number;
  name?: string;
  title?: string;
  city?: string;
  province?: string;
  status?: string;
  createdAt: string;
  thumbnail?: string;
  images?: string[];
  image?: string;
}

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBillboards: 0,
    totalPosts: 0,
    totalUsers: 0,
    totalPages: 0,
    totalCategories: 0,
    totalTags: 0,
  });
  const [recentBillboards, setRecentBillboards] = useState<RecentItem[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch only endpoints that exist
      const [billboardsRes, postsRes] = await Promise.all([
        apiV1Client.get('/public/billboards').catch(() => ({ data: { data: [] } })),
        blogClient.get('/posts').catch(() => ({ data: { data: [] } })),
      ]);

      const billboards = billboardsRes.data?.data || [];
      const posts = postsRes.data?.data || [];

      setStats({
        totalBillboards: billboards.length,
        totalPosts: posts.length,
        totalUsers: 1, // Static for now
        totalPages: 0, // Static for now
        totalCategories: 0, // Static for now
        totalTags: 0, // Static for now
      });

      setRecentBillboards(billboards.slice(0, 3));
      setRecentPosts(posts.slice(0, 3));
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Gagal memuat data dashboard';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchDashboardData();
}, []);

  const statsCards = [
    {
      title: 'Total Billboards',
      value: stats.totalBillboards,
      icon: ImageIcon,
      color: 'from-amber-500/10 to-amber-500/5 text-amber-500 border-amber-500/20',
      desc: 'Media iklan luar ruang aktif',
      link: '/admin/billboards',
    },
    {
      title: 'Blog Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'from-blue-500/10 to-blue-500/5 text-blue-500 border-blue-500/20',
      desc: 'Artikel edukasi & informasi',
      link: '/admin/blog',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'from-emerald-500/10 to-emerald-500/5 text-emerald-500 border-emerald-500/20',
      desc: 'Administrator & staf pengelola',
      link: '/admin/users',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: FileText,
      color: 'from-pink-500/10 to-pink-500/5 text-pink-500 border-pink-500/20',
      desc: 'Kategori konten',
      link: '/admin/blog',
    },
    {
      title: 'Tags',
      value: stats.totalTags,
      icon: FileText,
      color: 'from-yellow-500/10 to-yellow-500/5 text-yellow-500 border-yellow-500/20',
      desc: 'Tag konten',
      link: '/admin/blog',
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-400 mb-4">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-500 text-zinc-950 rounded-lg font-semibold"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="dashboard-page" className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-amber-500" />
            Dashboard Overview
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Status dan aktivitas ringkas dari sistem manajemen konten Kreasi</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/billboards"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10"
          >
            <PlusCircle className="w-4 h-4" />
            Add Billboard
          </Link>
          <Link
            to="/admin/blog"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold border border-zinc-700 rounded-xl text-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 text-zinc-400" />
            Add Post
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className={`bg-gradient-to-br ${card.color} border p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 block relative overflow-hidden group`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{card.title}</p>
                  <h3 className="text-4xl font-black text-white mt-1 group-hover:text-amber-400 transition-colors">
                    {isLoading ? '...' : card.value}
                  </h3>
                </div>
                <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
                  <IconComp className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mt-2">
                <span>{card.desc}</span>
                <span className="flex items-center gap-1 text-amber-500 font-semibold group-hover:translate-x-1 transition-transform">
                  Kelola <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Activities Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Billboards */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-500" />
              Recent Billboards
            </h2>
            <Link to="/admin/billboards" className="text-xs font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4 py-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-12 bg-zinc-800/40 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentBillboards.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              Belum ada billboard yang terdaftar.
            </div>
          ) : (
            <div className="space-y-4">
              {recentBillboards.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800/60 hover:border-zinc-700/80 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center text-zinc-500 border border-zinc-700">
                      {b.thumbnail || b.images?.[0] || b.image ? (
                        <img src={b.thumbnail || b.images?.[0] || b.image} alt={b.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-zinc-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white leading-tight">{b.name}</h4>
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-zinc-600" />
                        {b.city}, {b.province}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    b.status === 'AVAILABLE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {b.status || 'AVAILABLE'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Posts */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Recent Blog Posts
            </h2>
            <Link to="/admin/blog" className="text-xs font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4 py-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-12 bg-zinc-800/40 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              Belum ada artikel yang diterbitkan.
            </div>
          ) : (
            <div className="space-y-4">
              {recentPosts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800/60 hover:border-zinc-700/80 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center text-zinc-500 border border-zinc-700">
                      {p.thumbnail ? (
                        <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="w-5 h-5 text-zinc-600" />
                      )}
                    </div>
                    <div className="overflow-hidden max-w-[200px] md:max-w-xs">
                      <h4 className="text-sm font-semibold text-white leading-tight truncate">{p.title}</h4>
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-zinc-600" />
                        {new Date(p.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    p.status === 'PUBLISHED'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {p.status || 'DRAFT'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};