import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Edit2, Trash2, Printer, 
  Eye, CheckCircle2, Ship, MapPin, Package, ArrowRight, X, AlertCircle
} from 'lucide-react';
import { BookingBL, JadwalVoyage, Kapal, Pelabuhan, Pelanggan, BLStatus } from '../../types';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { PrintBLModal } from '../shared/PrintBLModal';

interface BookingBLViewProps {
  bookings: BookingBL[];
  voyages: JadwalVoyage[];
  kapalList: Kapal[];
  pelabuhanList: Pelabuhan[];
  pelangganList: Pelanggan[];
  onSaveBooking: (booking: BookingBL) => void;
  onDeleteBooking: (id: string) => void;
}

export const BookingBLView: React.FC<BookingBLViewProps> = ({
  bookings,
  voyages,
  kapalList,
  pelabuhanList,
  pelangganList,
  onSaveBooking,
  onDeleteBooking
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingBL | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Print B/L state
  const [printTargetBooking, setPrintTargetBooking] = useState<BookingBL | null>(null);

  // Form states
  const [formNomorBL, setFormNomorBL] = useState('');
  const [formVoyageId, setFormVoyageId] = useState(voyages[0]?.id || '');
  const [formShipperId, setFormShipperId] = useState(pelangganList[0]?.id || '');
  const [formConsigneeId, setFormConsigneeId] = useState(pelangganList[1]?.id || '');
  const [formNotifyParty, setFormNotifyParty] = useState('SAME AS CONSIGNEE');
  const [formPolId, setFormPolId] = useState(pelabuhanList[0]?.id || '');
  const [formPodId, setFormPodId] = useState(pelabuhanList[1]?.id || '');
  const [formKontainer, setFormKontainer] = useState('');
  const [formSeal, setFormSeal] = useState('');
  const [formJenisKargo, setFormJenisKargo] = useState('FCL Container 20ft (Dry)');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formJumlah, setFormJumlah] = useState<number>(1);
  const [formSatuan, setFormSatuan] = useState<'TEU' | 'FEU' | 'Ton' | 'M3' | 'Unit'>('TEU');
  const [formBeratKotor, setFormBeratKotor] = useState<number>(18500);
  const [formVolumeCbm, setFormVolumeCbm] = useState<number>(33.2);
  const [formFreightRate, setFormFreightRate] = useState<number>(6500000);
  const [formBiayaTambahan, setFormBiayaTambahan] = useState<number>(1400000);
  const [formFreightTerm, setFormFreightTerm] = useState<'prepaid' | 'collect'>('prepaid');
  const [formStatus, setFormStatus] = useState<BLStatus>('booked');

  const openCreateModal = () => {
    setEditingBooking(null);
    setFormNomorBL(`BL-2026-NTR-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormVoyageId(voyages[0]?.id || '');
    setFormShipperId(pelangganList[0]?.id || '');
    setFormConsigneeId(pelangganList[1]?.id || '');
    setFormNotifyParty('SAME AS CONSIGNEE');
    setFormPolId(pelabuhanList[0]?.id || '');
    setFormPodId(pelabuhanList[1]?.id || '');
    setFormKontainer(`TEMU-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(1 + Math.random() * 9)}`);
    setFormSeal(`SL-ID-${Math.floor(100000 + Math.random() * 900000)}`);
    setFormJenisKargo('FCL Container 20ft (Dry Box)');
    setFormDeskripsi('KOMODITAS PERDAGANGAN & KONSUMSI NASIONAL');
    setFormJumlah(1);
    setFormSatuan('TEU');
    setFormBeratKotor(19500);
    setFormVolumeCbm(33.5);
    setFormFreightRate(7000000);
    setFormBiayaTambahan(1500000);
    setFormFreightTerm('prepaid');
    setFormStatus('booked');
    setIsModalOpen(true);
  };

  const openEditModal = (b: BookingBL) => {
    setEditingBooking(b);
    setFormNomorBL(b.nomorBL);
    setFormVoyageId(b.voyageId);
    setFormShipperId(b.shipperId);
    setFormConsigneeId(b.consigneeId);
    setFormNotifyParty(b.notifyParty);
    setFormPolId(b.pelabuhanMuatId);
    setFormPodId(b.pelabuhanBongkarId);
    setFormKontainer(b.nomorKontainer || '');
    setFormSeal(b.nomorSeal || '');
    setFormJenisKargo(b.jenisKargo);
    setFormDeskripsi(b.deskripsiBarang);
    setFormJumlah(b.jumlahSatuan);
    setFormSatuan(b.satuanKargo);
    setFormBeratKotor(b.beratKotorKg);
    setFormVolumeCbm(b.volumeCbm);
    setFormFreightRate(b.tarifFreight);
    setFormBiayaTambahan(b.biayaTambahan);
    setFormFreightTerm(b.freightTerm);
    setFormStatus(b.status);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNomorBL.trim() || !formShipperId || !formConsigneeId) return;

    const total = (Number(formFreightRate) * Number(formJumlah)) + Number(formBiayaTambahan);

    const data: BookingBL = {
      id: editingBooking ? editingBooking.id : `bl-${Date.now()}`,
      nomorBL: formNomorBL.trim(),
      voyageId: formVoyageId,
      shipperId: formShipperId,
      consigneeId: formConsigneeId,
      notifyParty: formNotifyParty.trim() || 'SAME AS CONSIGNEE',
      pelabuhanMuatId: formPolId,
      pelabuhanBongkarId: formPodId,
      nomorKontainer: formKontainer.trim(),
      nomorSeal: formSeal.trim(),
      jenisKargo: formJenisKargo.trim(),
      deskripsiBarang: formDeskripsi.trim(),
      jumlahSatuan: Number(formJumlah) || 1,
      satuanKargo: formSatuan,
      beratKotorKg: Number(formBeratKotor) || 0,
      volumeCbm: Number(formVolumeCbm) || 0,
      freightTerm: formFreightTerm,
      tarifFreight: Number(formFreightRate) || 0,
      biayaTambahan: Number(formBiayaTambahan) || 0,
      totalBiaya: total,
      status: formStatus,
      tanggalBooking: editingBooking ? editingBooking.tanggalBooking : new Date().toISOString(),
      createdAt: editingBooking ? editingBooking.createdAt : new Date().toISOString()
    };

    onSaveBooking(data);
    setIsModalOpen(false);
  };

  // Helper getters
  const getShipper = (id: string) => pelangganList.find(p => p.id === id);
  const getConsignee = (id: string) => pelangganList.find(p => p.id === id);
  const getPort = (id: string) => pelabuhanList.find(p => p.id === id);
  const getVoyage = (id: string) => voyages.find(v => v.id === id);
  const getKapalForBooking = (b: BookingBL) => {
    const v = getVoyage(b.voyageId);
    return v ? kapalList.find(k => k.id === v.kapalId) || null : null;
  };

  const getStatusBadge = (status: BLStatus) => {
    switch (status) {
      case 'on_board':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">🚢 On Board</span>;
      case 'in_transit':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800">🌊 In Transit</span>;
      case 'discharged':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">🏗️ Discharged</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">📦 Delivered</span>;
      case 'released':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">✅ B/L Released</span>;
      case 'loading':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">⏳ Loading</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">📑 Booked</span>;
    }
  };

  const filteredList = bookings.filter(b => {
    const shipper = getShipper(b.shipperId)?.namaPerusahaan.toLowerCase() || '';
    const consignee = getConsignee(b.consigneeId)?.namaPerusahaan.toLowerCase() || '';
    const noBL = b.nomorBL.toLowerCase();
    const kontainer = (b.nomorKontainer || '').toLowerCase();
    const desk = b.deskripsiBarang.toLowerCase();
    const q = searchTerm.toLowerCase();

    const matchSearch = noBL.includes(q) || shipper.includes(q) || consignee.includes(q) || kontainer.includes(q) || desk.includes(q);
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div id="transaksi-booking-bl-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900">Transaksi Booking & Bill of Lading (B/L)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Penerbitan surat muatan konosemen kargo kapal laut, nomor kontainer, segel (seal), dan cetak resmi B/L.
          </p>
        </div>

        <button
          id="btn-add-booking-bl"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Terbitkan B/L Baru</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-booking-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor B/L, kontainer, shipper, barang..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <select
          id="filter-booking-status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer w-full sm:w-auto"
        >
          <option value="all">Semua Status B/L</option>
          <option value="booked">Booked (Dipesan)</option>
          <option value="loading">Loading Muatan</option>
          <option value="on_board">On Board (Di Kapal)</option>
          <option value="in_transit">In Transit (Berlayar)</option>
          <option value="discharged">Discharged (Bongkar)</option>
          <option value="delivered">Delivered (Terkirim)</option>
          <option value="released">B/L Released</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-5">NOMOR B/L & KONTAINER</th>
                <th className="p-3.5">SHIPPER (PENGIRIM) ➔ CONSIGNEE</th>
                <th className="p-3.5">RUTE PELABUHAN</th>
                <th className="p-3.5">DESKRIPSI KARGO</th>
                <th className="p-3.5 text-right">TOTAL FREIGHT (IDR)</th>
                <th className="p-3.5">STATUS B/L</th>
                <th className="p-3.5 pr-5 text-right">AKSI DOKUMEN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredList.map((b) => {
                const shipper = getShipper(b.shipperId);
                const consignee = getConsignee(b.consigneeId);
                const pol = getPort(b.pelabuhanMuatId);
                const pod = getPort(b.pelabuhanBongkarId);

                return (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-mono font-bold text-blue-900 text-sm">{b.nomorBL}</div>
                      <div className="text-[11px] font-mono text-slate-600">
                        {b.nomorKontainer ? `Box: ${b.nomorKontainer}` : 'Break Bulk'}
                      </div>
                      {b.nomorSeal && (
                        <div className="text-[10px] text-slate-400 font-mono">Seal: {b.nomorSeal}</div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900 truncate max-w-[200px]">
                        {shipper?.namaPerusahaan || 'Shipper'}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate max-w-[200px]">
                        <span>➔</span>
                        <span>{consignee?.namaPerusahaan || 'Consignee'}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-800 font-medium">
                        {pol?.namaPelabuhan.replace('Pelabuhan ', '')}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ➔ {pod?.namaPelabuhan.replace('Pelabuhan ', '')}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800 truncate max-w-[180px]">
                        {b.deskripsiBarang}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {b.jumlahSatuan} {b.satuanKargo} ({(b.beratKotorKg / 1000).toFixed(1)} Ton)
                      </div>
                    </td>
                    <td className="p-3.5 text-right font-mono">
                      <div className="font-bold text-blue-900">
                        Rp {b.totalBiaya.toLocaleString('id-ID')}
                      </div>
                      <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                        b.freightTerm === 'prepaid' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                      }`}>
                        {b.freightTerm}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`print-bl-${b.id}`}
                          onClick={() => setPrintTargetBooking(b)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                          title="Cetak Bill of Lading Resmi"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Cetak B/L</span>
                        </button>
                        <button
                          id={`edit-booking-${b.id}`}
                          onClick={() => openEditModal(b)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                          title="Edit Booking"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id={`delete-booking-${b.id}`}
                          onClick={() => setDeleteTargetId(b.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus Booking"
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

      {/* Modal Add/Edit Booking B/L */}
      {isModalOpen && (
        <div id="modal-booking-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold">
                  {editingBooking ? 'Edit Dokumen Bill of Lading (B/L)' : 'Penerbitan Bill of Lading Baru'}
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
                  <label className="block font-semibold text-slate-700 mb-1">Nomor B/L (Bill of Lading No)</label>
                  <input
                    id="input-nomor-bl"
                    type="text"
                    required
                    value={formNomorBL}
                    onChange={(e) => setFormNomorBL(e.target.value)}
                    placeholder="BL-2026-NTR-0012"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jadwal Pelayaran (Voyage)</label>
                  <select
                    id="select-voyage-bl"
                    value={formVoyageId}
                    onChange={(e) => {
                      setFormVoyageId(e.target.value);
                      const v = voyages.find(item => item.id === e.target.value);
                      if (v) {
                        setFormPolId(v.pelabuhanAsalId);
                        setFormPodId(v.pelabuhanTujuanId);
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    {voyages.map(v => {
                      const k = kapalList.find(item => item.id === v.kapalId);
                      return (
                        <option key={v.id} value={v.id}>
                          {v.nomorVoyage} - {k?.namaKapal || 'Kapal'}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shipper (Pihak Pengirim)</label>
                  <select
                    id="select-shipper-bl"
                    value={formShipperId}
                    onChange={(e) => setFormShipperId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    {pelangganList.map(p => (
                      <option key={p.id} value={p.id}>{p.namaPerusahaan}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consignee (Pihak Penerima)</label>
                  <select
                    id="select-consignee-bl"
                    value={formConsigneeId}
                    onChange={(e) => setFormConsigneeId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    {pelangganList.map(p => (
                      <option key={p.id} value={p.id}>{p.namaPerusahaan}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pelabuhan Muat (Port of Loading)</label>
                  <select
                    id="select-pol-bl"
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
                  <label className="block font-semibold text-slate-700 mb-1">Pelabuhan Bongkar (Port of Discharge)</label>
                  <select
                    id="select-pod-bl"
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

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Kontainer</label>
                  <input
                    id="input-container-no"
                    type="text"
                    value={formKontainer}
                    onChange={(e) => setFormKontainer(e.target.value)}
                    placeholder="TEMU-928341-2"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Segel (Seal No)</label>
                  <input
                    id="input-seal-no"
                    type="text"
                    value={formSeal}
                    onChange={(e) => setFormSeal(e.target.value)}
                    placeholder="SL-ID-882910"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Satuan</label>
                  <select
                    id="select-satuan-bl"
                    value={formSatuan}
                    onChange={(e) => setFormSatuan(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="TEU">TEU (20ft)</option>
                    <option value="FEU">FEU (40ft)</option>
                    <option value="Ton">Tonase</option>
                    <option value="M3">M3 (CBM)</option>
                    <option value="Unit">Unit Kendaraan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Kargo / Muatan Barang</label>
                <input
                  id="input-deskripsi-kargo"
                  type="text"
                  required
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  placeholder="e.g. 500 BOX PRODUK KONSUMEN & SEMBAKO"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Berat Kotor (Gross Weight - Kg)</label>
                  <input
                    id="input-berat-kotor"
                    type="number"
                    value={formBeratKotor}
                    onChange={(e) => setFormBeratKotor(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Volume Kubikasi (CBM)</label>
                  <input
                    id="input-volume-cbm"
                    type="number"
                    step="0.1"
                    value={formVolumeCbm}
                    onChange={(e) => setFormVolumeCbm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tarif Freight Pokok (IDR)</label>
                  <input
                    id="input-tarif-freight-bl"
                    type="number"
                    value={formFreightRate}
                    onChange={(e) => setFormFreightRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Biaya Tambahan (THC+Doc)</label>
                  <input
                    id="input-biaya-tambahan-bl"
                    type="number"
                    value={formBiayaTambahan}
                    onChange={(e) => setFormBiayaTambahan(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Syarat Freight</label>
                  <select
                    id="select-freight-term"
                    value={formFreightTerm}
                    onChange={(e) => setFormFreightTerm(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="prepaid">Freight Prepaid</option>
                    <option value="collect">Freight Collect</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Muatan / B/L</label>
                  <select
                    id="select-status-bl"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as BLStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="booked">Booked (Dipesan)</option>
                    <option value="loading">Loading</option>
                    <option value="on_board">On Board</option>
                    <option value="in_transit">In Transit</option>
                    <option value="discharged">Discharged</option>
                    <option value="delivered">Delivered</option>
                    <option value="released">B/L Released</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Notify Party</label>
                  <input
                    id="input-notify-party"
                    type="text"
                    value={formNotifyParty}
                    onChange={(e) => setFormNotifyParty(e.target.value)}
                    placeholder="SAME AS CONSIGNEE"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
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
                  id="btn-save-booking-submit"
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Terbitkan Dokumen B/L
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Print B/L Modal */}
      {printTargetBooking && (
        <PrintBLModal
          isOpen={true}
          onClose={() => setPrintTargetBooking(null)}
          booking={printTargetBooking}
          voyage={getVoyage(printTargetBooking.voyageId) || undefined}
          kapal={getKapalForBooking(printTargetBooking) || undefined}
          shipper={getShipper(printTargetBooking.shipperId) || undefined}
          consignee={getConsignee(printTargetBooking.consigneeId) || undefined}
          pelabuhanMuat={getPort(printTargetBooking.pelabuhanMuatId) || undefined}
          pelabuhanBongkar={getPort(printTargetBooking.pelabuhanBongkarId) || undefined}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Hapus Bill of Lading (B/L)"
        message="Apakah Anda yakin ingin membatalkan dan menghapus dokumen B/L ini? Invoice terkait perlu disesuaikan."
        confirmLabel="Hapus B/L"
        onConfirm={() => {
          if (deleteTargetId) {
            onDeleteBooking(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
