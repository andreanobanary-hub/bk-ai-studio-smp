import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health / Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
    version: '1.0.0',
  });
});

// Fallback generator for RPL if offline or no API key
function getFallbackRPL(params: {
  kelas: string;
  bidang: string;
  fungsi: string;
  topik: string;
  alokasiWaktu: string;
  pendekatan: string;
}) {
  const { kelas, bidang, fungsi, topik, alokasiWaktu, pendekatan } = params;
  return {
    topik: topik || 'Membangun Pertemanan Sehat & Regulasi Emosi di SMP',
    kelas,
    fase: 'Fase D (SMP)',
    bidang,
    fungsi,
    alokasiWaktu,
    pendekatan,
    skkpd: `Kematangan Hubungan dengan Teman Sebaya & Kematangan Emosi (Mampu membina relasi pertemanan positif dan mengendalikan gejolak emosi di lingkungan sekolah)`,
    profilPelajarPancasila: ['Mandiri', 'Bergotong Royong', 'Bernalar Kritis'],
    capaianLayanan: `Peserta didik mampu memahami nilai-nilai positif dalam pertemanan sebaya, mengidentifikasi faktor risiko konflik atau perundungan, serta menunjukkan perilaku saling menghargai dan regulasi diri yang sehat di kelas ${kelas}.`,
    tujuanUmum: `Peserta didik kelas ${kelas} SMP mampu mengembangkan pemahaman diri dan keterampilan sosial untuk mempraktikkan pertemanan yang sehat serta menyelesaikan masalah pergaulan secara bijak.`,
    tujuanKhusus: [
      `1. Peserta didik dapat menganalisis karakteristik ${topik} dalam kehidupan sehari-hari (Kognitif/C4)`,
      `2. Peserta didik dapat mengekspresikan komitmen dan sikap saling menghargai perbedaan antar teman sebaya (Afektif/A3)`,
      `3. Peserta didik dapat mendemonstrasikan tindakan nyata menciptakan lingkungan kelas yang suportif dan bebas perundungan (Psikomotorik/P3)`
    ],
    materiPokok: [
      `Pengertian dan esensi penting ${topik} bagi remaja Fase D`,
      `Ciri-ciri relasi yang sehat vs relasi toksik/berisiko`,
      `Langkah praktis menerapkan nilai ${topik} dalam keseharian di SMP`,
      `Tips mengelola emosi dan komunikasi asertif saat terjadi perbedaan pendapat`
    ],
    mediaDanAlat: 'Slide Presentasi Interaktif, Kartu Studi Kasus Teman Sebaya, Lembar Kerja Refleksi 4F, LCD Projector & Papan Tulis',
    metode: 'Experiential Learning berbasis Alur ARKA (Aktivitas, Refleksi, Konseptualisasi, Aplikasi), Diskusi Kelompok, Curah Pendapat',
    langkahKegiatan: {
      tahapAwal: {
        waktu: '10 Menit',
        kegiatan: [
          'Guru BK menyapa peserta didik dengan hangat, memimpin doa bersama, dan memeriksa kehadiran siswa.',
          'Melakukan apersepsi dan ice breaking pembakar semangat "Tepuk Fokus & Salam Harmoni BK".',
          'Guru BK menyampaikan topik materi layanan dan tujuan yang hendak dicapai.',
          'Menjelaskan alur pembelajaran ARKA dan membangun kontrak belajar yang menyenangkan dan saling menghormati.'
        ]
      },
      tahapInti: {
        waktu: '25 Menit',
        alurARKA: {
          aktivitas: 'Guru BK membagi siswa menjadi 5 kelompok kecil dan menyajikan simulasi kartu cerita / video singkat studi kasus dinamika pergaulan remaja.',
          refleksi: 'Guru BK memandu sesi tanya jawab reflektif: "Apa yang kalian rasakan jika berada di posisi tokoh tersebut?", "Mengapa hal itu bisa terjadi?", "Pelajaran apa yang paling bermakna bagi diri kita?"',
          konseptualisasi: 'Guru BK memberikan penguatan konsep inti materi, meluruskan miskonsepsi remaja tentang pertemanan/isu yang dibahas, serta merumuskan prinsip-prinsip kunci bersama siswa.',
          aplikasi: 'Setiap kelompok menyusun "Komitmen Lingkaran Baik" atau rancangan aksi nyata yang akan dipraktikkan langsung di kelas dan lingkungan sekolah.'
        }
      },
      tahapPenutup: {
        waktu: '5 Menit',
        kegiatan: [
          'Guru BK mengajak 2-3 perwakilan siswa menyimpulkan inti pembelajaran hari ini.',
          'Peserta didik mengisi lembar refleksi diri cepat (LKPD 4F).',
          'Guru BK memberikan apresiasi atas antusiasme seluruh siswa dan menyampaikan materi pertemuan berikutnya.',
          'Doa penutup dan salam hangat konseling.'
        ]
      }
    },
    evaluasi: {
      evaluasiProses: [
        'Antusiasme dan keaktifan peserta didik selama alur kegiatan ARKA',
        'Kekompakan dan partisipasi berpendapat dalam diskusi kelompok',
        'Sikap saling menghargai saat teman lain mengemukakan pendapat',
        'Kesesuaian alokasi waktu dan efektivitas penggunaan media layanan'
      ],
      evaluasiHasil: [
        'Understanding: Pemahaman peserta didik terhadap materi diukur melalui tes lisan/kuis singkat',
        'Comfortable: Rasa nyaman dan penerimaan diri yang ditunjukkan pada instrumen kepuasan layanan',
        'Action: Rencana aksi konkret yang dituliskan peserta didik pada LKPD Refleksi'
      ]
    },
    tindakLanjut: 'Bagi peserta didik yang memerlukan pendalaman materi atau memiliki kendala sosial khusus, Guru BK akan menjadwalkan sesi Bimbingan Kelompok atau Konseling Individual.'
  };
}

