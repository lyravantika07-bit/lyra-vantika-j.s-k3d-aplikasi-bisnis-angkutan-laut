import { Kapal, Pelabuhan, Pelanggan, TarifKargo, JadwalVoyage, BookingBL, InvoiceFreight, User } from '../types';

export const initialUsers: User[] = [
  {
    id: 'usr-1',
    username: 'admin',
    name: 'Capt. Hendra Gunawan, M.Mar',
    email: 'admin@maritimlogistik.id',
    role: 'super_admin',
    department: 'Direksi & Operasional Maritim',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lastLogin: '2026-08-25 09:15 WIB'
  },
  {
    id: 'usr-2',
    username: 'ops_manager',
    name: 'Bambang Wijaya, S.T.',
    email: 'bambang.ops@maritimlogistik.id',
    role: 'ops_manager',
    department: 'Manajemen Armada & Voyage',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lastLogin: '2026-08-25 08:30 WIB'
  },
  {
    id: 'usr-3',
    username: 'logistics',
    name: 'Siti Rahmawati, S.Log',
    email: 'siti.cargo@maritimlogistik.id',
    role: 'logistics_staff',
    department: 'Pelayanan Kargo & Bill of Lading',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    lastLogin: '2026-08-25 07:45 WIB'
  },
  {
    id: 'usr-4',
    username: 'finance',
    name: 'Dewi Lestari, S.E., Ak.',
    email: 'dewi.finance@maritimlogistik.id',
    role: 'finance_billing',
    department: 'Keuangan & Freight Billing',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    lastLogin: '2026-08-25 10:00 WIB'
  }
];

export const initialKapal: Kapal[] = [
  {
    id: 'kpl-1',
    kodeKapal: 'KPL-NTR-01',
    namaKapal: 'KM Nusantara Raya 01',
    imoNumber: 'IMO 9482103',
    callSign: 'YDYB',
    tipe: 'container',
    kapasitasDwt: 12500,
    kapasitasTeu: 850,
    tahunPembuatan: 2019,
    bendera: 'Indonesia (Merah Putih)',
    nahkoda: 'Capt. Rahmat Hidayat',
    kecepatanKnot: 16.5,
    status: 'berlayar',
    lokasiTerkini: 'Laut Jawa (E 110° 24.12, S 05° 48.30)',
    catatan: 'Rute reguler Tanjung Priok -> Tanjung Perak -> Makassar',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-24T14:30:00Z'
  },
  {
    id: 'kpl-2',
    kodeKapal: 'KPL-SMB-09',
    namaKapal: 'KM Samudera Bahari IX',
    imoNumber: 'IMO 9623841',
    callSign: 'PKST',
    tipe: 'container',
    kapasitasDwt: 18000,
    kapasitasTeu: 1200,
    tahunPembuatan: 2021,
    bendera: 'Indonesia (Merah Putih)',
    nahkoda: 'Capt. Agus Suryono',
    kecepatanKnot: 18.0,
    status: 'aktif',
    lokasiTerkini: 'Dermaga Kontainer JICT 2 Tanjung Priok',
    catatan: 'Kondisi prima, siap muat untuk Voyage Sorong - Jayapura',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-08-25T07:15:00Z'
  },
  {
    id: 'kpl-3',
    kodeKapal: 'KPL-TLB-03',
    namaKapal: 'KM Teluk Bitung Star',
    imoNumber: 'IMO 9355120',
    callSign: 'YDBT',
    tipe: 'bulk_carrier',
    kapasitasDwt: 24000,
    kapasitasTeu: 0,
    tahunPembuatan: 2017,
    bendera: 'Indonesia (Merah Putih)',
    nahkoda: 'Capt. Johan Frans',
    kecepatanKnot: 13.5,
    status: 'berlayar',
    lokasiTerkini: 'Selat Makassar menuju Balikpapan',
    catatan: 'Angkutan curah kargo semen dan komoditas industri',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-08-24T18:00:00Z'
  },
  {
    id: 'kpl-4',
    kodeKapal: 'KPL-PLN-08',
    namaKapal: 'KM Pelni Baruna Express',
    imoNumber: 'IMO 9510048',
    callSign: 'PKBE',
    tipe: 'ro_ro',
    kapasitasDwt: 8500,
    kapasitasTeu: 320,
    tahunPembuatan: 2020,
    bendera: 'Indonesia (Merah Putih)',
    nahkoda: 'Capt. Ilham Pratama',
    kecepatanKnot: 15.0,
    status: 'aktif',
    lokasiTerkini: 'Pelabuhan Tanjung Perak Surabaya (Dermaga Jamrud)',
    catatan: 'Fasilitas Ro-Ro muat truk logistik dan dry container',
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-08-25T06:00:00Z'
  },
  {
    id: 'kpl-5',
    kodeKapal: 'KPL-CLB-05',
    namaKapal: 'KM Celebes Navigator',
    imoNumber: 'IMO 9298450',
    callSign: 'YDCN',
    tipe: 'general_cargo',
    kapasitasDwt: 6500,
    kapasitasTeu: 180,
    tahunPembuatan: 2015,
    bendera: 'Indonesia (Merah Putih)',
    nahkoda: 'Capt. Marthen Lolo',
    kecepatanKnot: 12.0,
    status: 'docking',
    lokasiTerkini: 'Galangan Kapal PT PAL Surabaya (Annual Survey)',
    catatan: 'Perawatan rutin propeller dan lambung kapal s/d akhir bulan',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z'
  }
];

