import React, { useState, useEffect } from 'react';
import { apiV1Client } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext'; // kalau ada
import {
  Users as UsersIcon,
  Plus,
  Search,
  Shield,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Check,
  Loader2
} from 'lucide-react';

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt?: string;
}

export const UsersPage: React.FC = () => {
  // const { user } = useAuth(); // uncomment kalau mau role guard

  const [users, setUsers] = useState<UserItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserItem | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER' as 'ADMIN' | 'USER',
    password: '', // ✅ TAMBAHIN untuk create
  });

  // Role guard (opsional)
  // useEffect(() => {
  //   if (user?.role !== 'admin') {
  //     triggerAlert('error', 'Akses ditolak: halaman khusus admin');
  //   }
  // }, [user]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiV1Client.get('/users');
      const data = response.data?.data || [];
      setUsers(data);
      setFilteredUsers(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal memuat data pengguna';
      triggerAlert('error', msg);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
      );
    }
    setFilteredUsers(result);
  }, [searchTerm, users]);

  const handleOpenAdd = () => {
    setCurrentUser(null);
    setFormData({ name: '', email: '', role: 'USER', password: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setCurrentUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (user: UserItem) => {
    setCurrentUser(user);
    setIsDeleteOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (currentUser) {
        // Edit — jangan kirim password kalau kosong
        const payload: any = { name: formData.name, email: formData.email, role: formData.role };
        if (formData.password.trim()) payload.password = formData.password;

        await apiV1Client.put(`/users/${currentUser.id}`, payload);
        triggerAlert('success', `Pengguna "${formData.name}" berhasil diperbarui.`);
      } else {
        // Create — wajib ada password
        if (!formData.password || formData.password.length < 6) {
          triggerAlert('error', 'Password minimal 6 karakter');
          setIsSubmitting(false);
          return;
        }
        await apiV1Client.post('/users', {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
        });
        triggerAlert('success', `Pengguna "${formData.name}" berhasil ditambahkan.`);
      }

      await fetchUsers(); // ✅ re-fetch dari server
      setIsModalOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal menyimpan data';
      triggerAlert('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUser) return;
    setIsSubmitting(true);

    try {
      await apiV1Client.delete(`/users/${currentUser.id}`);
      triggerAlert('success', `Akun "${currentUser.name}" berhasil dihapus.`);
      await fetchUsers(); // ✅ re-fetch
      setIsDeleteOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal menghapus';
      triggerAlert('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  return (
    <div id="users-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <UsersIcon className="w-7 h-7 text-amber-500" />
            Manage CMS Users
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Kelola akun pengguna administrator dan staf editor
          </p>
        </div>

        <button
          id="btn-add-user"
          onClick={handleOpenAdd}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Add User Account
        </button>
      </div>

      {/* Alert Banner */}
      {alertMsg && (
        <div
          id="users-alert-banner"
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

      {/* Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="user-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-[11px] font-bold uppercase tracking-wider bg-zinc-900/50">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">User Details</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Join Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm text-zinc-300">
              {isLoading ? (
                [1, 2].map((n) => (
                  <tr key={n}>
                    <td colSpan={6} className="p-8 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-zinc-600 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-500">
                    Tidak ada pengguna terdaftar.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 pl-6 font-mono text-xs text-zinc-500">#{u.id}</td>
                    <td className="p-4 font-semibold text-white flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-amber-500 font-bold border border-zinc-700">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="p-4 font-mono text-zinc-400">{u.email}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Shield className={`w-4 h-4 ${u.role === 'ADMIN' ? 'text-amber-500' : 'text-blue-400'}`} />
                        <span className={`capitalize font-semibold ${u.role === 'ADMIN' ? 'text-amber-500' : 'text-blue-400'}`}>
                          {u.role}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.id !== 1 && (
                          <>
                            <button
                              id={`btn-user-edit-${u.id}`}
                              onClick={() => handleOpenEdit(u)}
                              className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              id={`btn-user-delete-${u.id}`}
                              onClick={() => handleOpenDelete(u)}
                              className="p-1.5 hover:bg-rose-950/30 text-zinc-400 hover:text-rose-400 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-white">
                {currentUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Password {currentUser && '(kosongkan jika tidak diubah)'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!currentUser}
                  minLength={6}
                  placeholder={currentUser ? '••••••' : 'Min. 6 karakter'}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold rounded-xl text-xs transition-all flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Konfirmasi Hapus</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  Hapus akun <strong className="text-white">"{currentUser?.name}"</strong>?
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 font-semibold rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};