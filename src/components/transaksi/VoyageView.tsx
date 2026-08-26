import React, { useState } from 'react';
import { 
  CalendarDays, Plus, Search, Edit2, Trash2, Ship, 
  MapPin, Clock, ArrowRight, CheckCircle2, AlertTriangle, X, Anchor
} from 'lucide-react';
import { JadwalVoyage, Kapal, Pelabuhan, VoyageStatus } from '../../types';
import { ConfirmDialog } from '../shared/ConfirmDialog';

interface VoyageViewProps {
  voyages: JadwalVoyage[];
  kapalList: Kapal[];
  pelabuhanList: Pelabuhan[];
  onSaveVoyage: (voyage: JadwalVoyage) => void;
  onDeleteVoyage: (id: string) => void;
}

export const VoyageView: React.FC<VoyageViewProps> = ({
  voyages,
  kapalList,
  pelabuhanList,
  onSaveVoyage,
  onDeleteVoyage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoyage, setEditingVoyage] = useState<JadwalVoyage | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [formNomor, setFormNomor] = useState('');
  const [formKapalId, setFormKapalId] = useState(kapalList[0]?.id || '');
  const [formPolId, setFormPolId] = useState(pelabuhanList[0]?.id || '');
  const [formPodId, setFormPodId] = useState(pelabuhanList[1]?.id || '');
  const [formEtd, setFormEtd] = useState(new Date().toISOString().slice(0, 10));
  const [formEta, setFormEta] = useState(new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10));
  const [formMuatanTeu, setFormMuatanTeu] = useState<number>(350);
  const [formMuatanDwt, setFormMuatanDwt] = useState<number>(5500);
  const [formStatus, setFormStatus] = useState<VoyageStatus>('scheduled');
  const [formNahkoda, setFormNahkoda] = useState('Capt. ');
  const [formCatatan, setFormCatatan] = useState('');

  const openCreateModal = () => {
    setEditingVoyage(null);
    const selectedKapal = kapalList[0];
    setFormNomor(`VOY-2026-${selectedKapal?.kodeKapal.slice(-3) || 'NTR'}-0${Math.floor(10 + Math.random() * 90)}`);
    setFormKapalId(selectedKapal?.id || '');
    setFormPolId(pelabuhanList[0]?.id || '');
    setFormPodId(pelabuhanList[1]?.id || '');
    setFormEtd(new Date().toISOString().slice(0, 10));
    setFormEta(new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10));
    setFormMuatanTeu(420);
    setFormMuatanDwt(6200);
    setFormStatus('scheduled');
    setFormNahkoda(selectedKapal?.nahkoda || 'Capt. Handoko');
    setFormCatatan('Voyage komersial trayek reguler');
    setIsModalOpen(true);
  };

  const openEditModal = (v: JadwalVoyage) => {
    setEditingVoyage(v);
    setFormNomor(v.nomorVoyage);
    setFormKapalId(v.kapalId);
    setFormPolId(v.pelabuhanAsalId);
    setFormPodId(v.pelabuhanTujuanId);
    setFormEtd(v.etd.slice(0, 10));
    setFormEta(v.eta.slice(0, 10));
    setFormMuatanTeu(v.totalMuatanTeu || 0);
    setFormMuatanDwt(v.totalMuatanDwt || 0);
    setFormStatus(v.status);
    setFormNahkoda(v.nahkodaTugas);
    setFormCatatan(v.catatan || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNomor.trim() || !formKapalId || !formPolId || !formPodId) return;

    const data: JadwalVoyage = {
      id: editingVoyage ? editingVoyage.id : `voy-${Date.now()}`,
      nomorVoyage: formNomor.trim(),
      kapalId: formKapalId,
      pelabuhanAsalId: formPolId,
      pelabuhanTujuanId: formPodId,
      etd: formEtd,
      eta: formEta,
      status: formStatus,
      nahkodaTugas: formNahkoda.trim() || 'Capt. Maritim',
      totalMuatanTeu: Number(formMuatanTeu) || 0,
      totalMuatanDwt: Number(formMuatanDwt) || 0,
      catatan: formCatatan.trim(),
      createdAt: editingVoyage ? editingVoyage.createdAt : new Date().toISOString()
    };

    onSaveVoyage(data);
    setIsModalOpen(false);
  };

  const getKapal = (id: string) => kapalList.find(k => k.id === id);
  const getPort = (id: string) => pelabuhanList.find(p => p.id === id);

  const getStatusBadge = (status: VoyageStatus) => {
    switch (status) {
      case 'sailing':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">🌊 Berlayar (Sailing)</span>;
      case 'loading':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">📦 Loading Muatan</span>;
      case 'berthed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">⚓ Sandar di Dermaga</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">✅ Selesai (Completed)</span>;
      case 'delayed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">⚠️ Cuaca / Terlambat</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">🗓️ Terjadwal (Scheduled)</span>;
    }
  };

  const filteredList = voyages.filter(v => {
    const kapal = getKapal(v.kapalId)?.namaKapal.toLowerCase() || '';
    const pol = getPort(v.pelabuhanAsalId)?.namaPelabuhan.toLowerCase() || '';
    const pod = getPort(v.pelabuhanTujuanId)?.namaPelabuhan.toLowerCase() || '';
    const no = v.nomorVoyage.toLowerCase();
    const q = searchTerm.toLowerCase();

    const matchSearch = no.includes(q) || kapal.includes(q) || pol.includes(q) || pod.includes(q);
    const matchStatus = filterStatus === 'all' || v.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div id="transaksi-voyage-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900">Transaksi Jadwal Pelayaran (Voyage Schedule)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengaturan nomor voyage kapal, jadwal keberangkatan (ETD), kedatangan (ETA), utilisasi kargo, dan nahkoda tugas.
          </p>
        </div>

        <button
          id="btn-add-voyage"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Jadwal Voyage Baru</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-voyage-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor voyage, nama kapal, rute..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <select
          id="filter-voyage-status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer w-full sm:w-auto"
        >
          <option value="all">Semua Status Pelayaran</option>
          <option value="scheduled">Terjadwal (Scheduled)</option>
          <option value="loading">Loading Muatan</option>
          <option value="sailing">Sedang Berlayar (Sailing)</option>
          <option value="berthed">Sandar di Dermaga</option>
          <option value="completed">Selesai (Completed)</option>
          <option value="delayed">Terlambat (Delayed)</option>
        </select>
      </div>

      {/* Voyage Cards List */}
      <div className="space-y-4">
        {filteredList.map((v) => {
          const kapal = getKapal(v.kapalId);
          const pol = getPort(v.pelabuhanAsalId);
          const pod = getPort(v.pelabuhanTujuanId);
          const utilizationPct = kapal?.kapasitasTeu 
            ? Math.min(100, Math.round(((v.totalMuatanTeu || 0) / kapal.kapasitasTeu) * 100))
            : 75;

          return (
            <div 
              key={v.id} 
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                {/* Voyage & Ship Header */}
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                    <Ship className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-blue-900 text-sm bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                        {v.nomorVoyage}
                      </span>
                      {getStatusBadge(v.status)}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {kapal?.namaKapal || 'KM Armada'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Nahkoda Bertugas: <strong className="text-slate-700">{v.nahkodaTugas}</strong> | Kapasitas: {kapal?.kapasitasTeu} TEU ({kapal?.kapasitasDwt.toLocaleString('id-ID')} DWT)
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end lg:self-center">
                  <button
                    id={`edit-voyage-${v.id}`}
                    onClick={() => openEditModal(v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Jadwal</span>
                  </button>
                  <button
                    id={`delete-voyage-${v.id}`}
                    onClick={() => setDeleteTargetId(v.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Hapus Voyage"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rute & Timeline Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                {/* POL Departure */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    PELABUHAN MUAT (POL)
                  </span>
                  <div className="font-bold text-slate-900 text-xs">{pol?.namaPelabuhan}</div>
                  <div className="text-[11px] text-slate-500">{pol?.kota}, {pol?.provinsi}</div>
                  <div className="mt-2 text-[11px] font-mono text-blue-800 bg-blue-100/50 px-2 py-0.5 rounded inline-block">
                    ETD: {new Date(v.etd).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                {/* POD Arrival */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    PELABUHAN BONGKAR (POD)
                  </span>
                  <div className="font-bold text-slate-900 text-xs">{pod?.namaPelabuhan}</div>
                  <div className="text-[11px] text-slate-500">{pod?.kota}, {pod?.provinsi}</div>
                  <div className="mt-2 text-[11px] font-mono text-emerald-800 bg-emerald-100/50 px-2 py-0.5 rounded inline-block">
                    ETA: {new Date(v.eta).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                {/* Cargo Capacity Utilization */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        UTILISASI MUATAN KARGO
                      </span>
                      <span className="font-mono font-bold text-blue-900">{utilizationPct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all" 
                        style={{ width: `${utilizationPct}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-600 mt-2 font-mono">
                    <span>Muatan: <strong>{v.totalMuatanTeu} TEU</strong></span>
                    <span>Tonase: <strong>{v.totalMuatanDwt?.toLocaleString('id-ID')} Ton</strong></span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add/Edit Voyage */}
      {isModalOpen && (
        <div id="modal-voyage-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold">
                  {editingVoyage ? 'Edit Jadwal Pelayaran (Voyage)' : 'Buat Jadwal Pelayaran Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Voyage</label>
                  <input
                    id="input-nomor-voyage"
                    type="text"
                    required
                    value={formNomor}
                    onChange={(e) => setFormNomor(e.target.value)}
                    placeholder="VOY-2026-NTR01-08"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilih Armada Kapal</label>
                  <select
                    id="select-kapal-voyage"
                    value={formKapalId}
                    onChange={(e) => {
                      setFormKapalId(e.target.value);
                      const k = kapalList.find(item => item.id === e.target.value);
                      if (k) setFormNahkoda(k.nahkoda);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    {kapalList.map(k => (
                      <option key={k.id} value={k.id}>{k.namaKapal} ({k.kodeKapal})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pelabuhan Muat (POL)</label>
                  <select
                    id="select-pol-voyage"
                    value={formPolId}
                    onChange={(e) => setFormPolId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    {pelabuhanList.map(p => (
                      <option key={p.id} value={p.id}>{p.namaPelabuhan}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pelabuhan Bongkar (POD)</label>
                  <select
                    id="select-pod-voyage"
                    value={formPodId}
                    onChange={(e) => setFormPodId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    {pelabuhanList.map(p => (
                      <option key={p.id} value={p.id}>{p.namaPelabuhan}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jadwal Keberangkatan (ETD)</label>
                  <input
                    id="input-etd-voyage"
                    type="date"
                    required
                    value={formEtd}
                    onChange={(e) => setFormEtd(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Perkiraan Tiba (ETA)</label>
                  <input
                    id="input-eta-voyage"
                    type="date"
                    required
                    value={formEta}
                    onChange={(e) => setFormEta(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Muatan TEU</label>
                  <input
                    id="input-muatan-teu"
                    type="number"
                    value={formMuatanTeu}
                    onChange={(e) => setFormMuatanTeu(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Berat Tonase (DWT)</label>
                  <input
                    id="input-muatan-dwt"
                    type="number"
                    value={formMuatanDwt}
                    onChange={(e) => setFormMuatanDwt(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Voyage</label>
                  <select
                    id="select-status-voyage"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as VoyageStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="loading">Loading Muatan</option>
                    <option value="sailing">Sailing (Berlayar)</option>
                    <option value="berthed">Berthed (Sandar)</option>
                    <option value="completed">Completed</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nahkoda yang Bertugas</label>
                <input
                  id="input-nahkoda-voyage"
                  type="text"
                  value={formNahkoda}
                  onChange={(e) => setFormNahkoda(e.target.value)}
                  placeholder="Capt. Handoko Wibowo"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Pelayaran</label>
                <input
                  id="input-catatan-voyage"
                  type="text"
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  placeholder="Informasi izin sandar, rute perintis atau komersial..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  id="btn-save-voyage-submit"
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Simpan Jadwal Voyage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Hapus Jadwal Voyage"
        message="Apakah Anda yakin ingin menghapus jadwal pelayaran ini? Pastikan tidak ada Bill of Lading aktif yang tertaut pada voyage ini."
        confirmLabel="Hapus Voyage"
        onConfirm={() => {
          if (deleteTargetId) {
            onDeleteVoyage(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
