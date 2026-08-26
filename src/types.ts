export type UserRole = 'super_admin' | 'ops_manager' | 'logistics_staff' | 'finance_billing';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department: string;
  lastLogin?: string;
}

export type KapalStatus = 'aktif' | 'berlayar' | 'docking' | 'standby';
export type KapalType = 'container' | 'bulk_carrier' | 'general_cargo' | 'ro_ro' | 'tanker' | 'tug_barge';

export interface Kapal {
  id: string;
  kodeKapal: string;
  namaKapal: string;
  imoNumber: string;
  callSign: string;
  tipe: KapalType;
  kapasitasDwt: number; // Deadweight Tonnage (Ton)
  kapasitasTeu: number; // TEU for container vessel
  tahunPembuatan: number;
  bendera: string;
  nahkoda: string;
  kecepatanKnot: number;
  status: KapalStatus;
  lokasiTerkini: string;
  catatan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pelabuhan {
  id: string;
  kodePelabuhan: string; // UN/LOCODE e.g. IDTPP
  namaPelabuhan: string;
  kota: string;
  provinsi: string;
  kedalamanDraftMeter: number;
  fasilitas: string[]; // ['Container Crane', 'Reefer Plugs', 'Gudang CFS', 'Dermaga Curah']
  koordinat: string;
  namaSyahbandar: string;
  teleponKontak: string;
  createdAt: string;
}

export type CustomerType = 'shipper' | 'consignee' | 'forwarder' | 'korporat';

export interface Pelanggan {
  id: string;
  kodeCustomer: string;
  namaPerusahaan: string;
  tipe: CustomerType;
  picName: string;
  telepon: string;
  email: string;
  alamat: string;
  kota: string;
  npwp: string;
  creditLimit: number;
  creditTermDays: number;
  status: 'aktif' | 'nonaktif';
  createdAt: string;
}

export type CargoUnit = 'TEU' | 'FEU' | 'TON' | 'CBM' | 'UNIT' | 'Ton' | 'M3' | 'Unit';

export interface TarifKargo {
  id: string;
  kodeTarif?: string;
  namaKategori?: string;
  jenisKargo?: string;
  pelabuhanAsalId: string;
  pelabuhanTujuanId: string;
  satuan: string;
  tarifDasar: number; // IDR
  thcRate?: number; // Terminal Handling Charge
  thcCharge?: number;
  bunkerSurcharge: number; // BAF / BBM Surcharge
  adminFee?: number;
  docFee?: number;
  berlakuHingga?: string;
  catatan?: string;
  createdAt?: string;
}

export type VoyageStatus = 'draft' | 'scheduled' | 'loading' | 'sailing' | 'berthed' | 'completed' | 'cancelled' | 'delayed';

export interface JadwalVoyage {
  id: string;
  nomorVoyage: string; // e.g. VOY-2026-NTR-08
  kapalId: string;
  pelabuhanAsalId: string;
  pelabuhanTujuanId: string;
  pelabuhanTransitId?: string;
  etd: string; // Estimated Departure (YYYY-MM-DD)
  eta: string; // Estimated Arrival
  atd?: string; // Actual Departure
  ata?: string; // Actual Arrival
  status: VoyageStatus;
  totalMuatanTeu?: number;
  totalMuatanTon?: number;
  totalMuatanDwt?: number;
  nahkodaBertugas?: string;
  nahkodaTugas?: string;
  catatanRute?: string;
  catatan?: string;
  createdAt: string;
}

export type BLStatus = 'draft' | 'booked' | 'loading' | 'on_board' | 'in_transit' | 'arrived' | 'discharged' | 'delivered' | 'released';
export type CargoType = 'FCL_20' | 'FCL_40' | 'REEFER_20' | 'BREAK_BULK' | 'LIQUID_BULK' | 'VEHICLE' | string;

export interface BookingBL {
  id: string;
  nomorBL: string; // e.g. BL-2026-NTR-0012
  voyageId: string;
  shipperId: string;
  consigneeId: string;
  notifyParty?: string;
  pelabuhanMuatId: string;
  pelabuhanBongkarId: string;
  jenisKargo: CargoType;
  deskripsiBarang: string;
  nomorKontainer?: string;
  nomorSegel?: string; // Seal No.
  nomorSeal?: string;
  jumlahSatuan: number;
  satuanKargo: string;
  beratKotorKg: number;
  volumeCbm: number;
  isDangerousGoods?: boolean;
  reeferTempCelsius?: number;
  tarifFreight?: number;
  biayaFreight?: number;
  biayaTambahan?: number;
  biayaThc?: number;
  biayaAsuransi?: number;
  freightTerm?: 'prepaid' | 'collect';
  totalBiaya: number;
  status: BLStatus;
  tanggalBooking: string;
  tanggalMuat?: string;
  tanggalTiba?: string;
  catatanKhusus?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  deskripsi: string;
  jumlah: number;
  tarifSatuan: number;
  total: number;
}

export type PaymentStatus = 'unpaid' | 'paid' | 'overdue' | 'partial';

export interface InvoiceFreight {
  id: string;
  nomorInvoice: string; // e.g. INV-2026-FRT-0081
  bookingId?: string;
  bookingBlId?: string;
  customerId?: string;
  shipperId?: string;
  tanggalInvoice: string;
  jatuhTempo: string;
  items?: InvoiceItem[];
  subtotal: number;
  thcTotal?: number;
  bunkerAdjustment?: number;
  docFee?: number;
  ppn?: number;
  ppnPersen?: number; // 11%
  ppnNominal?: number;
  totalTagihan: number;
  statusBayar: PaymentStatus;
  tanggalBayar?: string;
  metodeBayar?: string;
  metodePembayaran?: string;
  rekeningBankTujuan?: string;
  catatan?: string;
  catatanPayment?: string;
  createdAt?: string;
}

export type DatabaseProvider = 'local' | 'supabase' | 'neon' | 'firebase';

export interface DatabaseConfig {
  provider: DatabaseProvider;
  // Supabase
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  // Neon DB
  neonConnectionString?: string;
  neonHost?: string;
  // Firebase
  firebaseProjectId?: string;
  firebaseApiKey?: string;
  firebaseAppId?: string;
  firebaseDatabaseUrl?: string;
  lastSyncTime?: string;
  autoSync: boolean;
}

export type ActiveTab = 
  | 'dashboard'
  | 'master_kapal'
  | 'master_pelabuhan'
  | 'master_pelanggan'
  | 'master_tarif'
  | 'transaksi_voyage'
  | 'transaksi_booking_bl'
  | 'transaksi_invoicing'
  | 'transaksi_tracking'
  | 'laporan'
  | 'database_hub';
