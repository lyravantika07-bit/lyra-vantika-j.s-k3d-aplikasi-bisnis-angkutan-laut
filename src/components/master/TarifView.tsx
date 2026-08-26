import React, { useState } from 'react';
import { 
  Tag, Plus, Search, Edit2, Trash2, Calculator, 
  ArrowRight, ShieldCheck, DollarSign, X, CheckCircle2
} from 'lucide-react';
import { TarifKargo, Pelabuhan } from '../../types';
import { ConfirmDialog } from '../shared/ConfirmDialog';

interface TarifViewProps {
  tarifList: TarifKargo[];
  pelabuhanList: Pelabuhan[];
  onSaveTarif: (tarif: TarifKargo) => void;
  onDeleteTarif: (id: string) => void;
}

export const TarifView: React.FC<TarifViewProps> = ({
  tarifList,
  pelabuhanList,
  onSaveTarif,
  onDeleteTarif
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTarif, setEditingTarif] = useState<TarifKargo | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [formPolId, setFormPolId] = useState(pelabuhanList[0]?.id || '');
  const [formPodId, setFormPodId] = useState(pelabuhanList[1]?.id || '');
  const [formJenisKargo, setFormJenisKargo] = useState('FCL Container 20ft (Dry Box)');
  const [formSatuan, setFormSatuan] = useState<'TEU' | 'FEU' | 'Ton' | 'M3' | 'Unit'>('TEU');
  const [formTarifDasar, setFormTarifDasar] = useState<number>(6500000);
  const [formThc, setFormThc] = useState<number>(950000);
  const [formBaf, setFormBaf] = useState<number>(450000);
  const [formDocFee, setFormDocFee] = useState<number>(150000);
  const [formCatatan, setFormCatatan] = useState('');

  // Interactive Freight Calculator state
  const [calcPol, setCalcPol] = useState(pelabuhanList[0]?.id || '');
  const [calcPod, setCalcPod] = useState(pelabuhanList[1]?.id || '');
  const [calcQty, setCalcQty] = useState<number>(2);

  const openCreateModal = () => {
    setEditingTarif(null);
    setFormPolId(pelabuhanList[0]?.id || '');
    setFormPodId(pelabuhanList[1]?.id || '');
    setFormJenisKargo('FCL Container 20ft (Dry)');
    setFormSatuan('TEU');
    setFormTarifDasar(7500000);
    setFormThc(950000);
    setFormBaf(500000);
    setFormDocFee(150000);
    setFormCatatan('Term: Port to Port / FIOST (Free In and Out Stowed and Trimmed)');
    setIsModalOpen(true);
  };

  const openEditModal = (t: TarifKargo) => {
    setEditingTarif(t);
    setFormPolId(t.pelabuhanAsalId);
    setFormPodId(t.pelabuhanTujuanId);
    setFormJenisKargo(t.jenisKargo);
    setFormSatuan(t.satuan);
    setFormTarifDasar(t.tarifDasar);
    setFormThc(t.thcCharge);
    setFormBaf(t.bunkerSurcharge);
    setFormDocFee(t.docFee);
    setFormCatatan(t.catatan || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPolId || !formPodId) return;

    const data: TarifKargo = {
      id: editingTarif ? editingTarif.id : `trf-${Date.now()}`,
      pelabuhanAsalId: formPolId,
      pelabuhanTujuanId: formPodId,
      jenisKargo: formJenisKargo.trim(),
      satuan: formSatuan,
      tarifDasar: Number(formTarifDasar) || 0,
      thcCharge: Number(formThc) || 0,
      bunkerSurcharge: Number(formBaf) || 0,
      docFee: Number(formDocFee) || 0,
      berlakuHingga: '2026-12-31',
      catatan: formCatatan.trim()
    };

    onSaveTarif(data);
    setIsModalOpen(false);
  };

  const getPortName = (id: string) => {
    return pelabuhanList.find(p => p.id === id)?.namaPelabuhan || id;
  };

  const filteredList = tarifList.filter(t => {
    const pol = getPortName(t.pelabuhanAsalId).toLowerCase();
    const pod = getPortName(t.pelabuhanTujuanId).toLowerCase();
    const kargo = t.jenisKargo.toLowerCase();
    const q = searchTerm.toLowerCase();
    return pol.includes(q) || pod.includes(q) || kargo.includes(q);
  });

  // Calculate live estimate
  const matchedTarif = tarifList.find(t => t.pelabuhanAsalId === calcPol && t.pelabuhanTujuanId === calcPod);
  const unitTotal = matchedTarif ? (matchedTarif.tarifDasar + matchedTarif.thcCharge + matchedTarif.bunkerSurcharge) : 0;
  const grandEstimate = matchedTarif ? (unitTotal * calcQty + matchedTarif.docFee) : 0;

  return (
    <div id="master-tarif-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900">Master Tarif Kargo & Uang Tambang (Freight Matrix)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Matriks tarif rute pelabuhan, Terminal Handling Charge (THC), Bunker Adjustment Factor (BAF), dan biaya dokumen.
          </p>
        </div>

        <button
          id="btn-add-tarif"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Tarif Rute</span>
        </button>
      </div>

      {/* Interactive Freight Quick Calculator Widget */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-5 rounded-2xl border border-slate-800 text-white shadow-md">
        <div className="flex items-center gap-2 mb-3 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Calculator className="w-4 h-4" />
          <span>Simulasi Cepat Hitung Estimasi Ongkos Angkut Laut (Freight Estimator)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-[11px] text-slate-300 mb-1">Pelabuhan Muat (POL)</label>
            <select
              id="calc-pol-select"
              value={calcPol}
              onChange={(e) => setCalcPol(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-cyan-500"
            >
              {pelabuhanList.map(p => (
                <option key={p.id} value={p.id}>{p.namaPelabuhan} ({p.kodePelabuhan})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-300 mb-1">Pelabuhan Bongkar (POD)</label>
            <select
              id="calc-pod-select"
              value={calcPod}
              onChange={(e) => setCalcPod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-cyan-500"
            >
              {pelabuhanList.map(p => (
                <option key={p.id} value={p.id}>{p.namaPelabuhan} ({p.kodePelabuhan})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-300 mb-1">Jumlah Muatan (Kontainer/Unit)</label>
            <input
              id="calc-qty-input"
              type="number"
              min="1"
              value={calcQty}
              onChange={(e) => setCalcQty(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Estimasi Freight</span>
              <span className="text-sm font-black text-cyan-300 font-mono">
                Rp {grandEstimate.toLocaleString('id-ID')}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              {matchedTarif ? 'Tarif Valid' : 'Tarif Custom'}
            </span>
          </div>
        </div>
      </div>

      {/* Search & List */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-tarif-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari rute pelabuhan atau jenis kargo..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Ditemukan <strong className="text-slate-800">{filteredList.length}</strong> Matriks Tarif
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-5">RUTE TRAYEK (POL ➔ POD)</th>
                <th className="p-3.5">JENIS KARGO / SATUAN</th>
                <th className="p-3.5 text-right">TARIF DASAR (FREIGHT)</th>
                <th className="p-3.5 text-right">THC + BAF SURCHARGE</th>
                <th className="p-3.5 text-right">TOTAL ALL-IN / UNIT</th>
                <th className="p-3.5">TERM PENGAPALAN</th>
                <th className="p-3.5 pr-5 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredList.map((t) => {
                const totalUnit = t.tarifDasar + t.thcCharge + t.bunkerSurcharge;
                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{getPortName(t.pelabuhanAsalId).replace('Pelabuhan ', '')}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                        <span>{getPortName(t.pelabuhanTujuanId).replace('Pelabuhan ', '')}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {t.id}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800">{t.jenisKargo}</div>
                      <span className="inline-block px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 text-[10px] font-bold mt-0.5">
                        Satuan: {t.satuan}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono font-semibold text-slate-800">
                      Rp {t.tarifDasar.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3.5 text-right font-mono text-slate-600 text-[11px]">
                      <div>THC: Rp {t.thcCharge.toLocaleString('id-ID')}</div>
                      <div className="text-[10px] text-amber-700">BAF: Rp {t.bunkerSurcharge.toLocaleString('id-ID')}</div>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-blue-900 text-sm">
                      Rp {totalUnit.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3.5 text-slate-500 text-[11px]">
                      {t.catatan || 'Port to Port / FIOST'}
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`edit-tarif-${t.id}`}
                          onClick={() => openEditModal(t)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                          title="Edit Tarif"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id={`delete-tarif-${t.id}`}
                          onClick={() => setDeleteTargetId(t.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus Tarif"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Tarif */}
      {isModalOpen && (
        <div id="modal-tarif-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <Tag className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold">
                  {editingTarif ? 'Edit Tarif Kargo Rute' : 'Tambah Matriks Tarif Kargo Baru'}
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
                  <label className="block font-semibold text-slate-700 mb-1">Pelabuhan Muat Asal (POL)</label>
                  <select
                    id="input-pol-tarif"
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
                  <label className="block font-semibold text-slate-700 mb-1">Pelabuhan Bongkar Tujuan (POD)</label>
                  <select
                    id="input-pod-tarif"
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
                  <label className="block font-semibold text-slate-700 mb-1">Deskripsi Jenis Kargo</label>
                  <input
                    id="input-jenis-kargo"
                    type="text"
                    required
                    value={formJenisKargo}
                    onChange={(e) => setFormJenisKargo(e.target.value)}
                    placeholder="e.g. FCL 20ft Dry Box"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Satuan Dasar</label>
                  <select
                    id="input-satuan-tarif"
                    value={formSatuan}
                    onChange={(e) => setFormSatuan(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="TEU">TEU (Kontainer 20ft)</option>
                    <option value="FEU">FEU (Kontainer 40ft)</option>
                    <option value="Ton">Ton (Curah Kering/Cair)</option>
                    <option value="M3">M3 (CBM Break Bulk)</option>
                    <option value="Unit">Unit (Kendaraan / Truk)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tarif Dasar Freight (IDR)</label>
                  <input
                    id="input-tarif-dasar"
                    type="number"
                    value={formTarifDasar}
                    onChange={(e) => setFormTarifDasar(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">THC (Terminal Handling Charge)</label>
                  <input
                    id="input-thc"
                    type="number"
                    value={formThc}
                    onChange={(e) => setFormThc(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">BAF (Bunker Surcharge)</label>
                  <input
                    id="input-baf"
                    type="number"
                    value={formBaf}
                    onChange={(e) => setFormBaf(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Biaya Dokumen B/L (Doc Fee)</label>
                  <input
                    id="input-docfee"
                    type="number"
                    value={formDocFee}
                    onChange={(e) => setFormDocFee(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan & Syarat Pengapalan</label>
                <input
                  id="input-catatan-tarif"
                  type="text"
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  placeholder="e.g. Free Time Demurrage 5 Hari di Dermaga Tujuan..."
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
                  id="btn-save-tarif-submit"
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Simpan Tarif Kargo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Hapus Data Tarif Kargo"
        message="Apakah Anda yakin ingin menghapus data tarif rute ini?"
        confirmLabel="Hapus Tarif"
        onConfirm={() => {
          if (deleteTargetId) {
            onDeleteTarif(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