export const initialPelabuhan: Pelabuhan[] = [
  {
    id: 'plb-1',
    kodePelabuhan: 'IDTPP',
    namaPelabuhan: 'Pelabuhan Tanjung Priok',
    kota: 'Jakarta Utara',
    provinsi: 'DKI Jakarta',
    kedalamanDraftMeter: 14.5,
    fasilitas: ['Container Crane (CC)', 'Reefer Plugs (500 unit)', 'Gudang CFS 24 Jam', 'Dermaga Curah Kering'],
    koordinat: '06° 06\' 00" S, 106° 53\' 00" E',
    namaSyahbandar: 'Kantor KSOP Utama Tanjung Priok',
    teleponKontak: '(021) 4301080',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'plb-2',
    kodePelabuhan: 'IDSUB',
    namaPelabuhan: 'Pelabuhan Tanjung Perak',
    kota: 'Surabaya',
    provinsi: 'Jawa Timur',
    kedalamanDraftMeter: 13.0,
    fasilitas: ['Terminal Petikemas Surabaya (TPS)', 'Dermaga Jamrud Ro-Ro', 'Cold Storage Maritim', 'Tugboat Escort'],
    koordinat: '07° 12\' 00" S, 112° 44\' 00" E',
    namaSyahbandar: 'Kantor Otoritas Pelabuhan Tanjung Perak',
    teleponKontak: '(031) 3291992',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'plb-3',
    kodePelabuhan: 'IDMAK',
    namaPelabuhan: 'Pelabuhan Soekarno-Hatta Makassar',
    kota: 'Makassar',
    provinsi: 'Sulawesi Selatan',
    kedalamanDraftMeter: 12.5,
    fasilitas: ['Makassar New Port (MNP)', 'Gantry Crane', 'Depo Petikemas Lapangan', 'Fasilitas Bunker BBM'],
    koordinat: '05° 08\' 00" S, 119° 24\' 00" E',
    namaSyahbandar: 'Kantor KSOP Utama Makassar',
    teleponKontak: '(0411) 316524',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'plb-4',
    kodePelabuhan: 'IDBLW',
    namaPelabuhan: 'Pelabuhan Belawan',
    kota: 'Medan',
    provinsi: 'Sumatera Utara',
    kedalamanDraftMeter: 11.5,
    fasilitas: ['Belawan International Container Terminal (BICT)', 'Dermaga Curah Cair CPO', 'Gudang Ekspor'],
    koordinat: '03° 47\' 00" N, 98° 41\' 00" E',
    namaSyahbandar: 'Kantor Otoritas Pelabuhan Belawan',
    teleponKontak: '(061) 6941444',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'plb-5',
    kodePelabuhan: 'IDBPN',
    namaPelabuhan: 'Pelabuhan Semayang Balikpapan',
    kota: 'Balikpapan',
    provinsi: 'Kalimantan Timur',
    kedalamanDraftMeter: 13.5,
    fasilitas: ['Terminal Petikemas Kariangau', 'Dermaga Alat Berat IKN', 'Helipad Evakuasi Medis'],
    koordinat: '01° 16\' 00" S, 116° 48\' 00" E',
    namaSyahbandar: 'Kantor KSOP Balikpapan',
    teleponKontak: '(0542) 422056',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'plb-6',
    kodePelabuhan: 'IDSOQ',
    namaPelabuhan: 'Pelabuhan Sorong Tol Laut',
    kota: 'Sorong',
    provinsi: 'Papua Barat Daya',
    kedalamanDraftMeter: 11.0,
    fasilitas: ['Dermaga Kontainer Tol Laut', 'Reefer Station Ikan Segar', 'Gudang Logistik Perintis'],
    koordinat: '00° 53\' 00" S, 131° 15\' 00" E',
    namaSyahbandar: 'Kantor KSOP Kelas I Sorong',
    teleponKontak: '(0951) 321852',
    createdAt: '2026-01-01T00:00:00Z'
  }
];

