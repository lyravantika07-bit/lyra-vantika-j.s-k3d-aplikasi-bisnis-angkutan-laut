import React, { useState } from 'react';
import { 
  Anchor, Plus, Search, Edit2, Trash2, MapPin, 
  Phone, Building2, Check, X, Shield
} from 'lucide-react';
import { Pelabuhan } from '../../types';
import { ConfirmDialog } from '../shared/ConfirmDialog';

interface PelabuhanViewProps {
  pelabuhanList: Pelabuhan[];
  onSavePelabuhan: (pelabuhan: Pelabuhan) => void;
  onDeletePelabuhan: (id: string) => void;
}

const AVAILABLE_FACILITIES = [
  'Container Crane (CC)',
  'Reefer Plugs (Pendingin)',
  'Gudang CFS 24 Jam',
  'Dermaga Curah Kering',
  'Dermaga Curah Cair (CPO)',
  'Terminal Ro-Ro',
  'Tugboat Escort 24 Jam',
  'Fasilitas Bunker BBM',
  'Helipad Evakuasi Medis'
];

export const PelabuhanView: React.FC<PelabuhanViewProps> = ({
  pelabuhanList,
  onSavePelabuhan,
  onDeletePelabuhan
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPelabuhan, setEditingPelabuhan] = useState<Pelabuhan | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [formKode, setFormKode] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formKota, setFormKota] = useState('');
  const [formProvinsi, setFormProvinsi] = useState('');
  const [formDraft, setFormDraft] = useState<number>(12.0);
  const [formFasilitas, setFormFasilitas] = useState<string[]>([]);
  const [formKoordinat, setFormKoordinat] = useState('');
  const [formSyahbandar, setFormSyahbandar] = useState('');
  const [formTelepon, setFormTelepon] = useState('');

  const openCreateModal = () => {
    setEditingPelabuhan(null);
    setFormKode('ID' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26)));
    setFormNama('');
    setFormKota('');
    setFormProvinsi('');
    setFormDraft(12.5);
    setFormFasilitas(['Container Crane (CC)', 'Gudang CFS 24 Jam']);
    setFormKoordinat('06° 00\' 00" S, 106° 50\' 00" E');
    setFormSyahbandar('Kantor KSOP Kelas I');
    setFormTelepon('(021) 4301080');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Pelabuhan) => {
    setEditingPelabuhan(p);
    setFormKode(p.kodePelabuhan);
    setFormNama(p.namaPelabuhan);
    setFormKota(p.kota);
    setFormProvinsi(p.provinsi);
    setFormDraft(p.kedalamanDraftMeter);
    setFormFasilitas(p.fasilitas || []);
    setFormKoordinat(p.koordinat);
    setFormSyahbandar(p.namaSyahbandar);
    setFormTelepon(p.teleponKontak);
    setIsModalOpen(true);
  };

  const toggleFacility = (fac: string) => {
    if (formFasilitas.includes(fac)) {
      setFormFasilitas(formFasilitas.filter(f => f !== fac));
    } else {
      setFormFasilitas([...formFasilitas, fac]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim() || !formKode.trim()) return;

    const data: Pelabuhan = {
      id: editingPelabuhan ? editingPelabuhan.id : `plb-${Date.now()}`,
      kodePelabuhan: formKode.trim().toUpperCase(),
      namaPelabuhan: formNama.trim(),
      kota: formKota.trim(),
      provinsi: formProvinsi.trim(),
      kedalamanDraftMeter: Number(formDraft) || 10,
      fasilitas: formFasilitas,
      koordinat: formKoordinat.trim(),
      namaSyahbandar: formSyahbandar.trim(),
      teleponKontak: formTelepon.trim(),
      createdAt: editingPelabuhan ? editingPelabuhan.createdAt : new Date().toISOString()
    };

    onSavePelabuhan(data);
    setIsModalOpen(false);
  };

  const filteredList = pelabuhanList.filter(p => 
    p.namaPelabuhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.kodePelabuhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.kota.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.provinsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="master-pelabuhan-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Anchor className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900">Master Data Pelabuhan & Terminal Maritim</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Database kode UN/LOCODE, kedalaman alur dermaga (Draft LWS), fasilitas petikemas, dan otoritas KSOP.
          </p>
        </div>

        <button
          id="btn-add-pelabuhan"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Pelabuhan</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-pelabuhan-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kode LOCODE, nama pelabuhan, kota, provinsi..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Total: <strong className="text-slate-800">{filteredList.length}</strong> Pelabuhan Terdaftar
        </span>
      </div>

      {/* Pelabuhan Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.map((p) => (
          <div 
            key={p.id} 
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 font-mono font-bold text-xs border border-blue-100">
                  {p.kodePelabuhan}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                    title="Edit Pelabuhan"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(p.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Hapus Pelabuhan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h2 className="text-sm font-bold text-slate-900 mb-1">{p.namaPelabuhan}</h2>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{p.kota}, {p.provinsi}</span>
              </p>

              <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Kedalaman Alur Draft:</span>
                  <span className="font-mono font-bold text-blue-900">{p.kedalamanDraftMeter} Meter LWS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Koordinat Maritim:</span>
                  <span className="font-mono text-slate-700 text-[10px]">{p.koordinat || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Otoritas KSOP:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[150px]">{p.namaSyahbandar}</span>
                </div>
              </div>

              {/* Facilities Chips */}
              <div className="mt-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Fasilitas Terminal:</span>
                <div className="flex flex-wrap gap-1">
                  {p.fasilitas.map((f, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-50 text-cyan-800 border border-cyan-200">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {p.teleponKontak || '(021) 4301080'}
              </span>
              <span className="font-mono text-[10px] text-slate-400">ID: {p.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit Pelabuhan */}
      {isModalOpen && (
        <div id="modal-pelabuhan-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <Anchor className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold">
                  {editingPelabuhan ? 'Edit Data Pelabuhan' : 'Tambah Pelabuhan Baru'}
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
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode UN/LOCODE</label>
                  <input
                    id="input-kode-pelabuhan"
                    type="text"
                    required
                    value={formKode}
                    onChange={(e) => setFormKode(e.target.value)}
                    placeholder="e.g. IDTPP"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nama Resmi Pelabuhan</label>
                  <input
                    id="input-nama-pelabuhan"
                    type="text"
                    required
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    placeholder="e.g. Pelabuhan Tanjung Priok"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kota / Kabupaten</label>
                  <input
                    id="input-kota-pelabuhan"
                    type="text"
                    required
                    value={formKota}
                    onChange={(e) => setFormKota(e.target.value)}
                    placeholder="Jakarta Utara"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Provinsi</label>
                  <input
                    id="input-provinsi-pelabuhan"
                    type="text"
                    required
                    value={formProvinsi}
                    onChange={(e) => setFormProvinsi(e.target.value)}
                    placeholder="DKI Jakarta"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kedalaman Alur Draft (Meter)</label>
                  <input
                    id="input-draft-pelabuhan"
                    type="number"
                    step="0.5"
                    value={formDraft}
                    onChange={(e) => setFormDraft(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Koordinat GPS Maritim</label>
                  <input
                    id="input-koordinat-pelabuhan"
                    type="text"
                    value={formKoordinat}
                    onChange={(e) => setFormKoordinat(e.target.value)}
                    placeholder="06° 06' S, 106° 53' E"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Kantor KSOP / Syahbandar</label>
                  <input
                    id="input-syahbandar-pelabuhan"
                    type="text"
                    value={formSyahbandar}
                    onChange={(e) => setFormSyahbandar(e.target.value)}
                    placeholder="Kantor Otoritas Pelabuhan"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telepon Kontak Pelabuhan</label>
                  <input
                    id="input-telepon-pelabuhan"
                    type="text"
                    value={formTelepon}
                    onChange={(e) => setFormTelepon(e.target.value)}
                    placeholder="(021) 4301080"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Fasilitas Terminal Tersedia (Pilih):</label>
                <div className="grid grid-cols-2 gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-36 overflow-y-auto">
                  {AVAILABLE_FACILITIES.map((fac) => {
                    const isChecked = formFasilitas.includes(fac);
                    return (
                      <button
                        key={fac}
                        type="button"
                        onClick={() => toggleFacility(fac)}
                        className={`flex items-center gap-2 p-1.5 rounded text-left transition-colors cursor-pointer text-[11px] ${
                          isChecked ? 'bg-blue-600 text-white font-semibold' : 'bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          isChecked ? 'border-white bg-blue-700' : 'border-slate-300'
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span className="truncate">{fac}</span>
                      </button>
                    );
                  })}
                </div>
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
                  id="btn-save-pelabuhan-submit"
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Simpan Pelabuhan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Hapus Data Pelabuhan"
        message="Apakah Anda yakin ingin menghapus data pelabuhan ini? Pelabuhan yang sudah memiliki relasi jadwal pelayaran tidak disarankan untuk dihapus."
        confirmLabel="Hapus Pelabuhan"
        onConfirm={() => {
          if (deleteTargetId) {
            onDeletePelabuhan(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
