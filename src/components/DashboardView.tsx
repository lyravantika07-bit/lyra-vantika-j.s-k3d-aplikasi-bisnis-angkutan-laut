import React from 'react';
import { 
  Ship, Anchor, FileText, Receipt, TrendingUp, 
  ArrowUpRight, Clock, AlertTriangle, ShieldCheck, 
  MapPin, CheckCircle2, Navigation, Compass, PackageCheck, Layers
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Kapal, Pelabuhan, Pelanggan, JadwalVoyage, 
  BookingBL, InvoiceFreight, ActiveTab 
} from '../types';

interface DashboardViewProps {
  kapalList: Kapal[];
  pelabuhanList: Pelabuhan[];
  pelangganList: Pelanggan[];
  voyages: JadwalVoyage[];
  bookings: BookingBL[];
  invoices: InvoiceFreight[];
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  kapalList,
  pelabuhanList,
  pelangganList,
  voyages,
  bookings,
  invoices,
  onNavigate
}) => {
  // Calculations for KPIs
  const totalKapal = kapalList.length;
  const kapalBerlayar = kapalList.filter(k => k.status === 'berlayar').length;
  const kapalAktif = kapalList.filter(k => k.status === 'aktif').length;
  const kapalDocking = kapalList.filter(k => k.status === 'docking').length;

  const totalBookings = bookings.length;
  const totalTeu = bookings.reduce((sum, b) => sum + (b.satuanKargo === 'TEU' ? b.jumlahSatuan : b.satuanKargo === 'FEU' ? b.jumlahSatuan * 2 : 0), 0);
  const totalTonase = bookings.reduce((sum, b) => sum + b.beratKotorKg, 0) / 1000; // Ton

  const totalOmset = invoices.reduce((sum, inv) => sum + inv.totalTagihan, 0);
  const totalLunas = invoices.filter(i => i.statusBayar === 'paid').reduce((sum, i) => sum + i.totalTagihan, 0);
  const totalPiutang = invoices.filter(i => i.statusBayar !== 'paid').reduce((sum, i) => sum + i.totalTagihan, 0);

  // Chart Data 1: Pendapatan per Rute Pelayaran
  const routeRevenueMap: { [key: string]: number } = {};
  bookings.forEach(b => {
    const pol = pelabuhanList.find(p => p.id === b.pelabuhanMuatId)?.namaPelabuhan.replace('Pelabuhan ', '') || 'Asal';
    const pod = pelabuhanList.find(p => p.id === b.pelabuhanBongkarId)?.namaPelabuhan.replace('Pelabuhan ', '') || 'Tujuan';
    const routeKey = `${pol.split(' ')[0]} ➔ ${pod.split(' ')[0]}`;
    routeRevenueMap[routeKey] = (routeRevenueMap[routeKey] || 0) + b.totalBiaya;
  });

  const routeChartData = Object.entries(routeRevenueMap).map(([route, amount]) => ({
    route,
    omsetJuta: Math.round(amount / 1000000)
  }));

  // Chart Data 2: Status Armada Kapal (Pie)
  const fleetStatusData = [
    { name: 'Berlayar di Laut', value: kapalBerlayar, color: '#0284c7' },
    { name: 'Sandar / Siap Muat', value: kapalAktif, color: '#10b981' },
    { name: 'Perawatan (Docking)', value: kapalDocking, color: '#f59e0b' },
    { name: 'Standby / Cadangan', value: totalKapal - (kapalBerlayar + kapalAktif + kapalDocking), color: '#64748b' }
  ].filter(d => d.value > 0);

  return (
    <div id="dashboard-container" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>Pusat Komando Operasional Maritim Nusantara</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
            Sistem Angkutan Laut & Ekspedisi Kargo Kapal
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Monitoring armada kapal, jadwal pelayaran (voyage), surat muatan Bill of Lading (B/L), invoicing freight, dan pelacakan kargo real-time.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="dash-quick-booking-btn"
            onClick={() => onNavigate('transaksi_booking_bl')}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>+ Buat B/L Baru</span>
          </button>
          <button
            id="dash-quick-voyage-btn"
            onClick={() => onNavigate('transaksi_voyage')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Anchor className="w-3.5 h-3.5 text-cyan-400" />
            <span>Jadwal Pelayaran</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Armada Kapal */}
        <div 
          onClick={() => onNavigate('master_kapal')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Ship className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {kapalBerlayar} Sedang Berlayar
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Armada Kapal Aktif</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{totalKapal}</span>
            <span className="text-xs text-slate-500 font-medium">Unit Kapal</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            {kapalAktif} Standby / {kapalDocking} Docking
          </p>
        </div>

        {/* KPI 2: Total Volume Kargo */}
        <div 
          onClick={() => onNavigate('transaksi_booking_bl')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <PackageCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
              {totalBookings} B/L Aktif
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Muatan Angkutan</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{totalTeu.toLocaleString('id-ID')}</span>
            <span className="text-xs text-slate-500 font-medium">TEU Kontainer</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Tonase Kargo: <span className="font-semibold text-slate-800">{totalTonase.toLocaleString('id-ID', { maximumFractionDigits: 1 })} Ton</span>
          </p>
        </div>

        {/* KPI 3: Omset Uang Tambang */}
        <div 
          onClick={() => onNavigate('transaksi_invoicing')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Lunas: {Math.round((totalLunas / (totalOmset || 1)) * 100)}%
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Tagihan Freight</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs font-bold text-slate-500">Rp</span>
            <span className="text-2xl font-black text-slate-900">
              {(totalOmset / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Juta
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Lunas: <span className="font-semibold text-emerald-600">Rp {(totalLunas / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt</span>
          </p>
        </div>

        {/* KPI 4: Piutang / Pending Invoices */}
        <div 
          onClick={() => onNavigate('transaksi_invoicing')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              {invoices.filter(i => i.statusBayar !== 'paid').length} Belum Bayar
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Piutang Uang Tambang</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs font-bold text-slate-500">Rp</span>
            <span className="text-2xl font-black text-amber-600">
              {(totalPiutang / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Juta
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Jatuh tempo dalam 14-30 hari ke depan
          </p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Pendapatan per Rute (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Performa Pendapatan Freight per Rute Pelayaran</h2>
              <p className="text-[11px] text-slate-500">Omset muatan kapal berdasarkan trayek utama nusantara (Juta Rupiah)</p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 text-slate-700">
              Bulan Berjalan
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="route" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')} Juta`, 'Total Omset']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="omsetJuta" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Komposisi Status Armada (1 col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Distribusi Status Armada Kapal</h2>
            <p className="text-[11px] text-slate-500">Status operasional kapal komersial & perintis</p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fleetStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {fleetStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value} Kapal`, 'Jumlah']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {fleetStatusData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span className="text-slate-600">{d.name}</span>
                </div>
                <span className="font-bold text-slate-900">{d.value} Kapal</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Voyages & Recent Bookings Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Voyages */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Jadwal Pelayaran Kapal Terkini</h3>
                <p className="text-[11px] text-slate-500">Status voyage yang sedang berjalan dan sandar</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('transaksi_voyage')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {voyages.slice(0, 3).map((v) => {
              const kapal = kapalList.find(k => k.id === v.kapalId);
              const pol = pelabuhanList.find(p => p.id === v.pelabuhanAsalId);
              const pod = pelabuhanList.find(p => p.id === v.pelabuhanTujuanId);
              return (
                <div key={v.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-blue-900">{v.nomorVoyage}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      v.status === 'sailing' ? 'bg-blue-100 text-blue-700' :
                      v.status === 'loading' ? 'bg-amber-100 text-amber-700' :
                      v.status === 'berthed' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {v.status === 'sailing' ? '🌊 Sedang Berlayar' : v.status === 'loading' ? '📦 Loading Muatan' : v.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">{kapal?.namaKapal}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <MapPin className="w-3 h-3 text-red-500" />
                    <span>{pol?.kota || 'Asal'} ➔ {pod?.kota || 'Tujuan'}</span>
                    <span className="text-slate-400">|</span>
                    <span>ETA: {new Date(v.eta).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent B/L Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Transaksi Bill of Lading (B/L) Terbaru</h3>
                <p className="text-[11px] text-slate-500">Konosemen kargo terdaftar dalam sistem</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('transaksi_booking_bl')}
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 3).map((b) => {
              const shipper = pelangganList.find(p => p.id === b.shipperId);
              return (
                <div key={b.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-slate-900">{b.nomorBL}</span>
                    <span className="text-xs font-mono font-bold text-blue-900">
                      Rp {b.totalBiaya.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 truncate">{shipper?.namaPerusahaan || 'Shipper'}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span className="truncate max-w-[200px]">{b.deskripsiBarang}</span>
                    <span className="font-mono text-slate-600">{b.nomorKontainer || 'General'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