export const initialPelanggan: Pelanggan[] = [
  {
    id: 'plg-1',
    kodeCustomer: 'CUST-IND-01',
    namaPerusahaan: 'PT Indofood Sukses Makmur Tbk (Divisi Logistik)',
    tipe: 'shipper',
    picName: 'Ir. Budi Santoso',
    telepon: '0812-3456-7890',
    email: 'budi.logistics@indofood.co.id',
    alamat: 'Jl. Jend. Sudirman Kav. 76-78, Jakarta Selatan',
    kota: 'Jakarta',
    npwp: '01.332.124.5-015.000',
    creditLimit: 2500000000, // Rp 2.5 M
    creditTermDays: 30,
    status: 'aktif',
    createdAt: '2026-01-10T00:00:00Z'
  },
  {
    id: 'plg-2',
    kodeCustomer: 'CUST-SMN-02',
    namaPerusahaan: 'PT Semen Indonesia Logistik (SILOG)',
    tipe: 'korporat',
    picName: 'H. Suwandi, M.M.',
    telepon: '0811-9876-5432',
    email: 'procurement@silog.co.id',
    alamat: 'Jl. Veteran No. 12, Gresik',
    kota: 'Surabaya / Gresik',
    npwp: '01.214.568.9-612.000',
    creditLimit: 5000000000, // Rp 5 M
    creditTermDays: 45,
    status: 'aktif',
    createdAt: '2026-01-12T00:00:00Z'
  },
  {
    id: 'plg-3',
    kodeCustomer: 'CUST-SMD-03',
    namaPerusahaan: 'PT Samudera Indonesia Forwarding',
    tipe: 'forwarder',
    picName: 'Nadia Amelia, S.E.',
    telepon: '0813-1122-3344',
    email: 'nadia.forwarding@samudera.id',
    alamat: 'Samudera Building Lt. 8, Jl. Letjen S. Parman, Jakarta Barat',
    kota: 'Jakarta',
    npwp: '01.109.876.4-032.000',
    creditLimit: 1500000000,
    creditTermDays: 30,
    status: 'aktif',
    createdAt: '2026-01-20T00:00:00Z'
  },
  {
    id: 'plg-4',
    kodeCustomer: 'CUST-BRK-04',
    namaPerusahaan: 'CV Berkah Hasil Laut Nusantara',
    tipe: 'shipper',
    picName: 'Andi Mallarangeng',
    telepon: '0821-4455-6677',
    email: 'andi@berkahhasillaut.com',
    alamat: 'Kawasan Industri Pelabuhan Paotere No. 45',
    kota: 'Makassar',
    npwp: '31.458.789.2-801.000',
    creditLimit: 800000000,
    creditTermDays: 14,
    status: 'aktif',
    createdAt: '2026-02-05T00:00:00Z'
  },
  {
    id: 'plg-5',
    kodeCustomer: 'CUST-PAP-05',
    namaPerusahaan: 'PT Papua Mega Konstruksi (Consignee)',
    tipe: 'consignee',
    picName: 'Yohanes Rumkabu',
    telepon: '0812-7788-9900',
    email: 'yohanes@papuakonstruksi.id',
    alamat: 'Jl. Ahmad Yani No. 100, Klademak',
    kota: 'Sorong',
    npwp: '42.331.654.1-952.000',
    creditLimit: 1200000000,
    creditTermDays: 30,
    status: 'aktif',
    createdAt: '2026-02-15T00:00:00Z'
  }
];

