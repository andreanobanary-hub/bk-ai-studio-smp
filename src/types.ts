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
  profilPelajarPancasila: string[];
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
  pilihan1Id: number;
  pilihan2Id: number;
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
