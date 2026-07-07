import React, { useState, useEffect } from 'react';
import { useBuilder } from '../../contexts/BuilderContext';
import { pagesApi } from '../../api/pages.api';
import { Search, Save, AlertCircle, Loader2 } from 'lucide-react';

interface SEOFormData {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  noIndex: boolean;
  structuredData: string;
}

export const SEOPanel: React.FC = () => {
  const { page, loadPage } = useBuilder();
  const [formData, setFormData] = useState<SEOFormData>({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonicalUrl: '',
    noIndex: false,
    structuredData: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (page) {
      setFormData({
        metaTitle: page.metaTitle || page.title || '',
        metaDescription: page.metaDescription || '',
        metaKeywords: page.metaKeywords || '',
        ogTitle: page.ogTitle || '',
        ogDescription: page.ogDescription || '',
        ogImage: page.ogImage || '',
        canonicalUrl: page.canonicalUrl || '',
        noIndex: page.noIndex || false,
        structuredData: page.structuredData || ''
      });
    }
  }, [page]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async () => {
    if (!page) return;
    setIsSaving(true);
    setSaveMessage('');
    try {
      await pagesApi.updatePage(page.id, formData);
      setSaveMessage('SEO settings saved successfully');
      await loadPage(page.id);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setSaveMessage('Failed to save SEO settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (!page) return null;

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-zinc-300">
      <div className="p-4 border-b border-zinc-800 bg-zinc-950/20">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Search className="w-4 h-4 text-amber-500" />
          SEO Settings
        </h3>
        <p className="text-[10px] text-zinc-500 mt-1 font-medium">
          Configure search engine metadata and social sharing cards.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {saveMessage && (
          <div className={`p-2 text-[10px] font-bold rounded-lg flex items-center gap-1.5 ${saveMessage.includes('Failed') ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            <AlertCircle className="w-3.5 h-3.5" />
            {saveMessage}
          </div>
        )}

        {/* Basic SEO */}
        <div className="space-y-3 bg-zinc-950/50 p-3 rounded-lg border border-zinc-850">
          <h4 className="text-[10px] font-bold uppercase text-zinc-400">Search Engine Basics</h4>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-300 flex justify-between">
              <span>Meta Title</span>
              <span className={formData.metaTitle.length > 60 ? 'text-red-500' : 'text-zinc-500'}>{formData.metaTitle.length}/60</span>
            </label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Primary page title..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-300 flex justify-between">
              <span>Meta Description</span>
              <span className={formData.metaDescription.length > 160 ? 'text-red-500' : 'text-zinc-500'}>{formData.metaDescription.length}/160</span>
            </label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
              placeholder="Brief description of the page..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-300">Keywords</label>
            <input
              type="text"
              name="metaKeywords"
              value={formData.metaKeywords}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="comma, separated, keywords"
            />
          </div>
        </div>

        {/* Open Graph / Social */}
        <div className="space-y-3 bg-zinc-950/50 p-3 rounded-lg border border-zinc-850">
          <h4 className="text-[10px] font-bold uppercase text-zinc-400">Social Sharing (Open Graph)</h4>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-300">OG Title</label>
            <input
              type="text"
              name="ogTitle"
              value={formData.ogTitle}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Social media title..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-300">OG Description</label>
            <textarea
              name="ogDescription"
              value={formData.ogDescription}
              onChange={handleChange}
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-300">OG Image URL</label>
            <input
              type="text"
              name="ogImage"
              value={formData.ogImage}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="https://.../image.jpg"
            />
          </div>
        </div>

        {/* Advanced SEO */}
        <div className="space-y-3 bg-zinc-950/50 p-3 rounded-lg border border-zinc-850">
          <h4 className="text-[10px] font-bold uppercase text-zinc-400">Advanced</h4>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-300">Canonical URL</label>
            <input
              type="text"
              name="canonicalUrl"
              value={formData.canonicalUrl}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="https://..."
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              name="noIndex"
              checked={formData.noIndex}
              onChange={handleChange}
              className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-900"
            />
            <span className="text-xs font-semibold text-zinc-300">No Index (Hide from search engines)</span>
          </label>

          <div className="space-y-1 pt-2">
            <label className="text-[10px] font-bold text-zinc-300">JSON-LD Structured Data</label>
            <textarea
              name="structuredData"
              value={formData.structuredData}
              onChange={handleChange}
              rows={5}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-[10px] font-mono text-zinc-400 focus:text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
              placeholder='{ "@context": "https://schema.org", ... }'
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-lg py-2 text-xs font-bold transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save SEO Settings'}
        </button>
      </div>
    </div>
  );
};
