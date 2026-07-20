import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { apiV1Client } from '../../api/client';
import {
  Settings as SettingsIcon,
  Save,
  Globe,
  Phone,
  Mail,
  Share2,
  Check,
  AlertCircle,
  Loader2,
  RotateCcw,
  Search,
  BarChart3,
  FileText,
} from 'lucide-react';

/* ─────────────── Types ─────────────── */

interface SettingsData {
  siteName: string;
  siteDescription: string;
  siteLogo: string;
  siteFavicon: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  officeAddress: string;
  officeMapIframe: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  footerCopyright: string;
  footerDisclaimer: string;
  maintenanceMode: string;
}

type FieldError = Partial<Record<keyof SettingsData, string>>;

interface FieldConfig {
  name: keyof SettingsData;
  label: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea';
  required: boolean;
  colSpan?: number;
  placeholder?: string;
}

interface SectionConfig {
  id: string;
  title: string;
  icon: React.ElementType;
  fields: FieldConfig[];
}

/* ─────────────── Constants ─────────────── */

const DEFAULT_SETTINGS: SettingsData = {
  siteName: 'Kreasi Advertising',
  siteDescription: 'Platform Penyedia Jasa Iklan Luar Ruang (OOH) Terlengkap dan Terpercaya di Indonesia.',
  siteLogo: '',
  siteFavicon: '',
  contactEmail: 'info@kreasiadvertising.com',
  contactPhone: '021-555-1234',
  contactWhatsapp: '0812-3456-7890',
  officeAddress: 'Jl. Jend. Sudirman Kav 21, Jakarta Selatan',
  officeMapIframe: '',
  socialFacebook: 'https://facebook.com/kreasiadv',
  socialInstagram: 'https://instagram.com/kreasiadv',
  socialTwitter: 'https://twitter.com/kreasiadv',
  metaTitle: 'Kreasi Advertising - Solusi Periklanan Luar Ruang',
  metaDescription: 'Penyedia jasa periklanan luar ruang terpercaya di Indonesia.',
  metaKeywords: 'billboard, reklame, iklan, ooh, advertising',
  googleAnalyticsId: '',
  googleTagManagerId: '',
  footerCopyright: '© 2026 Kreasi Advertising. All rights reserved.',
  footerDisclaimer: '',
  maintenanceMode: 'false',
};