export const initialTarif: TarifKargo[] = [
  {
    id: 'trf-1',
    kodeTarif: 'TRF-JKT-SUB-20',
    namaKategori: 'Dry Container 20ft FCL',
    pelabuhanAsalId: 'plb-1', // Tanjung Priok
    pelabuhanTujuanId: 'plb-2', // Tanjung Perak
    satuan: 'TEU',
    tarifDasar: 5500000, // Rp 5.500.000 / TEU
    thcRate: 1100000,
    bunkerSurcharge: 450000,
    adminFee: 150000,
    catatan: 'Tarif termasuk seal standard dan asuransi dasar pelayaran',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'trf-2',
    kodeTarif: 'TRF-JKT-SUB-40',
    namaKategori: 'Dry Container 40ft FCL',
    pelabuhanAsalId: 'plb-1', // Tanjung Priok
    pelabuhanTujuanId: 'plb-2', // Tanjung Perak
    satuan: 'FEU',
    tarifDasar: 9800000,
    thcRate: 1750000,
    bunkerSurcharge: 750000,
    adminFee: 150000,
    catatan: 'Muatan general kargo non-DG',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'trf-3',
    kodeTarif: 'TRF-SUB-MAK-20',
    namaKategori: 'Dry Container 20ft FCL',
    pelabuhanAsalId: 'plb-2', // Tanjung Perak
    pelabuhanTujuanId: 'plb-3', // Makassar
    satuan: 'TEU',
    tarifDasar: 7800000,
    thcRate: 1250000,
    bunkerSurcharge: 650000,
    adminFee: 150000,
    catatan: 'Rute Lintas Timur Nusantara',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'trf-4',
    kodeTarif: 'TRF-MAK-SOQ-REEFER',
    namaKategori: 'Reefer Container 20ft (Hasil Laut Beku)',
    pelabuhanAsalId: 'plb-3', // Makassar
    pelabuhanTujuanId: 'plb-6', // Sorong
    satuan: 'TEU',
    tarifDasar: 14500000,
    thcRate: 1950000,
    bunkerSurcharge: 1200000,
    adminFee: 250000,
    catatan: 'Termasuk monitoring listrik generator pendingin 24 jam nonstop',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'trf-5',
    kodeTarif: 'TRF-SUB-BPN-BULK',
    namaKategori: 'Semen & Material Curah Kering',
    pelabuhanAsalId: 'plb-2', // Tanjung Perak
    pelabuhanTujuanId: 'plb-5', // Balikpapan
    satuan: 'TON',
    tarifDasar: 280000, // Rp 280.000 / Ton
    thcRate: 45000,
    bunkerSurcharge: 25000,
    adminFee: 50000,
    catatan: 'Minimal muat 1.000 Ton per pengapalan',
    createdAt: '2026-01-01T00:00:00Z'
  }
];

