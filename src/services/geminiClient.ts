import { GoogleGenAI } from '@google/genai';
import { RPLData, CaseAnalysis, LKPDData } from '../types';
import { DEFAULT_RPL } from '../data/constants';

// Retrieve active API Key from localStorage or import.meta.env.VITE_GEMINI_API_KEY
export function getActiveApiKey(): string {
  const customKey = localStorage.getItem('bk_gemini_api_key');
  if (customKey && customKey.trim()) {
    return customKey.trim();
  }
  return (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
}

export function setActiveApiKey(key: string): void {
  if (key && key.trim()) {
    localStorage.setItem('bk_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('bk_gemini_api_key');
  }
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = getActiveApiKey();
  if (!apiKey) {
    throw new Error(
      'Gemini API Key belum diatur. Silakan klik tombol "Pengaturan API Key" di pojok kanan atas untuk memasukkan API Key Anda.'
    );
  }
  return new GoogleGenAI({ apiKey });
}

// Client-side RPL Generation
export async function generateRPLClient(params: {
  kelas: string;
  bidang: string;
  fungsi: string;
  topik: string;
  alokasiWaktu: string;
  pendekatan: string;
  tujuanTambahan?: string;
}): Promise<RPLData> {
  const { kelas, bidang, fungsi, topik, alokasiWaktu, pendekatan, tujuanTambahan } = params;
  const ai = getGeminiClient();

  const systemPrompt = `Anda adalah Dosen Ahli dan Konselor Senior Bimbingan dan Konseling (BK) jenjang Sekolah Menengah Pertama (SMP) / Fase D di Indonesia yang menguasai Standar Kurikulum Nasional Terbaru (Pendekatan Deep Learning: Mindful, Meaningful, dan Joyful Learning; Permendikbudristek Layanan BK SMP Fase D), Standar Kompetensi Kemandirian Peserta Didik (SKKPD SMP), dan Alur ARKA (Aktivitas Bermakna, Refleksi Kritis, Konseptualisasi, dan Aplikasi/Aksi Nyata).
Tugas Anda adalah menghasilkan dokumen Rencana Pelaksanaan Layanan (RPL) Bimbingan Klasikal resmi, operasional, berorientasi Deep Learning, dan siap cetak. Output HARUS berupa format JSON murni tanpa markdown codeblock backticks jika memungkinkan, atau JSON valid.`;

  const userPrompt = `Buatkan RPL Bimbingan Klasikal SMP Fase D yang komprehensif berstandar Kurikulum Nasional Terbaru (Deep Learning) dengan parameter berikut:
- Sasaran: ${kelas} (Fase D SMP)
- Bidang Layanan: ${bidang}
- Fungsi Layanan: ${fungsi}
- Topik / Tema: "${topik}"
- Alokasi Waktu: ${alokasiWaktu}
- Pendekatan/Model: Pendekatan Deep Learning (Mindful, Meaningful, Joyful Learning) berbasis Alur ARKA
${tujuanTambahan ? `- Catatan Khusus/Tujuan Tambahan: ${tujuanTambahan}` : ''}

Format output JSON harus memiliki struktur:
{
  "topik": string,
  "kelas": string,
  "fase": "Fase D (SMP)",
  "bidang": string,
  "fungsi": string,
  "alokasiWaktu": string,
  "pendekatan": "Pendekatan Deep Learning (Mindful, Meaningful, Joyful Learning) berbasis Alur ARKA",
  "pendekatanDeepLearning": {
    "mindfulLearning": string, // Uraian penerapan Mindful Learning (Pembelajaran Berkesadaran: hadir utuh, STOP technique, regulasi atensi/emosi)
    "meaningfulLearning": string, // Uraian penerapan Meaningful Learning (Pembelajaran Bermakna: mengaitkan topik dengan realitas autentik remaja SMP & nilai batin)
    "joyfulLearning": string // Uraian penerapan Joyful Learning (Pembelajaran Menyenangkan: iklim psikologis aman, positif, menggugah antusiasme)
  },
  "skkpd": string, // Aspek perkembangan SKKPD SMP yang relevan dan definisinya
  "profilPelajarPancasila": string[], // 2-3 dimensi Profil Pelajar Pancasila yang relevan
  "capaianLayanan": string, // Capaian layanan BK fase D yang sesuai
  "tujuanUmum": string,
  "tujuanKhusus": string[], // 3 butir (Kognitif C4, Afektif A3, Psikomotorik P3)
  "materiPokok": string[], // 4 butir materi inti bimbingan
  "mediaDanAlat": string,
  "metode": string,
  "langkahKegiatan": {
    "tahapAwal": {
      "waktu": string,
      "kegiatan": string[] // 4 poin pendahuluan (salam hangat, apersepsi Mindful/Joyful, tujuan Meaningful, kontrak belajar)
    },
    "tahapInti": {
      "waktu": string,
      "alurARKA": {
        "aktivitas": string, // Aktivitas Bermakna (Meaningful Activity): simulasi/kasus kontekstual yang berkesan
        "refleksi": string, // Refleksi Kritis (Critical Reflection): pertanyaan olah rasa & penggugah insight mendalam
        "konseptualisasi": string, // Konseptualisasi: internalisasi konsep kunci bimbingan
        "aplikasi": string // Aplikasi / Aksi Nyata (Real Action Application): deklarasi komitmen nyata konseli
      }
    },
    "tahapPenutup": {
      "waktu": string,
      "kegiatan": string[] // 4 poin penutup (sintesis makna, asesmen refleksi 4F, afirmasi penguatan, doa)
    }
  },
  "asesmen": {
    "asesmenProses": string[], // 4 indikator asesmen proses (keterlibatan, iklim kelas aman, antusiasme, alokasi waktu)
    "asesmenHasil": {
      "understanding": string, // Pengukuran pemahaman baru (U)
      "comfortable": string, // Pengukuran kenyamanan & rasa aman (C)
      "action": string // Pengukuran rencana aksi nyata (A)
    }
  },
  "evaluasi": {
    "evaluasiProses": string[],
    "evaluasiHasil": string[]
  },
  "tindakLanjut": string
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
    },
  });

  const textOutput = response.text || '';
  try {
    return JSON.parse(textOutput);
  } catch {
    const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }
}

// Client-side Case Consultation
export async function consultCaseClient(params: {
  kasus: string;
  kelas: string;
  bidang: string;
  fokus: string;
}): Promise<CaseAnalysis> {
  const { kasus, kelas, bidang, fokus } = params;
  const ai = getGeminiClient();

  const systemPrompt = `Anda adalah Dosen / Pakar Bimbingan dan Konseling Spesialis Remaja SMP (Fase D) bersertifikasi ABKIN. Anda memberikan bimbingan klinis & pedagogis kepada Guru BK sekolah yang sedang menangani kasus peserta didik.
Berikan panduan komprehensif, empatik, berbasis bukti psikologis remaja, dan berorientasi solusi praktis.
Keluarkan respon dalam format JSON murni.`;

  const userPrompt = `Berikut studi kasus peserta didik SMP:
- Sasaran: ${kelas}
- Bidang: ${bidang}
- Layanan/Fokus: ${fokus}
- Deskripsi Kasus: "${kasus}"

Berikan analisa dan rekomendasi profesional dalam format JSON:
{
  "ringkasanKasus": string,
  "karakteristikRemaja": string,
  "hipotesisDinamika": string,
  "rekomendasiPendekatan": string,
  "tahapanKonseling": [
    {
      "tahap": string,
      "deskripsi": string
    }
  ],
  "pertanyaanKunciKonselor": string[],
  "kolaborasiTripusat": {
    "waliKelas": string,
    "orangTua": string,
    "temanSebaya": string
  },
  "kodeEtikDanKerahasiaan": string
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
    },
  });

  const textOutput = response.text || '';
  try {
    return JSON.parse(textOutput);
  } catch {
    const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }
}

