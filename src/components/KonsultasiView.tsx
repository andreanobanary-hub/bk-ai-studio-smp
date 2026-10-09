import React, { useState } from 'react';
import { SchoolProfile, CaseAnalysis } from '../types';
import { PRESET_KASUS_KONSELOR } from '../data/constants';
import { consultCaseClient, getActiveApiKey } from '../services/geminiClient';
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
  const [kelas, setKelas] = useState<string>('Kelas 8 SMP');
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

  const handleApplyPreset = (item: typeof PRESET_KASUS_KONSELOR[0]) => {
    setKasus(item.deskripsi);
    setKelas(item.kelas);
    setBidang(item.bidang);
    setFokus(item.fokus);
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

  const handleCopyAnalysis = () => {
    if (!analysis) return;
    const text = `
LEMBAR KONSULTASI & STUDI KASUS KONSELOR BK SMP
SATUAN PENDIDIKAN : ${profile.namaSekolah}
SASARAN           : ${kelas} (${bidang})
FOKUS LAYANAN     : ${fokus}

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
              Dapatkan rekomendasi pendekatan konseling (SFBC, CBT, REBT), panduan pertanyaan kunci wawancara konseli, serta strategi kolaborasi orang tua dan wali kelas sesuai Kode Etik ABKIN.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form (no-print) */}
        <div className="no-print lg:col-span-5 space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <MessageSquareHeart className="w-4 h-4 text-indigo-600" />
            <span>Parameter Studi Kasus Konseli</span>
          </h3>

          {/* Preset Buttons */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Pilihan Cepat Kasus Khas SMP:</span>
            </div>
            <div className="space-y-1.5">
              {PRESET_KASUS_KONSELOR.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(item)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50/70 hover:border-indigo-300 transition-all text-xs text-slate-800"
                >
                  <div className="font-bold text-slate-900 line-clamp-1">{item.judul}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {item.kelas} • Bidang {item.bidang}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Sasaran Kelas
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold"
              >
                <option value="Kelas 7 SMP">Kelas 7 SMP</option>
                <option value="Kelas 8 SMP">Kelas 8 SMP</option>
                <option value="Kelas 9 SMP">Kelas 9 SMP</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Bidang Masalah
              </label>
              <select
                value={bidang}
                onChange={(e) => setBidang(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold"
              >
                <option value="Pribadi">Pribadi</option>
                <option value="Sosial">Sosial</option>
                <option value="Belajar">Belajar</option>
                <option value="Karier">Karier</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Fokus Penanganan
            </label>
            <input
              type="text"
              value={fokus}
              onChange={(e) => setFokus(e.target.value)}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium"
              placeholder="Konseling Individual, Mediasi, dll."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Deskripsi Kasus & Gejala Siswa
            </label>
            <textarea
              rows={4}
              value={kasus}
              onChange={(e) => setKasus(e.target.value)}
              placeholder="Ceritakan latar belakang masalah, perilaku yang terlihat di kelas, keluhan wali kelas atau orang tua..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-hidden font-medium text-slate-800"
            />
          </div>

          <button
            type="button"
            onClick={handleConsult}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menganalisis Kasus dengan AI Pakar...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Analisis Kasus & Formulasi Solusi (AI)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Case Analysis Document */}
        <div className="lg:col-span-7 space-y-4">
          <div className="print-area bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-lg text-slate-900 space-y-6">
            {/* Header Laporan Kasus */}
            <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Unit Bimbingan dan Konseling • {profile.namaSekolah}
              </h2>
              <h3 className="text-base font-black text-slate-900 uppercase">
                Lembar Studi Kasus & Rencana Tindakan Konseling (Fase D SMP)
              </h3>
              <p className="text-xs text-slate-600">
                Dokumen Rahasia Berdasarkan Kode Etik Profesi Bimbingan dan Konseling Indonesia (ABKIN)
              </p>
            </div>

            {analysis && (
              <div className="space-y-5 text-xs">
                {/* 1. Ringkasan Kasus */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>1. Ringkasan Deskripsi Masalah Konseli</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed pl-5">
                    {analysis.ringkasanKasus}
                  </p>
                </div>

                {/* 2. Karakteristik & Hipotesis Dinamika */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1">
                    <div className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-blue-600" />
                      <span>Karakteristik Psikologis Remaja (Fase D)</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {analysis.karakteristikRemaja}
                    </p>
                  </div>
                  <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-indigo-600" />
                      <span>Hipotesis Dinamika Psikologis</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {analysis.hipotesisDinamika}
                    </p>
                  </div>
                </div>

                {/* 3. Rekomendasi Pendekatan */}
                <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>Rekomendasi Pendekatan Konseling:</span>
                  </div>
                  <p className="text-slate-800 font-medium pl-5 leading-relaxed">
                    {analysis.rekomendasiPendekatan}
                  </p>
                </div>

                {/* 4. Tahapan Konseling Individual */}
                <div className="space-y-2">
                  <div className="font-black text-slate-900 uppercase tracking-wider">
                    Panduan Alur Wawancara Konseling Individual:
                  </div>
                  <div className="space-y-2">
                    {analysis.tahapanKonseling?.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white border border-slate-200 rounded-xl space-y-1"
                      >
                        <div className="font-bold text-blue-900 text-xs">
                          {step.tahap}
                        </div>
                        <p className="text-slate-700 leading-relaxed text-[11px] pl-2">
                          {step.deskripsi}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Pertanyaan Kunci Konselor */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>Contoh Pertanyaan Kunci Penggugah Insight (Miracle & Scaling):</span>
                  </div>
                  <ul className="space-y-1.5 pl-5 text-slate-700">
                    {analysis.pertanyaanKunciKonselor?.map((q, i) => (
                      <li key={i} className="list-disc italic text-[11px] leading-relaxed">
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 6. Kolaborasi Tripusat */}
                <div className="space-y-2">
                  <div className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Kolaborasi Tripusat Pendidikan</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="font-bold text-slate-800 mb-1">Wali Kelas:</div>
                      <p className="text-slate-600 leading-relaxed">
                        {analysis.kolaborasiTripusat?.waliKelas}
                      </p>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="font-bold text-slate-800 mb-1">Orang Tua / Rumah:</div>
                      <p className="text-slate-600 leading-relaxed">
                        {analysis.kolaborasiTripusat?.orangTua}
                      </p>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="font-bold text-slate-800 mb-1">Teman Sebaya (Peer):</div>
                      <p className="text-slate-600 leading-relaxed">
                        {analysis.kolaborasiTripusat?.temanSebaya}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 7. Asas Kerahasiaan ABKIN */}
                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl flex items-start space-x-2 text-[11px] text-rose-900">
                  <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Kode Etik Kerahasiaan Konseling: </span>
                    <span>{analysis.kodeEtikDanKerahasiaan}</span>
                  </div>
                </div>

                {/* Lembar Paraf Konselor */}
                <div className="pt-4 border-t border-slate-300 flex justify-between items-end text-xs">
                  <div>
                    <span className="text-slate-500 block">Status Kasus: Dalam Pemantauan Terjadwal</span>
                    <span className="text-slate-500">Tercatat pada Buku Kasus BK: Semester {profile.semester}</span>
                  </div>
                  <div className="text-right">
                    <p>{profile.kota}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="font-bold mt-1">Konselor / Guru BK Pelaksana,</p>
                    <p className="font-bold underline uppercase mt-12">{profile.namaGuruBK}</p>
                    <p className="text-slate-600">NIP. {profile.nipGuruBK || '-'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