export const initialVoyages: JadwalVoyage[] = [
  {
    id: 'vyg-1',
    nomorVoyage: 'VYG-2026-JKT-SBY-088',
    kapalId: 'kpl-1', // KM Nusantara Raya 01
    pelabuhanAsalId: 'plb-1', // Tanjung Priok
    pelabuhanTujuanId: 'plb-2', // Tanjung Perak
    pelabuhanTransitId: undefined,
    etd: '2026-08-24T18:00',
    eta: '2026-08-26T06:00',
    atd: '2026-08-24T19:15',
    status: 'sailing',
    totalMuatanTeu: 680,
    totalMuatanTon: 8900,
    nahkodaBertugas: 'Capt. Rahmat Hidayat',
    catatanRute: 'Kondisi cuaca laut tenang, ombak 1.2 meter di Laut Jawa',
    createdAt: '2026-08-20T10:00:00Z'
  },
  {
    id: 'vyg-2',
    nomorVoyage: 'VYG-2026-SBY-MAK-092',
    kapalId: 'kpl-4', // KM Pelni Baruna Express
    pelabuhanAsalId: 'plb-2', // Tanjung Perak
    pelabuhanTujuanId: 'plb-3', // Makassar
    pelabuhanTransitId: undefined,
    etd: '2026-08-26T14:00',
    eta: '2026-08-28T08:00',
    status: 'loading',
    totalMuatanTeu: 240,
    totalMuatanTon: 3400,
    nahkodaBertugas: 'Capt. Ilham Pratama',
    catatanRute: 'Proses pemuatan petikemas dan kendaraan logistik di Dermaga Jamrud',
    createdAt: '2026-08-22T11:00:00Z'
  },
  {
    id: 'vyg-3',
    nomorVoyage: 'VYG-2026-JKT-SOQ-015',
    kapalId: 'kpl-2', // KM Samudera Bahari IX
    pelabuhanAsalId: 'plb-1', // Tanjung Priok
    pelabuhanTujuanId: 'plb-6', // Sorong
    pelabuhanTransitId: 'plb-3', // Transit Makassar
    etd: '2026-08-28T20:00',
    eta: '2026-09-03T16:00',
    status: 'draft',
    totalMuatanTeu: 950,
    totalMuatanTon: 14200,
    nahkodaBertugas: 'Capt. Agus Suryono',
    catatanRute: 'Pelayaran Tol Laut Ekspedisi Papua Timur',
    createdAt: '2026-08-23T14:00:00Z'
  },
  {
    id: 'vyg-4',
    nomorVoyage: 'VYG-2026-SBY-BPN-044',
    kapalId: 'kpl-3', // KM Teluk Bitung Star
    pelabuhanAsalId: 'plb-2', // Tanjung Perak
    pelabuhanTujuanId: 'plb-5', // Balikpapan
    etd: '2026-08-23T12:00',
    eta: '2026-08-25T17:00',
    atd: '2026-08-23T13:00',
    ata: '2026-08-25T16:45',
    status: 'berthed',
    totalMuatanTeu: 0,
    totalMuatanTon: 18500,
    nahkodaBertugas: 'Capt. Johan Frans',
    catatanRute: 'Sandar di Terminal Semayang Balikpapan, persiapan bongkar semen',
    createdAt: '2026-08-19T09:00:00Z'
  }
];

