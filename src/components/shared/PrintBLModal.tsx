import React from 'react';
import { Printer, X, Anchor, ShieldCheck, QrCode } from 'lucide-react';
import { BookingBL, Kapal, Pelabuhan, Pelanggan, JadwalVoyage } from '../../types';

interface PrintBLModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingBL | null;
  voyage?: JadwalVoyage;
  kapal?: Kapal;
  pelabuhanMuat?: Pelabuhan;
  pelabuhanBongkar?: Pelabuhan;
  shipper?: Pelanggan;
  consignee?: Pelanggan;
}

export const PrintBLModal: React.FC<PrintBLModalProps> = ({
  isOpen,
  onClose,
  booking,
  voyage,
  kapal,
  pelabuhanMuat,
  pelabuhanBongkar,
  shipper,
  consignee
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="print-bl-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden my-6 border border-slate-300">
        {/* Modal Action Bar (Hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-3">
            <Anchor className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold">Preview & Cetak Bill of Lading (Konosemen Resmi)</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="print-bl-action-btn"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Dokumen B/L
            </button>
            <button
              id="close-print-bl-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div id="printable-bill-of-lading" className="p-8 bg-white text-slate-900 font-sans text-xs print:p-0">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-blue-900 mb-1">
                  <Anchor className="w-6 h-6 text-blue-800" />
                  <span className="text-xl font-black tracking-wider uppercase">PT SAMUDERA MARITIM LOGISTIK</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  Layanan Angkutan Laut Nasional & Internasional (Shipping Lines & Freight Forwarding)
                </p>
                <p className="text-[10px] text-slate-500">
                  Gedung Maritim Tower Lt. 12, Jl. RE Martadinata No. 88, Tanjung Priok, Jakarta 14310 | Tel: (021) 43908888
                </p>
              </div>
              <div className="text-right border-2 border-slate-900 p-2 rounded bg-slate-50">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">ORIGINAL BILL OF LADING</span>
                <span className="text-sm font-extrabold text-blue-900 font-mono">{booking.nomorBL}</span>
              </div>
            </div>
          </div>

          {/* Grid Shipper & Consignee */}
          <div className="grid grid-cols-2 border border-slate-900 mb-3">
            <div className="p-2.5 border-r border-b border-slate-900">
              <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">1. SHIPPER / PENGIRIM (Name & Address):</span>
              <p className="font-bold text-[11px] text-slate-900">{shipper?.namaPerusahaan || 'PT Indofood Sukses Makmur Tbk'}</p>
              <p className="text-[10px] text-slate-600">{shipper?.alamat || 'Jakarta Selatan'}</p>
              <p className="text-[10px] text-slate-600">PIC: {shipper?.picName} | Tel: {shipper?.telepon}</p>
              <p className="text-[9px] text-slate-500">NPWP: {shipper?.npwp || '-'}</p>
            </div>
            <div className="p-2.5 border-b border-slate-900">
              <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">2. BOOKING REF & VOYAGE NO:</span>
              <p className="font-bold text-slate-800">Voyage: <span className="font-mono text-blue-900">{voyage?.nomorVoyage || '-'}</span></p>
              <p className="text-slate-600">Tanggal Booking: {booking.tanggalBooking}</p>
              <p className="text-slate-600">Status Muatan: <span className="uppercase font-semibold text-emerald-700">{booking.status.replace('_', ' ')}</span></p>
            </div>

            <div className="p-2.5 border-r border-slate-900">
              <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">3. CONSIGNEE / PENERIMA (To Order Of):</span>
              <p className="font-bold text-[11px] text-slate-900">{consignee?.namaPerusahaan || 'To Order of Consignee'}</p>
              <p className="text-[10px] text-slate-600">{consignee?.alamat || '-'}</p>
              <p className="text-[10px] text-slate-600">PIC: {consignee?.picName} | Tel: {consignee?.telepon}</p>
            </div>
            <div className="p-2.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">4. NOTIFY PARTY (Pihak yang diberitahu):</span>
              <p className="text-[11px] font-medium text-slate-800">{booking.notifyParty || 'Same as Consignee'}</p>
            </div>
          </div>

          {/* Grid Transport Details */}
          <div className="grid grid-cols-4 border border-slate-900 mb-3 bg-slate-50">
            <div className="p-2 border-r border-slate-900">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">VESSEL / KAPAL:</span>
              <span className="font-bold text-[11px] text-blue-950 block">{kapal?.namaKapal || 'KM Nusantara'}</span>
              <span className="text-[9px] text-slate-500 font-mono">{kapal?.imoNumber} | Call: {kapal?.callSign}</span>
            </div>
            <div className="p-2 border-r border-slate-900">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">PELABUHAN MUAT (POL):</span>
              <span className="font-bold text-[11px] text-slate-900 block">{pelabuhanMuat?.namaPelabuhan}</span>
              <span className="text-[9px] text-slate-500 font-mono">[{pelabuhanMuat?.kodePelabuhan}] - {pelabuhanMuat?.kota}</span>
            </div>
            <div className="p-2 border-r border-slate-900">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">PELABUHAN BONGKAR (POD):</span>
              <span className="font-bold text-[11px] text-slate-900 block">{pelabuhanBongkar?.namaPelabuhan}</span>
              <span className="text-[9px] text-slate-500 font-mono">[{pelabuhanBongkar?.kodePelabuhan}] - {pelabuhanBongkar?.kota}</span>
            </div>
            <div className="p-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">TEMPAT PENYERAHAN:</span>
              <span className="font-bold text-[11px] text-slate-900 block">CY / CY (Container Yard)</span>
              <span className="text-[9px] text-slate-500">Freight Prepaid</span>
            </div>
          </div>

          {/* Cargo Particulars Table */}
          <table className="w-full border border-slate-900 mb-3 text-left border-collapse">
            <thead>
              <tr className="bg-slate-200 border-b border-slate-900 font-bold text-[10px]">
                <th className="p-2 border-r border-slate-900 w-1/4">CONTAINER NO / SEAL NO</th>
                <th className="p-2 border-r border-slate-900 w-1/12 text-center">JUMLAH</th>
                <th className="p-2 border-r border-slate-900 w-1/3">DESKRIPSI LENGKAP MUATAN / GOODS</th>
                <th className="p-2 border-r border-slate-900 w-1/6 text-right">BERAT KOTOR (KG)</th>
                <th className="p-2 text-right w-1/6">VOLUME (CBM)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-300">
                <td className="p-2.5 border-r border-slate-900 align-top font-mono font-bold text-slate-900">
                  {booking.nomorKontainer || 'LCL / BREAK BULK'}
                  <div className="text-[9px] font-normal text-slate-600">Seal No: {booking.nomorSegel || '-'}</div>
                  <div className="text-[9px] font-normal text-blue-700 mt-1">Jenis: {booking.jenisKargo}</div>
                  {booking.reeferTempCelsius !== undefined && (
                    <div className="text-[9px] font-bold text-cyan-700 bg-cyan-50 px-1 py-0.5 rounded mt-1 inline-block">
                      Reefer Temp: {booking.reeferTempCelsius}°C
                    </div>
                  )}
                </td>
                <td className="p-2.5 border-r border-slate-900 align-top text-center font-bold">
                  {booking.jumlahSatuan} {booking.satuanKargo}
                </td>
                <td className="p-2.5 border-r border-slate-900 align-top">
                  <p className="font-semibold text-slate-900">{booking.deskripsiBarang}</p>
                  <p className="text-[10px] text-slate-500 mt-1 italic">
                    "Said to Contain: {booking.deskripsiBarang}. Shipped on board in apparent good order and condition."
                  </p>
                  {booking.catatanKhusus && (
                    <p className="text-[9px] text-amber-800 mt-1 bg-amber-50 p-1 rounded">
                      Instruksi Khusus: {booking.catatanKhusus}
                    </p>
                  )}
                  {booking.isDangerousGoods && (
                    <p className="text-[9px] font-bold text-red-700 mt-1">
                      ⚠️ MUATAN BERBAHAYA (DG - IMO CLASS REGULATED)
                    </p>
                  )}
                </td>
                <td className="p-2.5 border-r border-slate-900 align-top text-right font-mono font-bold">
                  {booking.beratKotorKg.toLocaleString('id-ID')} KG
                </td>
                <td className="p-2.5 align-top text-right font-mono font-bold">
                  {booking.volumeCbm.toLocaleString('id-ID')} CBM
                </td>
              </tr>
            </tbody>
          </table>

          {/* Freight Calculation Summary */}
          <div className="grid grid-cols-2 border border-slate-900 mb-4">
            <div className="p-3 border-r border-slate-900 text-[10px] text-slate-600 leading-tight">
              <span className="font-bold block text-slate-800 mb-1">KETENTUAN KONOSEMEN & ASURANSI:</span>
              <p>
                Diterbitkan sesuai ketentuan Kitab Undang-Undang Hukum Dagang (KUHD) Indonesia dan Konvensi Maritim Internasional (Hague-Visby Rules). Pengangkut tidak bertanggung jawab atas kerusakan akibat force majeure, badai laut lepas, atau kelalaian pengepakan shipper.
              </p>
            </div>
            <div className="p-3 bg-slate-50 text-right">
              <div className="flex justify-between text-[11px] mb-1">
                <span>Ocean Freight Charges:</span>
                <span className="font-mono font-medium">Rp {booking.biayaFreight.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Terminal Handling Charge (THC):</span>
                <span className="font-mono font-medium">Rp {booking.biayaThc.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[11px] mb-1 text-slate-500">
                <span>Asuransi Maritim:</span>
                <span className="font-mono">Rp {booking.biayaAsuransi.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-blue-950 border-t border-slate-300 pt-1 mt-1">
                <span>TOTAL FREIGHT CHARGES:</span>
                <span className="font-mono text-sm">Rp {booking.totalBiaya.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="grid grid-cols-3 border border-slate-900 text-center text-[10px]">
            <div className="p-3 border-r border-slate-900 flex flex-col justify-between h-28">
              <span className="font-semibold text-slate-700">Tanda Tangan Shipper / Forwarder</span>
              <div className="text-slate-400 italic text-[9px]">(Nama Terang & Cap Perusahaan)</div>
              <div className="border-t border-dashed border-slate-400 pt-1 font-bold text-slate-800">
                {shipper?.picName || 'Shipper Authorized'}
              </div>
            </div>
            <div className="p-3 border-r border-slate-900 flex flex-col justify-between h-28">
              <span className="font-semibold text-slate-700">Nahkoda Kapal (Master / Carrier)</span>
              <div className="flex items-center justify-center gap-1 text-blue-800 font-semibold text-[9px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                VERIFIED ON BOARD
              </div>
              <div className="border-t border-dashed border-slate-400 pt-1 font-bold text-slate-800">
                {kapal?.nahkoda || 'Master of Vessel'}
              </div>
            </div>
            <div className="p-3 flex flex-col justify-between h-28 bg-slate-50">
              <span className="font-semibold text-slate-700">Petugas Syahbandar / Agen Resmi</span>
              <div className="flex items-center justify-center text-slate-400">
                <QrCode className="w-10 h-10 opacity-70" />
              </div>
              <div className="border-t border-dashed border-slate-400 pt-1 font-bold text-slate-800">
                PT Samudera Maritim Logistik
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[9px] text-slate-400 mt-3">
            Dokumen ini dicetak secara sah dari Sistem Informasi Operasional Angkutan Laut MARITIMEX ERP | Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
};
