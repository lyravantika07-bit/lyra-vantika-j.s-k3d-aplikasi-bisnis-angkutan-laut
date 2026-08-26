import React, { useState } from 'react';
import { 
  Receipt, Plus, Search, Edit2, Trash2, Printer, 
  CheckCircle2, Clock, AlertTriangle, ArrowRight, DollarSign, X, Check
} from 'lucide-react';
import { InvoiceFreight, BookingBL, Pelanggan, InvoiceItem } from '../../types';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { PrintInvoiceModal } from '../shared/PrintInvoiceModal';

interface InvoiceViewProps {
  invoices: InvoiceFreight[];
  bookings: BookingBL[];
  pelangganList: Pelanggan[];
  onSaveInvoice: (invoice: InvoiceFreight) => void;
  onDeleteInvoice: (id: string) => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({
  invoices,
  bookings,
  pelangganList,
  onSaveInvoice,
  onDeleteInvoice
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceFreight | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Print Invoice Modal State
  const [printTargetInvoice, setPrintTargetInvoice] = useState<InvoiceFreight | null>(null);

  // Form states
  const [formNomorInv, setFormNomorInv] = useState('');
  const [formBookingId, setFormBookingId] = useState(bookings[0]?.id || '');
  const [formCustomerId, setFormCustomerId] = useState(pelangganList[0]?.id || '');
  const [formTanggal, setFormTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [formJatuhTempo, setFormJatuhTempo] = useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  const [formFreightAmount, setFormFreightAmount] = useState<number>(7500000);
  const [formThcAmount, setFormThcAmount] = useState<number>(950000);
  const [formBafAmount, setFormBafAmount] = useState<number>(450000);
  const [formDocAmount, setFormDocAmount] = useState<number>(150000);
  const [formStatus, setFormStatus] = useState<'unpaid' | 'paid' | 'overdue'>('unpaid');
  const [formPaymentMethod, setFormPaymentMethod] = useState('');

  const openCreateModal = () => {
    setEditingInvoice(null);
    const selBooking = bookings[0];
    setFormNomorInv(`INV-2026-FRT-00${Math.floor(10 + Math.random() * 90)}`);
    setFormBookingId(selBooking?.id || '');
    setFormCustomerId(selBooking?.shipperId || pelangganList[0]?.id || '');
    setFormTanggal(new Date().toISOString().slice(0, 10));
    setFormJatuhTempo(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
    setFormFreightAmount(selBooking ? selBooking.tarifFreight * selBooking.jumlahSatuan : 7500000);
    setFormThcAmount(950000);
    setFormBafAmount(450000);
    setFormDocAmount(150000);
    setFormStatus('unpaid');
    setFormPaymentMethod('');
    setIsModalOpen(true);
  };

  const openEditModal = (inv: InvoiceFreight) => {
    setEditingInvoice(inv);
    setFormNomorInv(inv.nomorInvoice);
    setFormBookingId(inv.bookingId);
    setFormCustomerId(inv.customerId);
    setFormTanggal(inv.tanggalInvoice);
    setFormJatuhTempo(inv.jatuhTempo);
    setFormStatus(inv.statusBayar);
    setFormPaymentMethod(inv.metodePembayaran || '');

    // Extract amounts from items
    const freightItem = inv.items.find(i => i.deskripsi.toLowerCase().includes('freight'))?.total || 7500000;
    const thcItem = inv.items.find(i => i.deskripsi.toLowerCase().includes('thc'))?.total || 950000;
    const bafItem = inv.items.find(i => i.deskripsi.toLowerCase().includes('baf') || i.deskripsi.toLowerCase().includes('bunker'))?.total || 450000;
    const docItem = inv.items.find(i => i.deskripsi.toLowerCase().includes('dokumen') || i.deskripsi.toLowerCase().includes('bl'))?.total || 150000;

    setFormFreightAmount(freightItem);
    setFormThcAmount(thcItem);
    setFormBafAmount(bafItem);
    setFormDocAmount(docItem);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNomorInv.trim() || !formCustomerId) return;

    const items: InvoiceItem[] = [
      { deskripsi: 'Ocean Freight Rate (Uang Tambang Laut)', jumlah: 1, tarifSatuan: formFreightAmount, total: formFreightAmount },
      { deskripsi: 'Terminal Handling Charge (THC) Pelabuhan', jumlah: 1, tarifSatuan: formThcAmount, total: formThcAmount },
      { deskripsi: 'Bunker Adjustment Factor (BAF Surcharge)', jumlah: 1, tarifSatuan: formBafAmount, total: formBafAmount },
      { deskripsi: 'Biaya Penerbitan Dokumen B/L & Manifest', jumlah: 1, tarifSatuan: formDocAmount, total: formDocAmount }
    ];

    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const ppn = Math.round(subtotal * 0.11);
    const totalTagihan = subtotal + ppn;

    const data: InvoiceFreight = {
      id: editingInvoice ? editingInvoice.id : `inv-${Date.now()}`,
      nomorInvoice: formNomorInv.trim(),
      bookingId: formBookingId,
      customerId: formCustomerId,
      tanggalInvoice: formTanggal,
      jatuhTempo: formJatuhTempo,
      items,
      subtotal,
      ppn,
      totalTagihan,
      statusBayar: formStatus,
      tanggalBayar: formStatus === 'paid' ? (editingInvoice?.tanggalBayar || new Date().toISOString().slice(0, 10)) : undefined,
      metodePembayaran: formStatus === 'paid' ? (formPaymentMethod.trim() || 'Bank Transfer Mandiri Virtual Account') : undefined,
      catatan: 'Pembayaran tagihan uang tambang kargo pelayaran laut.'
    };

    onSaveInvoice(data);
    setIsModalOpen(false);
  };

  const handleQuickMarkPaid = (inv: InvoiceFreight) => {
    const updated: InvoiceFreight = {
      ...inv,
      statusBayar: 'paid',
      tanggalBayar: new Date().toISOString().slice(0, 10),
      metodePembayaran: 'Bank Transfer Rekening Giro Mandiri'
    };
    onSaveInvoice(updated);
  };

  const getCustomer = (id: string) => pelangganList.find(p => p.id === id);
  const getBooking = (id: string) => bookings.find(b => b.id === id);

  const filteredList = invoices.filter(inv => {
    const cust = getCustomer(inv.customerId)?.namaPerusahaan.toLowerCase() || '';
    const noInv = inv.nomorInvoice.toLowerCase();
    const q = searchTerm.toLowerCase();

    const matchSearch = noInv.includes(q) || cust.includes(q);
    const matchStatus = filterStatus === 'all' || inv.statusBayar === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: 'unpaid' | 'paid' | 'overdue') => {
    switch (status) {
      case 'paid':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><Check className="w-3 h-3" /> Lunas (Paid)</span>;
      case 'overdue':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Jatuh Tempo</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1"><Clock className="w-3 h-3" /> Belum Bayar</span>;
    }
  };

  return (
    <div id="transaksi-invoice-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900">Transaksi Invoicing & Freight Billing</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Penagihan uang tambang, Terminal Handling Charge (THC), PPN 11%, status piutang, dan cetak invoice resmi.
          </p>
        </div>

        <button
          id="btn-add-invoice"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Invoice Baru</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-invoice-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor invoice atau pelanggan..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <select
          id="filter-invoice-status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer w-full sm:w-auto"
        >
          <option value="all">Semua Status Pembayaran</option>
          <option value="unpaid">Belum Dibayar (Unpaid)</option>
          <option value="paid">Lunas (Paid)</option>
          <option value="overdue">Jatuh Tempo (Overdue)</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-5">NOMOR INVOICE & B/L</th>
                <th className="p-3.5">PELANGGAN / PERUSAHAAN</th>
                <th className="p-3.5">TANGGAL & TEMPO</th>
                <th className="p-3.5 text-right">TOTAL TAGIHAN (IDR)</th>
                <th className="p-3.5">STATUS BAYAR</th>
                <th className="p-3.5 pr-5 text-right">AKSI TAGIHAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredList.map((inv) => {
                const cust = getCustomer(inv.customerId);
                const booking = getBooking(inv.bookingId);

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-mono font-bold text-blue-900 text-sm">{inv.nomorInvoice}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {booking ? `Ref B/L: ${booking.nomorBL}` : '-'}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{cust?.namaPerusahaan || 'Customer'}</div>
                      <div className="text-[11px] text-slate-500">PIC: {cust?.picName} ({cust?.telepon})</div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">
                      <div>Tgl: {new Date(inv.tanggalInvoice).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      <div className="text-[11px] text-amber-700">
                        Due: {new Date(inv.jatuhTempo).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="p-3.5 text-right font-mono">
                      <div className="font-bold text-slate-900 text-sm">
                        Rp {inv.totalTagihan.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Termasuk PPN: Rp {inv.ppn.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="p-3.5">
                      {getStatusBadge(inv.statusBayar)}
                      {inv.statusBayar === 'paid' && inv.tanggalBayar && (
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Tgl: {inv.tanggalBayar}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inv.statusBayar !== 'paid' && (
                          <button
                            id={`pay-invoice-${inv.id}`}
                            onClick={() => handleQuickMarkPaid(inv)}
                            className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
                            title="Tandai Lunas"
                          >
                            ✓ Lunas
                          </button>
                        )}
                        <button
                          id={`print-invoice-${inv.id}`}
                          onClick={() => setPrintTargetInvoice(inv)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                          title="Cetak Invoice Tagihan"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Cetak</span>
                        </button>
                        <button
                          id={`edit-invoice-${inv.id}`}
                          onClick={() => openEditModal(inv)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                          title="Edit Invoice"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id={`delete-invoice-${inv.id}`}
                          onClick={() => setDeleteTargetId(inv.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus Invoice"
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

      {/* Modal Add/Edit Invoice */}
      {isModalOpen && (
        <div id="modal-invoice-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold">
                  {editingInvoice ? 'Edit Tagihan Freight Invoice' : 'Buat Invoice Tagihan Uang Tambang Baru'}
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
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Invoice</label>
                  <input
                    id="input-nomor-invoice"
                    type="text"
                    required
                    value={formNomorInv}
                    onChange={(e) => setFormNomorInv(e.target.value)}
                    placeholder="INV-2026-FRT-0081"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Referensi Dokumen B/L</label>
                  <select
                    id="select-booking-invoice"
                    value={formBookingId}
                    onChange={(e) => {
                      setFormBookingId(e.target.value);
                      const b = bookings.find(item => item.id === e.target.value);
                      if (b) {
                        setFormCustomerId(b.shipperId);
                        setFormFreightAmount(b.tarifFreight * b.jumlahSatuan);
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    {bookings.map(b => (
                      <option key={b.id} value={b.id}>{b.nomorBL} - {b.deskripsiBarang.slice(0, 20)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Customer / Perusahaan Penerima Tagihan</label>
                <select
                  id="select-customer-invoice"
                  value={formCustomerId}
                  onChange={(e) => setFormCustomerId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                >
                  {pelangganList.map(p => (
                    <option key={p.id} value={p.id}>{p.namaPerusahaan} ({p.kodeCustomer})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Terbit Invoice</label>
                  <input
                    id="input-tanggal-invoice"
                    type="date"
                    required
                    value={formTanggal}
                    onChange={(e) => setFormTanggal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Jatuh Tempo</label>
                  <input
                    id="input-jatuh-tempo"
                    type="date"
                    required
                    value={formJatuhTempo}
                    onChange={(e) => setFormJatuhTempo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ocean Freight Pokok (IDR)</label>
                  <input
                    id="input-freight-amount"
                    type="number"
                    value={formFreightAmount}
                    onChange={(e) => setFormFreightAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">THC Pelabuhan (IDR)</label>
                  <input
                    id="input-thc-amount"
                    type="number"
                    value={formThcAmount}
                    onChange={(e) => setFormThcAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bunker Surcharge BAF (IDR)</label>
                  <input
                    id="input-baf-amount"
                    type="number"
                    value={formBafAmount}
                    onChange={(e) => setFormBafAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Biaya Dokumen B/L (IDR)</label>
                  <input
                    id="input-doc-amount"
                    type="number"
                    value={formDocAmount}
                    onChange={(e) => setFormDocAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Pembayaran</label>
                  <select
                    id="select-status-invoice"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="unpaid">Belum Dibayar (Unpaid)</option>
                    <option value="paid">Lunas (Paid)</option>
                    <option value="overdue">Jatuh Tempo (Overdue)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Metode Pembayaran</label>
                  <input
                    id="input-metode-bayar"
                    type="text"
                    value={formPaymentMethod}
                    onChange={(e) => setFormPaymentMethod(e.target.value)}
                    placeholder="e.g. Bank Transfer Mandiri Rek. Giro"
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
                  id="btn-save-invoice-submit"
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Simpan & Terbitkan Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Print Invoice Modal */}
      {printTargetInvoice && (
        <PrintInvoiceModal
          isOpen={true}
          onClose={() => setPrintTargetInvoice(null)}
          invoice={printTargetInvoice}
          shipper={getCustomer(printTargetInvoice.customerId || printTargetInvoice.shipperId || '') || undefined}
          booking={getBooking(printTargetInvoice.bookingId || printTargetInvoice.bookingBlId || '') || undefined}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Hapus Invoice Tagihan"
        message="Apakah Anda yakin ingin menghapus data invoice ini?"
        confirmLabel="Hapus Invoice"
        onConfirm={() => {
          if (deleteTargetId) {
            onDeleteInvoice(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