export const initialBookings: BookingBL[] = [
  {
    id: 'bl-1',
    nomorBL: 'BL-JKT-SUB-2608001',
    voyageId: 'vyg-1',
    shipperId: 'plg-1', // Indofood
    consigneeId: 'plg-3', // Samudera Forwarding
    notifyParty: 'PT Indofood Cabang Rungkut Industri Surabaya',
    pelabuhanMuatId: 'plb-1', // Tanjung Priok
    pelabuhanBongkarId: 'plb-2', // Tanjung Perak
    jenisKargo: 'FCL_20',
    deskripsiBarang: 'Makanan Olahan, Mie Instan & Minuman Kemasan (Foodstuff)',
    nomorKontainer: 'TEMU 482910-3',
    nomorSegel: 'SL-ID-99201',
    jumlahSatuan: 5,
    satuanKargo: 'TEU',
    beratKotorKg: 85000,
    volumeCbm: 165,
    isDangerousGoods: false,
    biayaFreight: 27500000, // 5 x 5.5 jt
    biayaThc: 5500000,
    biayaAsuransi: 750000,
    totalBiaya: 33750000,
    status: 'in_transit',
    tanggalBooking: '2026-08-22',
    tanggalMuat: '2026-08-24 16:00',
    catatanKhusus: 'Simpan di palka bawah deck, jaga kelembaban kering',
    createdAt: '2026-08-22T09:30:00Z',
    updatedAt: '2026-08-24T19:00:00Z'
  },
  {
    id: 'bl-2',
    nomorBL: 'BL-JKT-SUB-2608002',
    voyageId: 'vyg-1',
    shipperId: 'plg-3', // Samudera Forwarding
    consigneeId: 'plg-2', // SILOG
    notifyParty: 'PT Semen Gresik Logistik Center',
    pelabuhanMuatId: 'plb-1',
    pelabuhanBongkarId: 'plb-2',
    jenisKargo: 'FCL_40',
    deskripsiBarang: 'Sparepart Mesin Pabrik & Pompa Industri (Industrial Spares)',
    nomorKontainer: 'MSKU 883921-7',
    nomorSegel: 'SL-ID-88412',
    jumlahSatuan: 2,
    satuanKargo: 'FEU',
    beratKotorKg: 42000,
    volumeCbm: 130,
    isDangerousGoods: false,
    biayaFreight: 19600000,
    biayaThc: 3500000,
    biayaAsuransi: 600000,
    totalBiaya: 23700000,
    status: 'in_transit',
    tanggalBooking: '2026-08-23',
    tanggalMuat: '2026-08-24 17:30',
    catatanKhusus: 'Harap penanganan crane dengan sling ganda',
    createdAt: '2026-08-23T11:00:00Z',
    updatedAt: '2026-08-24T19:00:00Z'
  },
  {
    id: 'bl-3',
    nomorBL: 'BL-SUB-MAK-2608003',
    voyageId: 'vyg-2',
    shipperId: 'plg-4', // CV Berkah Hasil Laut
    consigneeId: 'plg-3', // Forwarder
    notifyParty: 'Gudang Cold Storage Makassar Port',
    pelabuhanMuatId: 'plb-2',
    pelabuhanBongkarId: 'plb-3',
    jenisKargo: 'REEFER_20',
    deskripsiBarang: 'Ikan Tuna Sirip Kuning & Udang Beku Ekspor',
    nomorKontainer: 'TCLU 551940-1',
    nomorSegel: 'SL-ID-77309',
    jumlahSatuan: 3,
    satuanKargo: 'TEU',
    beratKotorKg: 54000,
    volumeCbm: 90,
    isDangerousGoods: false,
    reeferTempCelsius: -20,
    biayaFreight: 43500000,
    biayaThc: 5850000,
    biayaAsuransi: 1200000,
    totalBiaya: 50550000,
    status: 'on_board',
    tanggalBooking: '2026-08-24',
    tanggalMuat: '2026-08-25 10:00',
    catatanKhusus: 'Monitor suhu reefer tetap -20°C selama pelayaran',
    createdAt: '2026-08-24T14:20:00Z',
    updatedAt: '2026-08-25T11:00:00Z'
  },
  {
    id: 'bl-4',
    nomorBL: 'BL-SBY-BPN-2608004',
    voyageId: 'vyg-4',
    shipperId: 'plg-2', // Semen Indonesia
    consigneeId: 'plg-5', // Papua / Kaltim Konstruksi
    notifyParty: 'Proyek Infrastruktur IKN Nusantara Balikpapan',
    pelabuhanMuatId: 'plb-2',
    pelabuhanBongkarId: 'plb-5',
    jenisKargo: 'BREAK_BULK',
    deskripsiBarang: 'Semen Portland Curah & Jumbo Bag 1 Ton',
    nomorKontainer: 'BULK-SHIP-HOLD 1-3',
    nomorSegel: 'SL-PORT-0012',
    jumlahSatuan: 18500,
    satuanKargo: 'TON',
    beratKotorKg: 18500000,
    volumeCbm: 14200,
    isDangerousGoods: false,
    biayaFreight: 5180000000,
    biayaThc: 832500000,
    biayaAsuransi: 25000000,
    totalBiaya: 6037500000,
    status: 'arrived',
    tanggalBooking: '2026-08-18',
    tanggalMuat: '2026-08-22 08:00',
    tanggalTiba: '2026-08-25 16:45',
    catatanKhusus: 'Bongkar langsung ke truk silo di dermaga Balikpapan',
    createdAt: '2026-08-18T10:00:00Z',
    updatedAt: '2026-08-25T17:00:00Z'
  }
];

