import React, { useState } from 'react';
import { 
  Radar, Search, Ship, MapPin, Package, CheckCircle2, 
  Clock, ArrowRight, Compass, ShieldCheck, Waves, Anchor
} from 'lucide-react';
import { BookingBL, JadwalVoyage, Kapal, Pelabuhan, Pelanggan } from '../../types';

interface TrackingViewProps {
  bookings: BookingBL[];
  voyages: JadwalVoyage[];
  kapalList: Kapal[];
  pelabuhanList: Pelabuhan[];
  pelangganList: Pelanggan[];
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  bookings,
  voyages,
  kapalList,
  pelabuhanList,
  pelangganList
}) => {
  const [searchQuery, setSearchQuery] = useState(bookings[0]?.nomorBL || '');
  const [selectedBooking, setSelectedBooking] = useState<BookingBL | null>(bookings[0] || null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const found = bookings.find(b => 
      b.nomorBL.toLowerCase().includes(query) ||
      (b.nomorKontainer && b.nomorKontainer.toLowerCase().includes(query)) ||
      (b.nomorSeal && b.nomorSeal.toLowerCase().includes(query))
    );

    if (found) {
      setSelectedBooking(found);
    } else {
      alert(`Nomor B/L atau Kontainer "${searchQuery}" tidak ditemukan dalam sistem database.`);
    }
  };

  const getVoyage = (id: string) => voyages.find(v => v.id === id);
  const getKapal = (id?: string) => id ? kapalList.find(k => k.id === id) : null;
  const getPort = (id: string) => pelabuhanList.find(p => p.id === id);
  const getShipper = (id: string) => pelangganList.find(p => p.id === id);
  const getConsignee = (id: string) => pelangganList.find(p => p.id === id);

  const currentVoyage = selectedBooking ? getVoyage(selectedBooking.voyageId) : null;
  const currentKapal = currentVoyage ? getKapal(currentVoyage.kapalId) : null;
  const pol = selectedBooking ? getPort(selectedBooking.pelabuhanMuatId) : null;
  const pod = selectedBooking ? getPort(selectedBooking.pelabuhanBongkarId) : null;
  const shipper = selectedBooking ? getShipper(selectedBooking.shipperId) : null;
  const consignee = selectedBooking ? getConsignee(selectedBooking.consigneeId) : null;

  // Milestone Stages
  const stages = [
    { key: 'booked', label: '1. Booking Diterima', desc: 'Surat muatan terbit', icon: Package },
    { key: 'loading', label: '2. Gate In & Muat', desc: 'Kontainer masuk dermaga', icon: Anchor },
    { key: 'on_board', label: '3. On Board Kapal', desc: 'Barang di atas kapal', icon: Ship },
    { key: 'in_transit', label: '4. Pelayaran Laut', desc: 'Berlayar di perairan nusantara', icon: Waves },
    { key: 'discharged', label: '5. Tiba & Bongkar', desc: 'Bongkar di pelabuhan tujuan', icon: MapPin },
    { key: 'delivered', label: '6. Selesai Terkirim', desc: 'Kargo diterima consignee', icon: CheckCircle2 }
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'booked': return 0;
      case 'loading': return 1;
      case 'on_board': return 2;
      case 'in_transit': return 3;
      case 'discharged': return 4;
      case 'delivered':
      case 'released': return 5;
      default: return 0;
    }
  };

  const currentStageIdx = selectedBooking ? getStageIndex(selectedBooking.status) : 0;

  return (
    <div id="tracking-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Radar className="w-4 h-4 animate-spin-slow" />
          <span>Real-Time Maritime Cargo & Fleet Tracking</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
          Pelacakan Kargo Kapal Laut & Posisi Radar Armada
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl">
          Lacak status pergerakan petikemas, posisi koordinat kapal, perkiraan sandar (ETA), dan riwayat milestone pengapalan.
        </p>

        {/* Search Bar Container */}
        <form onSubmit={handleSearch} className="mt-5 flex flex-col sm:flex-row gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="tracking-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Masukkan Nomor B/L (e.g. BL-2026-NTR-0012) atau Kontainer..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <button
            id="tracking-submit-btn"
            type="submit"
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <Radar className="w-4 h-4" />
            <span>Lacak Sekarang</span>
          </button>
        </form>

        {/* Quick Clickable Suggestions */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">Contoh B/L Cepat:</span>
          {bookings.slice(0, 4).map(b => (
            <button
              key={b.id}
              type="button"
              onClick={() => { setSearchQuery(b.nomorBL); setSelectedBooking(b); }}
              className="font-mono text-cyan-300 hover:underline bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 cursor-pointer"
            >
              {b.nomorBL}
            </button>
          ))}
        </div>
      </div>

      {selectedBooking ? (
        <div className="space-y-6">
          {/* Main Tracking Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-base font-black text-blue-900 font-mono">
                    {selectedBooking.nomorBL}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                    Status: {selectedBooking.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Kontainer: <strong className="font-mono text-slate-800">{selectedBooking.nomorKontainer || 'General Cargo'}</strong> | Segel: <strong className="font-mono text-slate-800">{selectedBooking.nomorSeal || '-'}</strong>
                </p>
              </div>

              <div className="text-left md:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">ESTIMASI TIBA (ETA)</span>
                <span className="text-sm font-black text-slate-900 font-mono">
                  {currentVoyage ? new Date(currentVoyage.eta).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </span>
              </div>
            </div>

            {/* Visual Milestone Timeline */}
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                Milestone Perjalanan Kargo:
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {stages.map((st, idx) => {
                  const Icon = st.icon;
                  const isDone = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;

                  return (
                    <div 
                      key={st.key}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? 'bg-blue-900 text-white border-blue-800 shadow-md ring-2 ring-blue-500'
                          : isDone
                            ? 'bg-blue-50 text-blue-950 border-blue-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-1.5 rounded-lg ${
                          isCurrent ? 'bg-white/20 text-white' : isDone ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isDone && <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-cyan-300' : 'text-blue-600'}`} />}
                      </div>

                      <div className={`text-xs font-bold ${isCurrent ? 'text-white' : isDone ? 'text-blue-950' : 'text-slate-500'}`}>
                        {st.label}
                      </div>
                      <p className={`text-[10px] mt-0.5 leading-tight ${isCurrent ? 'text-slate-200' : isDone ? 'text-slate-600' : 'text-slate-400'}`}>
                        {st.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipment Route Summary Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
              {/* Shipper & Consignee */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ENTITAS PENGIRIMAN
                </span>
                <div>
                  <span className="text-slate-500 text-[11px] block">Shipper (Pengirim):</span>
                  <span className="font-bold text-slate-900">{shipper?.namaPerusahaan}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Consignee (Penerima):</span>
                  <span className="font-bold text-slate-900">{consignee?.namaPerusahaan}</span>
                </div>
              </div>

              {/* Ports & Voyage */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  TRAYEK & PELABUHAN
                </span>
                <div>
                  <span className="text-slate-500 text-[11px] block">Pelabuhan Muat (POL):</span>
                  <span className="font-bold text-blue-900">{pol?.namaPelabuhan}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Pelabuhan Bongkar (POD):</span>
                  <span className="font-bold text-emerald-900">{pod?.namaPelabuhan}</span>
                </div>
              </div>

              {/* Cargo Details */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  SPESIFIKASI MUATAN
                </span>
                <div>
                  <span className="text-slate-500 text-[11px] block">Deskripsi Barang:</span>
                  <span className="font-bold text-slate-900">{selectedBooking.deskripsiBarang}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span>Berat: <strong>{selectedBooking.beratKotorKg.toLocaleString('id-ID')} Kg</strong></span>
                  <span>Volume: <strong>{selectedBooking.volumeCbm} CBM</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Vessel Telemetry & Radar Simulation */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  TELEMETRI RADAR KAPAL PEMBAWA (AIS LIVE VESSEL MONITOR)
                </h3>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AIS SATELLITE SYNC
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">KAPAL PENGANGKUT</span>
                <span className="text-sm font-black text-cyan-300 block mt-1">{currentKapal?.namaKapal || 'KM Armada'}</span>
                <span className="text-[10px] text-slate-400 font-mono">Call Sign: {currentKapal?.callSign} | {currentKapal?.imoNumber}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">KECEPATAN & HALUAN</span>
                <span className="text-sm font-black text-white font-mono block mt-1">{currentKapal?.kecepatanKnot || 15.2} Knot</span>
                <span className="text-[10px] text-emerald-400">Heading 084° ESE (Pelayaran Normal)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">NAHKODA (MASTER)</span>
                <span className="text-sm font-black text-white block mt-1">{currentVoyage?.nahkodaTugas || currentKapal?.nahkoda || 'Capt. Nahkoda'}</span>
                <span className="text-[10px] text-slate-400">Lisensi Master Mariner ANT-I</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">POSISI GPS TERKINI</span>
                <span className="text-xs font-mono font-bold text-cyan-400 block mt-1">{currentKapal?.lokasiTerkini || 'Perairan Laut Jawa'}</span>
                <span className="text-[10px] text-slate-400">Zona Alur Laut Kepulauan Indonesia (ALKI)</span>
              </div>
            </div>

            {/* Interactive Sea Map Simulation Bar */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Anchor className="w-3.5 h-3.5" />
                  <span>{pol?.namaPelabuhan}</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Trayek Maritim Tol Laut Indonesia
                </span>
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{pod?.namaPelabuhan}</span>
                </span>
              </div>

              {/* Progress Line */}
              <div className="relative w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(15, (currentStageIdx + 1) * 16.6))}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0 NM (Nautical Miles)</span>
                <span className="text-cyan-400 font-bold">Kapal Berada di Koridor Rute Aman</span>
                <span>Tujuan Akhir Dermaga</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
          Masukkan nomor Bill of Lading atau nomor kontainer di atas untuk memulai pelacakan.
        </div>
      )}
    </div>
  );
};
