import { ClassRoom, StudentPeer, LKPDSubmission, CounselingCaseEntry, RPLData, IKMSSummary, IKMSItem } from '../types';
import { INITIAL_CLASSES, DEFAULT_RPL, STANDARD_IKMS_ITEMS } from '../data/constants';

const STORAGE_KEY_CLASSES = 'bk_smp_classes';
const STORAGE_KEY_LKPD = 'bk_smp_lkpd_submissions';
const STORAGE_KEY_CASES = 'bk_smp_case_entries';
const STORAGE_KEY_RPL = 'bk_smp_rpl_data';
const STORAGE_KEY_ACTIVE_CLASS = 'bk_smp_active_class_id';

// ====================== CLASS & STUDENT PERSISTENCE ======================
export function loadClasses(): ClassRoom[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLASSES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load classes from localStorage:', e);
  }
  return INITIAL_CLASSES;
}

export function saveClasses(classes: ClassRoom[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
  } catch (e) {
    console.error('Failed to save classes to localStorage:', e);
  }
}

export function loadActiveClassId(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_CLASS);
    if (saved) return saved;
  } catch (e) {
    console.error(e);
  }
  return INITIAL_CLASSES[0].id;
}

export function saveActiveClassId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_CLASS, id);
  } catch (e) {
    console.error(e);
  }
}

// ====================== LKPD SUBMISSIONS PERSISTENCE ======================
export function loadLKPDSubmissions(): LKPDSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LKPD);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load LKPD submissions:', e);
  }
  return [
    {
      id: 'lkpd-demo-1',
      tipe: 'Individu',
      namaSiswaAtauKelompok: 'Dinda Ayu Maharani',
      kelas: 'Kelas 7-A',
      tanggal: '2026-10-08',
      topik: 'Membangun Pertemanan Sehat & Anti-Bullying',
      fact: 'Saya pernah melihat teman satu kelompok diejek karena salah menjawab pertanyaan di depan kelas dan tidak ada yang membela.',
      feeling: 'Saat itu saya merasa serba salah dan kasihan, namun setelah layanan hari ini saya merasa lebih percaya diri dan ingin menjadi pembela teman (Upstander).',
      finding: 'Saya menyadari bahwa diam saat melihat teman dibully sama saja membiarkan keburukan terjadi. Sahabat sejati harus saling melindungi dan menghargai martabat sesama.',
      future: '1) Menyapa dan mengajak teman yang sedang menyendiri untuk bergabung; 2) Berani menegur secara santun jika ada teman yang mengejek nama orang tua.',
      komitmen: [
        'Saya berkomitmen menciptakan iklim pertemanan kelas yang aman tanpa ejekan.',
        'Saya berani berkonsultasi kepada Guru BK jika ada masalah yang mengganggu.'
      ],
      catatanKonselor: 'Refleksi sangat mendalam dan menunjukkan empati matang sebagai calon konselor sebaya.',
      parafKonselor: true,
    }
  ];
}

export function saveLKPDSubmissions(submissions: LKPDSubmission[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LKPD, JSON.stringify(submissions));
  } catch (e) {
    console.error('Failed to save LKPD submissions:', e);
  }
}

// ====================== CASE LOGS PERSISTENCE ======================
export function loadCaseEntries(): CounselingCaseEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CASES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load case entries:', e);
  }
  return [
    {
      id: 'case-demo-1',
      tanggal: '2026-10-07',
      namaSiswaInisial: 'AM (Siswi)',
      kelas: 'Kelas 7 SMP',
      bidang: 'Sosial',
      fokus: 'Konseling Individual & Mediasi Sebaya',
      deskripsiKasus: 'Siswi menarik diri dan sering menangis di pojok kelas akibat foto ekspresinya diedit menjadi meme/stiker ejekan di grup WhatsApp kelas.',
      statusPenanganan: 'Proses Konseling',
      catatanTindakLanjut: 'Sesi konseling tahap 1 (stabilisasi emosi) selesai. Rencana mediasi restoratif dengan admin grup WA dijadwalkan besok.',
      analysis: {
        ringkasanKasus: 'Siswi Kelas 7 (Inisial AM) menarik diri akibat perundungan siber (cyberbullying) foto stiker di grup WhatsApp kelas.',
        karakteristikRemaja: 'Remaja Fase D (usia 12-14 tahun) memiliki kepekaan tinggi terhadap penerimaan teman sebaya. Pelecehan reputasi sosial memicu rasa malu toksik.',
        hipotesisDinamika: 'Konseli mengalami kecemasan sosial akut akibat runtuhnya rasa aman psikologis di kelas.',
        rekomendasiPendekatan: 'SFBC (Solution-Focused Brief Counseling) dipadukan dengan Mediasi Restoratif untuk pelaku serta psikoedukasi kelas.',
        tahapanKonseling: [
          { tahap: '1. Rapport & Stabilisasi Emosi', deskripsi: 'Validasi perasaan konseli dan jamin kerahasiaan penuh.' },
          { tahap: '2. Eksplorasi Skala Masalah', deskripsi: 'Gunakan scaling question 1-10 untuk mengukur tingkat kecemasan.' },
          { tahap: '3. Formulasi Solusi & Safety Plan', deskripsi: 'Beri jeda istirahat dari grup WA dan fasilitasi komunikasi positif.' }
        ],
        pertanyaanKunciKonselor: [
          'Jika besok pagi kamu masuk ke kelas dengan perasaan aman, apa tanda pertama yang kamu rasakan?',
          'Siapa teman di kelas yang saat ini paling membuatmu merasa nyaman?'
        ],
        kolaborasiTripusat: {
          waliKelas: 'Penataan kembali norma komunikasi di grup WhatsApp kelas.',
          orangTua: 'Pendampingan ramah remaja di rumah tanpa menghakimi.',
          temanSebaya: 'Menghubungkan dengan 2 peer buddies yang suportif.'
        },
        kodeEtikDanKerahasiaan: 'Patuhi asas kerahasiaan Kode Etik ABKIN.'
      }
    }
  ];
}

