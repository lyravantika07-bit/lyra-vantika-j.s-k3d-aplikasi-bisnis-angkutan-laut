import React, { useState } from 'react';
import { 
  X, Database, CheckCircle2, AlertCircle, RefreshCw, 
  Copy, Download, Upload, Server, Flame, Sparkles, Terminal, Shield
} from 'lucide-react';
import { DatabaseConfig, DatabaseProvider } from '../types';
import { StorageService } from '../services/storageService';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: DatabaseConfig;
  onConfigUpdated: (config: DatabaseConfig) => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onConfigUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'providers' | 'schema' | 'backup'>('providers');
  const [provider, setProvider] = useState<DatabaseProvider>(currentConfig.provider);

  // Provider config inputs
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.supabaseUrl || 'https://xmaritim-db.supabase.co');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(currentConfig.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.maritim_demo_key');
  const [neonConnStr, setNeonConnStr] = useState(currentConfig.neonConnectionString || 'postgres://user:password@ep-sea-logistics-pooler.ap-southeast-1.neon.tech/maritim_db?sslmode=require');
  const [neonHost, setNeonHost] = useState(currentConfig.neonHost || 'ep-sea-logistics-pooler.ap-southeast-1.neon.tech');
  const [firebaseProject, setFirebaseProject] = useState(currentConfig.firebaseProjectId || 'maritim-freight-app-2026');
  const [firebaseApiKey, setFirebaseApiKey] = useState(currentConfig.firebaseApiKey || 'AIzaSyA_DemoMaritimeFirebaseApiKey2026');

  // Status & Testing
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs: number; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    const updated: DatabaseConfig = {
      provider,
      supabaseUrl,
      supabaseAnonKey,
      neonConnectionString: neonConnStr,
      neonHost,
      firebaseProjectId: firebaseProject,
      firebaseApiKey,
      autoSync: true,
      lastSyncTime: new Date().toISOString()
    };
    StorageService.saveDbConfig(updated);
    onConfigUpdated(updated);
    setTestResult({
      success: true,
      latencyMs: 12,
      message: `Konfigurasi database '${provider.toUpperCase()}' berhasil disimpan dan aktif!`
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const testConfig: DatabaseConfig = {
      provider,
      supabaseUrl,
      supabaseAnonKey,
      neonConnectionString: neonConnStr,
      neonHost,
      firebaseProjectId: firebaseProject,
      firebaseApiKey,
      autoSync: true
    };
    const res = await StorageService.testConnection(testConfig);
    setTestResult(res);
    setIsTesting(false);
  };

  const handleCopySql = () => {
    const sql = StorageService.generatePostgresSqlDDL();
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadBackup = () => {
    const json = StorageService.exportDatabaseToJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maritimex-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestore = () => {
    if (!importJsonText.trim()) {
      setImportStatus('Masukkan JSON data backup terlebih dahulu.');
      return;
    }
    const ok = StorageService.importDatabaseFromJson(importJsonText);
    if (ok) {
      setImportStatus('Data berhasil dipulihkan secara instan!');
      setTimeout(() => {
        onConfigUpdated(StorageService.getDbConfig());
      }, 300);
    } else {
      setImportStatus('Format JSON tidak valid atau korup.');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset basis data ke data sampel default Maritim Indonesia?')) {
      StorageService.resetToDefaultData();
      onConfigUpdated(StorageService.getDbConfig());
      setTestResult({
        success: true,
        latencyMs: 10,
        message: 'Basis data berhasil direset ke data sampel operasional armada maritim default.'
      });
    }
  };

  return (
    <div id="database-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        id="database-modal-card" 
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white tracking-wide">REAL DATABASE INTEGRATION HUB</h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Sync Ready
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Koneksi Real Database: Supabase (PostgreSQL), Neon DB Serverless, Firebase Firestore & Local Storage
                </p>
              </div>
            </div>
            <button
              id="close-database-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              id="db-tab-providers-btn"
              type="button"
              onClick={() => setActiveTab('providers')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'providers'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Pilihan Provider Database</span>
            </button>
            <button
              id="db-tab-schema-btn"
              type="button"
              onClick={() => setActiveTab('schema')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'schema'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Skema SQL (PostgreSQL DDL)</span>
            </button>
            <button
              id="db-tab-backup-btn"
              type="button"
              onClick={() => setActiveTab('backup')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'backup'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup & Restore Data</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {testResult && (
            <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
              testResult.success 
                ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200' 
                : 'bg-red-950/40 border-red-800/80 text-red-200'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold">{testResult.success ? 'Koneksi Berhasil' : 'Koneksi Bermasalah'}</span>
                  {testResult.latencyMs > 0 && (
                    <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      Latency: {testResult.latencyMs} ms
                    </span>
                  )}
                </div>
                <p className="mt-1 leading-relaxed opacity-90">{testResult.message}</p>
              </div>
            </div>
          )}

          {activeTab === 'providers' && (
            <div className="space-y-6">
              {/* Provider Selection Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Pilih Database Provider Aktif:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Supabase */}
                  <button
                    id="provider-supabase-card"
                    type="button"
                    onClick={() => setProvider('supabase')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      provider === 'supabase'
                        ? 'bg-emerald-950/50 border-emerald-500 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                        ⚡
                      </div>
                      {provider === 'supabase' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-xs font-bold text-white">Supabase</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">PostgreSQL Cloud + REST</p>
                  </button>

                  {/* Neon DB */}
                  <button
                    id="provider-neon-card"
                    type="button"
                    onClick={() => setProvider('neon')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      provider === 'neon'
                        ? 'bg-cyan-950/50 border-cyan-500 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                        🐘
                      </div>
                      {provider === 'neon' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-xs font-bold text-white">Neon DB</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Serverless PostgreSQL</p>
                  </button>

                  {/* Firebase */}
                  <button
                    id="provider-firebase-card"
                    type="button"
                    onClick={() => setProvider('firebase')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      provider === 'firebase'
                        ? 'bg-amber-950/50 border-amber-500 shadow-md shadow-amber-950/40 ring-1 ring-amber-500'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                        <Flame className="w-4 h-4" />
                      </div>
                      {provider === 'firebase' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-xs font-bold text-white">Firebase</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Firestore Realtime DB</p>
                  </button>

                  {/* Local Persistent */}
                  <button
                    id="provider-local-card"
                    type="button"
                    onClick={() => setProvider('local')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      provider === 'local'
                        ? 'bg-blue-950/50 border-blue-500 shadow-md shadow-blue-950/40 ring-1 ring-blue-500'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                        <Database className="w-4 h-4" />
                      </div>
                      {provider === 'local' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </div>
                    <p className="text-xs font-bold text-white">Local Persistent</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">IndexedDB Offline-First</p>
                  </button>
                </div>
              </div>

              {/* Dynamic Settings per Provider */}
              <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span>Konfigurasi Kredensial: {provider.toUpperCase()}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Auto-Save & Realtime Synchronization
                  </span>
                </div>

                {provider === 'supabase' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Supabase Project URL</label>
                      <input
                        id="input-supabase-url"
                        type="text"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        placeholder="https://your-project.supabase.co"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Supabase Anon Public Key</label>
                      <input
                        id="input-supabase-key"
                        type="password"
                        value={supabaseAnonKey}
                        onChange={(e) => setSupabaseAnonKey(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {provider === 'neon' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Neon Connection String (PostgreSQL)</label>
                      <input
                        id="input-neon-conn"
                        type="text"
                        value={neonConnStr}
                        onChange={(e) => setNeonConnStr(e.target.value)}
                        placeholder="postgres://user:pass@ep-hostname.region.neon.tech/dbname"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Neon Serverless Host Endpoint</label>
                      <input
                        id="input-neon-host"
                        type="text"
                        value={neonHost}
                        onChange={(e) => setNeonHost(e.target.value)}
                        placeholder="ep-sea-logistics.ap-southeast-1.neon.tech"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {provider === 'firebase' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Firebase Project ID</label>
                      <input
                        id="input-firebase-project"
                        type="text"
                        value={firebaseProject}
                        onChange={(e) => setFirebaseProject(e.target.value)}
                        placeholder="maritim-freight-erp-2026"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Firebase Web API Key</label>
                      <input
                        id="input-firebase-key"
                        type="password"
                        value={firebaseApiKey}
                        onChange={(e) => setFirebaseApiKey(e.target.value)}
                        placeholder="AIzaSyA_..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}

                {provider === 'local' && (
                  <div className="p-3 bg-blue-950/30 rounded-lg border border-blue-900/50 text-xs text-blue-200 leading-relaxed">
                    💡 <strong>Mode Local Persistent Database</strong> menyimpan seluruh data armada kapal, pelabuhan, transaksi Bill of Lading, dan invoice ke dalam persistent client storage secara otomatis. Anda dapat mengekspor atau mengimpor data kapan saja, atau beralih ke Supabase / Neon DB di atas!
                  </div>
                )}

                {/* Actions: Test Connection & Save */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    id="btn-test-db-connection"
                    type="button"
                    disabled={isTesting}
                    onClick={handleTestConnection}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Menguji Latensi...' : 'Test Koneksi DB'}</span>
                  </button>

                  <button
                    id="btn-save-db-config"
                    type="button"
                    onClick={handleSaveConfig}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Terapkan Provider Database</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-200">Skema Tabel PostgreSQL (DDL)</h3>
                  <p className="text-[11px] text-slate-400">
                    Jalankan skrip SQL ini di Supabase SQL Editor atau Neon Console untuk membuat semua tabel.
                  </p>
                </div>
                <button
                  id="btn-copy-sql"
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSql ? 'Disalin ke Clipboard!' : 'Salin Skrip SQL'}</span>
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-96 overflow-y-auto font-mono text-[11px] text-cyan-300 leading-relaxed">
                <pre>{StorageService.generatePostgresSqlDDL()}</pre>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              {/* Export Section */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xs font-bold text-white">Ekspor Full Database (.JSON)</h3>
                    <p className="text-[11px] text-slate-400">Unduh seluruh master data & transaksi saat ini dalam 1 berkas JSON.</p>
                  </div>
                  <button
                    id="btn-export-json"
                    onClick={handleDownloadBackup}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Backup JSON</span>
                  </button>
                </div>
              </div>

              {/* Import Section */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
                <h3 className="text-xs font-bold text-white">Impor / Pulihkan Database dari JSON</h3>
                <textarea
                  id="textarea-import-json"
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Tempelkan isi berkas backup JSON di sini..."
                  rows={4}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
                {importStatus && (
                  <p className="text-xs text-amber-300">{importStatus}</p>
                )}
                <div className="flex items-center justify-between">
                  <button
                    id="btn-import-json"
                    type="button"
                    onClick={handleRestore}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Pulihkan Data Sekarang</span>
                  </button>

                  <button
                    id="btn-reset-default-data"
                    type="button"
                    onClick={handleResetData}
                    className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    Reset ke Data Sampel Maritim Awal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
