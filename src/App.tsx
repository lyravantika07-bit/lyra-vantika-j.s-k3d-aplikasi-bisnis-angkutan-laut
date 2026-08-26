import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginModal } from './components/LoginModal';
import { DatabaseModal } from './components/DatabaseModal';
import { DashboardView } from './components/DashboardView';

// Master Views
import { KapalView } from './components/master/KapalView';
import { PelabuhanView } from './components/master/PelabuhanView';
import { PelangganView } from './components/master/PelangganView';
import { TarifView } from './components/master/TarifView';

// Transaksi Views
import { VoyageView } from './components/transaksi/VoyageView';
import { BookingBLView } from './components/transaksi/BookingBLView';
import { InvoiceView } from './components/transaksi/InvoiceView';
import { TrackingView } from './components/transaksi/TrackingView';

// Laporan View
import { LaporanView } from './components/laporan/LaporanView';

import { StorageService } from './services/storageService';
import { 
  User, DatabaseConfig, ActiveTab, Kapal, Pelabuhan, 
  Pelanggan, TarifKargo, JadwalVoyage, BookingBL, InvoiceFreight 
} from './types';

export default function App() {
  // App Core State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(StorageService.getDbConfig());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  // Live Data States
  const [kapalList, setKapalList] = useState<Kapal[]>([]);
  const [pelabuhanList, setPelabuhanList] = useState<Pelabuhan[]>([]);
  const [pelangganList, setPelangganList] = useState<Pelanggan[]>([]);
  const [tarifList, setTarifList] = useState<TarifKargo[]>([]);
  const [voyages, setVoyages] = useState<JadwalVoyage[]>([]);
  const [bookings, setBookings] = useState<BookingBL[]>([]);
  const [invoices, setInvoices] = useState<InvoiceFreight[]>([]);

  // Load Initial Data
  const refreshAllData = () => {
    setCurrentUser(StorageService.getCurrentUser());
    setDbConfig(StorageService.getDbConfig());
    setKapalList(StorageService.getKapalList());
    setPelabuhanList(StorageService.getPelabuhanList());
    setPelangganList(StorageService.getPelangganList());
    setTarifList(StorageService.getTarifList());
    setVoyages(StorageService.getVoyages());
    setBookings(StorageService.getBookings());
    setInvoices(StorageService.getInvoices());
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // CRUD Handlers for Master Kapal
  const handleSaveKapal = (k: Kapal) => {
    StorageService.saveKapal(k);
    setKapalList(StorageService.getKapalList());
  };
  const handleDeleteKapal = (id: string) => {
    StorageService.deleteKapal(id);
    setKapalList(StorageService.getKapalList());
  };

  // CRUD Handlers for Master Pelabuhan
  const handleSavePelabuhan = (p: Pelabuhan) => {
    StorageService.savePelabuhan(p);
    setPelabuhanList(StorageService.getPelabuhanList());
  };
  const handleDeletePelabuhan = (id: string) => {
    StorageService.deletePelabuhan(id);
    setPelabuhanList(StorageService.getPelabuhanList());
  };

  // CRUD Handlers for Master Pelanggan
  const handleSavePelanggan = (plg: Pelanggan) => {
    StorageService.savePelanggan(plg);
    setPelangganList(StorageService.getPelangganList());
  };
  const handleDeletePelanggan = (id: string) => {
    StorageService.deletePelanggan(id);
    setPelangganList(StorageService.getPelangganList());
  };

  // CRUD Handlers for Master Tarif
  const handleSaveTarif = (t: TarifKargo) => {
    StorageService.saveTarif(t);
    setTarifList(StorageService.getTarifList());
  };
  const handleDeleteTarif = (id: string) => {
    StorageService.deleteTarif(id);
    setTarifList(StorageService.getTarifList());
  };

  // CRUD Handlers for Transaksi Voyage
  const handleSaveVoyage = (v: JadwalVoyage) => {
    StorageService.saveVoyage(v);
    setVoyages(StorageService.getVoyages());
  };
  const handleDeleteVoyage = (id: string) => {
    StorageService.deleteVoyage(id);
    setVoyages(StorageService.getVoyages());
  };

  // CRUD Handlers for Transaksi Booking & B/L
  const handleSaveBooking = (b: BookingBL) => {
    StorageService.saveBooking(b);
    setBookings(StorageService.getBookings());
  };
  const handleDeleteBooking = (id: string) => {
    StorageService.deleteBooking(id);
    setBookings(StorageService.getBookings());
  };

  // CRUD Handlers for Transaksi Invoice
  const handleSaveInvoice = (inv: InvoiceFreight) => {
    StorageService.saveInvoice(inv);
    setInvoices(StorageService.getInvoices());
  };
  const handleDeleteInvoice = (id: string) => {
    StorageService.deleteInvoice(id);
    setInvoices(StorageService.getInvoices());
  };

  // User Auth & DB Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    refreshAllData();
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  const handleConfigUpdated = (newConfig: DatabaseConfig) => {
    setDbConfig(newConfig);
    refreshAllData();
  };

  const handleNavigate = (tab: ActiveTab) => {
    if (tab === 'database_hub') {
      setIsDbModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div id="maritime-app-root" className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        dbConfig={dbConfig}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenDatabase={() => setIsDbModalOpen(true)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Layout Container: Sidebar + Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleNavigate}
          counts={{
            kapal: kapalList.length,
            pelabuhan: pelabuhanList.length,
            pelanggan: pelangganList.length,
            voyages: voyages.length,
            bookings: bookings.length,
            invoices: invoices.length
          }}
        />

        {/* Dynamic Main Workspace Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              kapalList={kapalList}
              pelabuhanList={pelabuhanList}
              pelangganList={pelangganList}
              voyages={voyages}
              bookings={bookings}
              invoices={invoices}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'master_kapal' && (
            <KapalView
              kapalList={kapalList}
              onSaveKapal={handleSaveKapal}
              onDeleteKapal={handleDeleteKapal}
            />
          )}

          {activeTab === 'master_pelabuhan' && (
            <PelabuhanView
              pelabuhanList={pelabuhanList}
              onSavePelabuhan={handleSavePelabuhan}
              onDeletePelabuhan={handleDeletePelabuhan}
            />
          )}

          {activeTab === 'master_pelanggan' && (
            <PelangganView
              pelangganList={pelangganList}
              onSavePelanggan={handleSavePelanggan}
              onDeletePelanggan={handleDeletePelanggan}
            />
          )}

          {activeTab === 'master_tarif' && (
            <TarifView
              tarifList={tarifList}
              pelabuhanList={pelabuhanList}
              onSaveTarif={handleSaveTarif}
              onDeleteTarif={handleDeleteTarif}
            />
          )}

          {activeTab === 'transaksi_voyage' && (
            <VoyageView
              voyages={voyages}
              kapalList={kapalList}
              pelabuhanList={pelabuhanList}
              onSaveVoyage={handleSaveVoyage}
              onDeleteVoyage={handleDeleteVoyage}
            />
          )}

          {activeTab === 'transaksi_booking_bl' && (
            <BookingBLView
              bookings={bookings}
              voyages={voyages}
              kapalList={kapalList}
              pelabuhanList={pelabuhanList}
              pelangganList={pelangganList}
              onSaveBooking={handleSaveBooking}
              onDeleteBooking={handleDeleteBooking}
            />
          )}

          {activeTab === 'transaksi_invoicing' && (
            <InvoiceView
              invoices={invoices}
              bookings={bookings}
              pelangganList={pelangganList}
              onSaveInvoice={handleSaveInvoice}
              onDeleteInvoice={handleDeleteInvoice}
            />
          )}

          {activeTab === 'transaksi_tracking' && (
            <TrackingView
              bookings={bookings}
              voyages={voyages}
              kapalList={kapalList}
              pelabuhanList={pelabuhanList}
              pelangganList={pelangganList}
            />
          )}

          {activeTab === 'laporan' && (
            <LaporanView
              kapalList={kapalList}
              pelabuhanList={pelabuhanList}
              pelangganList={pelangganList}
              voyages={voyages}
              bookings={bookings}
              invoices={invoices}
            />
          )}
        </main>
      </div>

      {/* Global Authentication Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Global Real Database Configuration & Schema Hub Modal */}
      <DatabaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        currentConfig={dbConfig}
        onConfigUpdated={handleConfigUpdated}
      />
    </div>
  );
}
