import React, { useState, useEffect } from 'react';
import { 
  Ship, Database, Clock, LogOut, User as UserIcon, 
  ShieldCheck, CheckCircle2, ChevronDown, Bell, Search, Sparkles
} from 'lucide-react';
import { User, DatabaseConfig } from '../types';

interface NavbarProps {
  currentUser: User | null;
  dbConfig: DatabaseConfig;
  onOpenLogin: () => void;
  onOpenDatabase: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  dbConfig,
  onOpenLogin,
  onOpenDatabase,
  onLogout,
  searchQuery,
  onSearchChange
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [utcTimeStr, setUtcTimeStr] = useState<string>('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
      setUtcTimeStr(now.toUTCString().slice(17, 22) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getDbProviderLabel = () => {
    switch (dbConfig.provider) {
      case 'firebase':
        return { name: 'Firebase Firestore', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'supabase':
        return { name: 'Supabase PostgreSQL', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'neon':
        return { name: 'Neon Serverless DB', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      default:
        return { name: 'Local Persistent DB', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
    }
  };

  const dbInfo = getDbProviderLabel();

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-500 text-white shadow-lg shadow-blue-900/40">
            <Ship className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base lg:text-lg tracking-wider text-white">lyravantika-k3d-bal</span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                PROD v2.6
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">
              Sistem Informasi Bisnis Angkutan Laut & Ekspedisi Maritim
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nama kapal, nomor B/L, kontainer, shipper, pelabuhan..."
              className="w-full pl-10 pr-4 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Maritime Clock, Database Badge, User Menu */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Maritime Clock */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono font-medium">{timeStr}</span>
            <span className="text-slate-500">|</span>
            <span className="font-mono text-[11px] text-slate-400">{utcTimeStr}</span>
          </div>

          {/* Database Connection Status Button */}
          <button
            id="open-database-hub-btn"
            onClick={onOpenDatabase}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer shadow-xs ${dbInfo.color}`}
            title="Kelola Koneksi Database Real: Supabase, Neon DB, Firebase, Local DB"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{dbInfo.name}</span>
            <span className="sm:hidden">DB</span>
          </button>

          {/* User Auth Pill */}
          {currentUser ? (
            <div className="relative">
              <button
                id="user-profile-menu-toggle"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer text-left"
              >
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-600"
                />
                <div className="hidden md:block">
                  <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono capitalize">
                    {currentUser.role.replace('_', ' ')}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div 
                  id="user-dropdown-menu"
                  className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="p-3 border-b border-slate-700 mb-1">
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      Role: {currentUser.role.toUpperCase()}
                    </div>
                  </div>

                  <button
                    id="menu-open-db-btn"
                    onClick={() => { setUserMenuOpen(false); onOpenDatabase(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
                  >
                    <Database className="w-4 h-4 text-cyan-400" />
                    Koneksi Real Database Hub
                  </button>

                  <button
                    id="menu-switch-user-btn"
                    onClick={() => { setUserMenuOpen(false); onOpenLogin(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-amber-400" />
                    Ganti Akun / Form Login
                  </button>

                  <button
                    id="menu-logout-btn"
                    onClick={() => { setUserMenuOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer mt-1 border-t border-slate-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar (Logout)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              Login Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
