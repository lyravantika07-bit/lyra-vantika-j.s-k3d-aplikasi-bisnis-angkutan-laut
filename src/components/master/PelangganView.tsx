import React, { useState } from 'react';
import { 
  Users, Plus, Search, Edit2, Trash2, Building2, 
  Phone, Mail, MapPin, CreditCard, ShieldCheck, X
} from 'lucide-react';
import { Pelanggan, CustomerType } from '../../types';
import { ConfirmDialog } from '../shared/ConfirmDialog';

interface PelangganViewProps {
  pelangganList: Pelanggan[];
  onSavePelanggan: (pelanggan: Pelanggan) => void;
  onDeletePelanggan: (id: string) => void;
}

export const PelangganView: React.FC<PelangganViewProps> = ({
  pelangganList,
  onSavePelanggan,
  onDeletePelanggan
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPelanggan, setEditingPelanggan] = useState<Pelanggan | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [formKode, setFormKode] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formTipe, setFormTipe] = useState<CustomerType>('shipper');
  const [formPic, setFormPic] = useState('');
  const [formTelepon, setFormTelepon] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAlamat, setFormAlamat] = useState('');
  const [formKota, setFormKota] = useState('Jakarta');
  const [formNpwp, setFormNpwp] = useState('');
  const [formCreditLimit, setFormCreditLimit] = useState<number>(1000000000);
  const [formCreditTerm, setFormCreditTerm] = useState<number>(30);
  const [formStatus, setFormStatus] = useState<'aktif' | 'nonaktif'>('aktif');

  const openCreateModal = () => {
    setEditingPelanggan(null);
    setFormKode(`CUST-${Math.floor(100 + Math.random() * 900)}`);
    setFormNama('');
    setFormTipe('shipper');
    setFormPic('');
    setFormTelepon('0812-');
    setFormEmail('');
    setFormAlamat('');
    setFormKota('Jakarta');
    setFormNpwp('01.' + Math.floor(100 + Math.random() * 900) + '.' + Math.floor(100 + Math.random() * 900) + '.0-015.000');
    setFormCreditLimit(1500000000);
    setFormCreditTerm(30);
    setFormStatus('aktif');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Pelanggan) => {
    setEditingPelanggan(p);
    setFormKode(p.kodeCustomer);
    setFormNama(p.namaPerusahaan);
    setFormTipe(p.tipe);
    setFormPic(p.picName);
    setFormTelepon(p.telepon);
    setFormEmail(p.email || '');
    setFormAlamat(p.alamat);
    setFormKota(p.kota || 'Jakarta');
    setFormNpwp(p.npwp || '');
    setFormCreditLimit(p.creditLimit);
    setFormCreditTerm(p.creditTermDays);
    setFormStatus(p.status);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim() || !formKode.trim()) return;

    const data: Pelanggan = {
      id: editingPelanggan ? editingPelanggan.id : `plg-${Date.now()}`,
      kodeCustomer: formKode.trim(),
      namaPerusahaan: formNama.trim(),
      tipe: formTipe,
      picName: formPic.trim() || 'PIC Operasional',
      telepon: formTelepon.trim(),
      email: formEmail.trim(),
      alamat: formAlamat.trim() || 'Alamat Perusahaan',
      kota: formKota.trim(),
      npwp: formNpwp.trim(),
      creditLimit: Number(formCreditLimit) || 0,
      creditTermDays: Number(formCreditTerm) || 30,
      status: formStatus,
      createdAt: editingPelanggan ? editingPelanggan.createdAt : new Date().toISOString()
    };

    onSavePelanggan(data);
    setIsModalOpen(false);
  };

  const filteredList = pelangganList.filter(p => {
    const matchSearch = 
      p.namaPerusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.kodeCustomer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.picName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.kota.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || p.tipe === filterType;
    return matchSearch && matchType;
  });

  return (
    <div id="master-pelanggan-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900">Master Data Shipper, Consignee & Forwarder</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Database mitra pengirim kargo laut, kontak PIC, nomor NPWP, dan batas pagu kredit (Credit Term).
          </p>
        </div>

        <button
          id="btn-add-pelanggan"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Mitra Customer</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-pelanggan-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari perusahaan, PIC, kota..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <select
          id="filter-pelanggan-type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer w-full sm:w-auto"
        >
          <option value="all">Semua Kategori Mitra</option>
          <option value="shipper">Shipper (Pengirim)</option>
          <option value="consignee">Consignee (Penerima)</option>
          <option value="forwarder">Freight Forwarder</option>
          <option value="korporat">Korporat Logistik</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-5">NAMA PERUSAHAAN & KODE</th>
                <th className="p-3.5">TIPE MITRA</th>
                <th className="p-3.5">PIC & KONTAK</th>
                <th className="p-3.5">KOTA & ALAMAT</th>
                <th className="p-3.5 text-right">CREDIT LIMIT & TERM</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5 pr-5 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredList.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 pl-5">
                    <div className="font-bold text-slate-900 text-sm">{p.namaPerusahaan}</div>
                    <div className="text-[11px] font-mono text-blue-700">{p.kodeCustomer} | NPWP: {p.npwp || '-'}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.tipe === 'shipper' ? 'bg-blue-100 text-blue-800' :
                      p.tipe === 'consignee' ? 'bg-purple-100 text-purple-800' :
                      p.tipe === 'forwarder' ? 'bg-cyan-100 text-cyan-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.tipe}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-800">{p.picName}</div>
                    <div className="text-[11px] text-slate-500">{p.telepon}</div>
                    {p.email && <div className="text-[10px] text-slate-400">{p.email}</div>}
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-slate-800">{p.kota}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{p.alamat}</div>
                  </td>
                  <td className="p-3.5 text-right font-mono">
                    <div className="font-bold text-slate-900">
                      Rp {(p.creditLimit / 1000000).toLocaleString('id-ID')} Juta
                    </div>
                    <div className="text-[10px] text-slate-500">Term: {p.creditTermDays} Hari</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {p.status === 'aktif' ? 'Aktif' : 'Non-aktif'}
                    </span>
                  </td>
                  <td className="p-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        id={`edit-pelanggan-${p.id}`}
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        id={`delete-pelanggan-${p.id}`}
                        onClick={() => setDeleteTargetId(p.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus Customer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Pelanggan */}
      {isModalOpen && (
        <div id="modal-pelanggan-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold">
                  {editingPelanggan ? 'Edit Data Mitra Customer' : 'Tambah Mitra Customer Baru'}
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
                  <label className="block font-semibold text-slate-700 mb-1">Kode Customer</label>
                  <input
                    id="input-kode-customer"
                    type="text"
                    required
                    value={formKode}
                    onChange={(e) => setFormKode(e.target.value)}
                    placeholder="e.g. CUST-IND-01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nama Perusahaan / Instansi</label>
                  <input
                    id="input-nama-perusahaan"
                    type="text"
                    required
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    placeholder="e.g. PT Indofood Sukses Makmur Tbk"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori / Tipe Mitra</label>
                  <select
                    id="select-tipe-customer"
                    value={formTipe}
                    onChange={(e) => setFormTipe(e.target.value as CustomerType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="shipper">Shipper (Pengirim Kargo)</option>
                    <option value="consignee">Consignee (Penerima Kargo)</option>
                    <option value="forwarder">Freight Forwarder</option>
                    <option value="korporat">Korporat Logistik</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama PIC (Person in Charge)</label>
                  <input
                    id="input-pic-customer"
                    type="text"
                    required
                    value={formPic}
                    onChange={(e) => setFormPic(e.target.value)}
                    placeholder="Ir. Budi Santoso"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    id="input-telepon-customer"
                    type="text"
                    required
                    value={formTelepon}
                    onChange={(e) => setFormTelepon(e.target.value)}
                    placeholder="0812-3456-7890"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Email Bisnis</label>
                  <input
                    id="input-email-customer"
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="logistik@indofood.co.id"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kota</label>
                  <input
                    id="input-kota-customer"
                    type="text"
                    value={formKota}
                    onChange={(e) => setFormKota(e.target.value)}
                    placeholder="Jakarta Selatan"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor NPWP Perusahaan</label>
                  <input
                    id="input-npwp-customer"
                    type="text"
                    value={formNpwp}
                    onChange={(e) => setFormNpwp(e.target.value)}
                    placeholder="01.332.124.5-015.000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Kantor Lengkap</label>
                <textarea
                  id="input-alamat-customer"
                  rows={2}
                  value={formAlamat}
                  onChange={(e) => setFormAlamat(e.target.value)}
                  placeholder="Jl. Jend. Sudirman Kav. 76-78..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Credit Limit (IDR)</label>
                  <input
                    id="input-credit-limit"
                    type="number"
                    value={formCreditLimit}
                    onChange={(e) => setFormCreditLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jatuh Tempo (Credit Term - Hari)</label>
                  <input
                    id="input-credit-term"
                    type="number"
                    value={formCreditTerm}
                    onChange={(e) => setFormCreditTerm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
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
                  id="btn-save-pelanggan-submit"
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Simpan Mitra Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Hapus Data Customer"
        message="Apakah Anda yakin ingin menghapus data customer ini? Riwayat B/L dan invoice terkait dapat terpengaruh."
        confirmLabel="Hapus Customer"
        onConfirm={() => {
          if (deleteTargetId) {
            onDeletePelanggan(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