// Client-side LKPD Generation
export async function generateLKPDClient(params: {
  topik: string;
  kelas: string;
  bidang: string;
}): Promise<LKPDData> {
  const { topik, kelas, bidang } = params;
  const ai = getGeminiClient();

  const systemPrompt = `Anda adalah Konselor Sekolah Ahli yang merancang Lembar Kerja Peserta Didik (LKPD) Bimbingan dan Konseling jenjang SMP berbasis Model Refleksi 4F (Fact, Feeling, Finding, Future) yang ramah anak, komunikatif, dan memicu kesadaran diri peserta didik remaja. Keluarkan respon dalam JSON murni.`;

  const userPrompt = `Buatkan konten LKPD Refleksi Diri 4F untuk:
- Topik: "${topik}"
- Sasaran: ${kelas}
- Bidang: ${bidang}

Format JSON:
{
  "topik": string,
  "kelas": string,
  "bidang": string,
  "instruksiSiswa": string,
  "refleksi4F": {
    "fact": {
      "pertanyaan": string,
      "contohPemandu": string
    },
    "feeling": {
      "pertanyaan": string,
      "contohPemandu": string
    },
    "finding": {
      "pertanyaan": string,
      "contohPemandu": string
    },
    "future": {
      "pertanyaan": string,
      "contohPemandu": string
    }
  },
  "komitmenDiri": string[]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
    },
  });

  const textOutput = response.text || '';
  try {
    return JSON.parse(textOutput);
  } catch {
    const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }
}
