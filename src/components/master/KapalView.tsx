import React, { useState } from 'react';
import { 
  Ship, Plus, Search, Edit2, Trash2, Eye, 
  CheckCircle2, Anchor, Gauge, Flag, User, MapPin, X
} from 'lucide-react';
import { Kapal, KapalStatus, KapalType } from '../../types';
import { ConfirmDialog } from '../shared/ConfirmDialog';

interface KapalViewProps {
  kapalList: Kapal[];
  onSaveKapal: (kapal: Kapal) => void;
  onDeleteKapal: (id: string) => void;
}

export const KapalView: React.FC<KapalViewProps> = ({
  kapalList,
  onSaveKapal,
  onDeleteKapal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKapal, setEditingKapal] = useState<Kapal | null>(null);

  // Detail Modal State
  const [viewKapal, setViewKapal] = useState<Kapal | null>(null);

  // Delete Confirm State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form inputs
  const [formKode, setFormKode] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formImo, setFormImo] = useState('');
  const [formCallSign, setFormCallSign] = useState('');
  const [formTipe, setFormTipe] = useState<KapalType>('container');
  const [formDwt, setFormDwt] = useState<number>(10000);
  const [formTeu, setFormTeu] = useState<number>(500);
  const [formTahun, setFormTahun] = useState<number>(2020);
  const [formBendera, setFormBendera] = useState('Indonesia (Merah Putih)');
  const [formNahkoda, setFormNahkoda] = useState('Capt. ');
  const [formSpeed, setFormSpeed] = useState<number>(15.0);
  const [formStatus, setFormStatus] = useState<KapalStatus>('aktif');
  const [formLokasi, setFormLokasi] = useState('');
  const [formCatatan, setFormCatatan] = useState('');

  const openCreateModal = () => {
    setEditingKapal(null);
    setFormKode(`KPL-${Math.floor(100 + Math.random() * 900)}`);
    setFormNama('');
    setFormImo(`IMO ${Math.floor(9000000 + Math.random() * 999999)}`);
    setFormCallSign('PK' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26)));
    setFormTipe('container');
    setFormDwt(12000);
    setFormTeu(750);
    setFormTahun(2021);
    setFormBendera('Indonesia (Merah Putih)');
    setFormNahkoda('Capt. ');
    setFormSpeed(16.0);
    setFormStatus('aktif');
    setFormLokasi('Pelabuhan Tanjung Priok');
    setFormCatatan('');
    setIsModalOpen(true);
  };

  const openEditModal = (k: Kapal) => {
    setEditingKapal(k);
    setFormKode(k.kodeKapal);
    setFormNama(k.namaKapal);
    setFormImo(k.imoNumber);
    setFormCallSign(k.callSign);
    setFormTipe(k.tipe);
    setFormDwt(k.kapasitasDwt);
    setFormTeu(k.kapasitasTeu);
    setFormTahun(k.tahunPembuatan);
    setFormBendera(k.bendera);
    setFormNahkoda(k.nahkoda);
    setFormSpeed(k.kecepatanKnot);
    setFormStatus(k.status);
    setFormLokasi(k.lokasiTerkini);
    setFormCatatan(k.catatan || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim() || !formKode.trim()) return;

    const kapalData: Kapal = {
      id: editingKapal ? editingKapal.id : `kpl-${Date.now()}`,
      kodeKapal: formKode.trim(),
      namaKapal: formNama.trim(),
      imoNumber: formImo.trim(),
      callSign: formCallSign.trim(),
      tipe: formTipe,
      kapasitasDwt: Number(formDwt) || 0,
      kapasitasTeu: Number(formTeu) || 0,
      tahunPembuatan: Number(formTahun) || 2020,
      bendera: formBendera.trim(),
      nahkoda: formNahkoda.trim(),
      kecepatanKnot: Number(formSpeed) || 14,
      status: formStatus,
      lokasiTerkini: formLokasi.trim() || 'Pelabuhan Utama',
      catatan: formCatatan.trim(),
      createdAt: editingKapal ? editingKapal.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveKapal(kapalData);
    setIsModalOpen(false);
  };

  // Filtered List
  const filteredList = kapalList.filter(k => {
    const matchSearch = 
      k.namaKapal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.kodeKapal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.imoNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.nahkoda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.lokasiTerkini.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'all' || k.status === filterStatus;
    const matchType = filterType === 'all' || k.tipe === filterType;

    return matchSearch && matchStatus && matchType;
  });

  const getStatusBadge = (status: KapalStatus) => {
    switch (status) {
      case 'berlayar':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">🌊 Berlayar di Laut</span>;
      case 'aktif':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">⚓ Siap / Sandar</span>;
      case 'docking':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">🔧 Docking / Perawatan</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Standby</span>;
    }
  };

  return (
    <div id="master-kapal-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900">Master Data Armada Kapal (Fleet)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen spesifikasi kapal, nomor IMO, kapasitas DWT/TEU, status operasional, dan nahkoda.
          </p>
        </div>

        <button
          id="btn-add-kapal"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Kapal Baru</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-kapal-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama kapal, IMO, nahkoda..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            id="filter-kapal-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="aktif">Aktif / Sandar</option>
            <option value="berlayar">Sedang Berlayar</option>
            <option value="docking">Docking / Perawatan</option>
            <option value="standby">Standby</option>
          </select>

          <select
            id="filter-kapal-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Semua Tipe Kapal</option>
            <option value="container">Container Vessel</option>
            <option value="bulk_carrier">Bulk Carrier (Curah)</option>
            <option value="ro_ro">Ro-Ro (Kendaraan/Truk)</option>
            <option value="general_cargo">General Cargo</option>
            <option value="tanker">Tanker</option>
            <option value="tug_barge">Tug & Barge</option>
          </select>
        </div>
      </div>

      {/* Kapal Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-5">NAMA KAPAL & KODE</th>
                <th className="p-3.5">IMO / CALL SIGN</th>
                <th className="p-3.5">TIPE KAPAL</th>
                <th className="p-3.5 text-right">KAPASITAS DWT / TEU</th>
                <th className="p-3.5">NAHKODA & LOKASI</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5 pr-5 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    Tidak ada data kapal yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredList.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-slate-900 text-sm">{k.namaKapal}</div>
                      <div className="text-[11px] font-mono text-blue-700">{k.kodeKapal} ({k.tahunPembuatan})</div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-700">
                      <div>{k.imoNumber}</div>
                      <div className="text-[10px] text-slate-400">Call: {k.callSign}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold uppercase text-[10px]">
                        {k.tipe.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono">
                      <div className="font-bold text-slate-800">{k.kapasitasDwt.toLocaleString('id-ID')} Ton DWT</div>
                      {k.kapasitasTeu > 0 && (
                        <div className="text-[10px] text-cyan-700">{k.kapasitasTeu} TEU</div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {k.nahkoda}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate max-w-[220px]">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        <span className="truncate">{k.lokasiTerkini}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      {getStatusBadge(k.status)}
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`view-kapal-${k.id}`}
                          onClick={() => setViewKapal(k)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Lihat Rincian Kapal"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          id={`edit-kapal-${k.id}`}
                          onClick={() => openEditModal(k)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                          title="Edit Kapal"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id={`delete-kapal-${k.id}`}
                          onClick={() => setDeleteTargetId(k.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus Kapal"
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

      {/* Modal Add / Edit Kapal */}
      {isModalOpen && (
        <div id="modal-kapal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <Ship className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold">
                  {editingKapal ? 'Edit Data Armada Kapal' : 'Tambah Armada Kapal Baru'}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Kapal</label>
                  <input
                    id="input-kode-kapal"
                    type="text"
                    required
                    value={formKode}
                    onChange={(e) => setFormKode(e.target.value)}
                    placeholder="e.g. KPL-NTR-01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Kapal</label>
                  <input
                    id="input-nama-kapal"
                    type="text"
                    required
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    placeholder="e.g. KM Nusantara Raya 01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">IMO Number</label>
                  <input
                    id="input-imo-kapal"
                    type="text"
                    value={formImo}
                    onChange={(e) => setFormImo(e.target.value)}
                    placeholder="IMO 9482103"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Call Sign</label>
                  <input
                    id="input-callsign-kapal"
                    type="text"
                    value={formCallSign}
                    onChange={(e) => setFormCallSign(e.target.value)}
                    placeholder="YDYB"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipe Kapal</label>
                  <select
                    id="select-tipe-kapal"
                    value={formTipe}
                    onChange={(e) => setFormTipe(e.target.value as KapalType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="container">Container Vessel</option>
                    <option value="bulk_carrier">Bulk Carrier</option>
                    <option value="ro_ro">Ro-Ro</option>
                    <option value="general_cargo">General Cargo</option>
                    <option value="tanker">Tanker</option>
                    <option value="tug_barge">Tug & Barge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kapasitas DWT (Ton)</label>
                  <input
                    id="input-dwt-kapal"
                    type="number"
                    value={formDwt}
                    onChange={(e) => setFormDwt(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kapasitas TEU (Box)</label>
                  <input
                    id="input-teu-kapal"
                    type="number"
                    value={formTeu}
                    onChange={(e) => setFormTeu(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Pembuatan</label>
                  <input
                    id="input-tahun-kapal"
                    type="number"
                    value={formTahun}
                    onChange={(e) => setFormTahun(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Nahkoda (Master)</label>
                  <input
                    id="input-nahkoda-kapal"
                    type="text"
                    value={formNahkoda}
                    onChange={(e) => setFormNahkoda(e.target.value)}
                    placeholder="Capt. Rahmat Hidayat"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kecepatan Dinas (Knot)</label>
                  <input
                    id="input-speed-kapal"
                    type="number"
                    step="0.5"
                    value={formSpeed}
                    onChange={(e) => setFormSpeed(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Operasional</label>
                  <select
                    id="select-status-kapal"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as KapalStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="aktif">Aktif / Sandar</option>
                    <option value="berlayar">Sedang Berlayar</option>
                    <option value="docking">Docking / Perawatan</option>
                    <option value="standby">Standby</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lokasi / Posisi Terkini</label>
                <input
                  id="input-lokasi-kapal"
                  type="text"
                  value={formLokasi}
                  onChange={(e) => setFormLokasi(e.target.value)}
                  placeholder="e.g. Dermaga JICT Tanjung Priok / Laut Jawa"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Operasional</label>
                <textarea
                  id="input-catatan-kapal"
                  rows={2}
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  placeholder="Informasi tambahan terkait rute reguler, survei tahunan, sertifikat lambung..."
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
                  id="btn-save-kapal-submit"
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Simpan Data Kapal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer / Modal View Detail Kapal */}
      {viewKapal && (
        <div id="modal-view-kapal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{viewKapal.kodeKapal}</span>
                  <h3 className="text-lg font-black text-white">{viewKapal.namaKapal}</h3>
                </div>
                <button onClick={() => setViewKapal(null)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {getStatusBadge(viewKapal.status)}
                <span className="text-xs text-slate-300 font-mono">Bendera: {viewKapal.bendera}</span>
              </div>
            </div>

            <div className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">IMO Number</span>
                  <span className="font-mono font-bold text-slate-900">{viewKapal.imoNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Call Sign</span>
                  <span className="font-mono font-bold text-slate-900">{viewKapal.callSign}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Kapasitas DWT</span>
                  <span className="font-mono font-bold text-slate-900">{viewKapal.kapasitasDwt.toLocaleString('id-ID')} Ton</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Kapasitas TEU</span>
                  <span className="font-mono font-bold text-slate-900">{viewKapal.kapasitasTeu} Box</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Tahun Buat / Usia</span>
                  <span className="font-bold text-slate-900">{viewKapal.tahunPembuatan} ({2026 - viewKapal.tahunPembuatan} Thn)</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Kecepatan Dinas</span>
                  <span className="font-bold text-slate-900">{viewKapal.kecepatanKnot} Knot</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Nahkoda yang Bertugas</span>
                  <span className="font-bold text-slate-900">{viewKapal.nahkoda}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Posisi Terkini</span>
                  <span className="font-medium text-slate-800">{viewKapal.lokasiTerkini}</span>
                </div>
                {viewKapal.catatan && (
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Catatan Operasional</span>
                    <p className="text-slate-600 italic">{viewKapal.catatan}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setViewKapal(null)}
                  className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Hapus Data Kapal"
        message="Apakah Anda yakin ingin menghapus data kapal ini dari master armada? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus Kapal"
        onConfirm={() => {
          if (deleteTargetId) {
            onDeleteKapal(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
