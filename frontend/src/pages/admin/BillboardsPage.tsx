/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { apiV1Client } from '../../api/client';
import {
  Image as ImageIcon,
  Plus,
  Search,
  MapPin,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Check,
  Link as LinkIcon
} from 'lucide-react';

interface Billboard {
  id: number;
  name: string;
  slug: string;
  code: string;
  address: string;
  province: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  size: string;
  type: string;
  orientation: string;
  lighting: string;
  traffic?: string;
  description?: string;
  thumbnail?: string;
  thumbnailId?: number | null;
  gallery?: string[];
  galleryImageIds?: number[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
}

export const BillboardsPage: React.FC = () => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [filteredBillboards, setFilteredBillboards] = useState<Billboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [lightingFilter, setLightingFilter] = useState('ALL');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentBillboard, setCurrentBillboard] = useState<Billboard | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form States
  const [formData, setFormData] = useState<Partial<Billboard>>({
    name: '',
    code: '',
    slug: '',
    province: '',
    city: '',
    district: '',
    address: '',
    size: '',
    type: 'Billboard',
    orientation: 'Satu Sisi',
    lighting: 'Front Light',
    latitude: 0,
    longitude: 0,
    thumbnail: '',
    thumbnailId: null,
    gallery: [],
    galleryImageIds: [],
    traffic: '',
    description: '',
  });

  const fetchBillboards = async () => {
    setIsLoading(true);
    try {
      const response = await apiV1Client.get('/public/billboards');
      const data = response.data?.data || response.data || [];
      setBillboards(data);
      setFilteredBillboards(data);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Gagal memuat data billboard';
      console.error(`[Billboards] ${message}`);
      triggerAlert('error', message);
      setBillboards([]);
      setFilteredBillboards([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBillboards();
  }, []);

  // Filter & Search Logic
  useEffect(() => {
    let result = billboards;

    if (searchTerm) {
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.province.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'ALL') {
      result = result.filter((b) => (b.type || '').toLowerCase() === typeFilter.toLowerCase());
    }

    if (lightingFilter !== 'ALL') {
      result = result.filter((b) => (b.lighting || '').toLowerCase() === lightingFilter.toLowerCase());
    }

    setFilteredBillboards(result);
  }, [searchTerm, billboards, typeFilter, lightingFilter]);

  const uniqueTypes = React.useMemo(() => {
    const s = new Set<string>();
    billboards.forEach((b) => b.type && s.add(b.type));
    return Array.from(s);
  }, [billboards]);

  const uniqueLightings = React.useMemo(() => {
    const s = new Set<string>();
    billboards.forEach((b) => b.lighting && s.add(b.lighting));
    return Array.from(s);
  }, [billboards]);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  const generateCode = (name: string): string => {
    const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${random}`;
  };

  const handleOpenAdd = () => {
    setCurrentBillboard(null);
    setFormData({
      name: '',
      code: '',
      slug: '',
      province: 'DKI Jakarta',
      city: 'Jakarta',
      district: '',
      address: '',
      size: '4m x 8m',
      type: 'Billboard',
      orientation: 'Satu Sisi',
      lighting: 'Front Light',
      latitude: -6.2088,
      longitude: 106.8456,
      thumbnail: '',
      thumbnailId: null,
      gallery: [],
      galleryImageIds: [],
      traffic: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (billboard: Billboard) => {
    setCurrentBillboard(billboard);
    setFormData({
      ...billboard,
      gallery: billboard.gallery || [],
      thumbnailId: billboard.thumbnailId ?? null,
      galleryImageIds: billboard.galleryImageIds || [],
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (billboard: Billboard) => {
    setCurrentBillboard(billboard);
    setIsDeleteOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'name' && !currentBillboard) {
      const newSlug = generateSlug(value);
      const newCode = generateCode(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: newSlug,
        code: newCode,
      }));
    } else if (name === 'latitude' || name === 'longitude') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
    
    const payload: any = {
      name: formData.name,
      code: formData.code || generateCode(formData.name || ''),
      slug: formData.slug || generateSlug(formData.name || ''),
      province: formData.province,
      city: formData.city,
      district: formData.district || '',
      address: formData.address || '',
      size: formData.size,
      type: formData.type,
      orientation: formData.orientation,
      lighting: formData.lighting,
      latitude: formData.latitude || 0,
      longitude: formData.longitude || 0,
      traffic: formData.traffic || null,
      description: formData.description || null,
      metaTitle: formData.metaTitle || null,
      metaDescription: formData.metaDescription || null,
      metaKeywords: formData.metaKeywords || null,
      ogImage: formData.ogImage || null,
    };

    if (formData.thumbnailId !== undefined) {
      payload.thumbnailImageId = formData.thumbnailId;
    }

    if (formData.galleryImageIds && formData.galleryImageIds.length > 0) {
      payload.galleryImageIds = formData.galleryImageIds;
    }

    console.log('Payload:', payload);

    try {
      if (currentBillboard) {
        await apiV1Client.patch(`/admin/billboards/${currentBillboard.id}`, payload);
        triggerAlert('success', `Billboard "${formData.name}" berhasil diperbarui.`);
      } else {
        await apiV1Client.post('/admin/billboards', payload);
        triggerAlert('success', `Billboard "${formData.name}" berhasil ditambahkan.`);
      }
      await fetchBillboards();
      setIsModalOpen(false);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Gagal menyimpan';
      triggerAlert('error', message);
    }
  };

  const handleDelete = async () => {
    if (!currentBillboard) return;
    try {
      await apiV1Client.delete(`/admin/billboards/${currentBillboard.id}`);
      await fetchBillboards();
      triggerAlert('success', `Billboard "${currentBillboard.name}" berhasil dihapus.`);
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
    <div id="billboards-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-amber-500" />
            Manage Billboards
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Kelola data papan reklame & Spesifikasi</p>
        </div>

        <button
          id="btn-add-billboard"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Add New Billboard
        </button>
      </div>

      {/* Alert Banner */}
      {alertMsg && (
        <div
          id="alert-banner"
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
            id="billboard-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, kota, atau provinsi..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm transition-all"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto items-center">
          <select
            id="filter-type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="min-w-[140px] px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Jenis</option>
            {uniqueTypes.length > 0 ? (
              uniqueTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))
            ) : (
              <>
                <option value="Billboard">Billboard</option>
                <option value="Baliho">Baliho</option>
              </>
            )}
          </select>

          <select
            id="filter-lighting"
            value={lightingFilter}
            onChange={(e) => setLightingFilter(e.target.value)}
            className="min-w-[140px] px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Pencahayaan</option>
            {uniqueLightings.length > 0 ? (
              uniqueLightings.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))
            ) : (
              <>
                <option value="Back Light">Back Light</option>
                <option value="Front Light">Front Light</option>
                <option value="Non Light">Non Light</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-[11px] font-bold uppercase tracking-wider bg-zinc-900/50">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Billboard Info</th>
                <th className="p-4">Lokasi & Alamat</th>
                <th className="p-4">Dimensi & Tipe</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm text-zinc-300">
              {isLoading ? (
                [1, 2, 3].map((n) => (
                  <tr key={n}>
                    <td colSpan={7} className="p-8 text-center">
                      <div className="h-6 bg-zinc-800/40 rounded-lg animate-pulse max-w-lg mx-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredBillboards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-500">
                    Tidak ditemukan data billboard yang cocok dengan kriteria.
                  </td>
                </tr>
              ) : (
                filteredBillboards.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 pl-6 font-mono text-xs text-zinc-500">#{b.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{b.name}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{b.type || 'Standard'}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{b.city}, {b.province}</span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5 truncate max-w-[200px]" title={b.address}>
                        {b.address || '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-zinc-300">{b.size || '-'}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{b.orientation || 'Vertical'}</div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`btn-edit-${b.id}`}
                          onClick={() => handleOpenEdit(b)}
                          className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                          title="Edit Billboard"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-delete-${b.id}`}
                          onClick={() => handleOpenDelete(b)}
                          className="p-1.5 hover:bg-rose-950/30 text-zinc-400 hover:text-rose-400 rounded-lg transition-colors"
                          title="Delete Billboard"
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
        <div id="billboard-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-white">
                {currentBillboard ? 'Edit Billboard' : 'Add New Billboard'}
              </h2>
              <button
                id="btn-close-modal"
                onClick={() => setIsModalOpen(false)}
                className="p-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Nama Billboard
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder="Contoh: Billboard Sudirman KM 5"
                    required
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                {/* Code */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Kode Unik
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                      <LinkIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="code"
                      value={formData.code || ''}
                      onChange={handleInputChange}
                      placeholder="ABC-123"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug || ''}
                    onChange={handleInputChange}
                    placeholder="billboard-sudirman-km-5"
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province || ''}
                    onChange={handleInputChange}
                    placeholder="Contoh: DKI Jakarta"
                    required
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Kota
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    placeholder="Contoh: Jakarta Selatan"
                    required
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Kecamatan
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district || ''}
                    onChange={handleInputChange}
                    placeholder="Contoh: Kebayoran Baru"
                    required
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                {/* Address */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Alamat Detail
                  </label>
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    placeholder="Alamat lengkap lokasi pemasangan reklame"
                    rows={2}
                    required
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                {/* Latitude */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude || 0}
                    onChange={handleInputChange}
                    placeholder="Contoh: -6.2088"
                    required
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                {/* Longitude */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude || 0}
                    onChange={handleInputChange}
                    placeholder="Contoh: 106.8456"
                    required
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                {/* Size */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Ukuran (Dimensi)
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size || ''}
                    onChange={handleInputChange}
                    placeholder="Contoh: 4m x 8m"
                    required
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Jenis Media
                  </label>
                  <select
                    name="type"
                    value={formData.type || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
                  >
                    <option value="Billboard">Billboard</option>
                    <option value="Baliho">Baliho</option>
                    <option value="Neon Box">Neon Box</option>
                    <option value="Spanduk">Spanduk</option>
                  </select>
                </div>

                {/* Orientation */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Orientasi
                  </label>
                  <select
                    name="orientation"
                    value={formData.orientation || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
                  >
                    <option value="Satu Sisi">Satu Sisi</option>
                    <option value="Dua Sisi">Dua Sisi</option>
                    <option value="Tiga Sisi">Tiga Sisi</option>
                    <option value="Empat Sisi">Empat Sisi</option>
                  </select>
                </div>

                {/* Lighting */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Pencahayaan
                  </label>
                  <select
                    name="lighting"
                    value={formData.lighting || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
                  >
                    <option value="Back Light">Back Light</option>
                    <option value="Front Light">Front Light</option>
                    <option value="Non Light">Non Light</option>
                    <option value="LED">LED</option>
                  </select>
                </div>

                {/* Traffic */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Volume Lalu Lintas
                  </label>
                  <input
                    type="text"
                    name="traffic"
                    value={formData.traffic || ''}
                    onChange={handleInputChange}
                    placeholder="Contoh: 50.000 kendaraan/hari"
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                {/* Thumbnail */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Upload Thumbnail Billboard
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => document.getElementById('billboard-thumbnail-upload')?.click()}
                      className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm hover:border-amber-500"
                    >
                      Unggah Thumbnail
                    </button>
                    <span className="text-xs text-zinc-500">Format gambar yang didukung. Maks 5MB.</span>
                  </div>
                  <input
                    id="billboard-thumbnail-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const formDataUpload = new FormData();
                        formDataUpload.append('file', file);
                        const response = await apiV1Client.post('/images/single', formDataUpload, {
                          headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        const imageData = response.data?.data;
                        if (imageData) {
                          setFormData((prev) => ({
                            ...prev,
                            thumbnail: imageData.url,
                            thumbnailId: imageData.id,
                          }));
                        }
                      } catch (err: any) {
                        triggerAlert('error', err.response?.data?.message || err.message || 'Gagal mengunggah thumbnail');
                      } finally {
                        if (e.target) e.target.value = '';
                      }
                    }}
                  />
                  {formData.thumbnail && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={formData.thumbnail}
                        alt="thumbnail preview"
                        className="w-24 h-24 object-cover rounded-xl border border-zinc-800"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, thumbnail: '', thumbnailId: null }))}
                        className="text-xs text-rose-400 hover:text-rose-200"
                      >
                        Hapus Thumbnail
                      </button>
                    </div>
                  )}
                </div>

                {/* Gallery */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Upload Gallery Billboard
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => document.getElementById('billboard-gallery-upload')?.click()}
                      className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm hover:border-amber-500"
                    >
                      Unggah Gallery
                    </button>
                    <span className="text-xs text-zinc-500">Pilih beberapa gambar sekaligus.</span>
                  </div>
                  <input
                    id="billboard-gallery-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;
                      try {
                        const formDataUpload = new FormData();
                        Array.from(files).forEach((file) => formDataUpload.append('files', file));
                        const response = await apiV1Client.post('/images/multiple', formDataUpload, {
                          headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        const uploaded: Array<{ id: number; url: string }> = response.data?.data ?? [];
                        setFormData((prev) => ({
                          ...prev,
                          gallery: Array.from(new Set([...(prev.gallery || []), ...uploaded.map((item) => item.url)])),
                          galleryImageIds: Array.from(new Set([...(prev.galleryImageIds || []), ...uploaded.map((item) => item.id)])),
                        }));
                      } catch (err: any) {
                        triggerAlert('error', err.response?.data?.message || err.message || 'Gagal mengunggah galeri');
                      } finally {
                        if (e.target) e.target.value = '';
                      }
                    }}
                  />
                  {formData.gallery && formData.gallery.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {formData.gallery.map((url, index) => (
                        <div key={`${url}-${index}`} className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                          <img src={url} alt={`gallery-${index}`} className="w-full h-24 object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                gallery: (prev.gallery || []).filter((_, i) => i !== index),
                                galleryImageIds: (prev.galleryImageIds || []).filter((_, i) => i !== index),
                              }));
                            }}
                            className="absolute top-2 right-2 rounded-full bg-rose-500/90 text-white p-1 text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    placeholder="Deskripsi lengkap lokasi billboard"
                    rows={3}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                  />
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
                  Simpan Billboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div id="delete-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Konfirmasi Hapus</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  Apakah Anda yakin ingin menghapus billboard <strong className="text-white">"{currentBillboard?.name}"</strong>? Tindakan ini tidak dapat dibatalkan.
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