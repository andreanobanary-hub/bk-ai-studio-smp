import React, { useState } from 'react';
import { RPLData, SchoolProfile } from '../types';
import { TOPIK_PRESET_SMP } from '../data/constants';
import { generateRPLClient, getActiveApiKey } from '../services/geminiClient';
import {
  Sparkles,
  Printer,
  Copy,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  FileCheck,
  Download,
  AlertCircle,
  Lightbulb,
  Key,
} from 'lucide-react';

interface RPLViewProps {
  rplData: RPLData;
  setRplData: (data: RPLData) => void;
  profile: SchoolProfile;
  searchFilter: string;
  onNavigateToLKPD: () => void;
  onShowToast: (msg: string) => void;
  onOpenApiKeyModal?: () => void;
}

export const RPLView: React.FC<RPLViewProps> = ({
  rplData,
  setRplData,
  profile,
  searchFilter,
  onNavigateToLKPD,
  onShowToast,
  onOpenApiKeyModal,
}) => {
  // Form states
  const [kelas, setKelas] = useState<string>(rplData.kelas || 'Kelas 7 SMP');
  const [bidang, setBidang] = useState<string>(rplData.bidang || 'Sosial');
  const [fungsi, setFungsi] = useState<string>(rplData.fungsi || 'Pencegahan');
  const [topik, setTopik] = useState<string>(rplData.topik || '');
  const [alokasiWaktu, setAlokasiWaktu] = useState<string>(rplData.alokasiWaktu || '2 x 40 menit');
  const [pendekatan, setPendekatan] = useState<string>(
    'Alur ARKA (Aktivitas, Refleksi, Konseptualisasi, Aplikasi)'
  );
  const [catatanKhusus, setCatatanKhusus] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Available options
  const kelasOptions = ['Kelas 7 SMP', 'Kelas 8 SMP', 'Kelas 9 SMP'];
  const bidangOptions = ['Pribadi', 'Sosial', 'Belajar', 'Karier'];
  const fungsiOptions = [
    'Pemahaman',
    'Pencegahan',
    'Pengentasan',
    'Pemeliharaan/Pengembangan',
  ];
  const waktuOptions = ['1 x 40 menit', '2 x 40 menit'];

  // Presets filtered by selected class and search
  const filteredPresets = TOPIK_PRESET_SMP.filter((p) => {
    const matchesKelas = p.kelas === kelas;
    const matchesSearch =
      !searchFilter ||
      p.topik.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.bidang.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesKelas && matchesSearch;
  });

  const handleApplyPreset = (preset: typeof TOPIK_PRESET_SMP[0]) => {
    setTopik(preset.topik);
    setBidang(preset.bidang);
    setFungsi(preset.fungsi);
    setAlokasiWaktu(preset.waktu);
    onShowToast(`Topik "${preset.topik}" dimuat!`);
  };

  const handleGenerateRPL = async () => {
    if (!topik.trim()) {
      onShowToast('Mohon masukkan atau pilih topik layanan terlebih dahulu');
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
      const generatedRpl = await generateRPLClient({
        kelas,
        bidang,
        fungsi,
        topik,
        alokasiWaktu,
        pendekatan,
        tujuanTambahan: catatanKhusus,
      });

      if (generatedRpl) {
        setRplData(generatedRpl);
        onShowToast('Dokumen RPL Bimbingan Klasikal berhasil disusun via Gemini SDK!');
      }
    } catch (err: any) {
      console.error('Error generating RPL via Client Gen AI SDK:', err);
      onShowToast(`Gagal: ${err.message || 'Periksa API Key atau coba lagi'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = () => {
    const textContent = `
RENCANA PELAKSANAAN LAYANAN (RPL) BIMBINGAN KLASIKAL
STANDAR KURIKULUM NASIONAL TERBARU (DEEP LEARNING)
SATUAN PENDIDIKAN : ${profile.namaSekolah}
FASE / KELAS      : Fase D / ${rplData.kelas}
SEMESTER / T.A.   : ${profile.semester} / ${profile.tahunPelajaran}
BIDANG LAYANAN    : ${rplData.bidang}
FUNGSI LAYANAN    : ${rplData.fungsi}
ALOKASI WAKTU     : ${rplData.alokasiWaktu}
TOPIK / MATERI    : ${rplData.topik}
PENDEKATAN        : ${rplData.pendekatan}

A. CAPAIAN LAYANAN BK (FASE D SMP) & SKKPD
Capaian Layanan: ${rplData.capaianLayanan}
SKKPD SMP      : ${rplData.skkpd}
Dimensi Pembelajaran Mendalam (Deep Learning): ${(rplData.dimensiDeepLearning || rplData.profilPelajarPancasila)?.join(', ')}

B. PENDEKATAN DEEP LEARNING (3 PILAR PEMBELAJARAN MENDALAM)
1. Mindful Learning (Pembelajaran Berkesadaran):
${rplData.pendekatanDeepLearning?.mindfulLearning || '- Mengembangkan kesadaran penuh dan fokus emosional konseli.'}
2. Meaningful Learning (Pembelajaran Bermakna):
${rplData.pendekatanDeepLearning?.meaningfulLearning || '- Mengaitkan materi dengan pengalaman nyata kehidupan remaja SMP.'}
3. Joyful Learning (Pembelajaran Menyenangkan):
${rplData.pendekatanDeepLearning?.joyfulLearning || '- Menciptakan iklim bimbingan aman secara psikologis dan menggembirakan.'}

C. TUJUAN LAYANAN
1. Tujuan Umum: ${rplData.tujuanUmum}
2. Tujuan Khusus:
${rplData.tujuanKhusus?.join('\n')}

D. METODE & MEDIA
Metode : ${rplData.metode}
Media  : ${rplData.mediaDanAlat}

E. LANGKAH-LANGKAH KEGIATAN BERBASIS ALUR ARKA
1. TAHAP AWAL / PENDAHULUAN (${rplData.langkahKegiatan?.tahapAwal?.waktu})
${rplData.langkahKegiatan?.tahapAwal?.kegiatan?.map((k, i) => `${i + 1}. ${k}`).join('\n')}

2. TAHAP INTI (ALUR ARKA) (${rplData.langkahKegiatan?.tahapInti?.waktu})
- Aktivitas Bermakna (Meaningful Activity): ${rplData.langkahKegiatan?.tahapInti?.alurARKA?.aktivitas}
- Refleksi Kritis (Critical Reflection): ${rplData.langkahKegiatan?.tahapInti?.alurARKA?.refleksi}
- Konseptualisasi (Conceptualization): ${rplData.langkahKegiatan?.tahapInti?.alurARKA?.konseptualisasi}
- Aplikasi / Aksi Nyata (Real Action Application): ${rplData.langkahKegiatan?.tahapInti?.alurARKA?.aplikasi}

3. TAHAP PENUTUP (${rplData.langkahKegiatan?.tahapPenutup?.waktu})
${rplData.langkahKegiatan?.tahapPenutup?.kegiatan?.map((k, i) => `${i + 1}. ${k}`).join('\n')}

F. ASESMEN PROSES & ASESMEN HASIL
1. Asesmen Proses (Keterlaksanaan Layanan):
${(rplData.asesmen?.asesmenProses || rplData.evaluasi?.evaluasiProses)?.map((e) => `- ${e}`).join('\n')}
2. Asesmen Hasil (Refleksi Ketercapaian Konseli):
- Understanding : ${rplData.asesmen?.asesmenHasil?.understanding || rplData.evaluasi?.evaluasiHasil?.[0] || 'Pemahaman baru konseli'}
- Comfortable   : ${rplData.asesmen?.asesmenHasil?.comfortable || rplData.evaluasi?.evaluasiHasil?.[1] || 'Kenyamanan dan rasa aman konseli'}
- Action        : ${rplData.asesmen?.asesmenHasil?.action || rplData.evaluasi?.evaluasiHasil?.[2] || 'Rencana aksi nyata'}
Tindak Lanjut: ${rplData.tindakLanjut}

${profile.kota}, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}

Mengetahui,
Kepala Sekolah: ${profile.namaKepalaSekolah} (NIP. ${profile.nipKepalaSekolah || '-'})
Guru Bimbingan dan Konseling: ${profile.namaGuruBK} (NIP. ${profile.nipGuruBK || '-'})
    `.trim();

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    onShowToast('Dokumen RPL Standar Deep Learning berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDoc = () => {
    const textContent = `
RENCANA PELAKSANAAN LAYANAN (RPL) BIMBINGAN KLASIKAL
STANDAR KURIKULUM NASIONAL TERBARU (DEEP LEARNING)
SEKOLAH : ${profile.namaSekolah}
TOPIK   : ${rplData.topik}
SASARAN : ${rplData.kelas} (Fase D SMP)

A. CAPAIAN LAYANAN & SKKPD:
Capaian : ${rplData.capaianLayanan}
SKKPD   : ${rplData.skkpd}

B. PENDEKATAN DEEP LEARNING:
1. Mindful Learning    : ${rplData.pendekatanDeepLearning?.mindfulLearning || '-'}
2. Meaningful Learning : ${rplData.pendekatanDeepLearning?.meaningfulLearning || '-'}
3. Joyful Learning     : ${rplData.pendekatanDeepLearning?.joyfulLearning || '-'}

C. TUJUAN KHUSUS:
${rplData.tujuanKhusus?.join('\n')}

D. LANGKAH ARKA:
1. Aktivitas Bermakna   : ${rplData.langkahKegiatan?.tahapInti?.alurARKA?.aktivitas}
2. Refleksi Kritis      : ${rplData.langkahKegiatan?.tahapInti?.alurARKA?.refleksi}
3. Konseptualisasi      : ${rplData.langkahKegiatan?.tahapInti?.alurARKA?.konseptualisasi}
4. Aplikasi / Aksi Nyata: ${rplData.langkahKegiatan?.tahapInti?.alurARKA?.aplikasi}

E. ASESMEN PROSES & HASIL:
${(rplData.asesmen?.asesmenProses || rplData.evaluasi?.evaluasiProses)?.join('\n')}
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `RPL_DeepLearning_SMP_${rplData.kelas.replace(/\s+/g, '_')}_${rplData.topik.slice(0, 20).replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onShowToast('File RPL berhasil diunduh!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Alert info */}
      <div className="no-print bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standar Kurikulum Nasional Terbaru (Deep Learning • Fase D SMP)</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-black tracking-tight text-white">
              Penyusun Dokumen Bimbingan Klasikal Deep Learning & Alur ARKA
            </h2>
            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">
              Memadukan 3 Pilar Deep Learning (Mindful, Meaningful, Joyful Learning), Alur ARKA (Aktivitas Bermakna, Refleksi Kritis, Konseptualisasi, Aksi Nyata), Capaian Layanan BK Fase D, serta Asesmen Proses & Hasil.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={handleCopyText}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/30"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Generator Form (no-print) */}
        <div className="no-print lg:col-span-5 space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Parameter Layanan BK</span>
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
              Fase D
            </span>
          </div>

          {/* 1. Pilihan Kelas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Sasaran Kelas (Fase D SMP)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {kelasOptions.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKelas(k)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold text-center border transition-all ${
                    kelas === k
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/30'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Bidang Layanan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Bidang Layanan
            </label>
            <div className="grid grid-cols-2 gap-2">
              {bidangOptions.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBidang(b)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition-all ${
                    bidang === b
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{b}</span>
                  {bidang === b && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Fungsi Layanan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              3. Fungsi Layanan
            </label>
            <div className="grid grid-cols-2 gap-2">
              {fungsiOptions.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFungsi(f)}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-semibold border text-left truncate transition-all ${
                    fungsi === f
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title={f}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Input Topik / Judul Materi */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                4. Topik / Materi Layanan
              </label>
              <span className="text-[11px] text-blue-600 font-medium">Khas SMP</span>
            </div>
            <textarea
              rows={2}
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              placeholder="Contoh: Membangun Pertemanan Sehat & Anti-Bullying..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-hidden font-medium text-slate-800"
            />

            {/* Quick preset chips */}
            {filteredPresets.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pilihan Cepat Topik Populer {kelas}:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {filteredPresets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-slate-700 transition-colors text-left"
                    >
                      {p.topik}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. Alokasi Waktu & 6. Pendekatan */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                5. Alokasi Waktu
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {waktuOptions.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setAlokasiWaktu(w)}
                    className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-center transition-all ${
                      alokasiWaktu === w
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                6. Model Pendekatan
              </label>
              <div className="p-2 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] font-semibold text-blue-900 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Deep Learning • Alur ARKA</span>
              </div>
            </div>
          </div>

          {/* Deep Learning 3 Pillars hint */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">3 Pilar Deep Learning BK SMP:</span>
            <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-semibold">
              <span className="bg-white border border-slate-200 p-1 rounded text-blue-700">Mindful Learning</span>
              <span className="bg-white border border-slate-200 p-1 rounded text-indigo-700">Meaningful Learning</span>
              <span className="bg-white border border-slate-200 p-1 rounded text-emerald-700">Joyful Learning</span>
            </div>
          </div>

          {/* Catatan / Tujuan Khusus Tambahan */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Catatan Khusus / Kasus Kelas (Opsional)
            </label>
            <input
              type="text"
              value={catatanKhusus}
              onChange={(e) => setCatatanKhusus(e.target.value)}
              placeholder="Misal: Fokus pada dinamika siber & ejekan di grup WA"
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-hidden focus:border-blue-500"
            />
          </div>

          {/* 7. Tombol Generate RPL Lengkap */}
          <button
            type="button"
            onClick={handleGenerateRPL}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center space-x-2 shadow-lg transition-all ${
              isLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyusun RPL Lengkap (Gemini AI)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate RPL Lengkap</span>
              </>
            )}
          </button>

          {/* LKPD Shortcut link */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Perlu lembar kerja siswa?</span>
            <button
              onClick={onNavigateToLKPD}
              className="font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Buka Media & LKPD 4F</span>
            </button>
          </div>
        </div>

        {/* Right Column: Area Pratinjau Dokumen (Official Printable Format) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action bar above preview */}
          <div className="no-print flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>Pratinjau Dokumen Resmi Standar Kurikulum Nasional Terbaru</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadDoc}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                title="Unduh Teks"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh</span>
              </button>
              <button
                onClick={handleCopyText}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                title="Salin ke Clipboard"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                title="Cetak A4 / Simpan PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak A4</span>
              </button>
            </div>
          </div>

          {/* Printable Document Sheet Container */}
          <div className="print-area bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-lg text-slate-900 space-y-6">
            {/* Kop Surat Dokumen */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <h1 className="text-xs font-bold uppercase tracking-widest text-slate-700">
                Pemerintah Daerah • Dinas Pendidikan
              </h1>
              <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight">
                {profile.namaSekolah}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Unit Bimbingan dan Konseling (BK) • Jenjang Sekolah Menengah Pertama (SMP)
              </p>
              <div className="pt-2 space-y-1">
                <span className="inline-block px-3.5 py-0.5 rounded-full bg-blue-50 border border-blue-300 text-[11px] font-black tracking-wider uppercase text-blue-900">
                  Standar Kurikulum Nasional Terbaru • Fase D SMP
                </span>
                <div className="text-sm md:text-base font-black tracking-wide uppercase text-slate-900">
                  Rencana Pelaksanaan Layanan (RPL) Bimbingan Klasikal (Deep Learning)
                </div>
              </div>
            </div>

            {/* Identitas Umum Tabel */}
            <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
              <table className="w-full divide-y divide-slate-200">
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr className="divide-x divide-slate-200">
                    <td className="p-2.5 font-bold bg-slate-50 w-1/4 text-slate-700">Satuan Pendidikan</td>
                    <td className="p-2.5 text-slate-900 w-1/4">{profile.namaSekolah}</td>
                    <td className="p-2.5 font-bold bg-slate-50 w-1/4 text-slate-700">Fase / Kelas</td>
                    <td className="p-2.5 text-slate-900 w-1/4 font-semibold">{rplData.fase} / {rplData.kelas}</td>
                  </tr>
                  <tr className="divide-x divide-slate-200">
                    <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Tahun Pelajaran</td>
                    <td className="p-2.5 text-slate-900">{profile.tahunPelajaran} (Sem. {profile.semester})</td>
                    <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Alokasi Waktu</td>
                    <td className="p-2.5 text-slate-900 font-semibold">{rplData.alokasiWaktu}</td>
                  </tr>
                  <tr className="divide-x divide-slate-200">
                    <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Bidang Layanan</td>
                    <td className="p-2.5 text-slate-900 font-semibold text-blue-700">{rplData.bidang}</td>
                    <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Fungsi Layanan</td>
                    <td className="p-2.5 text-slate-900 font-semibold">{rplData.fungsi}</td>
                  </tr>
                  <tr className="divide-x divide-slate-200">
                    <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Topik / Tema Materi</td>
                    <td colSpan={3} className="p-2.5 text-slate-900 font-bold text-sm bg-blue-50/50">
                      {rplData.topik}
                    </td>
                  </tr>
                  <tr className="divide-x divide-slate-200">
                    <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Model & Pendekatan</td>
                    <td colSpan={3} className="p-2.5 text-slate-800">
                      <span className="font-bold text-blue-700">Pendekatan Deep Learning</span> (Mindful, Meaningful, Joyful Learning) berbasis <span className="font-bold text-indigo-700">Alur ARKA</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* A. Capaian Layanan & SKKPD */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-l-4 border-blue-600 pl-2.5">
                A. Capaian Layanan BK (Fase D SMP) & Standar Kompetensi Kemandirian (SKKPD)
              </h3>
              <div className="text-xs space-y-2.5">
                <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                  <span className="font-bold text-blue-900">Capaian Layanan BK (Fase D): </span>
                  <span className="text-slate-800 leading-relaxed">{rplData.capaianLayanan}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-bold text-slate-800 mb-1">Aspek Perkembangan SKKPD SMP:</div>
                    <p className="text-slate-700 leading-relaxed">{rplData.skkpd}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-bold text-slate-800 mb-1">Dimensi Pembelajaran Mendalam (Deep Learning):</div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {(rplData.dimensiDeepLearning || rplData.profilPelajarPancasila)?.map((dim, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white border border-slate-300 font-semibold text-slate-800 text-[11px]"
                        >
                          ✓ {dim}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* B. Pendekatan Deep Learning (3 Pilar) */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-l-4 border-indigo-600 pl-2.5">
                B. Penerapan Pendekatan Deep Learning (3 Pilar Pembelajaran Mendalam)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* 1. Mindful */}
                <div className="p-3 rounded-lg bg-blue-50/80 border border-blue-200 space-y-1">
                  <div className="font-black text-blue-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>Mindful Learning</span>
                  </div>
                  <div className="text-[11px] font-semibold text-blue-700">Pembelajaran Berkesadaran</div>
                  <p className="text-slate-700 text-[11px] leading-relaxed pt-1">
                    {rplData.pendekatanDeepLearning?.mindfulLearning ||
                      'Mengembangkan kesadaran penuh (Mindfulness) peserta didik dalam mengenali emosi diri, atensi fokus, dan kepekaan rasa saat menghadapi masalah.'}
                  </p>
                </div>

                {/* 2. Meaningful */}
                <div className="p-3 rounded-lg bg-indigo-50/80 border border-indigo-200 space-y-1">
                  <div className="font-black text-indigo-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>Meaningful Learning</span>
                  </div>
                  <div className="text-[11px] font-semibold text-indigo-700">Pembelajaran Bermakna</div>
                  <p className="text-slate-700 text-[11px] leading-relaxed pt-1">
                    {rplData.pendekatanDeepLearning?.meaningfulLearning ||
                      'Menghubungkan esensi materi bimbingan dengan pengalaman hidup nyata peserta didik di jenjang SMP sehingga menumbuhkan hikmah dan nilai batin.'}
                  </p>
                </div>

                {/* 3. Joyful */}
                <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200 space-y-1">
                  <div className="font-black text-emerald-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>Joyful Learning</span>
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700">Pembelajaran Menyenangkan</div>
                  <p className="text-slate-700 text-[11px] leading-relaxed pt-1">
                    {rplData.pendekatanDeepLearning?.joyfulLearning ||
                      'Menciptakan iklim bimbingan yang aman secara psikologis, bebas perundungan, interaktif, dan penuh kegembiraan dalam dinamika kelompok.'}
                  </p>
                </div>
              </div>
            </div>

            {/* C. Tujuan Pembelajaran BK */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-l-4 border-blue-600 pl-2.5">
                C. Tujuan Layanan Bimbingan Klasikal
              </h3>
              <div className="text-xs space-y-2 bg-white border border-slate-200 rounded-lg p-3">
                <div>
                  <span className="font-bold text-slate-800">1. Tujuan Umum: </span>
                  <span className="text-slate-700">{rplData.tujuanUmum}</span>
                </div>
                <div>
                  <div className="font-bold text-slate-800 mb-1">2. Tujuan Khusus (Operasional & Terukur):</div>
                  <ul className="space-y-1 pl-4 text-slate-700">
                    {rplData.tujuanKhusus?.map((tj, idx) => (
                      <li key={idx} className="list-disc leading-relaxed">
                        {tj}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* D. Materi, Media, dan Metode */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-l-4 border-blue-600 pl-2.5">
                D. Pokok Materi, Media, dan Metode Layanan
              </h3>
              <div className="text-xs grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-800 mb-1">Materi Pokok Layanan:</div>
                  <ul className="space-y-1 pl-4 text-slate-700">
                    {rplData.materiPokok?.map((m, i) => (
                      <li key={i} className="list-disc leading-relaxed">{m}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div>
                    <span className="font-bold text-slate-800">Media & Alat: </span>
                    <span className="text-slate-700">{rplData.mediaDanAlat}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Metode Pembelajaran: </span>
                    <span className="text-slate-700">{rplData.metode}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* E. Langkah-Langkah Kegiatan Alur ARKA */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-l-4 border-indigo-600 pl-2.5">
                E. Langkah-Langkah Pelaksanaan Layanan (Alur ARKA)
              </h3>

              <div className="space-y-3 text-xs">
                {/* 1. Tahap Awal */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-800 flex justify-between">
                    <span>1. Tahap Pendahuluan / Awal (Pengondisian Mindful & Joyful)</span>
                    <span className="text-slate-600 font-normal">{rplData.langkahKegiatan?.tahapAwal?.waktu}</span>
                  </div>
                  <div className="p-3 space-y-1.5 bg-white">
                    {rplData.langkahKegiatan?.tahapAwal?.kegiatan?.map((keg, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-slate-700">
                        <span className="font-bold text-blue-600 shrink-0">{idx + 1}.</span>
                        <span>{keg}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Tahap Inti (ARKA) */}
                <div className="border border-indigo-200 rounded-lg overflow-hidden">
                  <div className="bg-indigo-50 px-3 py-1.5 font-bold text-indigo-900 flex justify-between border-b border-indigo-100">
                    <span>2. Tahap Inti (Siklus Pembelajaran Mendalam Alur ARKA)</span>
                    <span className="text-indigo-700 font-semibold">{rplData.langkahKegiatan?.tahapInti?.waktu}</span>
                  </div>
                  <div className="p-3.5 space-y-3 bg-white">
                    {/* A - Aktivitas Bermakna */}
                    <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
                      <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">A</span>
                        <span>Aktivitas Bermakna (Meaningful Activity)</span>
                      </div>
                      <p className="text-slate-700 pl-6 leading-relaxed">
                        {rplData.langkahKegiatan?.tahapInti?.alurARKA?.aktivitas}
                      </p>
                    </div>

                    {/* R - Refleksi Kritis */}
                    <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100">
                      <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                        <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">R</span>
                        <span>Refleksi Kritis (Critical Reflection)</span>
                      </div>
                      <p className="text-slate-700 pl-6 leading-relaxed">
                        {rplData.langkahKegiatan?.tahapInti?.alurARKA?.refleksi}
                      </p>
                    </div>

                    {/* K - Konseptualisasi */}
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">K</span>
                        <span>Konseptualisasi (Conceptualization)</span>
                      </div>
                      <p className="text-slate-700 pl-6 leading-relaxed">
                        {rplData.langkahKegiatan?.tahapInti?.alurARKA?.konseptualisasi}
                      </p>
                    </div>

                    {/* A - Aplikasi / Aksi Nyata */}
                    <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-100">
                      <div className="font-bold text-purple-900 flex items-center gap-1.5 mb-1">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">A</span>
                        <span>Aplikasi / Aksi Nyata (Real Action Application)</span>
                      </div>
                      <p className="text-slate-700 pl-6 leading-relaxed">
                        {rplData.langkahKegiatan?.tahapInti?.alurARKA?.aplikasi}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Tahap Penutup */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-800 flex justify-between">
                    <span>3. Tahap Penutup (Sintesis Makna & Penguatan Afirmasi)</span>
                    <span className="text-slate-600 font-normal">{rplData.langkahKegiatan?.tahapPenutup?.waktu}</span>
                  </div>
                  <div className="p-3 space-y-1.5 bg-white">
                    {rplData.langkahKegiatan?.tahapPenutup?.kegiatan?.map((keg, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-slate-700">
                        <span className="font-bold text-blue-600 shrink-0">{idx + 1}.</span>
                        <span>{keg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* F. Asesmen Proses & Hasil */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-l-4 border-blue-600 pl-2.5">
                F. Asesmen Proses & Asesmen Hasil (Format Evaluasi Keterlaksanaan)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Asesmen Proses */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="font-bold text-slate-900">1. Asesmen Proses (Observasi Keterlaksanaan):</div>
                  <ul className="space-y-1.5 pl-4 text-slate-700">
                    {(rplData.asesmen?.asesmenProses || rplData.evaluasi?.evaluasiProses)?.map((ep, i) => (
                      <li key={i} className="list-disc leading-relaxed">{ep}</li>
                    ))}
                  </ul>
                </div>

                {/* Asesmen Hasil */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="font-bold text-slate-900">2. Asesmen Hasil (Refleksi Ketercapaian Konseli):</div>
                  <div className="space-y-1.5 text-[11px] text-slate-700">
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <span className="font-bold text-blue-800">Understanding (U): </span>
                      <span>{rplData.asesmen?.asesmenHasil?.understanding || rplData.evaluasi?.evaluasiHasil?.[0] || 'Pemahaman konsep konseli'}</span>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <span className="font-bold text-indigo-800">Comfortable (C): </span>
                      <span>{rplData.asesmen?.asesmenHasil?.comfortable || rplData.evaluasi?.evaluasiHasil?.[1] || 'Kenyamanan dan penerimaan emosional'}</span>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      <span className="font-bold text-emerald-800">Action (A): </span>
                      <span>{rplData.asesmen?.asesmenHasil?.action || rplData.evaluasi?.evaluasiHasil?.[2] || 'Rencana aksi nyata pada LKPD 4F'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <span className="font-bold text-slate-800">Rencana Tindak Lanjut: </span>
                <span className="text-slate-700">{rplData.tindakLanjut}</span>
              </div>
            </div>

            {/* Kolom Tanda Tangan Resmi */}
            <div className="pt-8 border-t border-slate-300">
              <div className="flex justify-between items-start text-xs text-slate-800 px-4">
                <div className="text-left space-y-16">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-bold">Kepala {profile.namaSekolah}</p>
                  </div>
                  <div>
                    <p className="font-bold underline uppercase">{profile.namaKepalaSekolah}</p>
                    <p className="text-slate-600">NIP. {profile.nipKepalaSekolah || '_________________________'}</p>
                  </div>
                </div>

                <div className="text-left space-y-16">
                  <div>
                    <p>{profile.kota || 'Nusantara'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="font-bold">Guru Bimbingan dan Konseling</p>
                  </div>
                  <div>
                    <p className="font-bold underline uppercase">{profile.namaGuruBK}</p>
                    <p className="text-slate-600">NIP. {profile.nipGuruBK || '_________________________'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
