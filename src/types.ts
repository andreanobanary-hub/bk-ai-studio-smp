export interface SchoolProfile {
  namaSekolah: string;
  namaGuruBK: string;
  nipGuruBK: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  tahunPelajaran: string;
  semester: string;
  kota: string;
}

export interface RPLData {
  topik: string;
  kelas: string;
  fase: string;
  bidang: 'Pribadi' | 'Sosial' | 'Belajar' | 'Karier' | string;
  fungsi: 'Pemahaman' | 'Pencegahan' | 'Pengentasan' | 'Pemeliharaan/Pengembangan' | string;
  alokasiWaktu: '1 x 40 menit' | '2 x 40 menit' | string;
  pendekatan: string;
  pendekatanDeepLearning?: {
    mindfulLearning: string; // Pembelajaran Berkesadaran (Mindful)
    meaningfulLearning: string; // Pembelajaran Bermakna (Meaningful)
    joyfulLearning: string; // Pembelajaran Menyenangkan (Joyful)
  };
  skkpd: string;
  dimensiDeepLearning: string[]; // Dimensi Pembelajaran Mendalam (6C): Karakter, Kewarganegaraan, Kolaborasi, Komunikasi, Kreativitas, Berpikir Kritis
  profilPelajarPancasila?: string[];
  capaianLayanan: string;
  tujuanUmum: string;
  tujuanKhusus: string[];
  materiPokok: string[];
  mediaDanAlat: string;
  metode: string;
  langkahKegiatan: {
    tahapAwal: {
      waktu: string;
      kegiatan: string[];
    };
    tahapInti: {
      waktu: string;
      alurARKA: {
        aktivitas: string; // Aktivitas Bermakna
        refleksi: string; // Refleksi Kritis
        konseptualisasi: string; // Konseptualisasi
        aplikasi: string; // Aplikasi / Aksi Nyata
      };
    };
    tahapPenutup: {
      waktu: string;
      kegiatan: string[];
    };
  };
  asesmen?: {
    asesmenProses: string[];
    asesmenHasil: {
      understanding: string;
      comfortable: string;
      action: string;
    };
  };
  evaluasi: {
    evaluasiProses: string[];
    evaluasiHasil: string[];
  };
  tindakLanjut: string;
}

export interface StudentPeer {
  id: number;
  nama: string;
  gender: 'L' | 'P';
  nisn?: string;
  pilihan1Id: number;
  pilihan2Id: number;
  ikmsResponses?: number[]; // IDs of IKMS items checked by the student
  timestamp?: string;
  submittedViaPortal?: boolean;
}

export interface ClassRoom {
  id: string;
  namaKelas: string;
  tingkat: 'Kelas 7 SMP' | 'Kelas 8 SMP' | 'Kelas 9 SMP' | string;
  tahunPelajaran: string;
  kriteriaSosiometri: string;
  siswa: StudentPeer[];
  googleSheetSyncUrl?: string;
  lastSyncTime?: string;
}

export interface IKMSItem {
  id: number;
  bidang: 'Pribadi' | 'Sosial' | 'Belajar' | 'Karier';
  pernyataan: string;
}

export interface IKMSSummary {
  bidang: 'Pribadi' | 'Sosial' | 'Belajar' | 'Karier';
  persentase: number;
  jumlahPemilih: number;
  totalRespons: number;
  warna: string;
  deskripsi: string;
  topIssues: Array<{ id: number; pernyataan: string; persentase: number; count: number }>;
}

export interface LKPDSubmission {
  id: string;
  tipe: 'Individu' | 'Kelompok';
  namaSiswaAtauKelompok: string;
  anggotaKelompok?: string[];
  kelas: string;
  tanggal: string;
  topik: string;
  fact: string;
  feeling: string;
  finding: string;
  future: string;
  komitmen: string[];
  catatanKonselor?: string;
  parafKonselor?: boolean;
}

export interface CounselingCaseEntry {
  id: string;
  tanggal: string;
  namaSiswaInisial: string;
  kelas: string;
  bidang: string;
  fokus: string;
  deskripsiKasus: string;
  analysis: CaseAnalysis;
  statusPenanganan: 'Dalam Pemantauan' | 'Proses Konseling' | 'Selesai' | 'Alih Tangan Kasus';
  catatanTindakLanjut?: string;
}

export interface SosiometriResult {
  studentId: number;
  nama: string;
  gender: 'L' | 'P';
  skor: number;
  pemilih: string[];
  status: 'Bintang (Populer)' | 'Normal' | 'Diabaikan' | 'Terisolasi (0 Pilihan)';
  catatanIntervensi: string;
}

export interface LKPDData {
  topik: string;
  kelas: string;
  bidang: string;
  instruksiSiswa: string;
  refleksi4F: {
    fact: {
      pertanyaan: string;
      contohPemandu: string;
    };
    feeling: {
      pertanyaan: string;
      contohPemandu: string;
    };
    finding: {
      pertanyaan: string;
      contohPemandu: string;
    };
    future: {
      pertanyaan: string;
      contohPemandu: string;
    };
  };
  komitmenDiri: string[];
}

export interface CaseAnalysis {
  ringkasanKasus: string;
  karakteristikRemaja: string;
  hipotesisDinamika: string;
  rekomendasiPendekatan: string;
  tahapanKonseling: Array<{
    tahap: string;
    deskripsi: string;
  }>;
  pertanyaanKunciKonselor: string[];
  kolaborasiTripusat: {
    waliKelas: string;
    orangTua: string;
    temanSebaya: string;
  };
  kodeEtikDanKerahasiaan: string;
}
