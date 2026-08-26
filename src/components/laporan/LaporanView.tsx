import React, { useState } from 'react';
import { 
  BarChart3, Download, Printer, Filter, Calendar, 
  FileSpreadsheet, Ship, Anchor, Users, Receipt, FileText, CheckCircle2
} from 'lucide-react';
import { 
  Kapal, Pelabuhan, Pelanggan, JadwalVoyage, 
  BookingBL, InvoiceFreight 
} from '../../types';

interface LaporanViewProps {
  kapalList: Kapal[];
  pelabuhanList: Pelabuhan[];
  pelangganList: Pelanggan[];
  voyages: JadwalVoyage[];
  bookings: BookingBL[];
  invoices: InvoiceFreight[];
}

type ReportType = 'voyage_perf' | 'financial_freight' | 'customs_manifest' | 'customer_summary';

export const LaporanView: React.FC<LaporanViewProps> = ({
  kapalList,
  pelabuhanList,
  pelangganList,
  voyages,
  bookings,
  invoices
}) => {
  const [selectedReport, setSelectedReport] = useState<ReportType>('voyage_perf');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');

  const getKapal = (id: string) => kapalList.find(k => k.id === id);
  const getPort = (id: string) => pelabuhanList.find(p => p.id === id);
  const getShipper = (id: string) => pelangganList.find(p => p.id === id);
  const getConsignee = (id: string) => pelangganList.find(p => p.id === id);

  // Financial summary
  const totalOmset = invoices.reduce((s, i) => s + i.totalTagihan, 0);
  const totalLunas = invoices.filter(i => i.statusBayar === 'paid').reduce((s, i) => s + i.totalTagihan, 0);
  const totalPiutang = invoices.filter(i => i.statusBayar !== 'paid').reduce((s, i) => s + i.totalTagihan, 0);

  // Export to CSV generator
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let filename = `laporan-maritim-${selectedReport}-${new Date().toISOString().slice(0, 10)}.csv`;

    if (selectedReport === 'voyage_perf') {
      csvContent += "Nomor Voyage,Nama Kapal,Tipe Kapal,Pelabuhan Asal,Pelabuhan Tujuan,ETD,ETA,Muatan TEU,Tonase DWT,Status\n";
      voyages.forEach(v => {
        const k = getKapal(v.kapalId);
        const pol = getPort(v.pelabuhanAsalId)?.namaPelabuhan || '';
        const pod = getPort(v.pelabuhanTujuanId)?.namaPelabuhan || '';
        csvContent += `"${v.nomorVoyage}","${k?.namaKapal || ''}","${k?.tipe || ''}","${pol}","${pod}","${v.etd}","${v.eta}",${v.totalMuatanTeu || 0},${v.totalMuatanDwt || 0},"${v.status}"\n`;
      });
    } else if (selectedReport === 'financial_freight') {
      csvContent += "Nomor Invoice,Pelanggan,Tanggal,Jatuh Tempo,Subtotal,PPN 11%,Total Tagihan,Status Bayar,Tanggal Bayar\n";
      invoices.forEach(inv => {
        const cust = getShipper(inv.customerId)?.namaPerusahaan || '';
        csvContent += `"${inv.nomorInvoice}","${cust}","${inv.tanggalInvoice}","${inv.jatuhTempo}",${inv.subtotal},${inv.ppn},${inv.totalTagihan},"${inv.statusBayar}","${inv.tanggalBayar || ''}"\n`;
      });
    } else if (selectedReport === 'customs_manifest') {
      csvContent += "Nomor B/L,Kontainer,Seal,Shipper,Consignee,Deskripsi Barang,Jumlah Satuan,Berat (Kg),Volume (CBM),Total Biaya,Status\n";
      bookings.forEach(b => {
        const sh = getShipper(b.shipperId)?.namaPerusahaan || '';
        const cn = getConsignee(b.consigneeId)?.namaPerusahaan || '';
        csvContent += `"${b.nomorBL}","${b.nomorKontainer || ''}","${b.nomorSeal || ''}","${sh}","${cn}","${b.deskripsiBarang}",${b.jumlahSatuan} ${b.satuanKargo},${b.beratKotorKg},${b.volumeCbm},${b.totalBiaya},"${b.status}"\n`;
      });
    } else {
      csvContent += "Kode Customer,Nama Perusahaan,Tipe,PIC,Telepon,Kota,NPWP,Credit Limit,Credit Term (Hari),Status\n";
      pelangganList.forEach(p => {
        csvContent += `"${p.kodeCustomer}","${p.namaPerusahaan}","${p.tipe}","${p.picName}","${p.telepon}","${p.kota}","${p.npwp || ''}",${p.creditLimit},${p.creditTermDays},"${p.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="laporan-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900">Pusat Laporan Eksekutif & Manifes Bea Cukai</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan kinerja operasional armada, finansial freight, manifes muatan kapal (Syahbandar KSOP & Bea Cukai), dan rekapitulasi pelanggan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-export-csv"
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor CSV (Excel)</span>
          </button>
          <button
            id="btn-print-laporan"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Resmi</span>
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 print:hidden">
        <button
          id="rep-tab-voyage"
          type="button"
          onClick={() => setSelectedReport('voyage_perf')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedReport === 'voyage_perf'
              ? 'bg-blue-900 text-white border-blue-800 shadow-md ring-2 ring-blue-500'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <Ship className={`w-5 h-5 mb-2 ${selectedReport === 'voyage_perf' ? 'text-cyan-300' : 'text-blue-600'}`} />
          <h2 className="text-xs font-bold">Laporan Kinerja Voyage</h2>
          <p className={`text-[10px] mt-0.5 ${selectedReport === 'voyage_perf' ? 'text-slate-300' : 'text-slate-500'}`}>
            Jadwal, rute, muatan TEU & DWT
          </p>
        </button>

        <button
          id="rep-tab-financial"
          type="button"
          onClick={() => setSelectedReport('financial_freight')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedReport === 'financial_freight'
              ? 'bg-blue-900 text-white border-blue-800 shadow-md ring-2 ring-blue-500'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <Receipt className={`w-5 h-5 mb-2 ${selectedReport === 'financial_freight' ? 'text-cyan-300' : 'text-emerald-600'}`} />
          <h2 className="text-xs font-bold">Laporan Finansial & Freight</h2>
          <p className={`text-[10px] mt-0.5 ${selectedReport === 'financial_freight' ? 'text-slate-300' : 'text-slate-500'}`}>
            Pendapatan, PPN & piutang freight
          </p>
        </button>

        <button
          id="rep-tab-manifest"
          type="button"
          onClick={() => setSelectedReport('customs_manifest')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedReport === 'customs_manifest'
              ? 'bg-blue-900 text-white border-blue-800 shadow-md ring-2 ring-blue-500'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <FileText className={`w-5 h-5 mb-2 ${selectedReport === 'customs_manifest' ? 'text-cyan-300' : 'text-amber-600'}`} />
          <h2 className="text-xs font-bold">Manifes Kargo Bea Cukai / KSOP</h2>
          <p className={`text-[10px] mt-0.5 ${selectedReport === 'customs_manifest' ? 'text-slate-300' : 'text-slate-500'}`}>
            Daftar muatan kontainer & segel
          </p>
        </button>

        <button
          id="rep-tab-customer"
          type="button"
          onClick={() => setSelectedReport('customer_summary')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedReport === 'customer_summary'
              ? 'bg-blue-900 text-white border-blue-800 shadow-md ring-2 ring-blue-500'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <Users className={`w-5 h-5 mb-2 ${selectedReport === 'customer_summary' ? 'text-cyan-300' : 'text-purple-600'}`} />
          <h2 className="text-xs font-bold">Rekapitulasi Shipper / Customer</h2>
          <p className={`text-[10px] mt-0.5 ${selectedReport === 'customer_summary' ? 'text-slate-300' : 'text-slate-500'}`}>
            Daftar pengirim & pagu kredit
          </p>
        </button>
      </div>

      {/* Main Report Paper / Document Layout */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        {/* Printable Official Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-950 text-cyan-400">
              <Ship className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-wide">
                PT MARITIM NUSANTARA EXPRESS (PERSERO)
              </h2>
              <p className="text-xs text-slate-600">
                Divisi Manajemen Angkutan Laut, Trayek Nusantara & Pelayanan Kargo Petikemas
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="font-bold text-slate-900 block">DOKUMEN RESMI MARITIM</span>
            <span className="font-mono text-slate-500 text-[11px]">
              Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Report Content 1: Voyage Performance */}
        {selectedReport === 'voyage_perf' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">
                LAPORAN KINERJA & UTILISASI JADWAL PELAYARAN (VOYAGE PERFORMANCE REPORT)
              </h3>
              <span className="text-xs text-slate-500 font-mono">Total {voyages.length} Voyage</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="p-2.5 border-r border-slate-200">NO. VOYAGE</th>
                    <th className="p-2.5 border-r border-slate-200">NAMA KAPAL</th>
                    <th className="p-2.5 border-r border-slate-200">RUTE TRAYEK</th>
                    <th className="p-2.5 border-r border-slate-200">ETD / ETA</th>
                    <th className="p-2.5 border-r border-slate-200 text-right">MUATAN TEU</th>
                    <th className="p-2.5 border-r border-slate-200 text-right">TONASE DWT</th>
                    <th className="p-2.5 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {voyages.map(v => {
                    const k = getKapal(v.kapalId);
                    const pol = getPort(v.pelabuhanAsalId)?.namaPelabuhan.replace('Pelabuhan ', '') || '';
                    const pod = getPort(v.pelabuhanTujuanId)?.namaPelabuhan.replace('Pelabuhan ', '') || '';
                    return (
                      <tr key={v.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-blue-900 border-r border-slate-200">{v.nomorVoyage}</td>
                        <td className="p-2.5 font-semibold text-slate-800 border-r border-slate-200">{k?.namaKapal}</td>
                        <td className="p-2.5 border-r border-slate-200">{pol} ➔ {pod}</td>
                        <td className="p-2.5 font-mono text-[11px] border-r border-slate-200">{v.etd.slice(0, 10)} / {v.eta.slice(0, 10)}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900 border-r border-slate-200">{v.totalMuatanTeu} TEU</td>
                        <td className="p-2.5 text-right font-mono border-r border-slate-200">{v.totalMuatanDwt?.toLocaleString('id-ID')} Ton</td>
                        <td className="p-2.5 text-center font-bold text-[10px] uppercase text-blue-800">{v.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Report Content 2: Financial Freight */}
        {selectedReport === 'financial_freight' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">
                LAPORAN KEUANGAN FREIGHT, PAJAK PPN & PIUTANG UANG TAMBANG
              </h3>
              <div className="flex items-center gap-3 text-xs font-mono font-bold">
                <span className="text-emerald-700">Lunas: Rp {(totalLunas / 1000000).toLocaleString('id-ID')} Jt</span>
                <span className="text-slate-400">|</span>
                <span className="text-amber-700">Piutang: Rp {(totalPiutang / 1000000).toLocaleString('id-ID')} Jt</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="p-2.5 border-r border-slate-200">NO. INVOICE</th>
                    <th className="p-2.5 border-r border-slate-200">CUSTOMER</th>
                    <th className="p-2.5 border-r border-slate-200">TANGGAL</th>
                    <th className="p-2.5 border-r border-slate-200 text-right">SUBTOTAL</th>
                    <th className="p-2.5 border-r border-slate-200 text-right">PPN 11%</th>
                    <th className="p-2.5 border-r border-slate-200 text-right">TOTAL TAGIHAN</th>
                    <th className="p-2.5 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoices.map(inv => {
                    const cust = getShipper(inv.customerId)?.namaPerusahaan || '';
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-blue-900 border-r border-slate-200">{inv.nomorInvoice}</td>
                        <td className="p-2.5 font-semibold text-slate-800 border-r border-slate-200">{cust}</td>
                        <td className="p-2.5 font-mono text-[11px] border-r border-slate-200">{inv.tanggalInvoice}</td>
                        <td className="p-2.5 text-right font-mono border-r border-slate-200">Rp {inv.subtotal.toLocaleString('id-ID')}</td>
                        <td className="p-2.5 text-right font-mono border-r border-slate-200">Rp {inv.ppn.toLocaleString('id-ID')}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900 border-r border-slate-200">Rp {inv.totalTagihan.toLocaleString('id-ID')}</td>
                        <td className="p-2.5 text-center font-bold text-[10px] uppercase">
                          <span className={`px-2 py-0.5 rounded ${inv.statusBayar === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {inv.statusBayar}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Report Content 3: Customs Manifest */}
        {selectedReport === 'customs_manifest' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">
                MANIFES MUATAN KAPAL LAUT (INWARD / OUTWARD CARGO MANIFEST)
              </h3>
              <span className="text-xs text-slate-500 font-mono">Format Standar Syahbandar KSOP & Ditjen Bea Cukai</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="p-2.5 border-r border-slate-200">NOMOR B/L</th>
                    <th className="p-2.5 border-r border-slate-200">NO. KONTAINER & SEAL</th>
                    <th className="p-2.5 border-r border-slate-200">PENGIRIM (SHIPPER)</th>
                    <th className="p-2.5 border-r border-slate-200">PENERIMA (CONSIGNEE)</th>
                    <th className="p-2.5 border-r border-slate-200">DESKRIPSI KARGO</th>
                    <th className="p-2.5 border-r border-slate-200 text-right">BERAT (KG)</th>
                    <th className="p-2.5 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {bookings.map(b => {
                    const sh = getShipper(b.shipperId)?.namaPerusahaan || '';
                    const cn = getConsignee(b.consigneeId)?.namaPerusahaan || '';
                    return (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-blue-900 border-r border-slate-200">{b.nomorBL}</td>
                        <td className="p-2.5 font-mono text-[11px] border-r border-slate-200">
                          <div>{b.nomorKontainer || 'Break Bulk'}</div>
                          <div className="text-[10px] text-slate-400">Seal: {b.nomorSeal || '-'}</div>
                        </td>
                        <td className="p-2.5 font-semibold text-slate-800 border-r border-slate-200 truncate max-w-[150px]">{sh}</td>
                        <td className="p-2.5 font-semibold text-slate-800 border-r border-slate-200 truncate max-w-[150px]">{cn}</td>
                        <td className="p-2.5 border-r border-slate-200 truncate max-w-[180px]">{b.deskripsiBarang}</td>
                        <td className="p-2.5 text-right font-mono border-r border-slate-200">{b.beratKotorKg.toLocaleString('id-ID')}</td>
                        <td className="p-2.5 text-center font-bold text-[10px] uppercase text-cyan-800">{b.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Report Content 4: Customer Summary */}
        {selectedReport === 'customer_summary' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">
                REKAPITULASI MITRA SHIPPER, FORWARDER & KORPORAT
              </h3>
              <span className="text-xs text-slate-500 font-mono">{pelangganList.length} Entitas Terdaftar</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="p-2.5 border-r border-slate-200">KODE CUSTOMER</th>
                    <th className="p-2.5 border-r border-slate-200">NAMA PERUSAHAAN</th>
                    <th className="p-2.5 border-r border-slate-200">KATEGORI</th>
                    <th className="p-2.5 border-r border-slate-200">PIC & TELEPON</th>
                    <th className="p-2.5 border-r border-slate-200">KOTA</th>
                    <th className="p-2.5 border-r border-slate-200 text-right">CREDIT LIMIT</th>
                    <th className="p-2.5 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pelangganList.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-blue-900 border-r border-slate-200">{p.kodeCustomer}</td>
                      <td className="p-2.5 font-semibold text-slate-900 border-r border-slate-200">{p.namaPerusahaan}</td>
                      <td className="p-2.5 border-r border-slate-200 uppercase font-bold text-[10px] text-slate-600">{p.tipe}</td>
                      <td className="p-2.5 border-r border-slate-200">{p.picName} ({p.telepon})</td>
                      <td className="p-2.5 border-r border-slate-200">{p.kota}</td>
                      <td className="p-2.5 text-right font-mono border-r border-slate-200">Rp {(p.creditLimit / 1000000).toLocaleString('id-ID')} Jt</td>
                      <td className="p-2.5 text-center font-bold text-[10px] uppercase text-emerald-800">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Official Signatures footer */}
        <div className="grid grid-cols-3 gap-8 pt-8 text-center text-xs text-slate-700">
          <div>
            <p className="font-semibold text-slate-600 mb-14">Dibuat Oleh (Admin Operasional):</p>
            <p className="font-bold text-slate-900 underline">Bambang Wijaya, S.Log</p>
            <p className="text-[10px] text-slate-500">Staff Operasional Pelayaran</p>
          </div>
          <div>
            <p className="font-semibold text-slate-600 mb-14">Diperiksa Oleh (Finance/Billing):</p>
            <p className="font-bold text-slate-900 underline">Dewi Anggraini, S.E.</p>
            <p className="text-[10px] text-slate-500">Manajer Keuangan Freight</p>
          </div>
          <div>
            <p className="font-semibold text-slate-600 mb-14">Disetujui Oleh (Direksi Operasi):</p>
            <p className="font-bold text-slate-900 underline">Capt. Hendra Pratama, M.Mar</p>
            <p className="text-[10px] text-slate-500">Direktur Armada & Operasi Laut</p>
          </div>
        </div>
      </div>
    </div>
  );
};
