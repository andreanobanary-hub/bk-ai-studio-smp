import React, { useState, useEffect } from 'react';
import { SchoolProfile, CaseAnalysis, CounselingCaseEntry } from '../types';
import { PRESET_KASUS_KONSELOR } from '../data/constants';
import { consultCaseClient, getActiveApiKey } from '../services/geminiClient';
import { loadCaseEntries, saveCaseEntries } from '../services/storageService';
import {
  MessageSquareHeart,
  Sparkles,
  Printer,
  Copy,
  Lightbulb,
  ShieldCheck,
  Users,
  Compass,
  FileText,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Bookmark,
  Trash2,
  FolderOpen,
  Calendar,
  Save,
} from 'lucide-react';

interface KonsultasiViewProps {
  profile: SchoolProfile;
  onShowToast: (msg: string) => void;
  onOpenApiKeyModal?: () => void;
}

export const KonsultasiView: React.FC<KonsultasiViewProps> = ({
  profile,
  onShowToast,
  onOpenApiKeyModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'consultation' | 'case_log'>('consultation');

  // Active Case Inputs
  const [namaInisial, setNamaInisial] = useState<string>('AM (Siswi)');
  const [kelas, setKelas] = useState<string>('Kelas 7 SMP');
  const [bidang, setBidang] = useState<string>('Sosial');
  const [fokus, setFokus] = useState<string>('Konseling Individual & Mediasi Sebaya');
  const [kasus, setKasus] = useState<string>(
    PRESET_KASUS_KONSELOR[0].deskripsi
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<CaseAnalysis | null>({
    ringkasanKasus:
      'Siswi Kelas 7 (Inisial AM) menarik diri, sering menangis di pojok kelas, dan kerap izin pulang lebih awal akibat perundungan siber (cyberbullying) foto stiker di grup WhatsApp kelas.',
    karakteristikRemaja:
      'Remaja Fase D (usia 12-14 tahun) sedang mengalami perkembangan identitas diri dan memiliki kepekaan tinggi terhadap penerimaan teman sebaya. Pengucilan atau pelecehan reputasi sosial di ruang digital memicu rasa malu toksik (toxic shame) dan penarikan diri sosial.',
    hipotesisDinamika:
      'Konseli mengalami kecemasan sosial akut akibat runtuhnya rasa aman psikologis di kelas. Tindakan pelaku didorong oleh konformitas kelompok dan minimnya literasi digital serta empati.',
    rekomendasiPendekatan:
      'SFBC (Solution-Focused Brief Counseling) untuk membangkitkan resiliensi dan kekuatan diri konseli, dipadukan dengan Mediasi Restoratif untuk pelaku serta psikoedukasi kelas.',
    tahapanKonseling: [
      {
        tahap: '1. Membangun Hubungan Hangat (Rapport) & Stabilisasi Emosi',
        deskripsi:
          'Validasi perasaan konseli secara tulus: "Ibu/Bapak mengerti betapa beratnya situasi ini, dan kamu sangat berani karena bersedia bercerita hari ini." Jamin kerahasiaan penuh.',
      },
      {
        tahap: '2. Eksplorasi Skala Masalah & Kekuatan Diri (Resource Finding)',
        deskripsi:
          'Gunakan scaling question 1-10: "Di angka berapa tingkat rasa takutmu saat ini?" dan temukan siapa teman di kelas yang masih dipercaya oleh konseli.',
      },
      {
        tahap: '3. Formulasi Solusi & Rencana Perlindungan (Safety Plan)',
        deskripsi:
          'Susun kesepakatan langkah bersama: Konseli istirahat sejenak dari grup WA kelas, sementara Guru BK mengambil alih penertiban aturan grup bersama wali kelas.',
      },
      {
        tahap: '4. Pendekatan Keadilan Restoratif bagi Pelaku',
        deskripsi:
          'Panggil pembuat stiker tanpa memojokkan di depan umum; ajak berefleksi tentang dampak luka batin korban dan buat kesepakatan permintaan maaf yang tulus serta menghapus konten.',
      },
    ],
    pertanyaanKunciKonselor: [
      '"Jika besok pagi kamu masuk ke kelas dengan perasaan aman dan tenang, apa tanda pertama yang kamu rasakan?"',
      '"Kapan terakhir kali kamu merasa paling bahagia bersama teman-teman di sekolah? Apa yang bisa kita hadirkan kembali dari momen itu?"',
      '"Dukungan seperti apa yang paling kamu butuhkan dari Guru BK saat ini agar kamu merasa terlindungi?"',
    ],
    kolaborasiTripusat: {
      waliKelas:
        'Koordinasi harian untuk memantau situasi kelas saat jam istirahat dan penataan kembali norma komunikasi di grup WhatsApp kelas.',
      orangTua:
        'Konsultasi pengasuhan ramah remaja: mendampingi tanpa menghakimi, membatasi screen-time malam hari, dan memberikan afirmasi kasih sayang di rumah.',
      temanSebaya:
        'Memberdayakan 2 siswa berpikiran matang (peer buddies) untuk mendampingi konseli ke kantin atau saat kerja kelompok.',
    },
    kodeEtikDanKerahasiaan:
      'Patuhi asas kerahasiaan Kode Etik ABKIN. Jangan pernah membocorkan curhatan konseli kepada siswa lain atau di ruang guru umum. Fokus pada pemulihan harga diri konseli.',
  });

  // Persistent Case Entries Log
  const [caseEntries, setCaseEntries] = useState<CounselingCaseEntry[]>(() => loadCaseEntries());
  const [statusPenanganan, setStatusPenanganan] = useState<CounselingCaseEntry['statusPenanganan']>('Proses Konseling');
  const [catatanTindakLanjut, setCatatanTindakLanjut] = useState<string>('Sesi konseling awal berjalan kondusif. Menunggu mediasi.');

  useEffect(() => {
    saveCaseEntries(caseEntries);
  }, [caseEntries]);

  const handleApplyPreset = (item: typeof PRESET_KASUS_KONSELOR[0]) => {
    setKasus(item.deskripsi);
    setKelas(item.kelas);
    setBidang(item.bidang);
    setFokus(item.fokus);
    setNamaInisial(item.judul.split(' ')[2] || 'Siswa SMP');
    onShowToast(`Kasus "${item.judul.slice(0, 30)}..." dimuat!`);
  };

  const handleConsult = async () => {
    if (!kasus.trim()) {
      onShowToast('Mohon tuliskan deskripsi kasus siswa terlebih dahulu');
      return;
    }

    const apiKey = getActiveApiKey();
    if (!apiKey) {
      onShowToast('Silakan masukkan Gemini API Key terlebih dahulu di pojok kanan atas.');
      if (onOpenApiKeyModal) {
        onOpenApiKeyModal();
      }
      return;
    }

    setIsLoading(true);
    try {
      const result = await consultCaseClient({ kasus, kelas, bidang, fokus });
      if (result) {
        setAnalysis(result);
        onShowToast('Analisis kasus dan strategi konseling berhasil disusun via Gemini SDK!');
      }
    } catch (err: any) {
      console.error('Error in case consultation via Client SDK:', err);
      onShowToast(`Gagal: ${err.message || 'Periksa API Key atau coba lagi'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToCaseLog = () => {
    if (!analysis) {
      onShowToast('Belum ada analisis kasus untuk disimpan.');
      return;
    }

    const newEntry: CounselingCaseEntry = {
      id: `case-${Date.now()}`,
      tanggal: new Date().toISOString().split('T')[0],
      namaSiswaInisial: namaInisial.trim() || 'Inisial Siswa',
      kelas,
      bidang,
      fokus,
      deskripsiKasus: kasus,
      analysis,
      statusPenanganan,
      catatanTindakLanjut,
    };

    setCaseEntries((prev) => [newEntry, ...prev]);
    onShowToast(`Kasus "${newEntry.namaSiswaInisial}" berhasil dicatat ke Buku Kasus Konselor!`);
  };

  const handleLoadSavedCase = (entry: CounselingCaseEntry) => {
    setNamaInisial(entry.namaSiswaInisial);
    setKelas(entry.kelas);
    setBidang(entry.bidang);
    setFokus(entry.fokus);
    setKasus(entry.deskripsiKasus);
    setAnalysis(entry.analysis);
    setStatusPenanganan(entry.statusPenanganan);
    setCatatanTindakLanjut(entry.catatanTindakLanjut || '');
    setActiveSubTab('consultation');
    onShowToast(`Kasus "${entry.namaSiswaInisial}" dimuat kembali!`);
  };

  const handleDeleteSavedCase = (id: string) => {
    setCaseEntries((prev) => prev.filter((c) => c.id !== id));
    onShowToast('Kasus berhasil dihapus dari buku catatan.');
  };

  const handleCopyAnalysis = () => {
    if (!analysis) return;
    const text = `
LEMBAR KONSULTASI & STUDI KASUS KONSELOR BK SMP
SATUAN PENDIDIKAN : ${profile.namaSekolah}
INISIAL SISWA     : ${namaInisial}
SASARAN           : ${kelas} (${bidang})
FOKUS LAYANAN     : ${fokus}
STATUS            : ${statusPenanganan}

1. RINGKASAN KASUS:
${analysis.ringkasanKasus}

2. KARAKTERISTIK PSIKOLOGIS REMAJA FASE D:
${analysis.karakteristikRemaja}

3. HIPOTESIS DINAMIKA MASALAH:
${analysis.hipotesisDinamika}

4. REKOMENDASI PENDEKATAN KONSELING:
${analysis.rekomendasiPendekatan}

5. TAHAPAN KONSELING:
${analysis.tahapanKonseling?.map((t) => `${t.tahap}\n${t.deskripsi}`).join('\n\n')}

6. PERTANYAAN KUNCI KONSELOR:
${analysis.pertanyaanKunciKonselor?.join('\n')}

7. KOLABORASI TRIPUSAT:
- Wali Kelas: ${analysis.kolaborasiTripusat.waliKelas}
- Orang Tua: ${analysis.kolaborasiTripusat.orangTua}
- Teman Sebaya: ${analysis.kolaborasiTripusat.temanSebaya}

8. KODE ETIK ABKIN:
${analysis.kodeEtikDanKerahasiaan}
    `.trim();

    navigator.clipboard.writeText(text);
    onShowToast('Catatan analisis kasus berhasil disalin ke clipboard!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="no-print bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Supervisi & Konsultasi Kasus Konselor Sekolah (Fase D SMP)</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-black tracking-tight text-white">
              Ruang Diskusi & Formulasi Kasus Klinis-Pedagogis
            </h2>
            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">
              Dianalisis langsung menggunakan Gemini API SDK: pendekatan konseling (SFBC, CBT, REBT), pertanyaan kunci wawancara konseli, serta strategi kolaborasi tripusat sesuai Kode Etik ABKIN.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Hasil</span>
            </button>
            <button
              onClick={handleCopyAnalysis}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
            >
              <Copy className="w-4 h-4" />
              <span>Salin Analisis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtab Navigation: Konsultasi vs Buku Kasus */}
      <div className="no-print flex p-1 bg-white border border-slate-200 rounded-xl max-w-md shadow-xs">
        <button
          type="button"
          onClick={() => setActiveSubTab('consultation')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'consultation'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquareHeart className="w-4 h-4" />
          <span>Analisis Kasus Aktif</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('case_log')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'case_log'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Buku Kasus Tersimpan ({caseEntries.length})</span>
        </button>
      </div>

      {activeSubTab === 'consultation' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Form (no-print) */}
          <div className="no-print lg:col-span-5 space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <MessageSquareHeart className="w-4 h-4 text-indigo-600" />
              <span>Parameter Kasus Nyata Konseli</span>
            </h3>

            {/* Inisial & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Inisial Nama Siswa:
                </label>
                <input
                  type="text"
                  value={namaInisial}
                  onChange={(e) => setNamaInisial(e.target.value)}
                  placeholder="Contoh: AM (Siswi)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Status Penanganan:
                </label>
                <select
                  value={statusPenanganan}
                  onChange={(e) =>
                    setStatusPenanganan(
                      e.target.value as CounselingCaseEntry['statusPenanganan']
                    )
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                >
                  <option value="Dalam Pemantauan">Dalam Pemantauan</option>
                  <option value="Proses Konseling">Proses Konseling</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Alih Tangan Kasus">Alih Tangan Kasus</option>
                </select>
              </div>
            </div>

            {/* Preset Buttons */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Inspirasi Preset Kasus SMP:</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {PRESET_KASUS_KONSELOR.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(item)}
                    className="w-full text-left p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50/70 hover:border-indigo-300 transition-all text-xs text-slate-800 flex items-center justify-between"
                  >
                    <span className="font-semibold line-clamp-1">{item.judul}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full shrink-0 ml-2">
                      {item.kelas}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Kelas & Bidang */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kelas:
                </label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 outline-hidden"
                >
                  <option value="Kelas 7 SMP">Kelas 7 SMP (Fase D)</option>
                  <option value="Kelas 8 SMP">Kelas 8 SMP (Fase D)</option>
                  <option value="Kelas 9 SMP">Kelas 9 SMP (Fase D)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Bidang Masalah:
                </label>
                <select
                  value={bidang}
                  onChange={(e) => setBidang(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 outline-hidden"
                >
                  <option value="Pribadi">Pribadi</option>
                  <option value="Sosial">Sosial</option>
                  <option value="Belajar">Belajar</option>
                  <option value="Karier">Karier</option>
                  <option value="Sosial & Pribadi">Sosial & Pribadi</option>
                </select>
              </div>
            </div>

            {/* Fokus Layanan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Bentuk / Fokus Intervensi:
              </label>
              <select
                value={fokus}
                onChange={(e) => setFokus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 outline-hidden"
              >
                <option value="Konseling Individual & Mediasi Sebaya">
                  Konseling Individual & Mediasi Sebaya
                </option>
                <option value="Konseling Individual (CBT / SFBC)">
                  Konseling Individual (CBT / SFBC)
                </option>
                <option value="Konferensi Kasus (Case Conference)">
                  Konferensi Kasus (Case Conference)
                </option>
                <option value="Kunjungan Rumah (Home Visit)">
                  Kunjungan Rumah (Home Visit)
                </option>
                <option value="Alih Tangan Kasus (Referral Psikolog)">
                  Alih Tangan Kasus (Referral Psikolog)
                </option>
              </select>
            </div>

            {/* Input Deskripsi Kasus Nyata */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Kronologi & Gejala Masalah Siswa:
                </label>
                <span className="text-[10px] text-slate-400">Deskripsi riil</span>
              </div>
              <textarea
                rows={5}
                value={kasus}
                onChange={(e) => setKasus(e.target.value)}
                placeholder="Tuliskan latar belakang masalah, perilaku yang teramati di kelas, durasi gejala, respon orang tua, dan situasi saat ini..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 outline-hidden focus:border-indigo-500 focus:bg-white transition-all leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Catatan Rencana Tindak Lanjut Guru BK:
              </label>
              <input
                type="text"
                value={catatanTindakLanjut}
                onChange={(e) => setCatatanTindakLanjut(e.target.value)}
                placeholder="Contoh: Sesi konseling 2 dijadwalkan hari Rabu..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
              />
            </div>

            {/* Tombol Eksekusi AI & Simpan */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleConsult}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>
                  {isLoading
                    ? 'Sedang Menganalisis Kasus via Gemini API...'
                    : 'Analisis Kasus dengan Gemini AI'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleSaveToCaseLog}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5 text-indigo-600" />
                <span>Simpan Kasus Ini ke Buku Catatan Konselor</span>
              </button>
            </div>
          </div>

          {/* Right Column: AI Analysis Result Sheet */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0 space-y-6">
            {/* Header Cetak */}
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <h3 className="font-bold text-xs tracking-widest uppercase text-slate-800">
                LEMBAR STUDI KASUS & REKOMENDASI KLINIS GURU BK
              </h3>
              <h2 className="font-black text-base text-slate-900 uppercase">
                {profile.namaSekolah}
              </h2>
              <div className="text-xs text-slate-600 mt-1">
                KONSULTASI PEDAGOGIS KASUS PESERTA DIDIK SMP (FASE D)
              </div>
            </div>

            {/* Identitas Kasus */}
            <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Inisial Konseli:</span>
                <strong className="block text-indigo-900">{namaInisial}</strong>
              </div>
              <div>
                <span className="text-slate-500">Sasaran & Bidang:</span>
                <strong className="block text-indigo-900">
                  {kelas} • {bidang}
                </strong>
              </div>
              <div>
                <span className="text-slate-500">Bentuk Layanan:</span>
                <strong className="block text-slate-900">{fokus}</strong>
              </div>
              <div>
                <span className="text-slate-500">Status Penanganan:</span>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 mt-0.5">
                  {statusPenanganan}
                </span>
              </div>
            </div>

            {analysis ? (
              <div className="space-y-5 text-xs text-slate-800">
                {/* Ringkasan */}
                <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 uppercase tracking-wider block text-[11px]">
                    1. Ringkasan Sintesis Kasus:
                  </span>
                  <p className="leading-relaxed text-slate-700">{analysis.ringkasanKasus}</p>
                </div>

                {/* Dinamika Psikologis Remaja */}
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 uppercase tracking-wider block text-[11px]">
                    2. Karakteristik Perkembangan Remaja Fase D (Usia 12-15 Tahun):
                  </span>
                  <p className="leading-relaxed text-slate-700 pl-3 border-l-2 border-indigo-400">
                    {analysis.karakteristikRemaja}
                  </p>
                </div>

                {/* Hipotesis Masalah */}
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 uppercase tracking-wider block text-[11px]">
                    3. Hipotesis Dinamika Psikologis & Faktor Pemicu:
                  </span>
                  <p className="leading-relaxed text-slate-700 pl-3 border-l-2 border-indigo-400">
                    {analysis.hipotesisDinamika}
                  </p>
                </div>

                {/* Pendekatan Konseling */}
                <div className="space-y-1 bg-blue-50/60 p-3.5 rounded-xl border border-blue-200">
                  <span className="font-bold text-blue-900 uppercase tracking-wider block text-[11px]">
                    4. Pendekatan Konseling yang Direkomendasikan:
                  </span>
                  <p className="leading-relaxed text-blue-950 font-medium">
                    {analysis.rekomendasiPendekatan}
                  </p>
                </div>

                {/* Tahapan Konseling */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-900 uppercase tracking-wider block text-[11px]">
                    5. Langkah Operasional Konseling Individual:
                  </span>
                  <div className="space-y-2">
                    {analysis.tahapanKonseling?.map((t, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="font-bold text-slate-900 mb-0.5">{t.tahap}</div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{t.deskripsi}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pertanyaan Kunci Konselor */}
                <div className="space-y-2 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-900 uppercase tracking-wider block text-[11px]">
                    6. Pertanyaan Pemandu Konselor (Miracle & Scaling Questions):
                  </span>
                  <ul className="space-y-1.5 pl-4 text-amber-950">
                    {analysis.pertanyaanKunciKonselor?.map((q, idx) => (
                      <li key={idx} className="list-disc leading-relaxed italic text-[11px]">
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kolaborasi Tripusat */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-900 uppercase tracking-wider block text-[11px]">
                    7. Rencana Kolaborasi Tripusat Pendidikan:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="font-bold text-slate-800 text-[11px] mb-1">Wali Kelas:</div>
                      <p className="text-[10px] text-slate-600 leading-snug">
                        {analysis.kolaborasiTripusat.waliKelas}
                      </p>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="font-bold text-slate-800 text-[11px] mb-1">Orang Tua / Wali:</div>
                      <p className="text-[10px] text-slate-600 leading-snug">
                        {analysis.kolaborasiTripusat.orangTua}
                      </p>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="font-bold text-slate-800 text-[11px] mb-1">Teman Sebaya:</div>
                      <p className="text-[10px] text-slate-600 leading-snug">
                        {analysis.kolaborasiTripusat.temanSebaya}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Asas Kerahasiaan ABKIN */}
                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>8. Kepatuhan Kode Etik ABKIN & Asas Kerahasiaan:</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {analysis.kodeEtikDanKerahasiaan}
                  </p>
                </div>

                {/* Tanda Tangan Konselor */}
                <div className="pt-6 border-t border-slate-300 flex justify-end">
                  <div className="text-right space-y-12">
                    <div>
                      <p>{profile.kota}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="font-bold">Konselor / Guru BK Pelaksana,</p>
                    </div>
                    <div>
                      <p className="font-bold underline uppercase">{profile.namaGuruBK}</p>
                      <p className="text-slate-600">NIP. {profile.nipGuruBK || '_________________________'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs">
                Klik tombol "Analisis Kasus dengan Gemini AI" untuk melihat formulasi kasus klinis.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* BUKU CATATAN KASUS KONSELOR (ARSHIP) */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-indigo-600" />
                <span>Buku Catatan Kasus Konselor (Tersimpan di Browser)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Riwayat kasus individual peserta didik dengan status pemantauan dan rekomendasi intervensi
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveSubTab('consultation')}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              + Buat Analisis Kasus Baru
            </button>
          </div>

          {caseEntries.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Belum ada kasus yang dicatat ke buku kasus. Analisis kasus di tab sebelah dan klik tombol "Simpan Kasus Ini".
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {caseEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">
                        {entry.namaSiswaInisial}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          entry.statusPenanganan === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : entry.statusPenanganan === 'Alih Tangan Kasus'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {entry.statusPenanganan}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        • {entry.kelas} • {entry.bidang} • {entry.tanggal}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-1">
                      <strong>Kronologi:</strong> {entry.deskripsiKasus}
                    </div>
                    <div className="text-xs text-indigo-700 line-clamp-1">
                      <strong>Pendekatan:</strong> {entry.analysis.rekomendasiPendekatan}
                    </div>
                    {entry.catatanTindakLanjut && (
                      <div className="text-[11px] text-slate-500 italic">
                        Tindak Lanjut: {entry.catatanTindakLanjut}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleLoadSavedCase(entry)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                    >
                      Buka & Tinjau
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleLoadSavedCase(entry);
                        setTimeout(() => window.print(), 100);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSavedCase(entry.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg"
                      title="Hapus dari buku kasus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