// Endpoint: Generate RPL BK SMP
app.post('/api/generate-rpl', async (req, res) => {
  try {
    const {
      kelas = 'Kelas 7 SMP',
      bidang = 'Sosial',
      fungsi = 'Pencegahan',
      topik = 'Membangun Pertemanan Sehat & Anti-Bullying',
      alokasiWaktu = '1 x 40 menit',
      pendekatan = 'Alur ARKA (Aktivitas, Refleksi, Konseptualisasi, Aplikasi)',
      tujuanTambahan = '',
    } = req.body;

    if (!ai) {
      const fallback = getFallbackRPL({ kelas, bidang, fungsi, topik, alokasiWaktu, pendekatan });
      return res.json({ source: 'curated_pedagogical_template', rpl: fallback });
    }

    const systemPrompt = `Anda adalah Dosen Ahli dan Konselor Senior Bimbingan dan Konseling (BK) jenjang Sekolah Menengah Pertama (SMP) / Fase D di Indonesia yang sangat menguasai Kurikulum Merdeka, Standar Kompetensi Kemandirian Peserta Didik (SKKPD SMP), dan model Experiential Learning berbasis alur ARKA (Aktivitas, Refleksi, Konseptualisasi, Aplikasi).
Tugas Anda adalah menghasilkan dokumen Rencana Pelaksanaan Layanan (RPL) Bimbingan Klasikal resmi, lengkap, operasional, dan siap cetak. Output HARUS berupa format JSON murni tanpa markdown pembungkus codeblock backticks jika memungkinkan, atau JSON valid.`;

    const userPrompt = `Buatkan RPL Bimbingan Klasikal SMP Fase D yang komprehensif dengan parameter berikut:
- Sasaran: ${kelas} (Fase D)
- Bidang Layanan: ${bidang}
- Fungsi Layanan: ${fungsi}
- Topik / Tema: "${topik}"
- Alokasi Waktu: ${alokasiWaktu}
- Pendekatan/Model: ${pendekatan}
${tujuanTambahan ? `- Catatan Khusus/Tujuan Tambahan: ${tujuanTambahan}` : ''}

Format output JSON harus memiliki struktur:
{
  "topik": string,
  "kelas": string,
  "fase": "Fase D (SMP)",
  "bidang": string,
  "fungsi": string,
  "alokasiWaktu": string,
  "pendekatan": string,
  "skkpd": string, // Aspek perkembangan SKKPD SMP yang relevan dan definisinya
  "profilPelajarPancasila": string[], // 2-3 dimensi P3 yang relevan
  "capaianLayanan": string, // Capaian layanan BK fase D yang sesuai
  "tujuanUmum": string,
  "tujuanKhusus": string[], // 3 butir (Kognitif C4, Afektif A3, Psikomotorik P3)
  "materiPokok": string[], // 4 butir materi inti
  "mediaDanAlat": string,
  "metode": string,
  "langkahKegiatan": {
    "tahapAwal": {
      "waktu": string,
      "kegiatan": string[] // 4 poin pendahuluan (salam, apersepsi/ice breaking, tujuan, kontrak belajar)
    },
    "tahapInti": {
      "waktu": string,
      "alurARKA": {
        "aktivitas": string, // Simulasi / Permainan / Analisis kasus yang seru untuk siswa SMP
        "refleksi": string, // Pertanyaan menggugah rasa & pemaknaan
        "konseptualisasi": string, // Penanaman teori/konsep kunci
        "aplikasi": string // Praktik nyata / lembar komitmen
      }
    },
    "tahapPenutup": {
      "waktu": string,
      "kegiatan": string[] // 4 poin penutup
    }
  },
  "evaluasi": {
    "evaluasiProses": string[], // 4 indikator proses
    "evaluasiHasil": string[] // 3 indikator hasil (Understanding, Comfortable, Action)
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
    let parsedData;
    try {
      parsedData = JSON.parse(textOutput);
    } catch {
      // Clean possible backticks
      const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({ source: 'gemini_3.8_flash', rpl: parsedData });
  } catch (error: any) {
    console.error('Error generating RPL via Gemini:', error);
    // fallback gracefully
    const fallback = getFallbackRPL({
      kelas: req.body.kelas || 'Kelas 7 SMP',
      bidang: req.body.bidang || 'Pribadi',
      fungsi: req.body.fungsi || 'Pemahaman',
      topik: req.body.topik || 'Pengembangan Diri Remaja SMP',
      alokasiWaktu: req.body.alokasiWaktu || '1 x 40 menit',
      pendekatan: req.body.pendekatan || 'Alur ARKA',
    });
    return res.json({
      source: 'fallback_due_to_error',
      error: error.message,
      rpl: fallback,
    });
  }
});

// Endpoint: Konsultasi Kasus Konselor
app.post('/api/consult-case', async (req, res) => {
  try {
    const { kasus, kelas = 'Kelas 8 SMP', bidang = 'Sosial', fokus = 'Konseling Individual' } = req.body;

    if (!kasus || kasus.trim().length === 0) {
      return res.status(400).json({ error: 'Deskripsi kasus wajib diisi' });
    }

    if (!ai) {
      // Curated expert response if no key
      return res.json({
        source: 'curated_expert_model',
        analysis: {
          ringkasanKasus: `Studi Kasus Peserta Didik ${kelas} (${bidang}) mengenai: ${kasus.slice(0, 100)}...`,
          karakteristikRemaja: 'Peserta didik berada pada fase perkembangan remaja awal (Fase D) di mana penerimaan kelompok sebaya (peer group), pembentukan identitas diri, dan stabilitas emosi masih dalam masa peralihan yang labil.',
          hipotesisDinamika: 'Terdapat kesenjangan antara kebutuhan psikologis siswa (rasa dihargai, otonomi, validasi) dengan kondisi lingkungan nyata atau stresor akademik yang memicu mekanisme pertahanan diri maladaptif.',
          rekomendasiPendekatan: 'Pendekatan SFBC (Solution-Focused Brief Counseling) dipadukan dengan Cognitive Restructuring dan WDEP (Wants, Direction, Evaluation, Plan) dari Terapi Realitas.',
          tahapanKonseling: [
            {
              tahap: '1. Membangun Hubungan (Rapport & Attending)',
              deskripsi: 'Ciptakan suasana hangat, tanpa menghakimi, dan tekankan asas kerahasiaan (Kode Etik ABKIN). Akui perasaan yang sedang dialami konseli.'
            },
            {
              tahap: '2. Eksplorasi Masalah & Skala Emosi',
              deskripsi: 'Gunakan pertanyaan berskala 1-10: "Jika 1 adalah sangat tertekan dan 10 adalah sangat tenang, di angka berapakah kamu sekarang?"'
            },
            {
              tahap: '3. Identifikasi Pengecualian (Exception Questions)',
              deskripsi: 'Gali momen saat masalah tidak terjadi: "Kapan terakhir kali kamu merasa bersemangat dan nyaman di sekolah? Apa yang berbeda saat itu?"'
            },
            {
              tahap: '4. Merumuskan Rencana Aksi Kecil (SMART Plan)',
              deskripsi: 'Ajak konseli menyepakati satu langkah konkret pertama yang bisa dilakukan dalam 48 jam ke depan.'
            }
          ],
          pertanyaanKunciKonselor: [
            '"Jika ada keajaiban malam ini dan saat kamu bangun esok hari masalah ini mereda, tanda apa yang pertama kali kamu rasakan?"',
            '"Siapa sosok di sekolah atau di rumah yang paling membuatmu merasa didengarkan?"',
            '"Apa yang paling kamu butuhkan dari Ibu/Bapak Guru BK saat ini?"'
          ],
          kolaborasiTripusat: {
            waliKelas: 'Koordinasi pemantauan harian di kelas tanpa membuka rahasia pribadi siswa yang sensitif.',
            orangTua: 'Komunikasi asertif mengenai dukungan pengasuhan di rumah, mengurangi pola menyalahkan, dan meningkatkan kelekatan emosional.',
            temanSebaya: 'Memberdayakan teman sebaya positif (peer counselor / sahabat kelas) untuk mendampingi.'
          },
          kodeEtikDanKerahasiaan: 'Jaga kerahasiaan penuh sesuai Kode Etik Profesi Bimbingan dan Konseling Indonesia (ABKIN), kecuali terdapat indikasi bahaya fisik mendesak terhadap diri konseli atau orang lain.'
        }
      });
    }

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
  "karakteristikRemaja": string, // Karakteristik psikologis perkembangan remaja SMP terkait isu ini
  "hipotesisDinamika": string, // Dinamika psikologis dan faktor pemicu (internal/eksternal)
  "rekomendasiPendekatan": string, // Pendekatan konseling (SFBC, CBT, REBT, Realitas WDEP, dll) beserta alasannya
  "tahapanKonseling": [
    {
      "tahap": string,
      "deskripsi": string
    }
  ],
  "pertanyaanKunciKonselor": string[], // 3-4 pertanyaan penggugah insight yang bisa diajukan Guru BK ke siswa
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
    let parsedData;
    try {
      parsedData = JSON.parse(textOutput);
    } catch {
      const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({ source: 'gemini_3.8_flash', analysis: parsedData });
  } catch (error: any) {
    console.error('Error in case consultation:', error);
    return res.status(500).json({ error: error.message || 'Gagal memproses konsultasi kasus' });
  }
});

// Endpoint: Generate LKPD 4F Otomatis
app.post('/api/generate-lkpd', async (req, res) => {
  try {
    const { topik = 'Membangun Pertemanan Sehat', kelas = 'Kelas 7 SMP', bidang = 'Sosial' } = req.body;

    if (!ai) {
      return res.json({
        topik,
        kelas,
        bidang,
        instruksiSiswa: `Halo Sahabat Konseli! Isilah lembar refleksi 4F ini secara jujur dan terbuka. Tidak ada jawaban benar atau salah, yang terpenting adalah apa yang kamu rasakan dan pelajari untuk perkembangan dirimu!`,
        refleksi4F: {
          fact: {
            pertanyaan: `Ceritakan peristiwa atau pengalaman nyata yang pernah kamu alami terkait "${topik}" di lingkungan sekolah atau rumah!`,
            contohPemandu: 'Contoh: Saya pernah merasa bingung saat ada teman mengajak menyindir teman lain di media sosial...'
          },
          feeling: {
            pertanyaan: `Bagaimana perasaanmu saat peristiwa itu terjadi, dan apa yang kamu rasakan setelah mengikuti layanan bimbingan hari ini?`,
            contohPemandu: 'Contoh: Awalnya saya merasa cemas dan ragu, namun sekarang saya merasa lebih lega dan berani bersikap asertif...'
          },
          finding: {
            pertanyaan: `Pelajaran berharga atau insight baru apa yang kamu temukan tentang dirimu dan orang lain?`,
            contohPemandu: 'Contoh: Saya menyadari bahwa pertemanan yang sehat adalah saling menghargai privasi dan tidak memaksakan kehendak...'
          },
          future: {
            pertanyaan: `Tuliskan 2 aksi nyata yang akan kamu praktikkan mulai minggu ini untuk menjadi pribadi yang lebih baik!`,
            contohPemandu: 'Contoh: 1) Menyapa teman yang sedang sendirian di kelas; 2) Membatasi bermain game maksimal 1 jam sehari...'
          }
        },
        komitmenDiri: [
          'Saya berjanji akan menghormati batas dan perasaan teman sebaya saya.',
          'Saya bersedia meminta bantuan kepada Guru BK jika menghadapi masalah yang sulit diselesaikan sendiri.'
        ]
      });
    }

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
  "komitmenDiri": string[] // 2 butir kalimat komitmen diri
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
    let parsedData;
    try {
      parsedData = JSON.parse(textOutput);
    } catch {
      const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating LKPD:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[BK AI STUDIO SMP] Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
