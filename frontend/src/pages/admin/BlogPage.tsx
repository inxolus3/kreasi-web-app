/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { blogClient } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Check,
  Award,
  Link as LinkIcon
} from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  gallery?: string[];
  status: 'DRAFT' | 'PUBLISHED';
  featured: boolean;
  categoryId: number;
  authorId: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export const BlogPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form States
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    content: '',
    status: 'DRAFT',
    featured: false,
    categoryId: 1,
    thumbnail: '',
    gallery: [],
    metaTitle: '',
    metaDescription: '',
  });

  const categories = [
    { id: 1, name: 'Tips & Edukasi' },
    { id: 2, name: 'Kreasi Advertising' },
    { id: 3, name: 'Tren Iklan' },
    { id: 4, name: 'Studi Kasus' },
  ];

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await blogClient.get('/posts');
      const data = response.data?.data || response.data || [];
      setPosts(data);
      setFilteredPosts(data);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Gagal memuat artikel';
      console.error(`[Blog] ${message}`);
      triggerAlert('error', message);
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter & Search Logic
  useEffect(() => {
    let result = posts;

    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter((p) => p.status === statusFilter);
    }

    setFilteredPosts(result);
  }, [searchTerm, statusFilter, posts]);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  const handleOpenAdd = () => {
    setCurrentPost(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      status: 'DRAFT',
      featured: false,
      categoryId: 1,
      thumbnail: '',
      gallery: [],
      metaTitle: '',
      metaDescription: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setFormData({
      ...post,
      gallery: post.gallery || [],
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (post: BlogPost) => {
    setCurrentPost(post);
    setIsDeleteOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'title' && !currentPost) {
      const newSlug = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: newSlug,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'categoryId' ? parseInt(value, 10) : value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const urls = e.target.value.split('\n').filter(s => s.trim() !== '');
    setFormData((prev) => ({
      ...prev,
      gallery: urls,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      triggerAlert('error', 'Anda harus login untuk membuat artikel');
      return;
    }

    // ✅ Filter valid URLs only
    const validGallery = (formData.gallery || []).filter((url: string) => 
      url && url.trim() !== '' && url.startsWith('http')
    );

    const payload = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title || ''),
      content: formData.content,
      status: formData.status,
      featured: formData.featured,
      categoryId: formData.categoryId,
      authorId: user.id,
      thumbnail: formData.thumbnail && formData.thumbnail.trim() !== '' && formData.thumbnail.startsWith('http')
        ? formData.thumbnail 
        : null,
      gallery: validGallery.length > 0 ? validGallery : [],
      metaTitle: formData.metaTitle || null,
      metaDescription: formData.metaDescription || null,
    };

    console.log('Payload:', payload);

    try {
      if (currentPost) {
        await blogClient.put(`/posts/${currentPost.id}`, payload);
        triggerAlert('success', `Artikel "${formData.title}" berhasil diperbarui.`);
      } else {
        await blogClient.post('/posts', payload);
        triggerAlert('success', `Artikel "${formData.title}" berhasil ditambahkan.`);
      }
      await fetchPosts();
      setIsModalOpen(false);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Gagal menyimpan';
      triggerAlert('error', message);
    }
  };

  const handleDelete = async () => {
    if (!currentPost) return;
    try {
      await blogClient.delete(`/posts/${currentPost.id}`);
      setPosts((prev) => prev.filter((p) => p.id !== currentPost.id));
      triggerAlert('success', `Artikel "${currentPost.title}" berhasil dihapus.`);
      setIsDeleteOpen(false);
    } catch (err: any) {
      triggerAlert('error', err.response?.data?.message || err.message || 'Gagal menghapus');
    }
  };

  const triggerAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => {
      setAlertMsg(null);
    }, 4000);
  };

  return (
    <div id="blog-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-500" />
            Manage Blog Posts
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Buat, sunting, dan jadwalkan publikasi artikel edukasi serta informasi promosi media</p>
        </div>

        <button
          id="btn-add-post"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Add New Post
        </button>
      </div>

      {/* Alert Banner */}
      {alertMsg && (
        <div
          id="blog-alert-banner"
          className={`p-4 rounded-xl flex items-start gap-3 text-sm border animate-fade-in ${
            alertMsg.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-300'
              : 'bg-rose-950/40 border-rose-900/50 text-rose-300'
          }`}
        >
          {alertMsg.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Filters Area */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="blog-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari judul artikel..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm transition-all"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'PUBLISHED', 'DRAFT'].map((status) => (
            <button
              key={status}
              id={`filter-blog-status-${status.toLowerCase()}`}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap border ${
                statusFilter === status
                  ? 'bg-amber-500 border-amber-500 text-zinc-950 shadow-md shadow-amber-500/10'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-[11px] font-bold uppercase tracking-wider bg-zinc-900/50">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Post Title & Category</th>
                <th className="p-4">Publish Date</th>
                <th className="p-4">Highlight</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm text-zinc-300">
              {isLoading ? (
                [1, 2, 3].map((n) => (
                  <tr key={n}>
                    <td colSpan={6} className="p-8 text-center">
                      <div className="h-6 bg-zinc-800/40 rounded-lg animate-pulse max-w-lg mx-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-500">
                    Belum ada artikel yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 pl-6 font-mono text-xs text-zinc-500">#{p.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white truncate max-w-sm" title={p.title}>{p.title}</div>
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700/50">
                        {p.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Calendar className="w-4 h-4 text-zinc-600" />
                        <span>{new Date(p.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {p.featured ? (
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold bg-amber-500/5 border border-amber-500/20 px-2 py-0.5 rounded-full w-max">
                          <Award className="w-3.5 h-3.5" />
                          <span>Featured</span>
                        </div>
                      ) : (
                        <span className="text-zinc-600 text-xs">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        p.status === 'PUBLISHED'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700/60'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`btn-post-edit-${p.id}`}
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                          title="Edit Artikel"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-post-delete-${p.id}`}
                          onClick={() => handleOpenDelete(p)}
                          className="p-1.5 hover:bg-rose-950/30 text-zinc-400 hover:text-rose-400 rounded-lg transition-colors"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div id="blog-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-white">
                {currentPost ? 'Edit Blog Post' : 'Add New Blog Post'}
              </h2>
              <button
                id="btn-blog-close"
                onClick={() => setIsModalOpen(false)}
                className="p-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Judul Artikel
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    placeholder="Contoh: Tips Memilih Papan Reklame Komersial"
                    required
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Slug URL
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                      <LinkIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug || ''}
                      onChange={handleInputChange}
                      placeholder="auto-generated-dari-judul"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {currentPost ? 'Slug tidak bisa diubah setelah dibuat' : 'Biarkan kosong untuk generate otomatis dari judul'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Kategori</label>
                    <select
                      name="categoryId"
                      value={formData.categoryId || 1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status || 'DRAFT'}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
                    >
                      <option value="DRAFT">DRAFT (Sembunyikan)</option>
                      <option value="PUBLISHED">PUBLISHED (Tayang Publik)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Konten Artikel</label>
                  <textarea
                    name="content"
                    value={formData.content || ''}
                    onChange={handleInputChange}
                    placeholder="Tulis artikel lengkap di sini..."
                    rows={10}
                    required
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Thumbnail URL (harus dimulai dengan http:// atau https://)
                  </label>
                  <input
                    type="text"
                    name="thumbnail"
                    value={formData.thumbnail || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Gallery URLs (satu per baris, harus dimulai dengan http:// atau https://)
                  </label>
                  <textarea
                    value={(formData.gallery || []).join('\n')}
                    onChange={handleGalleryChange}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    rows={3}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured || false}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 rounded text-amber-500 bg-zinc-900 border-zinc-800 focus:ring-amber-500 focus:ring-1"
                  />
                  <label htmlFor="featured" className="text-sm font-semibold text-zinc-300 cursor-pointer select-none">
                    Jadikan Artikel Unggulan (Featured Post)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/10"
                >
                  Simpan Artikel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div id="blog-delete-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Konfirmasi Hapus</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  Apakah Anda yakin ingin menghapus artikel <strong className="text-white">"{currentPost?.title}"</strong>? Artikel akan terhapus secara permanen.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-rose-500/10"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};