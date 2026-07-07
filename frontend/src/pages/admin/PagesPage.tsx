import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pagesApi, PageData, PageTemplateData } from '../../api/pages.api';
import {
  Layers,
  Plus,
  Search,
  Calendar,
  Edit,
  Trash2,
  X,
  AlertCircle,
  Check,
  ExternalLink,
  Sliders,
  Globe,
  FileText,
  Eye,
  CheckSquare,
  Sparkles
} from 'lucide-react';

export const PagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<PageData[]>([]);
  const [filteredPages, setFilteredPages] = useState<PageData[]>([]);
  const [templates, setTemplates] = useState<PageTemplateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageData | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    seoTitle: '',
    seoDescription: '',
    featuredImage: '',
    templateId: '',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { pages: pList } = await pagesApi.getPages();
      setPages(pList);
      setFilteredPages(pList);
      
      const tList = await pagesApi.getTemplates();
      setTemplates(tList);
    } catch (err) {
      console.error('Failed to load page builder data:', err);
      // Fallback fallback data if backend is starting or offline
      const fallback: PageData[] = [
        {
          id: 1,
          title: 'Home Page',
          slug: 'home',
          status: 'PUBLISHED',
          seoTitle: 'Enterprise Page Builder - Home',
          seoDescription: 'High performance corporate page builder.',
          featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Pricing Plans',
          slug: 'pricing',
          status: 'DRAFT',
          seoTitle: 'Flexible Enterprise Pricing Matrix',
          seoDescription: 'Enterprise pricing details.',
          featuredImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      setPages(fallback);
      setFilteredPages(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = [...pages];

    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter((p) => p.status === statusFilter);
    }

    setFilteredPages(result);
  }, [searchTerm, statusFilter, pages]);

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      showAlert('error', 'Title and Slug are required');
      return;
    }

    try {
      const newPage = await pagesApi.createPage({
        title: formData.title,
        slug: formData.slug,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        featuredImage: formData.featuredImage,
      });

      // If template is chosen, load the template sections and save them into the builder
      if (formData.templateId) {
        const tId = parseInt(formData.templateId, 10);
        const template = templates.find((t) => t.id === tId);
        if (template && template.sections) {
          await pagesApi.saveBuilder(newPage.id, template.sections);
        }
      }

      showAlert('success', 'Page created successfully');
      setIsCreateModalOpen(false);
      loadData();
      
      // Auto redirect to builder
      navigate(`/admin/pages/${newPage.id}/builder`);
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || err.message || 'Failed to create page');
    }
  };

  const handleDeletePage = async () => {
    if (!selectedPage) return;
    try {
      await pagesApi.deletePage(selectedPage.id);
      showAlert('success', 'Page deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedPage(null);
      loadData();
    } catch (err: any) {
      showAlert('error', err.response?.data?.message || 'Failed to delete page');
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await pagesApi.publishPage(id);
      showAlert('success', 'Page published successfully');
      loadData();
    } catch (err: any) {
      showAlert('error', 'Failed to publish page');
    }
  };

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'DRAFT':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'REVIEW':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'ARCHIVED':
        return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Layers className="w-8 h-8 text-amber-500 animate-pulse" />
            Enterprise Page Builder
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Build custom landing pages, services pages, pricing matrix or portals with a clean drag & drop interface.
          </p>
        </div>
        <button
          id="btn-create-page-trigger"
          onClick={() => {
            setFormData({
              title: '',
              slug: '',
              seoTitle: '',
              seoDescription: '',
              featuredImage: '',
              templateId: '',
            });
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-lg text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/10 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Create New Page
        </button>
      </div>

      {/* Alerts */}
      {alert && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg border text-sm animate-fade-in ${
            alert.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
              : 'bg-rose-950/40 border-rose-800 text-rose-400'
          }`}
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{alert.text}</span>
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
          <input
            id="search-pages"
            type="text"
            placeholder="Search pages by title or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-zinc-500 font-medium shrink-0">Filter Status:</span>
          {['ALL', 'DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              id={`filter-status-${st.toLowerCase()}`}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-zinc-800 text-amber-500 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-white bg-zinc-950/40 hover:bg-zinc-800/40 border border-transparent'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Pages Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/40 border border-zinc-800/50 rounded-xl space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-400 text-sm font-medium">Loading pages and layouts...</p>
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/40 border border-zinc-800/50 rounded-xl space-y-4 text-center px-6">
          <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600">
            <Layers className="w-8 h-8" />
          </div>
          <div className="max-w-md">
            <h3 className="text-lg font-bold text-white">No Pages Found</h3>
            <p className="text-zinc-500 text-sm mt-1">
              There are no pages matching your filters. Create your first page now or try another filter!
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-lg text-xs font-bold border border-zinc-700 hover:bg-zinc-700 hover:text-white transition-all"
          >
            Create Page
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              id={`page-card-${page.id}`}
              className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col hover:border-zinc-700/80 transition-all duration-200"
            >
              {/* Cover Image */}
              <div className="h-44 bg-zinc-950 relative overflow-hidden shrink-0">
                {page.featuredImage ? (
                  <img
                    src={page.featuredImage}
                    alt={page.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-950">
                    <FileText className="w-10 h-10 mb-2 text-zinc-700" />
                    <span className="text-xs font-semibold tracking-wider uppercase text-zinc-600">No Cover Asset</span>
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(page.status)}`}>
                    {page.status}
                  </span>
                </div>

                {/* Direct Page link button if published */}
                {page.status === 'PUBLISHED' && (
                  <a
                    href={`/pages/${page.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute top-4 right-4 p-1.5 bg-zinc-950/80 hover:bg-zinc-950 rounded-lg text-zinc-400 hover:text-amber-500 border border-zinc-800 backdrop-blur transition-all"
                    title="Live Preview"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Page Information */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-amber-500 transition-colors">
                    {page.title}
                  </h3>
                  <p className="text-xs font-mono text-zinc-500 mt-1 flex items-center gap-1.5">
                    <span>Slug:</span>
                    <span className="bg-zinc-950 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-800">
                      /{page.slug}
                    </span>
                  </p>

                  <p className="text-xs text-zinc-400 mt-3 line-clamp-2 italic">
                    {page.seoDescription || 'No description provided.'}
                  </p>
                </div>

                {/* Footer and Actions */}
                <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      id={`btn-edit-page-${page.id}`}
                      onClick={() => navigate(`/admin/pages/${page.id}/builder`)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-lg text-xs font-bold transition-all"
                      title="Open Page Builder"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      Builder
                    </button>

                    {page.status !== 'PUBLISHED' && (
                      <button
                        id={`btn-publish-page-${page.id}`}
                        onClick={() => handlePublish(page.id)}
                        className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 border border-emerald-500/20 hover:border-transparent rounded-lg text-xs font-semibold transition-all"
                        title="Publish Page"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      id={`btn-delete-page-${page.id}`}
                      onClick={() => {
                        setSelectedPage(page);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-zinc-100 border border-rose-500/20 hover:border-transparent rounded-lg text-xs font-semibold transition-all"
                      title="Delete Page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div id="modal-create-page" className="fixed inset-0 bg-zinc-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-in">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/30">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                Create New Page
              </h2>
              <button
                id="btn-close-create-modal"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1.5">
                  Page Title *
                </label>
                <input
                  id="create-page-title"
                  type="text"
                  required
                  placeholder="e.g. Services, About Us, Contact"
                  value={formData.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoSlug = val.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
                    setFormData({ ...formData, title: val, slug: autoSlug, seoTitle: val });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1.5">
                  Page Slug *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-semibold select-none">
                    /pages/
                  </span>
                  <input
                    id="create-page-slug"
                    type="text"
                    required
                    placeholder="services"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-18 pr-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1.5">
                  Featured Cover Image URL (Optional)
                </label>
                <input
                  id="create-page-image"
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1.5">
                  Seemless Starter Template
                </label>
                <select
                  id="create-page-template"
                  value={formData.templateId}
                  onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">Empty Layout (Start from scratch)</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.description?.substring(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-create-page"
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-lg text-sm font-bold shadow-md shadow-amber-500/10 transition-all"
                >
                  Create & Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div id="modal-delete-page" className="fixed inset-0 bg-zinc-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-rose-900/30 rounded-xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">Delete Page Layout?</h3>
                <p className="text-zinc-400 text-sm mt-1.5">
                  Are you absolutely sure you want to delete the page <strong>"{selectedPage?.title}"</strong>? This will permanently wipe all nested blocks, sections, history backups, and templates.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-zinc-950/40 border-t border-zinc-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-semibold transition-colors"
              >
                No, Keep It
              </button>
              <button
                id="btn-confirm-delete-page"
                onClick={handleDeletePage}
                className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-bold shadow-md shadow-rose-500/10 transition-all"
              >
                Yes, Delete Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PagesPage;
