import React from 'react';
import { Printer, X, FileText, CheckCircle2, Building2 } from 'lucide-react';
import { InvoiceFreight, BookingBL, Pelanggan } from '../../types';

interface PrintInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceFreight | null;
  booking?: BookingBL;
  shipper?: Pelanggan;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  booking,
  shipper
}) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="print-invoice-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden my-6 border border-slate-300">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold">Faktur Tagihan Uang Tambang (Freight Commercial Invoice)</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="print-invoice-action-btn"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Invoice
            </button>
            <button
              id="close-print-invoice-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div id="printable-freight-invoice" className="p-8 bg-white text-slate-900 font-sans text-xs print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-blue-900 mb-1">
                <Building2 className="w-7 h-7 text-blue-800" />
                <div>
                  <h1 className="text-xl font-black tracking-wide text-slate-900">PT SAMUDERA MARITIM LOGISTIK</h1>
                  <p className="text-[10px] text-slate-500 font-medium">SHIPPING LINES, LOGISTICS & CARGO FREIGHT OPERATOR</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-600 mt-2">
                NPWP: 01.442.890.1-015.000 | SK Kemenhub: SIUPAL/VIII/2020/099
              </p>
              <p className="text-[10px] text-slate-500">
                Gedung Maritim Tower Lt. 12, Tanjung Priok, Jakarta Utara | Email: billing@maritimlogistik.id
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900 tracking-wider block">INVOICE</span>
              <span className="text-xs font-mono font-bold text-blue-800 block mt-1">{invoice.nomorInvoice}</span>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border">
                Status: {invoice.statusBayar === 'paid' ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> LUNAS (PAID)</span>
                ) : invoice.statusBayar === 'overdue' ? (
                  <span className="text-red-600 font-bold">JATUH TEMPO (OVERDUE)</span>
                ) : (
                  <span className="text-amber-700 font-bold">BELUM LUNAS (UNPAID)</span>
                )}
              </div>
            </div>
          </div>

          {/* Client & Dates Info */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">DITUJUKAN KEPADA (BILL TO):</span>
              <p className="text-sm font-bold text-slate-900">{shipper?.namaPerusahaan || 'Customer Name'}</p>
              <p className="text-slate-600 mt-1">{shipper?.alamat || '-'}</p>
              <p className="text-slate-600">Kota: {shipper?.kota || '-'} | NPWP: {shipper?.npwp || '-'}</p>
              <p className="text-slate-600">Attn: {shipper?.picName || 'Finance Dept'} ({shipper?.telepon || '-'})</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <span className="text-slate-500">Tanggal Invoice:</span>
                <span className="font-semibold text-right">{invoice.tanggalInvoice}</span>

                <span className="text-slate-500">Jatuh Tempo (Due Date):</span>
                <span className="font-bold text-red-600 text-right">{invoice.jatuhTempo}</span>

                <span className="text-slate-500">Nomor B/L Referensi:</span>
                <span className="font-mono font-bold text-blue-900 text-right">{booking?.nomorBL || '-'}</span>

                <span className="text-slate-500">Nomor Kontainer:</span>
                <span className="font-mono font-semibold text-right">{booking?.nomorKontainer || 'General Cargo'}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px]">
                <th className="p-3 text-left w-12 rounded-tl-lg">NO</th>
                <th className="p-3 text-left">DESKRIPSI BIAYA JASA ANGKUTAN LAUT</th>
                <th className="p-3 text-center w-24">QTY</th>
                <th className="p-3 text-right w-36">TARIF (IDR)</th>
                <th className="p-3 text-right w-40 rounded-tr-lg">JUMLAH (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 border-x border-b border-slate-200 text-[11px]">
              <tr>
                <td className="p-3 text-center text-slate-500">1</td>
                <td className="p-3 font-semibold text-slate-800">
                  Ocean Freight (Uang Tambang Laut)
                  <p className="text-[10px] font-normal text-slate-500 mt-0.5">
                    Muatan: {booking?.deskripsiBarang || 'Petikemas / Kargo'}
                  </p>
                </td>
                <td className="p-3 text-center font-medium">{booking?.jumlahSatuan || 1} {booking?.satuanKargo || 'TEU'}</td>
                <td className="p-3 text-right font-mono">Rp {(invoice.subtotal / (booking?.jumlahSatuan || 1)).toLocaleString('id-ID')}</td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">Rp {invoice.subtotal.toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td className="p-3 text-center text-slate-500">2</td>
                <td className="p-3 font-semibold text-slate-800">
                  Terminal Handling Charge (THC Pelabuhan)
                  <p className="text-[10px] font-normal text-slate-500 mt-0.5">Biaya bongkar/muat dermaga container crane</p>
                </td>
                <td className="p-3 text-center font-medium">1 Lot</td>
                <td className="p-3 text-right font-mono">Rp {(invoice.thcTotal || 950000).toLocaleString('id-ID')}</td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">Rp {(invoice.thcTotal || 950000).toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td className="p-3 text-center text-slate-500">3</td>
                <td className="p-3 font-semibold text-slate-800">
                  Bunker Adjustment Factor (BAF / Surcharge BBM)
                  <p className="text-[10px] font-normal text-slate-500 mt-0.5">Kompensasi fluktuasi bahan bakar kapal</p>
                </td>
                <td className="p-3 text-center font-medium">1 Lot</td>
                <td className="p-3 text-right font-mono">Rp {(invoice.bunkerAdjustment || 450000).toLocaleString('id-ID')}</td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">Rp {(invoice.bunkerAdjustment || 450000).toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td className="p-3 text-center text-slate-500">4</td>
                <td className="p-3 font-semibold text-slate-800">
                  Dokumentasi B/L & Administrasi Pelayaran
                  <p className="text-[10px] font-normal text-slate-500 mt-0.5">Penerbitan surat jalan & e-Manifest Bea Cukai</p>
                </td>
                <td className="p-3 text-center font-medium">1 Dok</td>
                <td className="p-3 text-right font-mono">Rp {(invoice.docFee || 150000).toLocaleString('id-ID')}</td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">Rp {(invoice.docFee || 150000).toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>

          {/* Subtotals & Payment Details */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="p-4 bg-blue-50/60 rounded-lg border border-blue-200">
              <span className="text-[10px] font-bold text-blue-900 uppercase block mb-1">INSTRUKSI PEMBAYARAN:</span>
              <p className="text-slate-700 text-[11px] mb-2">
                Harap melakukan transfer penuh ke rekening resmi perusahaan kami berikut:
              </p>
              <div className="bg-white p-3 rounded border border-blue-200 text-xs font-mono">
                <span className="font-bold text-blue-950 block">{invoice.rekeningBankTujuan || 'Bank Mandiri Cabang Tanjung Priok: 120-00-99887711 (a/n PT Samudera Maritim)'}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Berita Transfer: {invoice.nomorInvoice}</span>
              </div>
              {(invoice.catatanPayment || invoice.catatan) && (
                <p className="text-[10px] text-slate-600 mt-2 italic">
                  Catatan: {invoice.catatanPayment || invoice.catatan}
                </p>
              )}
            </div>

            <div className="space-y-1.5 text-xs text-right">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Subtotal Freight & Services:</span>
                <span className="font-mono font-semibold">Rp {invoice.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">PPN ({invoice.ppnPersen || 11}%):</span>
                <span className="font-mono font-semibold">Rp {(invoice.ppnNominal || invoice.ppn || Math.round(invoice.subtotal * 0.11)).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black text-blue-950">
                <span>TOTAL HARUS DIBAYAR:</span>
                <span className="font-mono text-base text-blue-900">Rp {invoice.totalTagihan.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-center text-[11px]">
            <div className="p-2">
              <p className="text-slate-500">Penerima Tagihan,</p>
              <div className="h-16"></div>
              <p className="font-bold text-slate-900 border-t border-slate-300 inline-block px-8 pt-1">
                {shipper?.namaPerusahaan || 'Customer Finance'}
              </p>
            </div>
            <div className="p-2">
              <p className="text-slate-500">Finance & Billing Department,</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-900 uppercase border-2 border-blue-900 px-3 py-1 rounded rotate-[-5deg] opacity-75">
                  AUTHORIZED FINANCIAL STAMP
                </span>
              </div>
              <p className="font-bold text-slate-900 border-t border-slate-300 inline-block px-8 pt-1">
                PT Samudera Maritim Logistik
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
