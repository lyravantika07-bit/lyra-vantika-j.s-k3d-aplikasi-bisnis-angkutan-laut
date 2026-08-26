import React from 'react';
import { 
  LayoutDashboard, Ship, Anchor, Users, Tag, 
  CalendarDays, FileText, Receipt, Radar, BarChart3, 
  Database, ChevronRight
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  counts: {
    kapal: number;
    pelabuhan: number;
    pelanggan: number;
    voyages: number;
    bookings: number;
    invoices: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  counts
}) => {
  const navSections = [
    {
      title: 'UTAMA',
      items: [
        {
          id: 'dashboard' as ActiveTab,
          label: 'Dashboard Eksekutif',
          icon: LayoutDashboard,
          badge: null
        }
      ]
    },
    {
      title: 'MASTER DATA',
      items: [
        {
          id: 'master_kapal' as ActiveTab,
          label: 'Master Armada Kapal',
          icon: Ship,
          badge: counts.kapal
        },
        {
          id: 'master_pelabuhan' as ActiveTab,
          label: 'Master Pelabuhan & Rute',
          icon: Anchor,
          badge: counts.pelabuhan
        },
        {
          id: 'master_pelanggan' as ActiveTab,
          label: 'Master Shipper / Customer',
          icon: Users,
          badge: counts.pelanggan
        },
        {
          id: 'master_tarif' as ActiveTab,
          label: 'Master Tarif & Kargo',
          icon: Tag,
          badge: null
        }
      ]
    },
    {
      title: 'TRANSAKSI OPERASIONAL',
      items: [
        {
          id: 'transaksi_voyage' as ActiveTab,
          label: 'Jadwal Pelayaran (Voyage)',
          icon: CalendarDays,
          badge: counts.voyages
        },
        {
          id: 'transaksi_booking_bl' as ActiveTab,
          label: 'Booking & Bill of Lading (B/L)',
          icon: FileText,
          badge: counts.bookings,
          highlight: true
        },
        {
          id: 'transaksi_invoicing' as ActiveTab,
          label: 'Invoicing & Freight Billing',
          icon: Receipt,
          badge: counts.invoices
        },
        {
          id: 'transaksi_tracking' as ActiveTab,
          label: 'Tracking Kargo & Radar Kapal',
          icon: Radar,
          badge: 'LIVE'
        }
      ]
    },
    {
      title: 'LAPORAN & DATABASE',
      items: [
        {
          id: 'laporan' as ActiveTab,
          label: 'Laporan & Ekspor Data',
          icon: BarChart3,
          badge: 'PDF/CSV'
        },
        {
          id: 'database_hub' as ActiveTab,
          label: 'Real Database Hub (Cloud)',
          icon: Database,
          badge: 'Multi-DB'
        }
      ]
    }
  ];

  return (
    <aside id="main-sidebar" className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-tab-${item.id}`}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge !== null && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : typeof item.badge === 'string'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 text-slate-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick System Badge at Bottom */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[11px]">
          <div className="flex items-center justify-between font-medium text-slate-300 mb-1">
            <span>Server Status</span>
            <span className="text-emerald-400 font-mono text-[10px]">ONLINE 99.9%</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Tol Laut & Maritime Freight Network
          </div>
        </div>
      </div>
    </aside>
  );
};
