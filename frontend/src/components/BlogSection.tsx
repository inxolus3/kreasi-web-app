/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { blogApi, BlogPost } from '../api/blog.api';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import Skeleton, { BlogPostSkeleton } from './Skeleton';
import LazyImage from './LazyImage';
import { 
  BookOpen, Search, Calendar, User, ArrowLeft, Clock, Tag, ChevronRight, Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BlogSection() {
  const [searchVal, setSearchVal] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);

  // Trigger search on form submit or debounce
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(searchVal);
  };

  // TanStack Query to fetch posts
  const { data: postsData, isLoading, isError, refetch } = useQuery({
    queryKey: ['blogPosts', debouncedSearch],
    queryFn: () => blogApi.getPosts({ search: debouncedSearch || undefined }),
  });

  const posts = useMemo(() => postsData?.data || [], [postsData]);

  // Extract unique categories from loaded posts for local filtering
  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach(p => {
      if (p.category?.name) cats.add(p.category.name);
    });
    return ['ALL', ...Array.from(cats)];
  }, [posts]);

  // Locally filtered posts by category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'ALL') return posts;
    return posts.filter(p => p.category?.name === selectedCategory);
  }, [posts, selectedCategory]);

  // Fetch single post detail when slug is active
  const { data: detailData, isLoading: isDetailLoading, isError: isDetailError, refetch: refetchDetail } = useQuery({
    queryKey: ['blogPostDetail', selectedPostSlug],
    queryFn: () => blogApi.getPostBySlug(selectedPostSlug!),
    enabled: !!selectedPostSlug,
  });

  const activePost = detailData?.data;

  // Format Date safely
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Strip content preview
  const getContentPreview = (htmlOrMarkdown: string) => {
    const stripped = htmlOrMarkdown.replace(/<[^>]*>/g, '').substring(0, 150);
    return stripped + (htmlOrMarkdown.length > 150 ? '...' : '');
  };

  // Handle Share Article
  const handleShare = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.metaDescription || post.title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan artikel berhasil disalin ke papan klip!');
    }
  };

  if (selectedPostSlug) {
    return (
      <div className="bg-slate-50 dark:bg-[#070B19] min-h-screen transition-colors duration-300 py-12" id="blog-reader-view">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <button
            onClick={() => setSelectedPostSlug(null)}
            className="group mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-brand dark:text-neutral-400 dark:hover:text-brand-secondary transition-colors cursor-pointer"
            id="btn-back-to-list"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Artikel
          </button>

          {isDetailError ? (
            <ErrorState message="Gagal memuat isi artikel." onRetry={refetchDetail} />
          ) : isDetailLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-[400px] w-full" />
              <div className="space-y-4 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ) : activePost ? (
            <article className="bg-white dark:bg-dark-bg border border-slate-200/80 dark:border-white/5 p-6 sm:p-10 shadow-sm overflow-hidden" id="article-body">
              
              {/* Category / Read time / Date Header */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 dark:text-neutral-500 mb-6 font-mono font-bold">
                {activePost.category && (
                  <span className="bg-brand/5 dark:bg-brand-secondary/10 text-brand dark:text-brand-secondary px-2.5 py-1 border border-brand/10 dark:border-brand-secondary/25">
                    {activePost.category.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(activePost.createdAt)}
                </span>
                {activePost.author && (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    Oleh: {activePost.author.username}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase mb-8" id="article-title">
                {activePost.title}
              </h1>

              {/* Main Banner Image */}
              {activePost.thumbnail && (
                <div className="mb-10 overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm" id="article-banner">
                  <LazyImage
                    src={activePost.thumbnail}
                    alt={activePost.title}
                    aspectRatio="aspect-[21/9]"
                  />
                </div>
              )}

              {/* Content Body */}
              <div 
                className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed space-y-6"
                id="article-content-body"
                dangerouslySetInnerHTML={{ __html: activePost.content }}
              />

              {/* Footer Section / Share */}
              <div className="mt-12 pt-8 border-t border-slate-150 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-neutral-500">
                  ID Kategori: {activePost.categoryId}
                </span>
                <button
                  onClick={() => handleShare(activePost)}
                  className="flex items-center gap-2 border border-slate-250 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-700 dark:text-white cursor-pointer transition-colors"
                  id="btn-share-article"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Bagikan Artikel
                </button>
              </div>

            </article>
          ) : (
            <EmptyState message="Artikel tidak ditemukan." />
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-[#070B19] min-h-screen transition-colors duration-300" id="blog-section-wrapper">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-white py-16 dark:border-white/5 dark:bg-dark-bg sm:py-24" id="blog-hero">
        <div className="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-40" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 opacity-10 dark:opacity-20 pointer-events-none">
          <BookOpen className="w-96 h-96 animate-pulse text-brand dark:text-brand-secondary shrink-0" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-brand/5 dark:bg-brand-secondary/10 text-brand dark:text-brand-secondary mb-6 border border-brand/10 dark:border-brand-secondary/20 rounded-none">
              <BookOpen className="w-3.5 h-3.5" />
              Eksplorasi Wawasan & Ide
            </span>
            <h1 className="font-mono text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl uppercase leading-[0.95]" id="blog-title">
              Blog & <span className="text-brand dark:text-brand-secondary">Artikel</span> Kami
            </h1>
            <p className="mt-6 text-base font-medium leading-relaxed text-slate-500 dark:text-neutral-400 max-w-2xl">
              Dapatkan berita terbaru, panduan branding taktis, tips memilih media promosi, serta strategi pemasaran luar ruang (reklame & billboard) yang efektif untuk bisnis Anda.
            </p>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & LOCAL FILTER BAR */}
      <section className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="blog-search-bar">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Search Box Form */}
          <form 
            onSubmit={handleSearchSubmit}
            className="lg:col-span-4 bg-white dark:bg-dark-bg border border-slate-200/80 dark:border-white/5 p-4 shadow-sm flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-slate-400 dark:text-neutral-500 shrink-0" />
            <input
              type="text"
              placeholder="Cari artikel di sini..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-transparent text-xs font-medium focus:outline-none text-slate-800 dark:text-white placeholder-slate-400"
            />
            <button 
              type="submit"
              className="text-[10px] font-black uppercase bg-slate-900 hover:bg-slate-800 dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover text-white dark:text-slate-950 px-3 py-1.5 transition-colors cursor-pointer"
            >
              Cari
            </button>
          </form>

          {/* Local Categories Filters */}
          <div className="lg:col-span-8 bg-white dark:bg-dark-bg border border-slate-200/80 dark:border-white/5 p-4 shadow-sm flex flex-wrap items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-2">Filter Kategori:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider font-black border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand dark:bg-brand-secondary text-white dark:text-slate-950 border-transparent'
                    : 'bg-transparent text-slate-500 border-slate-200 hover:border-slate-350 dark:text-neutral-400 dark:border-white/10 dark:hover:border-white/20'
                }`}
              >
                {cat === 'ALL' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 3. BLOG POSTS CONTAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="blog-posts-grid-section">
        {isError ? (
          <ErrorState message="Gagal menghubungkan ke server untuk memuat postingan blog." onRetry={refetch} />
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogPostSkeleton />
            <BlogPostSkeleton />
            <BlogPostSkeleton />
          </div>
        ) : filteredPosts.length === 0 ? (
          <EmptyState 
            message="Belum ada artikel yang dipublikasikan dalam kategori atau pencarian ini." 
            onAction={debouncedSearch || selectedCategory !== 'ALL' ? () => {
              setSearchVal('');
              setDebouncedSearch('');
              setSelectedCategory('ALL');
            } : undefined}
            actionLabel="Reset Pencarian"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="posts-display-grid">
            {filteredPosts.map((post) => (
              <article 
                key={post.id}
                className="group flex flex-col bg-white dark:bg-dark-bg border border-slate-200/80 dark:border-white/5 hover:border-brand/40 dark:hover:border-brand-secondary/40 shadow-sm transition-all duration-300"
                id={`article-card-${post.id}`}
              >
                {/* Thumbnail Layer */}
                <div 
                  onClick={() => setSelectedPostSlug(post.slug)}
                  className="relative overflow-hidden aspect-[16/10] bg-slate-100 border-b border-slate-100 dark:border-white/5 cursor-pointer"
                >
                  <img
                    src={post.thumbnail || 'https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&q=80&w=600'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {post.category && (
                    <span className="absolute top-4 left-4 z-10 bg-slate-900/90 text-white dark:bg-brand-secondary dark:text-slate-950 text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
                      {post.category.name}
                    </span>
                  )}
                </div>

                {/* Content Details Block */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-slate-400 dark:text-neutral-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.createdAt)}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 
                      onClick={() => setSelectedPostSlug(post.slug)}
                      className="text-base font-black text-slate-900 dark:text-white uppercase leading-tight mb-3 group-hover:text-brand dark:group-hover:text-brand-secondary transition-colors cursor-pointer line-clamp-2"
                    >
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium leading-relaxed mb-6 line-clamp-3">
                      {getContentPreview(post.content)}
                    </p>
                  </div>

                  {/* Read More Button Link */}
                  <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedPostSlug(post.slug)}
                      className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-brand dark:text-brand-secondary group-hover:gap-2 transition-all cursor-pointer"
                    >
                      Baca Selengkapnya
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    {post.author && (
                      <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500">
                        Oleh: {post.author.username}
                      </span>
                    )}
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