const SECTIONS: SectionConfig[] = [
  {
    id: 'general',
    title: 'Informasi Umum Website',
    icon: Globe,
    fields: [
      { name: 'siteName', label: 'Nama Website', type: 'text', required: true, colSpan: 2 },
      { name: 'siteDescription', label: 'Deskripsi Website', type: 'textarea', required: true, colSpan: 2 },
      { name: 'siteLogo', label: 'URL Logo Website', type: 'url', required: false, placeholder: 'https://example.com/logo.png' },
      { name: 'siteFavicon', label: 'URL Favicon', type: 'url', required: false, placeholder: 'https://example.com/favicon.ico' },
      { name: 'maintenanceMode', label: 'Maintenance Mode', type: 'text', required: false, placeholder: 'true atau false' },
    ],
  },
  {
    id: 'contact',
    title: 'Kontak & Hubungan Pelanggan',
    icon: Mail,
    fields: [
      { name: 'contactEmail', label: 'Email Publik', type: 'email', required: true },
      { name: 'contactPhone', label: 'Telepon Kantor', type: 'tel', required: true },
      { name: 'contactWhatsapp', label: 'Nomor WhatsApp', type: 'tel', required: true },
      { name: 'officeAddress', label: 'Alamat Kantor Resmi', type: 'textarea', required: true, colSpan: 2 },
      { name: 'officeMapIframe', label: 'Embed Map (iframe URL)', type: 'url', required: false, colSpan: 2, placeholder: 'https://www.google.com/maps/embed?...' },
    ],
  },
  {
    id: 'social',
    title: 'Media Sosial Perusahaan',
    icon: Share2,
    fields: [
      { name: 'socialFacebook', label: 'Facebook URL', type: 'url', required: false },
      { name: 'socialInstagram', label: 'Instagram URL', type: 'url', required: false },
      { name: 'socialTwitter', label: 'Twitter / X URL', type: 'url', required: false },
    ],
  },
  {
    id: 'seo',
    title: 'SEO & Metadata Pencarian',
    icon: Search,
    fields: [
      { name: 'metaTitle', label: 'Meta Title (SEO)', type: 'text', required: false, colSpan: 2 },
      { name: 'metaDescription', label: 'Meta Description', type: 'textarea', required: false, colSpan: 2 },
      { name: 'metaKeywords', label: 'Meta Keywords', type: 'text', required: false, colSpan: 2, placeholder: 'pisahkan dengan koma' },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics & Tracking',
    icon: BarChart3,
    fields: [
      { name: 'googleAnalyticsId', label: 'Google Analytics ID (UA-... atau G-...)', type: 'text', required: false, placeholder: 'UA-00000000-0' },
      { name: 'googleTagManagerId', label: 'Google Tag Manager ID (GTM-...)', type: 'text', required: false, placeholder: 'GTM-00000000' },
    ],
  },
  {
    id: 'footer',
    title: 'Footer & Hak Cipta',
    icon: FileText,
    fields: [
      { name: 'footerCopyright', label: 'Teks Footer Copyright', type: 'text', required: true, colSpan: 2 },
      { name: 'footerDisclaimer', label: 'Teks Disclaimer', type: 'textarea', required: false, colSpan: 2 },
    ],
  },
];

/* ─────────────── Helpers ─────────────── */

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidUrl = (v: string) => {
  if (!v.trim()) return true;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
};

/* ─────────────── Component ─────────────── */

export const SettingsPage: React.FC = () => {
  const [original, setOriginal] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [formData, setFormData] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [errors, setErrors] = useState<FieldError>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  /* ── Derived state ── */
  const isDirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(original),
    [formData, original]
  );
  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  /* ── Fetch ── */
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await apiV1Client.get('/public/settings');
      const payload = data?.data ?? data ?? {};
      const merged = { ...DEFAULT_SETTINGS, ...payload };
      setOriginal(merged);
      setFormData(merged);
    } catch (err) {
      console.error('[Settings] fetch failed:', err);
      triggerAlert('error', 'Gagal memuat pengaturan dari server. Menampilkan default.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  /* ── Validation ── */
  const validateField = useCallback(
    (name: keyof SettingsData, value: string): string | undefined => {
      const fieldMeta = SECTIONS.flatMap((s) => s.fields).find((f) => f.name === name);
      if (fieldMeta?.required && !value.trim()) return 'Field ini wajib diisi';
      if (name === 'contactEmail' && !isValidEmail(value)) return 'Format email tidak valid';
      if (fieldMeta?.type === 'url' && !isValidUrl(value)) return 'Format URL tidak valid';
      return undefined;
    },
    []
  );

  const validateAll = useCallback((): boolean => {
    const next: FieldError = {};
    (Object.keys(formData) as Array<keyof SettingsData>).forEach((key) => {
      const msg = validateField(key, formData[key]);
      if (msg) next[key] = msg;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [formData, validateField]);

  /* ── Handlers ── */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const key = name as keyof SettingsData;
      setFormData((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const msg = validateField(key, value);
        if (msg) return { ...prev, [key]: msg };
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    },
    [validateField]
  );

  const handleReset = useCallback(() => {
    setFormData(original);
    setErrors({});
    triggerAlert('success', 'Form dikembalikan ke data terakhir tersimpan.');
  }, [original]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateAll()) {
        triggerAlert('error', 'Mohon perbaiki kesalahan pada form.');
        return;
      }
      setIsSaving(true);
      setAlertMsg(null);
      try {
        // ✅ FIX: endpoint yang benar sesuai backend route
        await apiV1Client.patch('/admin/settings', formData);
        setOriginal(formData);
        triggerAlert('success', 'Pengaturan berhasil disimpan ke server.');
      } catch (err: unknown) {
        let message = 'Gagal menyimpan pengaturan';
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosErr = err as { response?: { data?: { message?: string } } };
          message = axiosErr.response?.data?.message ?? message;
        } else if (err instanceof Error) {
          message = err.message;
        }
        triggerAlert('error', message);
      } finally {
        setIsSaving(false);
      }
    },
    [formData, validateAll]
  );

  const triggerAlert = useCallback((type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    window.clearTimeout((triggerAlert as any)._t);
    (triggerAlert as any)._t = window.setTimeout(() => setAlertMsg(null), 4000);
  }, []);

  /* ── Render helpers ── */
  const renderField = (field: FieldConfig) => {
    const { name, label, type, required, colSpan, placeholder } = field;
    const value = formData[name];
    const error = errors[name];
    const inputId = `field-${String(name)}`;
    const sharedClasses = `
      w-full px-4 py-2.5 bg-zinc-950 border rounded-xl text-white text-sm
      focus:outline-none focus:border-amber-500 transition-colors
      placeholder-zinc-600
      ${error ? 'border-rose-600 focus:border-rose-500' : 'border-zinc-800'}
    `;
    return (
      <div key={String(name)} className={colSpan === 2 ? 'col-span-1 md:col-span-2' : ''}>
        <label htmlFor={inputId} className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
        {type === 'textarea' ? (
          <textarea
            id={inputId}
            name={String(name)}
            value={value}
            onChange={handleInputChange}
            rows={name === 'siteDescription' ? 3 : 2}
            required={required}
            placeholder={placeholder}
            className={sharedClasses}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            name={String(name)}
            value={value}
            onChange={handleInputChange}
            required={required}
            placeholder={placeholder}
            className={sharedClasses}
          />
        )}
        {error && (
          <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    );
  };

  /* ── JSX ── */
  return (
    <div id="settings-page" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-7 h-7 text-amber-500" />
            General & Metadata Settings
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Konfigurasi identitas perusahaan, kanal komunikasi, dan metadata SEO
          </p>
        </div>
        {isDirty && (
          <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Ada perubahan belum disimpan
          </span>
        )}
      </div>

      {alertMsg && (
        <div
          id="settings-alert"
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

      {isLoading ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Memuat pengaturan...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl" noValidate>
          {SECTIONS.map((section) => (
            <section
              key={section.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl"
            >
              <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-zinc-800">
                <section.icon className="w-4 h-4 text-amber-500" />
                {section.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map(renderField)}
              </div>
            </section>
          ))}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty || isSaving}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-300 font-semibold rounded-xl text-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              id="btn-save-settings"
              type="submit"
              disabled={isSaving || !isDirty || hasErrors}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-[0.98]"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};