export function saveCaseEntries(entries: CounselingCaseEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save case entries:', e);
  }
}

// ====================== RPL DATA PERSISTENCE ======================
export function loadRPLData(): RPLData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RPL);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load RPL data:', e);
  }
  return DEFAULT_RPL;
}

export function saveRPLData(rpl: RPLData): void {
  try {
    localStorage.setItem(STORAGE_KEY_RPL, JSON.stringify(rpl));
  } catch (e) {
    console.error('Failed to save RPL data:', e);
  }
}

// ====================== DYNAMIC IKMS CALCULATION ======================
export function calculateDynamicIKMSSummaries(students: StudentPeer[]): IKMSSummary[] {
  const totalStudents = students.length;
  if (totalStudents === 0) {
    return [
      { bidang: 'Pribadi', persentase: 0, jumlahPemilih: 0, totalRespons: 0, warna: 'bg-blue-600', deskripsi: 'Belum ada data respons siswa.', topIssues: [] },
      { bidang: 'Sosial', persentase: 0, jumlahPemilih: 0, totalRespons: 0, warna: 'bg-indigo-600', deskripsi: 'Belum ada data respons siswa.', topIssues: [] },
      { bidang: 'Belajar', persentase: 0, jumlahPemilih: 0, totalRespons: 0, warna: 'bg-emerald-600', deskripsi: 'Belum ada data respons siswa.', topIssues: [] },
      { bidang: 'Karier', persentase: 0, jumlahPemilih: 0, totalRespons: 0, warna: 'bg-amber-600', deskripsi: 'Belum ada data respons siswa.', topIssues: [] },
    ];
  }

  const bidangList: Array<'Pribadi' | 'Sosial' | 'Belajar' | 'Karier'> = ['Pribadi', 'Sosial', 'Belajar', 'Karier'];
  const colors: Record<string, string> = {
    Pribadi: 'bg-blue-600',
    Sosial: 'bg-indigo-600',
    Belajar: 'bg-emerald-600',
    Karier: 'bg-amber-600',
  };
  const descriptions: Record<string, string> = {
    Pribadi: 'Regulasi emosi, kepercayaan diri, citra diri, dan manajemen gawai/sosmed',
    Sosial: 'Dinamika pertemanan sebaya, adaptasi, komunikasi asertif, pencegahan bullying',
    Belajar: 'Strategi belajar mandiri, konsentrasi, penuntasan tugas & kecemasan ujian',
    Karier: 'Eksplorasi bakat minat, cita-cita masa depan, pemahaman peminatan SMA vs SMK',
  };

  return bidangList.map((bidang) => {
    const itemsInBidang = STANDARD_IKMS_ITEMS.filter((i) => i.bidang === bidang);
    const itemCounts: Record<number, number> = {};
    itemsInBidang.forEach((i) => {
      itemCounts[i.id] = 0;
    });

    let studentsWithAnyInBidang = 0;
    let totalCheckedInBidang = 0;

    students.forEach((st) => {
      const resp = st.ikmsResponses || [];
      let hasInBidang = false;
      resp.forEach((itemId) => {
        if (itemCounts[itemId] !== undefined) {
          itemCounts[itemId]++;
          totalCheckedInBidang++;
          hasInBidang = true;
        }
      });
      if (hasInBidang) {
        studentsWithAnyInBidang++;
      }
    });

    // percentage of students in class reporting need in this domain
    const persentase = totalStudents > 0 ? Math.round((studentsWithAnyInBidang / totalStudents) * 100) : 0;

    // Rank top issues in this domain
    const topIssues = itemsInBidang
      .map((item) => ({
        id: item.id,
        pernyataan: item.pernyataan,
        count: itemCounts[item.id] || 0,
        persentase: totalStudents > 0 ? Math.round(((itemCounts[item.id] || 0) / totalStudents) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      bidang,
      persentase,
      jumlahPemilih: studentsWithAnyInBidang,
      totalRespons: totalCheckedInBidang,
      warna: colors[bidang],
      deskripsi: descriptions[bidang],
      topIssues,
    };
  });
}

// ====================== CSV & EXCEL IMPORT HELPER ======================
export function parseStudentsFromText(
  rawText: string,
  startId: number = 1
): { students: StudentPeer[]; count: number } {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const results: StudentPeer[] = [];
  let currentId = startId;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check if header row like "No, Nama, Gender" or "Nama"
    const lower = line.toLowerCase();
    if (i === 0 && (lower.includes('nama') || lower.includes('name') || lower.includes('nisn'))) {
      continue;
    }

    // Split by comma, tab, or semicolon
    let parts = line.split(/[\t;,]/).map((p) => p.trim().replace(/^["']|["']$/g, ''));
    if (parts.length === 0 || !parts[0]) continue;

    // If first part is a number (like "1. Ahmad"), strip or shift
    let nama = parts[0];
    let gender: 'L' | 'P' = 'L';
    let nisn: string | undefined = undefined;

    // If part 0 is just an index (e.g., "1"), and part 1 has name
    if (/^\d+$/.test(parts[0]) && parts.length > 1) {
      nama = parts[1];
      if (parts.length > 2) {
        const gCandidate = parts[2].toUpperCase();
        if (gCandidate.startsWith('P') || gCandidate.startsWith('W') || gCandidate.includes('PEREMPUAN')) {
          gender = 'P';
        } else {
          gender = 'L';
        }
      }
      if (parts.length > 3) {
        nisn = parts[3];
      }
    } else {
      // Clean leading numbering like "1. Ahmad"
      nama = nama.replace(/^\d+[\.\)]\s*/, '');
      if (parts.length > 1) {
        const gCandidate = parts[1].toUpperCase();
        if (gCandidate.startsWith('P') || gCandidate.startsWith('W') || gCandidate.includes('PEREMPUAN')) {
          gender = 'P';
        } else if (gCandidate.startsWith('L') || gCandidate.includes('LAKI')) {
          gender = 'L';
        }
      }
      if (parts.length > 2) {
        nisn = parts[2];
      }
    }

    if (nama.trim()) {
      results.push({
        id: currentId++,
        nama: nama.trim(),
        gender,
        nisn,
        pilihan1Id: 0,
        pilihan2Id: 0,
        ikmsResponses: [],
      });
    }
  }

  return { students: results, count: results.length };
}

// ====================== GOOGLE SHEETS SYNC HELPER ======================
export async function syncGoogleSheetData(
  sheetUrl: string,
  existingStudents: StudentPeer[]
): Promise<{ updatedStudents: StudentPeer[]; newSubmissionsCount: number; message: string }> {
  let fetchUrl = sheetUrl.trim();

  // If user pasted Google Sheet edit URL, transform to export CSV URL
  // Example: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing
  const sheetIdMatch = fetchUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (sheetIdMatch && (fetchUrl.includes('google.com/spreadsheets') || fetchUrl.includes('docs.google.com'))) {
    const spreadsheetId = sheetIdMatch[1];
    // extract gid if present
    const gidMatch = fetchUrl.match(/[#&?]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : '0';
    fetchUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
  }

  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`Gagal mengunduh data (HTTP ${response.status}). Pastikan Google Sheet telah dipublikasikan ke web (File -> Bagikan -> Publikasikan ke Web -> CSV) atau link memiliki izin akses siapa saja.`);
  }

  const text = await response.text();

  // Parse CSV rows
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length <= 1) {
    return {
      updatedStudents: existingStudents,
      newSubmissionsCount: 0,
      message: 'Tidak ada baris data respon baru yang ditemukan pada Google Sheet.',
    };
  }

  // Work with existing students copy
  const studentMap = new Map<string, StudentPeer>();
  const idMap = new Map<number, StudentPeer>();
  existingStudents.forEach((s) => {
    studentMap.set(s.nama.toLowerCase().trim(), s);
    idMap.set(s.id, s);
  });

  let nextId = existingStudents.length > 0 ? Math.max(...existingStudents.map((s) => s.id)) + 1 : 1;
  let newSubmissionsCount = 0;

  // Header row index mapping
  const headerParts = lines[0].split(',').map((h) => h.replace(/^["']|["']$/g, '').toLowerCase().trim());
  const idxNama = headerParts.findIndex((h) => h.includes('nama') || h.includes('siswa') || h.includes('peserta'));
  const idxGender = headerParts.findIndex((h) => h.includes('gender') || h.includes('jenis kelamin') || h.includes('jk'));
  const idxPilihan1 = headerParts.findIndex((h) => h.includes('pilihan 1') || h.includes('teman 1') || h.includes('pilihan1'));
  const idxPilihan2 = headerParts.findIndex((h) => h.includes('pilihan 2') || h.includes('teman 2') || h.includes('pilihan2'));
  const idxIKMS = headerParts.findIndex((h) => h.includes('ikms') || h.includes('kebutuhan') || h.includes('masalah') || h.includes('angket'));

  const updatedStudents = [...existingStudents];

  for (let i = 1; i < lines.length; i++) {
    // Basic CSV row parse taking quotes into account
    const rowValues = parseCsvLine(lines[i]);
    if (rowValues.length === 0) continue;

    const rawName = idxNama !== -1 ? rowValues[idxNama] : rowValues[1] || rowValues[0];
    if (!rawName || !rawName.trim()) continue;

    const studentName = rawName.trim();
    let currentStudent = studentMap.get(studentName.toLowerCase());

    const rawGender = idxGender !== -1 ? rowValues[idxGender] : '';
    const gender: 'L' | 'P' = rawGender && (rawGender.toUpperCase().startsWith('P') || rawGender.toLowerCase().includes('perempuan')) ? 'P' : 'L';

    if (!currentStudent) {
      // New student found in sheet! Add to class
      currentStudent = {
        id: nextId++,
        nama: studentName,
        gender,
        pilihan1Id: 0,
        pilihan2Id: 0,
        ikmsResponses: [],
        submittedViaPortal: true,
        timestamp: new Date().toISOString(),
      };
      updatedStudents.push(currentStudent);
      studentMap.set(studentName.toLowerCase(), currentStudent);
      idMap.set(currentStudent.id, currentStudent);
      newSubmissionsCount++;
    }

    // Resolve Pilihan 1
    const p1Raw = idxPilihan1 !== -1 ? rowValues[idxPilihan1] : rowValues[2];
    if (p1Raw && p1Raw.trim()) {
      const matchP1 = findStudentByNameOrId(p1Raw.trim(), updatedStudents);
      if (matchP1 && matchP1.id !== currentStudent.id) {
        currentStudent.pilihan1Id = matchP1.id;
      }
    }

    // Resolve Pilihan 2
    const p2Raw = idxPilihan2 !== -1 ? rowValues[idxPilihan2] : rowValues[3];
    if (p2Raw && p2Raw.trim()) {
      const matchP2 = findStudentByNameOrId(p2Raw.trim(), updatedStudents);
      if (matchP2 && matchP2.id !== currentStudent.id) {
        currentStudent.pilihan2Id = matchP2.id;
      }
    }

    // Resolve IKMS items if any
    const ikmsRaw = idxIKMS !== -1 ? rowValues[idxIKMS] : '';
    if (ikmsRaw && ikmsRaw.trim()) {
      const itemsFound = parseIKMSItemsFromRawString(ikmsRaw);
      if (itemsFound.length > 0) {
        currentStudent.ikmsResponses = Array.from(new Set([...(currentStudent.ikmsResponses || []), ...itemsFound]));
      }
    }
  }

  return {
    updatedStudents,
    newSubmissionsCount,
    message: `Sinkronisasi berhasil! Memproses ${lines.length - 1} baris respon Google Sheets.`,
  };
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

function findStudentByNameOrId(query: string, students: StudentPeer[]): StudentPeer | undefined {
  const qClean = query.toLowerCase().trim();
  // check if number
  if (/^\d+$/.test(qClean)) {
    const id = parseInt(qClean, 10);
    const byId = students.find((s) => s.id === id);
    if (byId) return byId;
  }
  // exact name
  const exact = students.find((s) => s.nama.toLowerCase().trim() === qClean);
  if (exact) return exact;
  // partial contains
  return students.find((s) => s.nama.toLowerCase().includes(qClean) || qClean.includes(s.nama.toLowerCase()));
}

function parseIKMSItemsFromRawString(raw: string): number[] {
  const result: number[] = [];
  // Could be IDs like "101, 102, 201"
  const tokens = raw.split(/[,;\n]/).map((t) => t.trim());
  tokens.forEach((t) => {
    if (/^\d{3}$/.test(t)) {
      result.push(parseInt(t, 10));
    } else {
      // Find matching standard item by substring
      const matched = STANDARD_IKMS_ITEMS.find((it) => it.pernyataan.toLowerCase().includes(t.toLowerCase()));
      if (matched) result.push(matched.id);
    }
  });
  return result;
}