export const initialInvoices: InvoiceFreight[] = [
  {
    id: 'inv-1',
    nomorInvoice: 'INV-MAR-2026-0045',
    bookingBlId: 'bl-1',
    shipperId: 'plg-1', // Indofood
    tanggalInvoice: '2026-08-24',
    jatuhTempo: '2026-09-23',
    subtotal: 27500000,
    thcTotal: 5500000,
    bunkerAdjustment: 2250000,
    docFee: 250000,
    ppnPersen: 11,
    ppnNominal: 3905000,
    totalTagihan: 39405000,
    statusBayar: 'paid',
    tanggalBayar: '2026-08-25 10:15 WIB',
    metodeBayar: 'Transfer Bank',
    rekeningBankTujuan: 'Bank Mandiri (137-00-988219-4) a.n PT Samudera Maritim Logistik',
    catatanPayment: 'Lunas via Virtual Account Mandiri Corporate',
    createdAt: '2026-08-24T16:30:00Z'
  },
  {
    id: 'inv-2',
    nomorInvoice: 'INV-MAR-2026-0046',
    bookingBlId: 'bl-2',
    shipperId: 'plg-3', // Samudera Forwarding
    tanggalInvoice: '2026-08-24',
    jatuhTempo: '2026-09-23',
    subtotal: 19600000,
    thcTotal: 3500000,
    bunkerAdjustment: 1500000,
    docFee: 250000,
    ppnPersen: 11,
    ppnNominal: 2733500,
    totalTagihan: 27583500,
    statusBayar: 'unpaid',
    metodeBayar: 'Transfer Bank',
    rekeningBankTujuan: 'Bank BCA (088-2918-771) a.n PT Samudera Maritim Logistik',
    catatanPayment: 'Menunggu konfirmasi approval finance customer',
    createdAt: '2026-08-24T18:00:00Z'
  },
  {
    id: 'inv-3',
    nomorInvoice: 'INV-MAR-2026-0047',
    bookingBlId: 'bl-3',
    shipperId: 'plg-4', // Berkah Hasil Laut
    tanggalInvoice: '2026-08-25',
    jatuhTempo: '2026-09-08',
    subtotal: 43500000,
    thcTotal: 5850000,
    bunkerAdjustment: 3600000,
    docFee: 350000,
    ppnPersen: 11,
    ppnNominal: 5863000,
    totalTagihan: 59163000,
    statusBayar: 'unpaid',
    metodeBayar: 'Letter of Credit',
    rekeningBankTujuan: 'Bank BNI (022-8172-881) a.n PT Samudera Maritim Logistik',
    catatanPayment: 'Invoice Reefer Container Khusus Suhu Dingin',
    createdAt: '2026-08-25T11:30:00Z'
  }
];
