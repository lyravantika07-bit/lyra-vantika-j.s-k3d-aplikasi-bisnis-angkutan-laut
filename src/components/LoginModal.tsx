import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, ShieldCheck, Ship, ArrowRight, CheckCircle2 } from 'lucide-react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storageService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [activeMode, setActiveMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('admin@maritimlogistik.id');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('logistics_staff');
  const [regDept, setRegDept] = useState('Operasional Kargo');

  if (!isOpen) return null;

  const users = StorageService.getUsers();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Harap isi username/email dan password.');
      return;
    }

    // Match username or email
    const trimmed = identifier.trim().toLowerCase();
    const foundUser = users.find(u => 
      u.email.toLowerCase() === trimmed || u.username.toLowerCase() === trimmed
    );

    if (foundUser) {
      // In this ERP demo, simple password check allows standard pass
      StorageService.setCurrentUser(foundUser);
      setSuccessMsg(`Selamat datang kembali, ${foundUser.name}!`);
      setTimeout(() => {
        onLoginSuccess(foundUser);
        onClose();
      }, 500);
    } else {
      // Create ad-hoc user if not found but entered as admin
      if (trimmed === 'admin' || trimmed.includes('admin')) {
        const newAdmin: User = {
          id: `usr-${Date.now()}`,
          username: trimmed,
          name: 'Administrator Maritim',
          email: trimmed.includes('@') ? trimmed : `${trimmed}@maritimlogistik.id`,
          role: 'super_admin',
          department: 'Direksi & TI',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          lastLogin: new Date().toLocaleString('id-ID')
        };
        StorageService.saveUser(newAdmin);
        StorageService.setCurrentUser(newAdmin);
        onLoginSuccess(newAdmin);
        onClose();
      } else {
        setErrorMsg('Username / Email tidak ditemukan. Anda dapat menggunakan tombol 1-Click Login di bawah atau mendaftar.');
      }
    }
  };

  const handleQuickLogin = (user: User) => {
    StorageService.setCurrentUser(user);
    setSuccessMsg(`Login sukses sebagai ${user.name}`);
    setTimeout(() => {
      onLoginSuccess(user);
      onClose();
    }, 300);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Semua kolom pendaftaran wajib diisi.');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: regName.trim(),
      username: regUsername.trim().toLowerCase(),
      email: regEmail.trim().toLowerCase(),
      role: regRole,
      department: regDept.trim() || 'Logistik Maritim',
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150&auto=format&fit=crop&q=80`,
      lastLogin: new Date().toLocaleString('id-ID')
    };

    StorageService.saveUser(newUser);
    StorageService.setCurrentUser(newUser);
    setSuccessMsg(`Pendaftaran berhasil! Selamat datang, ${newUser.name}`);
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 400);
  };

  return (
    <div id="login-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        id="login-modal-card" 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-white"
      >
        {/* Header with Maritime Emblem */}
        <div className="relative p-6 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-md">
                <Ship className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">MARITIMEX AUTH PORTAL</h2>
                <p className="text-xs text-slate-400">Autentikasi Hak Akses Sistem Angkutan Laut</p>
              </div>
            </div>
            <button
              id="close-login-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 mt-5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              id="tab-login-btn"
              type="button"
              onClick={() => { setActiveMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeMode === 'login'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Login Pengguna
            </button>
            <button
              id="tab-register-btn"
              type="button"
              onClick={() => { setActiveMode('register'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeMode === 'register'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Username atau Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-identifier-input"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="contoh: admin@maritimlogistik.id atau admin"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <button
                id="submit-login-btn"
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Masuk ke Dashboard Sistem</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Quick Login Chips */}
              <div className="pt-4 border-t border-slate-800">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  ⚡ 1-Click Quick Login (Pilih Role):
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {users.slice(0, 4).map((u) => (
                    <button
                      key={u.id}
                      id={`quick-login-${u.username}`}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <img src={u.avatarUrl} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-white group-hover:text-cyan-400 truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{u.role.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                  <input
                    id="reg-name-input"
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Nama Lengkap & Gelar"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Username</label>
                  <input
                    id="reg-username-input"
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="username_baru"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email Perusahaan</label>
                <input
                  id="reg-email-input"
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="user@maritimlogistik.id"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Role / Peran</label>
                  <select
                    id="reg-role-select"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-cyan-500"
                  >
                    <option value="super_admin">Super Admin (Direksi / IT)</option>
                    <option value="ops_manager">Manajer Operasional Laut</option>
                    <option value="logistics_staff">Staff Logistik & B/L</option>
                    <option value="finance_billing">Staff Keuangan & Invoice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Departemen</label>
                  <input
                    id="reg-dept-input"
                    type="text"
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    placeholder="Divisi Operasional"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Password</label>
                <input
                  id="reg-password-input"
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <button
                id="submit-register-btn"
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                <span>Daftar & Buat Akun Sistem</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
