import React, { useState, useEffect } from 'react';
import { SchoolProfile, LKPDData, LKPDSubmission } from '../types';
import { generateLKPDClient, getActiveApiKey } from '../services/geminiClient';
import {
  loadLKPDSubmissions,
  saveLKPDSubmissions,
} from '../services/storageService';
import {
  Sparkles,
  Printer,
  Copy,
  BookOpen,
  Calendar,
  CheckCircle2,
  Heart,
  Lightbulb,
  Compass,
  FileCheck,
  RotateCcw,
  Users,
  User,
  Download,
  Trash2,
  FileText,
  Save,
  Check,
} from 'lucide-react';

interface LKPDViewProps {
  profile: SchoolProfile;
  currentTopikRPL: string;
  currentKelasRPL: string;
  onShowToast: (msg: string) => void;
  onOpenApiKeyModal?: () => void;
}

export const LKPDView: React.FC<LKPDViewProps> = ({
  profile,
  currentTopikRPL,
  currentKelasRPL,
  onShowToast,
  onOpenApiKeyModal,
}) => {
  const [activeMode, setActiveMode] = useState<'interactive_form' | 'generator' | 'archive'>('interactive_form');

  // Generator State
  const [topik, setTopik] = useState<string>(
    currentTopikRPL || 'Membangun Pertemanan Sehat & Anti-Bullying'
  );
  const [kelas, setKelas] = useState<string>(currentKelasRPL || 'Kelas 7 SMP');
  const [bidang, setBidang] = useState<string>('Sosial');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // LKPD Master Data
  const [lkpd, setLkpd] = useState<LKPDData>({
    topik: topik,
    kelas: kelas,
    bidang: bidang,
    instruksiSiswa:
      'Halo Sahabat Konseli! Isilah lembar refleksi 4F ini dengan jujur dan santai. Jawabanmu adalah cermin pemikiran dan perasaanmu untuk bertumbuh menjadi remaja yang hebat dan berkarakter!',
    refleksi4F: {
      fact: {
        pertanyaan:
          'Ceritakan peristiwa nyata atau situasi yang pernah kamu lihat / alami di lingkungan sekolah atau pertemanan terkait materi ini!',
        contohPemandu:
          'Contoh: "Saya pernah melihat teman satu kelompok diejek karena salah menjawab pertanyaan di depan kelas..."',
      },
      feeling: {
        pertanyaan:
          'Apa yang kamu rasakan saat kejadian tersebut berlangsung, dan bagaimana perasaanmu setelah mengikuti layanan bimbingan hari ini?',
        contohPemandu:
          'Contoh: "Saat itu saya merasa serba salah dan kasihan, namun setelah layanan hari ini saya merasa lebih percaya diri dan ingin menjadi pembela teman..."',
      },
      finding: {
        pertanyaan:
          'Pelajaran berharga atau pencerahan baru apa yang kamu temukan tentang dirimu dan arti persahabatan?',
        contohPemandu:
          'Contoh: "Saya menyadari bahwa diam saat melihat teman dibully sama saja membiarkan keburukan terjadi. Sahabat sejati saling melindungi..."',
      },
      future: {
        pertanyaan:
          'Tuliskan 2 aksi nyata yang akan kamu praktikkan langsung mulai besok di kelas atau rumah!',
        contohPemandu:
          'Contoh: "1) Menyapa dan mengajak teman yang sedang menyendiri untuk bergabung; 2) Berani menegur secara santun jika ada teman yang mengejek nama orang tua."',
      },
    },
    komitmenDiri: [
      'Saya berkomitmen untuk menciptakan suasana pertemanan kelas yang aman, hangat, dan tanpa perundungan.',
      'Saya tidak ragu untuk bercerita dan berkonsultasi kepada Guru BK jika menghadapi masalah yang membingungkan.',
    ],
  });

  // Interactive Submissions State
  const [submissions, setSubmissions] = useState<LKPDSubmission[]>(() => loadLKPDSubmissions());

  // Active Interactive Form Data
  const [activeFormType, setActiveFormType] = useState<'Individu' | 'Kelompok'>('Individu');
  const [formNama, setFormNama] = useState<string>('Dinda Ayu Maharani');
  const [formAnggota, setFormAnggota] = useState<string>('');
  const [formKelas, setFormKelas] = useState<string>(currentKelasRPL || 'Kelas 7 SMP');
  const [formTanggal, setFormTanggal] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [formFact, setFormFact] = useState<string>(
    'Saya pernah melihat teman sebangku diejek karena nilai ulangannya rendah dan teman lain tertawa.'
  );
  const [formFeeling, setFormFeeling] = useState<string>(
    'Awalnya saya merasa cemas dan sedih. Setelah layanan BK, saya merasa lebih berani bersikap adil.'
  );
  const [formFinding, setFormFinding] = useState<string>(
    'Menghargai proses orang lain jauh lebih mulia daripada mengejek kegagalan. Saya harus jadi pendukung, bukan penonton.'
  );
  const [formFuture, setFormFuture] = useState<string>(
    '1) Mengajak teman tersebut belajar bersama; 2) Menegur teman lain yang mulai mengejek dengan sopan.'
  );
  const [formKomitmenChecked, setFormKomitmenChecked] = useState<boolean[]>([true, true]);
  const [formCatatanKonselor, setFormCatatanKonselor] = useState<string>(
    'Refleksi sangat baik dan penuh empati. Rencana aksi konkret dan dapat dipantau di kelas.'
  );

  // Persistence for submissions
  useEffect(() => {
    saveLKPDSubmissions(submissions);
  }, [submissions]);

  const handleGenerateAI = async () => {
    if (!topik.trim()) {
      onShowToast('Masukkan topik materi LKPD terlebih dahulu');
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
      const generated = await generateLKPDClient({ topik, kelas, bidang });
      setLkpd(generated);
      onShowToast('Lembar Refleksi 4F berhasil disusun via Gemini SDK!');
    } catch (err: any) {
      console.error('Error generating LKPD via Client SDK:', err);
      onShowToast(`Gagal: ${err.message || 'Periksa API Key atau coba lagi'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncFromRPL = () => {
    if (currentTopikRPL) {
      setTopik(currentTopikRPL);
      setKelas(currentKelasRPL);
      setFormKelas(currentKelasRPL);
      onShowToast(`Sinkronisasi dengan topik aktif: "${currentTopikRPL}"`);
    } else {
      onShowToast('Tidak ada topik RPL aktif');
    }
  };

  // Save Interactive Submission to Archive
  const handleSaveSubmission = () => {
    if (!formNama.trim()) {
      onShowToast('Harap masukkan nama siswa atau kelompok.');
      return;
    }

    const newSub: LKPDSubmission = {
      id: `lkpd-${Date.now()}`,
      tipe: activeFormType,
      namaSiswaAtauKelompok: formNama.trim(),
      anggotaKelompok:
        activeFormType === 'Kelompok' && formAnggota.trim()
          ? formAnggota.split(',').map((s) => s.trim())
          : undefined,
      kelas: formKelas,
      tanggal: formTanggal,
      topik: lkpd.topik,
      fact: formFact,
      feeling: formFeeling,
      finding: formFinding,
      future: formFuture,
      komitmen: lkpd.komitmenDiri,
      catatanKonselor: formCatatanKonselor,
      parafKonselor: true,
    };

    setSubmissions((prev) => [newSub, ...prev]);
    onShowToast(`Lembar LKPD untuk "${formNama}" berhasil disimpan ke arsip!`);
  };

  // Load a submission into active form
  const handleLoadSubmission = (sub: LKPDSubmission) => {
    setActiveFormType(sub.tipe);
    setFormNama(sub.namaSiswaAtauKelompok);
    setFormAnggota(sub.anggotaKelompok ? sub.anggotaKelompok.join(', ') : '');
    setFormKelas(sub.kelas);
    setFormTanggal(sub.tanggal);
    setFormFact(sub.fact);
    setFormFeeling(sub.feeling);
    setFormFinding(sub.finding);
    setFormFuture(sub.future);
    setFormCatatanKonselor(sub.catatanKonselor || '');
    setActiveMode('interactive_form');
    onShowToast(`Respon LKPD "${sub.namaSiswaAtauKelompok}" dimuat ke formulir!`);
  };

  // Delete submission
  const handleDeleteSubmission = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    onShowToast('Data LKPD berhasil dihapus dari arsip.');
  };

  // Export TXT
  const handleExportTxt = () => {
    const text = `
LEMBAR KERJA PESERTA DIDIK (LKPD) - MODEL REFLEKSI 4F
Satuan Pendidikan : ${profile.namaSekolah}
Topik Layanan     : ${lkpd.topik}
Format            : ${activeFormType}
Nama              : ${formNama} ${activeFormType === 'Kelompok' ? `\nAnggota           : ${formAnggota}` : ''}
Kelas             : ${formKelas}
Tanggal           : ${formTanggal}

1. FACT (Peristiwa Nyata):
${formFact}

2. FEELING (Perasaan yang Dialami):
${formFeeling}

3. FINDING (Pembelajaran / Insight Baru):
${formFinding}

4. FUTURE (Aksi Nyata & Penerapan):
${formFuture}

KOMITMEN DIRI:
${lkpd.komitmenDiri.map((k) => `[V] ${k}`).join('\n')}

Catatan & Feedback Konselor:
${formCatatanKonselor}
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `LKPD_4F_${formNama.replace(/\s+/g, '_')}_${formKelas}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onShowToast('Berkas TXT LKPD berhasil diunduh!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Media & LKPD Refleksi Diri 4F</span>
            </h2>
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-indigo-200">
              Model 4F Interaktif
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Model Refleksi 4F (Fact, Feeling, Finding, Future) ramah siswa SMP — Pengisian interaktif individu/kelompok dan ekspor cetak
          </p>
        </div>

        {/* Tab Mode Buttons */}
        <div className="flex p-1 bg-slate-100 rounded-xl space-x-1 shrink-0">
          <button
            onClick={() => setActiveMode('interactive_form')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeMode === 'interactive_form'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Pengisian Interaktif</span>
          </button>
          <button
            onClick={() => setActiveMode('archive')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeMode === 'archive'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Arsip Terisi ({submissions.length})</span>
          </button>
          <button
            onClick={() => setActiveMode('generator')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeMode === 'generator'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generator Materi AI</span>
          </button>
        </div>
      </div>

      {/* MODE 1: PENGISIAN INTERAKTIF SISWA / KELOMPOK */}
      {activeMode === 'interactive_form' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: Input Controls (no-print) */}
          <div className="no-print lg:col-span-5 space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Formulir Pengisian Refleksi 4F
              </h3>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveFormType('Individu')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                    activeFormType === 'Individu' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <User className="w-3 h-3" /> Individu
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormType('Kelompok')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                    activeFormType === 'Kelompok' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Users className="w-3 h-3" /> Kelompok
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {activeFormType === 'Individu' ? 'Nama Siswa:' : 'Nama Kelompok:'}
                </label>
                <input
                  type="text"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder={activeFormType === 'Individu' ? 'Contoh: Bagas Wicaksono' : 'Contoh: Kelompok Harapan 1'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {activeFormType === 'Kelompok' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Anggota Kelompok (pisahkan koma):
                  </label>
                  <input
                    type="text"
                    value={formAnggota}
                    onChange={(e) => setFormAnggota(e.target.value)}
                    placeholder="Aditya, Bagas, Chandra, Dinda"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kelas:</label>
                  <input
                    type="text"
                    value={formKelas}
                    onChange={(e) => setFormKelas(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal:</label>
                  <input
                    type="date"
                    value={formTanggal}
                    onChange={(e) => setFormTanggal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* 4F Inputs */}
              <div>
                <label className="block text-xs font-bold text-blue-700 mb-1 flex items-center gap-1">
                  <span>1. FACT (Peristiwa Nyata):</span>
                </label>
                <textarea
                  rows={2}
                  value={formFact}
                  onChange={(e) => setFormFact(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-700 mb-1 flex items-center gap-1">
                  <span>2. FEELING (Perasaan):</span>
                </label>
                <textarea
                  rows={2}
                  value={formFeeling}
                  onChange={(e) => setFormFeeling(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-700 mb-1 flex items-center gap-1">
                  <span>3. FINDING (Pembelajaran / Pencerahan):</span>
                </label>
                <textarea
                  rows={2}
                  value={formFinding}
                  onChange={(e) => setFormFinding(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-700 mb-1 flex items-center gap-1">
                  <span>4. FUTURE (Aksi Nyata & Komitmen):</span>
                </label>
                <textarea
                  rows={2}
                  value={formFuture}
                  onChange={(e) => setFormFuture(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan / Umpan Balik Guru BK:
                </label>
                <input
                  type="text"
                  value={formCatatanKonselor}
                  onChange={(e) => setFormCatatanKonselor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSaveSubmission}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan ke Arsip</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Lembar Ini</span>
              </button>
              <button
                type="button"
                onClick={handleExportTxt}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                title="Unduh berkas TXT"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Area: Document Preview Ready to Print */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0 space-y-6">
            {/* Kop LKPD */}
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <h3 className="font-bold text-sm tracking-widest uppercase text-slate-800">
                PEMERINTAH KOTA / KABUPATEN DINAS PENDIDIKAN
              </h3>
              <h2 className="font-black text-base text-slate-900 uppercase">
                {profile.namaSekolah}
              </h2>
              <div className="text-xs text-slate-600 mt-1">
                LEMBAR KERJA PESERTA DIDIK (LKPD) BIMBINGAN DAN KONSELING
              </div>
              <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mt-0.5">
                MODEL REFLEKSI 4F (FACT, FEELING, FINDING, FUTURE) • FASE D
              </div>
            </div>

            {/* Identitas Pengisi */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500">Materi Layanan:</span>
                <strong className="block text-slate-900">{lkpd.topik}</strong>
              </div>
              <div>
                <span className="text-slate-500">Bentuk Pengerjaan:</span>
                <strong className="block text-slate-900">{activeFormType}</strong>
              </div>
              <div>
                <span className="text-slate-500">Nama Siswa / Kelompok:</span>
                <strong className="block text-blue-700">{formNama || '____________________'}</strong>
                {activeFormType === 'Kelompok' && formAnggota && (
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    Anggota: {formAnggota}
                  </span>
                )}
              </div>
              <div>
                <span className="text-slate-500">Kelas / Tanggal:</span>
                <strong className="block text-slate-900">
                  {formKelas} • {new Date(formTanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </strong>
              </div>
            </div>

            {/* 4F Live Display */}
            <div className="space-y-4">
              {/* Fact */}
              <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/40 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-black text-blue-800">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>FACT (Peristiwa Nyata yang Dialami / Diamati)</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed pl-7 whitespace-pre-wrap font-medium">
                  {formFact || '...'}
                </p>
              </div>

              {/* Feeling */}
              <div className="border border-rose-200 rounded-xl p-4 bg-rose-50/40 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-black text-rose-800">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>FEELING (Perasaan Saat Kejadian & Setelah Layanan)</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed pl-7 whitespace-pre-wrap font-medium">
                  {formFeeling || '...'}
                </p>
              </div>

              {/* Finding */}
              <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/40 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-black text-amber-800">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>FINDING (Pembelajaran & Makna Baru yang Didapatkan)</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed pl-7 whitespace-pre-wrap font-medium">
                  {formFinding || '...'}
                </p>
              </div>

              {/* Future */}
              <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/40 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    4
                  </span>
                  <span>FUTURE (Aksi Nyata & Langkah Penerapan Besok)</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed pl-7 whitespace-pre-wrap font-medium">
                  {formFuture || '...'}
                </p>
              </div>
            </div>

            {/* Komitmen Diri */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Deklarasi Komitmen Diri:</span>
              </div>
              <ul className="text-xs space-y-1.5 pl-2 text-slate-700">
                {lkpd.komitmenDiri.map((k, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">☑</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Catatan Konselor */}
            {formCatatanKonselor && (
              <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl text-xs text-indigo-950">
                <strong>Catatan Guru BK:</strong> {formCatatanKonselor}
              </div>
            )}

            {/* Signature Area */}
            <div className="pt-4 border-t border-slate-300">
              <div className="flex justify-between items-start text-xs text-slate-800 px-4">
                <div className="text-left space-y-14">
                  <div>
                    <p>Peserta Didik / Ketua Kelompok,</p>
                    <p className="text-[11px] text-slate-500">Tanda tangan komitmen:</p>
                  </div>
                  <div>
                    <p className="font-bold underline uppercase">{formNama || 'Konseli'}</p>
                    <p className="text-slate-600">{formKelas}</p>
                  </div>
                </div>

                <div className="text-left space-y-14">
                  <div>
                    <p>{profile.kota}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="font-bold">Guru Bimbingan dan Konseling,</p>
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
      )}

      {/* MODE 2: ARSIP & RIWAYAT LKPD TERISI */}
      {activeMode === 'archive' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <span>Arsip Lembar Refleksi LKPD 4F Tersimpan</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar tanggapan dan refleksi diri siswa atau kelompok yang telah disimpan di penyimpanan browser lokal
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveMode('interactive_form')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              + Isi LKPD Baru
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Belum ada lembar refleksi LKPD yang disimpan. Buka tab <strong>Pengisian Interaktif</strong> untuk mengisi dan menyimpan data.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">
                        {sub.namaSiswaAtauKelompok}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sub.tipe === 'Kelompok'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {sub.tipe}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        • {sub.kelas} • {sub.tanggal}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      <strong>Topik:</strong> {sub.topik}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1 italic">
                      "Aksi: {sub.future}"
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleLoadSubmission(sub)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                    >
                      Buka & Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleLoadSubmission(sub);
                        setTimeout(() => window.print(), 100);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubmission(sub.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg"
                      title="Hapus dari arsip"
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

      {/* MODE 3: GENERATOR MATERI AI (MASTER TEMPLATE) */}
      {activeMode === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="no-print lg:col-span-4 space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Pengaturan Prompt AI Generator LKPD
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Topik Layanan BK:
              </label>
              <input
                type="text"
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kelas (Fase D):
                </label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800"
                >
                  <option value="Kelas 7 SMP">Kelas 7 SMP</option>
                  <option value="Kelas 8 SMP">Kelas 8 SMP</option>
                  <option value="Kelas 9 SMP">Kelas 9 SMP</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Bidang Layanan:
                </label>
                <select
                  value={bidang}
                  onChange={(e) => setBidang(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800"
                >
                  <option value="Pribadi">Pribadi</option>
                  <option value="Sosial">Sosial</option>
                  <option value="Belajar">Belajar</option>
                  <option value="Karier">Karier</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={isLoading}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Sedang Menyusun LKPD...' : 'Buat Materi Baru via Gemini SDK'}</span>
            </button>
          </div>

          {/* Master Template Preview */}
          <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b pb-3">
              <h4 className="text-base font-bold text-slate-900">
                Template Kosong Siap Distribusi: {lkpd.topik}
              </h4>
              <p className="text-xs text-slate-500">
                Petunjuk: "{lkpd.instruksiSiswa}"
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                <span className="font-bold text-xs text-blue-900 block">1. Fact (Peristiwa):</span>
                <span className="text-xs text-slate-700">{lkpd.refleksi4F.fact.pertanyaan}</span>
              </div>
              <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-lg">
                <span className="font-bold text-xs text-rose-900 block">2. Feeling (Perasaan):</span>
                <span className="text-xs text-slate-700">{lkpd.refleksi4F.feeling.pertanyaan}</span>
              </div>
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg">
                <span className="font-bold text-xs text-amber-900 block">3. Finding (Pencerahan):</span>
                <span className="text-xs text-slate-700">{lkpd.refleksi4F.finding.pertanyaan}</span>
              </div>
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg">
                <span className="font-bold text-xs text-emerald-900 block">4. Future (Aksi Nyata):</span>
                <span className="text-xs text-slate-700">{lkpd.refleksi4F.future.pertanyaan}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormFact('');
                  setFormFeeling('');
                  setFormFinding('');
                  setFormFuture('');
                  setActiveMode('interactive_form');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
              >
                Gunakan Template Ini untuk Pengisian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
